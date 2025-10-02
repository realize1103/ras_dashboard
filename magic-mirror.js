#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// 매직미러 스크립트
console.log('🪞 RAS Dashboard 매직미러를 시작합니다...');

// Next.js 개발 서버 시작
const nextProcess = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// 서버가 시작될 때까지 대기
setTimeout(() => {
  console.log('🌐 브라우저를 전체화면으로 엽니다...');
  
  // macOS에서 Safari를 전체화면으로 열기
  const openCommand = process.platform === 'darwin' 
    ? `osascript -e 'tell application "Safari" to activate' -e 'tell application "System Events" to keystroke "f" using {command down, control down}'`
    : process.platform === 'win32'
    ? `start msedge --kiosk http://localhost:3002`
    : `google-chrome --kiosk http://localhost:3002`;
  
  // 브라우저 열기
  const browserProcess = spawn(openCommand, {
    shell: true,
    stdio: 'inherit'
  });
  
  console.log('✅ 매직미러가 시작되었습니다!');
  console.log('📱 전체화면 모드로 실행 중...');
  console.log('⌨️  ESC 키를 눌러 종료할 수 있습니다.');
  
  // 프로세스 정리
  process.on('SIGINT', () => {
    console.log('\n🛑 매직미러를 종료합니다...');
    nextProcess.kill();
    browserProcess.kill();
    process.exit(0);
  });
  
}, 5000); // 5초 대기
