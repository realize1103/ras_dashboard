export const config = {
  openweather: {
    apiKey: process.env.OPENWEATHER_API_KEY || 'b24782eb6779829f27a06cd0ef599357',
    cityId: process.env.OPENWEATHER_CITY_ID || '3081368',
    baseUrl: 'https://api.openweathermap.org/data/2.5',
  },
  stock: {
    apiKey: process.env.ALPHA_VANTAGE_API_KEY || 'demo',
    baseUrl: 'https://www.alphavantage.co/query',
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'RAS Dashboard',
    refreshInterval: 300000, // 5분
  },
} as const;

export type Config = typeof config;
