'use client';

import { useState, useEffect, useCallback } from 'react';
import { DailyWeather } from '@/lib/weather';

interface UseWeeklyWeatherReturn {
  data: DailyWeather[] | null;
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  refresh: () => Promise<void>;
}

export function useWeeklyWeather(): UseWeeklyWeatherReturn {
  const [data, setData] = useState<DailyWeather[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchWeeklyWeather = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching weekly weather data...');
      const response = await fetch('/api/weather/weekly', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
      });
      
      console.log('Weekly response status:', response.status);
      console.log('Weekly response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Weekly error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const weeklyData: DailyWeather[] = await response.json();
      console.log('Weekly weather data received:', weeklyData);
      setData(weeklyData);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to fetch weekly weather data:', err);
      setError(err instanceof Error ? err.message : '주간 날씨 데이터를 가져올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchWeeklyWeather();
  }, [fetchWeeklyWeather]);

  useEffect(() => {
    fetchWeeklyWeather();
    
    // 30분마다 자동 새로고침 (주간 데이터는 자주 변경되지 않음)
    const interval = setInterval(fetchWeeklyWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchWeeklyWeather]);

  // 디버깅을 위한 로그 추가
  useEffect(() => {
    console.log('Weekly weather hook state:', { data, isLoading, error, lastUpdate });
  }, [data, isLoading, error, lastUpdate]);

  return {
    data,
    isLoading,
    error,
    lastUpdate,
    refresh,
  };
}
