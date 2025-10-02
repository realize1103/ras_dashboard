import { config } from './config';

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex?: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  timestamp: number;
}

export interface DailyWeather {
  date: string;
  dayOfWeek: string;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface WeeklyWeatherResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
}

export interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  dt: number;
}

export class WeatherService {
  private static instance: WeatherService;
  private cache: WeatherData | null = null;
  private lastFetch: number = 0;

  private constructor() {}

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  public async getCurrentWeather(): Promise<WeatherData> {
    const now = Date.now();
    
    // 캐시된 데이터가 있고 5분 이내라면 캐시된 데이터 반환
    if (this.cache && (now - this.lastFetch) < config.app.refreshInterval) {
      return this.cache;
    }

    try {
      const response = await fetch(
        `${config.openweather.baseUrl}/weather?id=${config.openweather.cityId}&appid=${config.openweather.apiKey}&units=metric&lang=kr`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: WeatherResponse = await response.json();
      
      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        visibility: data.visibility / 1000, // km로 변환
        feelsLike: Math.round(data.main.feels_like),
        tempMin: Math.round(data.main.temp_min),
        tempMax: Math.round(data.main.temp_max),
        timestamp: data.dt * 1000,
      };

      this.cache = weatherData;
      this.lastFetch = now;
      
      return weatherData;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      
      // 캐시된 데이터가 있다면 반환, 없다면 기본값 반환
      if (this.cache) {
        return this.cache;
      }
      
      throw new Error('날씨 데이터를 가져올 수 없습니다.');
    }
  }

  public async getWeeklyWeather(): Promise<DailyWeather[]> {
    try {
      const response = await fetch(
        `${config.openweather.baseUrl}/forecast?id=${config.openweather.cityId}&appid=${config.openweather.apiKey}&units=metric&lang=kr`
      );

      if (!response.ok) {
        throw new Error(`Weekly Weather API error: ${response.status}`);
      }

      const data: WeeklyWeatherResponse = await response.json();
      
      // 5일간의 데이터를 일별로 그룹화
      const dailyData = new Map<string, any[]>();
      
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData.has(date)) {
          dailyData.set(date, []);
        }
        dailyData.get(date)!.push(item);
      });

      // 각 날짜별로 대표 데이터 추출
      const weeklyWeather: DailyWeather[] = [];
      const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
      
      Array.from(dailyData.entries()).slice(0, 5).forEach(([date, items]) => {
        const dateObj = new Date(date);
        const dayOfWeek = dayNames[dateObj.getDay()];
        
        // 온도 범위 계산
        const temps = items.map(item => item.main.temp);
        const tempMin = Math.round(Math.min(...temps));
        const tempMax = Math.round(Math.max(...temps));
        
        // 가장 빈번한 날씨 상태 선택 (12시 데이터 우선)
        const noonItem = items.find(item => {
          const hour = new Date(item.dt * 1000).getHours();
          return hour >= 11 && hour <= 13;
        }) || items[Math.floor(items.length / 2)];
        
        // 평균 습도와 풍속 계산
        const avgHumidity = Math.round(
          items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length
        );
        const avgWindSpeed = Math.round(
          (items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length) * 10
        ) / 10;

        weeklyWeather.push({
          date: dateObj.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
          dayOfWeek,
          tempMin,
          tempMax,
          description: noonItem.weather[0].description,
          icon: noonItem.weather[0].icon,
          humidity: avgHumidity,
          windSpeed: avgWindSpeed,
        });
      });

      return weeklyWeather;
    } catch (error) {
      console.error('Failed to fetch weekly weather data:', error);
      throw new Error('주간 날씨 데이터를 가져올 수 없습니다.');
    }
  }

  public clearCache(): void {
    this.cache = null;
    this.lastFetch = 0;
  }
}
