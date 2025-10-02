# RAS Dashboard

라즈베리파이 4 + 4인치 터치 모니터용 날씨 대시보드입니다.

## 🚀 기능

- **실시간 날씨 정보**: OpenWeather API를 통한 현재 날씨 데이터
- **터치 최적화**: 4인치 터치 모니터에 최적화된 UI
- **자동 새로고침**: 5분마다 자동으로 날씨 데이터 업데이트
- **라즈베리파이 최적화**: 저전력 ARM 프로세서에 최적화된 성능
- **글래스모피즘 디자인**: 현대적이고 아름다운 UI

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: OpenWeather API
- **Target**: Raspberry Pi 4 + 4" Touch Monitor

## 📋 요구사항

- Node.js 18.0.0 이상
- npm 8.0.0 이상
- 라즈베리파이 4 (권장: 4GB RAM 이상)
- 4인치 터치 모니터
- 인터넷 연결

## 🚀 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd ras_dashboard
npm install
```

### 2. 매직미러 모드 (브라우저 없이 전체화면)

```bash
# 개발 모드로 매직미러 실행
npm run magic-mirror

# 또는
npm run electron-dev
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# OpenWeather API 설정
OPENWEATHER_API_KEY=b24782eb6779829f27a06cd0ef599357
OPENWEATHER_CITY_ID=3081368

# Alpha Vantage API 설정 (선택사항 - Yahoo Finance가 기본)
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here

# 앱 설정
NEXT_PUBLIC_APP_NAME=RAS Dashboard
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 5. 프로덕션 빌드

```bash
npm run build
npm start
```

### 6. 매직미러 앱 빌드

```bash
# Electron 앱 빌드
npm run electron-build

# 또는 디렉토리로 패키징
npm run electron-pack
```

## 🪞 매직미러 모드

### 매직미러란?
매직미러는 브라우저 없이 전체화면으로 실행되는 대시보드입니다. 라즈베리파이에 연결된 터치 모니터에서 바로 실행되어 벽에 걸어두고 사용할 수 있습니다.

### 매직미러 실행 방법

#### 🚀 **자동 전체화면 모드** (권장)
```bash
npm run magic-mirror
```
- Next.js 서버 자동 시작
- Safari 자동 열기 및 전체화면 전환
- 완전 자동화된 매직미러

#### 🔧 **간단한 모드**
```bash
npm run magic-mirror-simple
```
- Next.js 서버 시작
- 브라우저 열기 (수동으로 F11 전체화면)
- 권한 문제가 있을 때 사용

#### ⚡ **Electron 모드**
```bash
npm run magic-mirror-electron
```
- Electron 앱으로 실행
- 네이티브 앱처럼 동작

#### 🍓 **라즈베리파이 모드**
```bash
npm run magic-mirror-pi
```
- 라즈베리파이 최적화
- Chromium 전체화면 모드
- 터치 모니터 최적화

### 매직미러 키보드 단축키
- **ESC**: 앱 종료
- **F11**: 전체화면 토글
- **Ctrl+Q**: 앱 종료

### 🛠️ **스크립트 직접 실행**

#### 자동 전체화면 스크립트
```bash
./start-magic-mirror.sh
```

#### 간단한 스크립트
```bash
./simple-magic-mirror.sh
```

#### 라즈베리파이 스크립트
```bash
./raspberry-pi-magic-mirror.sh
```

### 🔧 **문제 해결**

#### 권한 오류가 발생하는 경우
```bash
# 간단한 모드 사용
npm run magic-mirror-simple

# 또는 브라우저에서 수동으로 F11 전체화면
```

#### 포트 충돌이 발생하는 경우
```bash
# 기존 프로세스 정리
pkill -f "next dev"
pkill -f "magic-mirror"

# 다시 실행
npm run magic-mirror
```

### 라즈베리파이 매직미러 설정

```bash
# 매직미러 자동 설정 스크립트 실행
chmod +x magic-mirror-setup.sh
./magic-mirror-setup.sh
```

이 스크립트는 다음을 자동으로 설정합니다:
- Electron 앱 빌드
- systemd 서비스 등록
- 자동 로그인 설정
- 터치 모니터 최적화
- 부팅 시 자동 실행

## 🍓 라즈베리파이 배포

### 1. 라즈베리파이 설정

```bash
# Node.js 설치 (라즈베리파이용)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 프로젝트 복사
scp -r ras_dashboard pi@<raspberry-pi-ip>:~/ras_dashboard
```

### 2. 라즈베리파이에서 실행

```bash
# 라즈베리파이에 SSH 접속
ssh pi@<raspberry-pi-ip>

# 프로젝트 디렉토리로 이동
cd ~/ras_dashboard

# 의존성 설치 및 빌드
npm run raspberry-pi:setup

# 서버 시작
npm run raspberry-pi:start
```

### 3. 자동 시작 설정 (systemd)

```bash
# 서비스 파일 생성
sudo nano /etc/systemd/system/ras-dashboard.service
```

다음 내용을 추가:

```ini
[Unit]
Description=RAS Dashboard
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/ras_dashboard
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

서비스 활성화:

```bash
sudo systemctl enable ras-dashboard
sudo systemctl start ras-dashboard
```

## 🎨 UI 특징

- **터치 친화적**: 최소 44px 터치 영역 보장
- **글래스모피즘**: 반투명 배경과 블러 효과
- **반응형**: 다양한 화면 크기 지원
- **애니메이션**: 부드러운 전환 효과
- **접근성**: 고대비 모드 지원

## 🔧 설정

### OpenWeather API 설정

1. [OpenWeatherMap](https://openweathermap.org/)에서 계정 생성
2. API 키 발급
3. `.env.local` 파일에 API 키 설정

### 도시 ID 변경

다른 도시의 날씨를 보려면 `OPENWEATHER_CITY_ID`를 변경하세요:

- 서울: `1835848`
- 부산: `1838519`
- 대구: `1835327`
- 인천: `1843561`

## 🐛 문제 해결

### 자주 발생하는 문제

1. **API 키 오류**: OpenWeather API 키가 올바른지 확인
2. **네트워크 연결**: 라즈베리파이의 인터넷 연결 확인
3. **터치 인식**: 터치 모니터 드라이버 설치 확인
4. **성능 이슈**: 라즈베리파이 4 4GB 모델 권장

### 로그 확인

```bash
# 서비스 로그 확인
sudo journalctl -u ras-dashboard -f

# 애플리케이션 로그 확인
tail -f ~/ras_dashboard/logs/app.log
```

## 📱 터치 모니터 최적화

- **화면 회전**: 필요시 `xrandr` 명령어로 화면 회전
- **터치 보정**: `xinput_calibrator`로 터치 보정
- **자동 로그인**: 라즈베리파이 부팅 시 자동으로 대시보드 실행

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.

---

**RAS Dashboard** - 라즈베리파이와 터치 모니터로 만드는 스마트 날씨 대시보드 🌤️