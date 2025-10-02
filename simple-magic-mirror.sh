#!/bin/bash

# 간단한 매직미러 스크립트
# 브라우저만 열고 전체화면으로 전환

echo "🪞 RAS Dashboard 매직미러를 시작합니다..."

# 기존 프로세스 정리
pkill -f "next dev" 2>/dev/null || true

# Next.js 서버 시작 (백그라운드)
echo "📡 Next.js 서버를 시작합니다..."
npm run dev &
NEXT_PID=$!

# 서버 시작 대기
echo "⏳ 서버 시작을 기다립니다..."
sleep 6

# 브라우저 열기
echo "🌐 브라우저를 엽니다..."
open http://localhost:3000

echo "✅ 매직미러가 시작되었습니다!"
echo "📱 브라우저에서 F11을 눌러 전체화면으로 전환하세요."
echo "⌨️  Ctrl+C로 종료하세요."

# 정리 함수
cleanup() {
    echo "🛑 매직미러를 종료합니다..."
    kill $NEXT_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM
wait $NEXT_PID
