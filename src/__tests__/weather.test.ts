import { WeatherService } from '@/lib/weather';

// Mock fetch
global.fetch = jest.fn();

describe('WeatherService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch weather data successfully', async () => {
    const mockWeatherData = {
      main: {
        temp: 20,
        feels_like: 22,
        temp_min: 18,
        temp_max: 25,
        pressure: 1013,
        humidity: 60,
      },
      weather: [
        {
          main: 'Clear',
          description: '맑음',
          icon: '01d',
        },
      ],
      wind: {
        speed: 3.5,
        deg: 180,
      },
      visibility: 10000,
      dt: 1640995200,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData,
    });

    const weatherService = WeatherService.getInstance();
    const result = await weatherService.getCurrentWeather();

    expect(result).toEqual({
      temperature: 20,
      humidity: 60,
      pressure: 1013,
      description: '맑음',
      icon: '01d',
      windSpeed: 3.5,
      windDirection: 180,
      visibility: 10,
      feelsLike: 22,
      tempMin: 18,
      tempMax: 25,
      timestamp: 1640995200000,
    });
  });

  it('should handle API errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const weatherService = WeatherService.getInstance();
    
    await expect(weatherService.getCurrentWeather()).rejects.toThrow(
      '날씨 데이터를 가져올 수 없습니다.'
    );
  });

  it('should return cached data when available', async () => {
    const mockWeatherData = {
      main: { temp: 20, feels_like: 22, temp_min: 18, temp_max: 25, pressure: 1013, humidity: 60 },
      weather: [{ main: 'Clear', description: '맑음', icon: '01d' }],
      wind: { speed: 3.5, deg: 180 },
      visibility: 10000,
      dt: 1640995200,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData,
    });

    const weatherService = WeatherService.getInstance();
    
    // 첫 번째 호출
    await weatherService.getCurrentWeather();
    
    // 두 번째 호출 (캐시된 데이터 반환)
    const result = await weatherService.getCurrentWeather();
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result.temperature).toBe(20);
  });
});
