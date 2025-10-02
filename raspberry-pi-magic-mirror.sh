#!/bin/bash

# 라즈베리파이용 매직미러 스크립트
# 라즈베리파이에서 매직미러를 자동으로 시작합니다.

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 함수 정의
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "🪞 라즈베리파이 매직미러를 시작합니다..."

# 기존 프로세스 정리
print_status "기존 프로세스를 정리합니다..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "magic-mirror" 2>/dev/null || true

# 프로젝트 디렉토리 확인
if [ ! -f "package.json" ]; then
    print_error "package.json을 찾을 수 없습니다."
    print_status "프로젝트 디렉토리에서 실행해 주세요."
    exit 1
fi

# 의존성 설치 확인
if [ ! -d "node_modules" ]; then
    print_status "의존성을 설치합니다..."
    npm install
fi

# 환경 변수 파일 확인
if [ ! -f ".env.local" ]; then
    print_warning ".env.local 파일이 없습니다. 기본 설정을 생성합니다..."
    cat > .env.local << EOF
OPENWEATHER_API_KEY=b24782eb6779829f27a06cd0ef599357
OPENWEATHER_CITY_ID=3081368
NEXT_PUBLIC_APP_NAME=RAS Dashboard
EOF
    print_success ".env.local 파일이 생성되었습니다."
fi

# Next.js 개발 서버 시작 (백그라운드)
print_status "Next.js 서버를 시작합니다..."
npm run dev &
NEXT_PID=$!

# 서버가 시작될 때까지 대기
print_status "서버 시작을 기다립니다..."
sleep 10

# 서버 상태 확인
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_success "Next.js 서버가 성공적으로 시작되었습니다! (포트 3000)"
    DASHBOARD_URL="http://localhost:3000"
elif curl -s http://localhost:3002 > /dev/null 2>&1; then
    print_success "Next.js 서버가 성공적으로 시작되었습니다! (포트 3002)"
    DASHBOARD_URL="http://localhost:3002"
else
    print_error "서버를 찾을 수 없습니다!"
    kill $NEXT_PID 2>/dev/null || true
    exit 1
fi

# 라즈베리파이에서 Chromium 열기
print_status "Chromium을 전체화면으로 엽니다..."

# Chromium이 설치되어 있는지 확인
if command -v chromium-browser &> /dev/null; then
    # Chromium을 전체화면으로 열기
    chromium-browser --kiosk --no-sandbox --disable-dev-shm-usage $DASHBOARD_URL &
    print_success "Chromium이 전체화면으로 열렸습니다!"
elif command -v chromium &> /dev/null; then
    # Chromium을 전체화면으로 열기
    chromium --kiosk --no-sandbox --disable-dev-shm-usage $DASHBOARD_URL &
    print_success "Chromium이 전체화면으로 열렸습니다!"
else
    print_warning "Chromium을 찾을 수 없습니다. 기본 브라우저로 열기 시도..."
    # 기본 브라우저로 열기
    xdg-open $DASHBOARD_URL &
fi

print_success "✅ 라즈베리파이 매직미러가 시작되었습니다!"
print_status "📱 전체화면 모드로 실행 중..."
print_status "🌐 대시보드: $DASHBOARD_URL"
print_warning "⌨️  Ctrl+C를 눌러 종료할 수 있습니다."

# 프로세스 정리 함수
cleanup() {
    print_status "🛑 매직미러를 종료합니다..."
    kill $NEXT_PID 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "chromium" 2>/dev/null || true
    print_success "매직미러가 종료되었습니다."
    exit 0
}

# 시그널 핸들러 설정
trap cleanup SIGINT SIGTERM

# 서버가 실행되는 동안 대기
print_status "매직미러가 실행 중입니다. Ctrl+C로 종료하세요."
wait $NEXT_PID
