'use client';

import { useState, useEffect, useCallback } from 'react';
import { StockData } from '@/lib/stock';

interface UseStocksReturn {
  data: StockData[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  refresh: () => Promise<void>;
}

export function useStocks(): UseStocksReturn {
  const [data, setData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchStocks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching stock data...');
      const response = await fetch('/api/stocks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
      });
      
      console.log('Stock response status:', response.status);
      console.log('Stock response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Stock error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const stockData: StockData[] = await response.json();
      console.log('Stock data received:', stockData);
      setData(stockData);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to fetch stock data:', err);
      setError(err instanceof Error ? err.message : '주식 지수 데이터를 가져올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchStocks();
  }, [fetchStocks]);

  useEffect(() => {
    fetchStocks();
    
    // 10분마다 자동 새로고침
    const interval = setInterval(fetchStocks, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchStocks]);

  // 디버깅을 위한 로그 추가
  useEffect(() => {
    console.log('Stock hook state:', { data, isLoading, error, lastUpdate });
  }, [data, isLoading, error, lastUpdate]);

  return {
    data,
    isLoading,
    error,
    lastUpdate,
    refresh,
  };
}
