#!/bin/bash

# RAS Dashboard 매직미러 시작 스크립트
# 이 스크립트는 Next.js 서버를 시작하고 브라우저를 전체화면으로 엽니다.

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

# 기존 프로세스 정리
print_status "기존 프로세스를 정리합니다..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "magic-mirror" 2>/dev/null || true

# 프로젝트 디렉토리로 이동
cd "$(dirname "$0")"

print_status "🪞 RAS Dashboard 매직미러를 시작합니다..."

# Next.js 개발 서버 시작 (백그라운드)
print_status "Next.js 서버를 시작합니다..."
npm run dev &
NEXT_PID=$!

# 서버가 시작될 때까지 대기
print_status "서버 시작을 기다립니다..."
sleep 8

# 서버 상태 확인
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_success "Next.js 서버가 성공적으로 시작되었습니다! (포트 3000)"
    DASHBOARD_URL="http://localhost:3000"
elif curl -s http://localhost:3002 > /dev/null 2>&1; then
    print_success "Next.js 서버가 성공적으로 시작되었습니다! (포트 3002)"
    DASHBOARD_URL="http://localhost:3002"
else
    print_warning "서버 시작을 확인할 수 없습니다. 잠시 더 기다립니다..."
    sleep 3
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        DASHBOARD_URL="http://localhost:3000"
    elif curl -s http://localhost:3002 > /dev/null 2>&1; then
        DASHBOARD_URL="http://localhost:3002"
    else
        print_error "서버를 찾을 수 없습니다!"
        exit 1
    fi
fi

# 브라우저 열기
print_status "브라우저를 전체화면으로 엽니다..."

# macOS에서 Safari 열기
if [[ "$OSTYPE" == "darwin"* ]]; then
    # Safari를 열고 전체화면으로 전환
    open -a Safari $DASHBOARD_URL
    sleep 2
    
    # 전체화면으로 전환 (AppleScript 사용)
    osascript <<EOF
tell application "Safari"
    activate
    delay 1
    tell application "System Events"
        keystroke "f" using {command down, control down}
    end tell
end tell
EOF
    
    print_success "Safari가 전체화면으로 열렸습니다!"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux에서 Chrome 열기
    google-chrome --kiosk $DASHBOARD_URL &
    print_success "Chrome이 전체화면으로 열렸습니다!"
    
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows에서 Edge 열기
    start msedge --kiosk $DASHBOARD_URL
    print_success "Edge가 전체화면으로 열렸습니다!"
    
else
    print_warning "지원되지 않는 운영체제입니다. 기본 브라우저로 열기 시도..."
    open $DASHBOARD_URL 2>/dev/null || xdg-open $DASHBOARD_URL 2>/dev/null || true
fi

print_success "✅ 매직미러가 시작되었습니다!"
print_status "📱 전체화면 모드로 실행 중..."
print_status "🌐 대시보드: $DASHBOARD_URL"
print_warning "⌨️  Ctrl+C를 눌러 종료할 수 있습니다."

# 프로세스 정리 함수
cleanup() {
    print_status "🛑 매직미러를 종료합니다..."
    kill $NEXT_PID 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    print_success "매직미러가 종료되었습니다."
    exit 0
}

# 시그널 핸들러 설정
trap cleanup SIGINT SIGTERM

# 서버가 실행되는 동안 대기
print_status "매직미러가 실행 중입니다. Ctrl+C로 종료하세요."
wait $NEXT_PID
