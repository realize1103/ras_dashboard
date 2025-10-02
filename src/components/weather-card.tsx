'use client';

import { WeatherData } from '@/lib/weather';
import { Thermometer, Droplets, Wind, Eye, Gauge } from 'lucide-react';

interface WeatherCardProps {
  data: WeatherData;
  isLoading?: boolean;
}

export function WeatherCard({ data, isLoading = false }: WeatherCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-16 bg-gray-200 rounded-lg mb-6"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const getWeatherIcon = (icon: string) => {
    const iconMap: Record<string, string> = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️',
    };
    return iconMap[icon] || '🌤️';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-black">현재 날씨</h2>
        <div className="text-3xl">{getWeatherIcon(data.icon)}</div>
      </div>

      {/* 메인 온도 */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-black mb-2">
          {data.temperature}°
        </div>
        <div className="text-lg text-gray-700 capitalize">
          {data.description}
        </div>
        <div className="text-sm text-gray-600 mt-2">
          체감 {data.feelsLike}° | 최고 {data.tempMax}° | 최저 {data.tempMin}°
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xs text-gray-600">습도</div>
            <div className="text-lg font-semibold text-black">{data.humidity}%</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Wind className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <div className="text-xs text-gray-600">풍속</div>
            <div className="text-lg font-semibold text-black">{data.windSpeed} m/s</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Gauge className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="text-xs text-gray-600">기압</div>
            <div className="text-lg font-semibold text-black">{data.pressure} hPa</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Eye className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <div className="text-xs text-gray-600">가시거리</div>
            <div className="text-lg font-semibold text-black">{data.visibility} km</div>
          </div>
        </div>
      </div>

      {/* 업데이트 시간 */}
      <div className="mt-4 text-left">
        <div className="text-xs text-gray-500">
          마지막 업데이트: {new Date(data.timestamp).toLocaleTimeString('ko-KR')}
        </div>
      </div>
    </div>
  );
}
