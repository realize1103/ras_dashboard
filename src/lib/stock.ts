export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface StockResponse {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

import { config } from './config';

export class StockService {
  private static instance: StockService;
  private cache: Map<string, StockData> = new Map();
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10분

  private constructor() {}

  public static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  public async getStockData(symbol: string): Promise<StockData> {
    const now = Date.now();
    const cached = this.cache.get(symbol);
    
    // 캐시된 데이터가 있고 5분 이내라면 캐시된 데이터 반환
    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return cached;
    }

    try {
      // Yahoo Finance API 사용 (무료)
      const yahooSymbol = this.convertToYahooSymbol(symbol);
      const apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
        throw new Error('Invalid API response');
      }
      
      const result = data.chart.result[0];
      const meta = result.meta;
      const regularMarketPrice = meta.regularMarketPrice;
      const previousClose = meta.previousClose;
      
      const price = regularMarketPrice;
      const change = price - previousClose;
      const changePercent = (change / previousClose) * 100;
      
      const stockData: StockData = {
        symbol: symbol,
        name: this.getStockName(symbol),
        price: Math.round(price * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        timestamp: now,
      };

      this.cache.set(symbol, stockData);
      return stockData;
    } catch (error) {
      console.error(`Failed to fetch stock data for ${symbol}:`, error);
      
      // API 실패 시 모의 데이터로 폴백
      console.log(`Falling back to mock data for ${symbol}`);
      const mockData = this.getMockStockData(symbol);
      
      const stockData: StockData = {
        symbol: mockData.symbol,
        name: this.getStockName(symbol),
        price: mockData.price,
        change: mockData.change,
        changePercent: mockData.changePercent,
        timestamp: now,
      };

      this.cache.set(symbol, stockData);
      return stockData;
    }
  }

  public async getAllStocks(): Promise<StockData[]> {
    // 실제 지수 심볼로 변경 (주식 지수 + 환율 + 암호화폐)
    const symbols = ['^GSPC', '^IXIC', '^KS11', 'USDKRW=X', 'BTC-USD']; // S&P 500, NASDAQ, KOSPI, 원달러, 비트코인
    const promises = symbols.map(symbol => this.getStockData(symbol));
    
    try {
      return await Promise.all(promises);
    } catch (error) {
      console.error('Failed to fetch all stock data:', error);
      throw new Error('주식 지수 데이터를 가져올 수 없습니다.');
    }
  }

  private convertToYahooSymbol(symbol: string): string {
    const yahooSymbols: Record<string, string> = {
      '^GSPC': '^GSPC',
      '^IXIC': '^IXIC', 
      '^KS11': '^KS11',
      'USDKRW=X': 'USDKRW=X',
      'BTC-USD': 'BTC-USD',
      'SPX': '^GSPC',
      'NASDAQ': '^IXIC',
      'KOSPI': '^KS11',
    };
    return yahooSymbols[symbol] || symbol;
  }

  private getStockName(symbol: string): string {
    const names: Record<string, string> = {
      '^GSPC': 'S&P 500',
      '^IXIC': 'NASDAQ',
      '^KS11': 'KOSPI',
      'USDKRW=X': '원달러',
      'BTC-USD': '비트코인',
      'SPX': 'S&P 500',
      'NASDAQ': 'NASDAQ',
      'KOSPI': 'KOSPI',
    };
    return names[symbol] || symbol;
  }

  private getMockStockData(symbol: string): StockResponse {
    // 실제로는 API 호출을 해야 하지만, 여기서는 모의 데이터 생성
    const basePrices: Record<string, number> = {
      '^GSPC': 4500,
      '^IXIC': 15000,
      '^KS11': 2500,
      'USDKRW=X': 1300,
      'BTC-USD': 65000,
      'SPX': 4500,
      'NASDAQ': 15000,
      'KOSPI': 2500,
    };

    const basePrice = basePrices[symbol] || 1000;
    const randomChange = (Math.random() - 0.5) * 100; // -50 ~ +50
    const price = basePrice + randomChange;
    const change = randomChange;
    const changePercent = (change / basePrice) * 100;

    return {
      symbol,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
    };
  }

  public clearCache(): void {
    this.cache.clear();
    this.lastFetch = 0;
  }
}
