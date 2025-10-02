import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/lib/weather';

export async function GET(request: NextRequest) {
  try {
    const weatherService = WeatherService.getInstance();
    const weeklyData = await weatherService.getWeeklyWeather();
    
    return NextResponse.json(weeklyData);
  } catch (error) {
    console.error('Weekly Weather API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '주간 날씨 데이터를 가져올 수 없습니다.' },
      { status: 500 }
    );
  }
}
