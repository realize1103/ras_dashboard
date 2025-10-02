'use client';

import { useState, useEffect } from 'react';

export function DateTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 h-full">
      <div className="text-left">
        <div className="text-lg font-bold text-black mb-2">
          {formatDate(currentTime)}
        </div>
        <div className="text-2xl font-mono text-gray-700">
          {formatTime(currentTime)}
        </div>
      </div>
    </div>
  );
}
