'use client';

import { Wifi, WifiOff, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface StatusIndicatorProps {
  isOnline: boolean;
  isRefreshing: boolean;
  lastUpdate?: Date;
  error?: string;
}

export function StatusIndicator({ 
  isOnline, 
  isRefreshing, 
  lastUpdate, 
  error 
}: StatusIndicatorProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
      <div className="flex items-center space-x-4">
        {/* 연결 상태 */}
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-600" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-600" />
          )}
          <span className="text-sm text-gray-700">
            {isOnline ? '연결됨' : '연결 끊김'}
          </span>
        </div>

        {/* 업데이트 상태 */}
        <div className="flex items-center space-x-2">
          {isRefreshing ? (
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
          ) : error ? (
            <XCircle className="w-5 h-5 text-red-600" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-600" />
          )}
          <span className="text-sm text-gray-700">
            {isRefreshing ? '업데이트 중...' : error ? '오류' : '정상'}
          </span>
        </div>
      </div>

      {/* 마지막 업데이트 시간 */}
      {lastUpdate && (
        <div className="text-sm text-gray-500">
          {lastUpdate.toLocaleTimeString('ko-KR')}
        </div>
      )}
    </div>
  );
}
