import { NextRequest, NextResponse } from 'next/server';
import { StockService } from '@/lib/stock';

export async function GET(request: NextRequest) {
  try {
    const stockService = StockService.getInstance();
    const stockData = await stockService.getAllStocks();
    
    return NextResponse.json(stockData);
  } catch (error) {
    console.error('Stock API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '주식 지수 데이터를 가져올 수 없습니다.' },
      { status: 500 }
    );
  }
}
