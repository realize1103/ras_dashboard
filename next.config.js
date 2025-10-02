/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 모드에서는 API 라우트 사용, 프로덕션에서는 정적 내보내기
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  distDir: 'out',
  
  // 터치 모니터 최적화
  experimental: {
    optimizeCss: true,
  },
  
  // 이미지 최적화
  images: {
    unoptimized: true,
  },
  
  // 성능 최적화
  compress: true,
  
  // 환경 변수
  env: {
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    OPENWEATHER_CITY_ID: process.env.OPENWEATHER_CITY_ID,
  },
};

module.exports = nextConfig;
