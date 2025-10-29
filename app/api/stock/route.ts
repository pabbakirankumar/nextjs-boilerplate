import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return NextResponse.json({ error: 'Stock symbol is required' }, { status: 400 });
    }

    // Using Alpha Vantage API (free tier) for stock data
    // You can replace this with any other stock data provider
    const apiKey = 'demo'; // Using demo key for Alpha Vantage
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }
    
    const data = await response.json();
    
    // Extract relevant stock information
    const quote = data['Global Quote'];
    if (!quote) {
      return NextResponse.json({ error: 'Stock symbol not found' }, { status: 404 });
    }
    
    const stockData = {
      symbol: quote['01. symbol'],
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      price: parseFloat(quote['05. price']),
      volume: parseInt(quote['06. volume']),
      latestTradingDay: quote['07. latest trading day'],
      previousClose: parseFloat(quote['08. previous close']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent']
    };
    
    return NextResponse.json(stockData);
    
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' }, 
      { status: 500 }
    );
  }
}
