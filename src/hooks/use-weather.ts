'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '@/lib/weather';

interface UseWeatherReturn {
  data: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  refresh: () => Promise<void>;
}

export function useWeather(): UseWeatherReturn {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchWeather = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching weather data...');
      const response = await fetch('/api/weather', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const weatherData: WeatherData = await response.json();
      console.log('Weather data received:', weatherData);
      setData(weatherData);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to fetch weather data:', err);
      setError(err instanceof Error ? err.message : '날씨 데이터를 가져올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchWeather();
  }, [fetchWeather]);

  useEffect(() => {
    fetchWeather();
    
    // 5분마다 자동 새로고침
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchWeather]);

  // 디버깅을 위한 로그 추가
  useEffect(() => {
    console.log('Weather hook state:', { data, isLoading, error, lastUpdate });
  }, [data, isLoading, error, lastUpdate]);

  return {
    data,
    isLoading,
    error,
    lastUpdate,
    refresh,
  };
}
