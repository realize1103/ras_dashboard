#!/bin/bash

# RAS Dashboard 매직미러 설정 스크립트
# 이 스크립트는 라즈베리파이에서 매직미러처럼 자동으로 실행되도록 설정합니다.

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

print_status "🪞 RAS Dashboard 매직미러 설정을 시작합니다..."

# 시스템 업데이트
print_status "시스템 패키지를 업데이트합니다..."
sudo apt update && sudo apt upgrade -y

# Node.js 설치 확인 및 설치
if ! command -v node &> /dev/null; then
    print_status "Node.js를 설치합니다..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    print_success "Node.js가 이미 설치되어 있습니다: $(node --version)"
fi

# npm 버전 확인
print_status "npm 버전: $(npm --version)"

# 프로젝트 디렉토리 확인
if [ ! -d "ras_dashboard" ] && [ ! -f "package.json" ]; then
    print_error "ras_dashboard 디렉토리 또는 package.json을 찾을 수 없습니다."
    print_status "프로젝트를 먼저 복사해 주세요."
    print_status "또는 현재 디렉토리에서 실행해 주세요."
    exit 1
fi

# ras_dashboard 디렉토리가 있으면 이동, 없으면 현재 디렉토리 사용
if [ -d "ras_dashboard" ]; then
    cd ras_dashboard
    print_status "ras_dashboard 디렉토리로 이동했습니다."
else
    print_status "현재 디렉토리에서 실행합니다."
fi

# 의존성 설치
print_status "프로젝트 의존성을 설치합니다..."
npm ci --production

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

# Electron 앱 빌드
print_status "Electron 앱을 빌드합니다..."
npm run build

# systemd 서비스 파일 생성 (매직미러용)
print_status "매직미러 systemd 서비스를 생성합니다..."
sudo tee /etc/systemd/system/ras-magic-mirror.service > /dev/null << EOF
[Unit]
Description=RAS Dashboard Magic Mirror
After=network.target graphical-session.target

[Service]
Type=simple
User=pi
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/npm run magic-mirror
Restart=always
RestartSec=10
Environment=DISPLAY=:0
Environment=NODE_ENV=production

[Install]
WantedBy=graphical-session.target
EOF

# 서비스 활성화
print_status "매직미러 서비스를 활성화합니다..."
sudo systemctl daemon-reload
sudo systemctl enable ras-magic-mirror

# 터치 모니터 최적화 설정
print_status "터치 모니터 최적화 설정을 적용합니다..."

# 터치 보정 도구 설치
sudo apt install -y xinput-calibrator

# 터치 하이라이트 제거
if ! grep -q "xinput set-prop" ~/.bashrc; then
    echo "# 터치 하이라이트 제거" >> ~/.bashrc
    echo "xinput set-prop 'FT5406 memory based driver' 'Device Enabled' 1" >> ~/.bashrc
fi

# 화면 보호기 비활성화
print_status "화면 보호기를 비활성화합니다..."
sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target

# 자동 로그인 설정
print_status "자동 로그인을 설정합니다..."
sudo raspi-config nonint do_boot_behaviour B4

# 브라우저 자동 시작 설정 (Electron 대신)
print_status "Electron 자동 시작을 설정합니다..."
mkdir -p ~/.config/autostart
cat > ~/.config/autostart/ras-dashboard.desktop << EOF
[Desktop Entry]
Type=Application
Name=RAS Dashboard
Comment=Magic Mirror Dashboard
Exec=cd $(pwd) && npm run magic-mirror
Icon=applications-internet
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOF

# 방화벽 설정 (선택사항)
read -p "포트 3000을 열어 외부 접근을 허용하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "방화벽을 설정합니다..."
    sudo ufw allow 3000
fi

# 서비스 시작
print_status "RAS Dashboard 매직미러를 시작합니다..."
sudo systemctl start ras-magic-mirror

# 서비스 상태 확인
sleep 3
if sudo systemctl is-active --quiet ras-magic-mirror; then
    print_success "RAS Dashboard 매직미러가 성공적으로 시작되었습니다!"
    print_status "매직미러가 전체화면으로 표시됩니다."
    print_warning "ESC 키를 눌러 앱을 종료할 수 있습니다."
else
    print_error "서비스 시작에 실패했습니다. 로그를 확인하세요:"
    print_status "sudo journalctl -u ras-magic-mirror -f"
fi

# 최종 정보 출력
echo
print_success "🎉 RAS Dashboard 매직미러 설정이 완료되었습니다!"
echo
echo "📋 설정 요약:"
echo "  • Node.js: $(node --version)"
echo "  • npm: $(npm --version)"
echo "  • 서비스 상태: $(sudo systemctl is-active ras-magic-mirror)"
echo "  • 서비스 활성화: $(sudo systemctl is-enabled ras-magic-mirror)"
echo
echo "🔧 유용한 명령어:"
echo "  • 서비스 상태 확인: sudo systemctl status ras-magic-mirror"
echo "  • 서비스 재시작: sudo systemctl restart ras-magic-mirror"
echo "  • 로그 확인: sudo journalctl -u ras-magic-mirror -f"
echo "  • 서비스 중지: sudo systemctl stop ras-magic-mirror"
echo
echo "🪞 매직미러 기능:"
echo "  • 전체화면 자동 실행"
echo "  • 브라우저 없이 실행"
echo "  • ESC 키로 종료"
echo "  • F11 키로 전체화면 토글"
echo "  • Ctrl+Q로 종료"
echo
print_warning "라즈베리파이를 재부팅하면 자동으로 매직미러가 시작됩니다."
