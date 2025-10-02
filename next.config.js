/** @type {import('next').NextConfig} */
const nextConfig = {
  // Electron용 정적 내보내기
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // 터치 모니터 최적화
  experimental: {
    optimizeCss: true,
  },
  
  // 이미지 최적화
  images: {
    unoptimized: true, // 정적 내보내기용
  },
  
  // 성능 최적화
  compress: true,
  
  // 환경 변수
  env: {
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    OPENWEATHER_CITY_ID: process.env.OPENWEATHER_CITY_ID,
  },
  
  // PWA 설정 (선택사항)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
