const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  // 전체 화면 정보 가져오기
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  // 매직미러 스타일로 전체화면 창 생성
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    fullscreen: true,
    frame: false, // 프레임 제거 (매직미러 스타일)
    alwaysOnTop: true, // 항상 최상위
    skipTaskbar: true, // 작업표시줄에서 숨김
    resizable: false, // 크기 조정 불가
    movable: false, // 이동 불가
    minimizable: false, // 최소화 불가
    maximizable: false, // 최대화 불가
    closable: false, // 닫기 불가 (ESC 키로만 닫기)
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    }
  });

  // 개발 환경에서는 개발 서버, 프로덕션에서는 빌드된 파일
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../out/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // 개발 환경에서만 개발자 도구 열기
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // 창이 닫힐 때 (ESC 키 등)
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 키보드 단축키 설정
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // ESC 키로 앱 종료
    if (input.key === 'Escape') {
      app.quit();
    }
    // F11 키로 전체화면 토글
    if (input.key === 'F11') {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
    // Ctrl+Q로 앱 종료
    if (input.ctrl && input.key === 'q') {
      app.quit();
    }
  });

  // 창이 준비되면 포커스
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

// 앱이 준비되면 창 생성
app.whenReady().then(createWindow);

// 모든 창이 닫혔을 때 (macOS 제외)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 앱이 활성화될 때 (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 보안: 새 창 생성 방지
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});
