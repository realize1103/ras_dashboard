import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/lib/weather';

export async function GET(request: NextRequest) {
  console.log('Weather API called');
  
  try {
    const weatherService = WeatherService.getInstance();
    console.log('Weather service instance created');
    
    const weatherData = await weatherService.getCurrentWeather();
    console.log('Weather data fetched:', weatherData);
    
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '날씨 데이터를 가져올 수 없습니다.' },
      { status: 500 }
    );
  }
}
