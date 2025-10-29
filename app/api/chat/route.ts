import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('API route called');
    const { message, stockData, conversationHistory } = await request.json();
    console.log('Received message:', message);
    console.log('Conversation history length:', conversationHistory?.length || 0);
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Prepare the prompt with context
    let prompt = message;
    
    // Add system context
    const systemContext = `You are an expert stock analyst AI assistant. You have access to real-time stock data and market information.
${stockData ? `Current Stock Data: ${JSON.stringify(stockData)}` : ''}

Provide comprehensive analysis including technical analysis, fundamental analysis, market sentiment, risk assessment, and investment recommendations.
Always include appropriate disclaimers about investment risks and that this is not financial advice.
Be conversational but professional in your response.

Previous conversation:
${conversationHistory?.map(msg => 
  `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.parts[0].text}`
).join('\n\n') || 'No previous conversation.'}

Current question: ${message}`;

    console.log('Generating content with Gemini...');
    const result = await model.generateContent(systemContext);
    const response = await result.response;
    const text = response.text();
    console.log('Generated response:', text.substring(0, 100) + '...');

    return NextResponse.json({ 
      message: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' }, 
      { status: 500 }
    );
  }
}
