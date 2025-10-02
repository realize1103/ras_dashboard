'use client';

import { DailyWeather } from '@/lib/weather';
import { Droplets, Wind } from 'lucide-react';

interface WeeklyWeatherProps {
  data: DailyWeather[];
  isLoading?: boolean;
}

export function WeeklyWeather({ data, isLoading = false }: WeeklyWeatherProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-200">
        <h3 className="text-xl font-bold text-black mb-6">5일 예보</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-xl animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
            </div>
          ))}
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
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 h-full">
      <h3 className="text-lg font-bold text-black mb-4 text-left">5일 예보</h3>
      <div className="space-y-2">
        {data.map((day, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{getWeatherIcon(day.icon)}</div>
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-black text-sm">{day.dayOfWeek}</span>
                  <span className="text-xs text-gray-500">{day.date}</span>
                </div>
                <div className="text-xs text-gray-600 capitalize">{day.description}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-bold text-black">
                  {day.tempMax}° / {day.tempMin}°
                </div>
                <div className="text-xs text-gray-500">최고/최저</div>
              </div>
              
              <div className="flex items-center space-x-3 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Droplets className="w-3 h-3 text-blue-600" />
                  <span>{day.humidity}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Wind className="w-3 h-3 text-green-600" />
                  <span>{day.windSpeed}m/s</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
