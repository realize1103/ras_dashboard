#!/bin/bash

# RAS Dashboard 라즈베리파이 설정 스크립트
# 이 스크립트는 라즈베리파이에서 실행되어 대시보드를 설정합니다.

set -e

echo "🍓 RAS Dashboard 라즈베리파이 설정을 시작합니다..."

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
if [ ! -d "ras_dashboard" ]; then
    print_error "ras_dashboard 디렉토리를 찾을 수 없습니다."
    print_status "프로젝트를 먼저 복사해 주세요."
    exit 1
fi

cd ras_dashboard

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

# 프로덕션 빌드
print_status "프로덕션 빌드를 실행합니다..."
npm run build

# systemd 서비스 파일 생성
print_status "systemd 서비스 파일을 생성합니다..."
sudo tee /etc/systemd/system/ras-dashboard.service > /dev/null << EOF
[Unit]
Description=RAS Dashboard
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# 서비스 활성화
print_status "systemd 서비스를 활성화합니다..."
sudo systemctl daemon-reload
sudo systemctl enable ras-dashboard

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

# 자동 로그인 설정 (선택사항)
read -p "자동 로그인을 설정하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "자동 로그인을 설정합니다..."
    sudo raspi-config nonint do_boot_behaviour B4
fi

# 브라우저 자동 시작 설정
print_status "브라우저 자동 시작을 설정합니다..."
mkdir -p ~/.config/lxsession/LXDE-pi
cat > ~/.config/lxsession/LXDE-pi/autostart << EOF
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
@xscreensaver -no-splash
@xset s off
@xset -dpms
@xset s noblank
@chromium-browser --kiosk --disable-infobars --disable-session-crashed-bubble --disable-web-security --user-data-dir=/tmp/chrome-user-data --start-fullscreen http://localhost:3000
EOF

# 방화벽 설정 (선택사항)
read -p "포트 3000을 열어 외부 접근을 허용하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "방화벽을 설정합니다..."
    sudo ufw allow 3000
fi

# 서비스 시작
print_status "RAS Dashboard 서비스를 시작합니다..."
sudo systemctl start ras-dashboard

# 서비스 상태 확인
sleep 3
if sudo systemctl is-active --quiet ras-dashboard; then
    print_success "RAS Dashboard가 성공적으로 시작되었습니다!"
    print_status "브라우저에서 http://localhost:3000 또는 http://$(hostname -I | awk '{print $1}'):3000 을 열어 확인하세요."
else
    print_error "서비스 시작에 실패했습니다. 로그를 확인하세요:"
    print_status "sudo journalctl -u ras-dashboard -f"
fi

# 최종 정보 출력
echo
print_success "🎉 RAS Dashboard 설정이 완료되었습니다!"
echo
echo "📋 설정 요약:"
echo "  • Node.js: $(node --version)"
echo "  • npm: $(npm --version)"
echo "  • 서비스 상태: $(sudo systemctl is-active ras-dashboard)"
echo "  • 서비스 활성화: $(sudo systemctl is-enabled ras-dashboard)"
echo
echo "🔧 유용한 명령어:"
echo "  • 서비스 상태 확인: sudo systemctl status ras-dashboard"
echo "  • 서비스 재시작: sudo systemctl restart ras-dashboard"
echo "  • 로그 확인: sudo journalctl -u ras-dashboard -f"
echo "  • 서비스 중지: sudo systemctl stop ras-dashboard"
echo
echo "🌐 접속 URL:"
echo "  • 로컬: http://localhost:3000"
echo "  • 네트워크: http://$(hostname -I | awk '{print $1}'):3000"
echo
print_warning "라즈베리파이를 재부팅하면 자동으로 대시보드가 시작됩니다."
