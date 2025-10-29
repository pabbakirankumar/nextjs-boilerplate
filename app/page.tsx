'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      if (res.ok) {
        const data = await res.json();
        setResponse(data.message);
      } else {
        setResponse('Error: Failed to get response');
      }
    } catch (error) {
      setResponse('Error: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            🤖 Stock Analyst AI
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Powered by Gemini AI - Ask me about stocks and investments!
          </p>
          
          <div className="space-y-6">
            <div className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me about stocks, market trends, or investment advice..."
                className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim() || isLoading}
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
            
            {response && (
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Response:</h3>
                <div className="text-gray-700 whitespace-pre-wrap">{response}</div>
              </div>
            )}
            
            <div className="text-center text-gray-500">
              <p>💡 Try: "Analyze AAPL", "What's the market outlook?", "Should I invest in Tesla?"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
