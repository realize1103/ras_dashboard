'use client';

import { WeatherCard } from '@/components/weather-card';
import { WeeklyWeather } from '@/components/weekly-weather';
import { DateTimeDisplay } from '@/components/date-time-display';
import { StockIndices } from '@/components/stock-indices';
import { StatusIndicator } from '@/components/status-indicator';
import { useWeather } from '@/hooks/use-weather';
import { useWeeklyWeather } from '@/hooks/use-weekly-weather';
import { useStocks } from '@/hooks/use-stocks';

export default function Home() {
  const { data, isLoading, error, lastUpdate, refresh } = useWeather();
  const { 
    data: weeklyData, 
    isLoading: isWeeklyLoading, 
    error: weeklyError, 
    refresh: refreshWeekly 
  } = useWeeklyWeather();
  const { 
    data: stockData, 
    isLoading: isStockLoading, 
    error: stockError 
  } = useStocks();

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* 상태 표시기 */}
        <div className="mb-6">
          <StatusIndicator
            isOnline={typeof window !== 'undefined' ? navigator.onLine : true}
            isRefreshing={isLoading}
            lastUpdate={lastUpdate}
            error={error}
          />
        </div>

        {/* 메인 대시보드 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* 날짜/시간 */}
          <div className="lg:col-span-1">
            <DateTimeDisplay />
          </div>

          {/* 주식 지수 */}
          <div className="lg:col-span-3">
            {stockError ? (
              <div className="bg-red-50 rounded-2xl p-4 shadow-lg border border-red-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">⚠️</div>
                  <h3 className="text-lg font-bold text-red-800 mb-1">주식 지수 오류</h3>
                  <p className="text-red-600 text-sm">{stockError}</p>
                </div>
              </div>
            ) : (
              <StockIndices data={stockData} isLoading={isStockLoading} />
            )}
          </div>
        </div>

        {/* 날씨 정보 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 현재 날씨 */}
          <div>
            {error ? (
              <div className="bg-red-50 rounded-2xl p-6 shadow-lg border border-red-200">
                <div className="text-center">
                  <div className="text-4xl mb-3">⚠️</div>
                  <h3 className="text-xl font-bold text-red-800 mb-2">오류 발생</h3>
                  <p className="text-red-600 mb-3">{error}</p>
                  <button
                    onClick={refresh}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            ) : (
              <WeatherCard data={data} isLoading={isLoading} />
            )}
          </div>

          {/* 주간 날씨 */}
          <div>
            {weeklyError ? (
              <div className="bg-red-50 rounded-2xl p-6 shadow-lg border border-red-200">
                <div className="text-center">
                  <div className="text-4xl mb-3">⚠️</div>
                  <h3 className="text-xl font-bold text-red-800 mb-2">주간 날씨 오류</h3>
                  <p className="text-red-600 mb-3">{weeklyError}</p>
                  <button
                    onClick={refreshWeekly}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            ) : (
              <WeeklyWeather data={weeklyData} isLoading={isWeeklyLoading} />
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            자동 업데이트 • 현재 날씨: 5분 • 주간 날씨: 30분 • 주식 지수: 10분
          </p>
        </div>
      </div>
    </div>
  );
}