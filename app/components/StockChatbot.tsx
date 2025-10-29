'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, TrendingUp, DollarSign, BarChart3, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  stockData?: any;
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: string;
  volume: number;
  high: number;
  low: number;
  open: number;
}

export default function StockChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Stock Analyst. I can help you analyze stocks, provide market insights, and answer investment questions. Try asking me about a specific stock symbol like 'AAPL' or 'What do you think about Tesla?'",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStock, setCurrentStock] = useState<StockData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchStockData = async (symbol: string): Promise<StockData | null> => {
    try {
      const response = await fetch(`/api/stock?symbol=${symbol.toUpperCase()}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
    return null;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Extract potential stock symbol from message
      const stockSymbolMatch = input.match(/\b[A-Z]{1,5}\b/g);
      let stockData = null;
      
      if (stockSymbolMatch) {
        console.log('Detected stock symbol:', stockSymbolMatch[0]);
        stockData = await fetchStockData(stockSymbolMatch[0]);
        if (stockData) {
          setCurrentStock(stockData);
        }
      }

      console.log('Sending request to API...');
      
      // Prepare conversation history (excluding the system message and current messages)
      const conversationHistory = messages
        .filter(msg => msg.id !== '1') // Exclude the initial system message
        .map(msg => ({
          role: msg.isUser ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          stockData: stockData,
          conversationHistory: conversationHistory
        }),
      });

      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Received response:', data);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          isUser: false,
          timestamp: new Date(data.timestamp),
          stockData: stockData
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error('Failed to get response');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error while processing your request. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const formatChange = (change: number, changePercent: string) => {
    const isPositive = change >= 0;
    return (
      <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent})
      </span>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b px-8 py-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stock Analyst AI</h1>
            <p className="text-lg text-gray-600">Powered by Gemini AI</p>
          </div>
        </div>
      </div>

      {/* Current Stock Display */}
      {currentStock && (
        <div className="bg-white border-b px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-7 h-7 text-blue-600" />
                <span className="font-bold text-2xl">{currentStock.symbol}</span>
              </div>
              <div className="text-4xl font-bold text-gray-900">
                ${formatPrice(currentStock.price)}
              </div>
              <div className="text-xl">
                {formatChange(currentStock.change, currentStock.changePercent)}
              </div>
            </div>
            <div className="text-lg text-gray-500">
              Vol: {currentStock.volume.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-4xl px-6 py-4 rounded-2xl ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 shadow-lg border'
              }`}
            >
              <div className="flex items-start space-x-3">
                {!message.isUser && (
                  <Bot className="w-7 h-7 text-blue-600 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="whitespace-pre-wrap text-lg leading-relaxed">{message.text}</div>
                  <div className={`text-sm mt-3 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 shadow-lg border px-6 py-4 rounded-2xl">
              <div className="flex items-center space-x-3">
                <Bot className="w-7 h-7 text-blue-600" />
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-lg text-gray-600 ml-2">Analyzing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t px-8 py-6">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about stocks, market trends, or investment advice..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
          >
            <Send className="w-6 h-6" />
            <span>Send</span>
          </button>
        </div>
        <div className="mt-4 text-base text-gray-600">
          💡 Try: "Analyze AAPL", "What's the market outlook?", "Should I invest in Tesla?"
        </div>
      </div>
    </div>
  );
}
