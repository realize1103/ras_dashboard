'use client';

import { StockData } from '@/lib/stock';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StockIndicesProps {
  data: StockData[];
  isLoading?: boolean;
}

export function StockIndices({ data, isLoading = false }: StockIndicesProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-bold text-black mb-4">주요 지수</h3>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 h-full">
      <h3 className="text-lg font-bold text-black mb-3 text-left">주요 지수</h3>
      <div className="grid grid-cols-5 gap-2">
        {data.map((stock, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600 text-left">{stock.name}</span>
              <div className="flex items-center">
                {getChangeIcon(stock.change)}
              </div>
            </div>
            <div className="text-sm font-bold text-black mb-1 text-left">
              {stock.price.toLocaleString()}
            </div>
            <div className={`text-xs font-medium text-left ${getChangeColor(stock.change)}`}>
              {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
