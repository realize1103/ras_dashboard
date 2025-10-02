'use client';

import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function RefreshButton({ onRefresh, isLoading = false, disabled = false }: RefreshButtonProps) {
  return (
    <button
      onClick={onRefresh}
      disabled={disabled || isLoading}
      className={`
        flex items-center justify-center space-x-2
        bg-white hover:bg-gray-50 
        rounded-2xl p-4
        shadow-lg border border-gray-200
        transition-all duration-200
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        touch-manipulation
      `}
    >
      <RefreshCw 
        className={`w-6 h-6 text-black ${isLoading ? 'animate-spin' : ''}`} 
      />
      <span className="text-black font-medium">
        {isLoading ? '새로고침 중...' : '새로고침'}
      </span>
    </button>
  );
}
