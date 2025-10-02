/** @type {import('next').NextConfig} */
const nextConfig = {
  // 라즈베리파이 환경 최적화
  output: 'standalone',
  
  // 터치 모니터 최적화
  experimental: {
    optimizeCss: true,
  },
  
  // 이미지 최적화
  images: {
    unoptimized: true, // 라즈베리파이에서 이미지 최적화 비활성화
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
