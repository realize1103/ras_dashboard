'use client';

import { useState } from 'react';

export default function TestPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/weather');
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Response data:', result);
      setData(result);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">API 테스트</h1>
        
        <button
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg mb-8"
        >
          {loading ? '테스트 중...' : 'API 테스트'}
        </button>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8">
            <h3 className="text-red-400 font-bold mb-2">오류:</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {data && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
            <h3 className="text-green-400 font-bold mb-2">성공:</h3>
            <pre className="text-green-300 text-sm overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
