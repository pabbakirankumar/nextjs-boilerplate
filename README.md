# Stock Analyst AI Chatbot

A powerful AI-powered stock analysis chatbot built with Next.js and Google's Gemini AI. Get real-time stock analysis, market insights, and investment advice through an intuitive chat interface.

## Features

- 🤖 **AI-Powered Analysis**: Powered by Google's Gemini AI for intelligent stock analysis
- 📊 **Real-time Stock Data**: Fetches live stock prices and market data
- 💬 **Interactive Chat Interface**: Natural conversation flow for asking questions
- 📈 **Technical Analysis**: Comprehensive technical and fundamental analysis
- 🎯 **Investment Insights**: Get personalized investment recommendations
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini AI API
- **Stock Data**: Alpha Vantage API (demo)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd nextjs-boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Chat with the AI Analyst

The chatbot can help you with:

- **Stock Analysis**: Ask about specific stocks (e.g., "Analyze AAPL")
- **Market Trends**: Get insights on market conditions
- **Investment Advice**: Receive personalized recommendations
- **Technical Analysis**: Understand price movements and patterns
- **Risk Assessment**: Evaluate investment risks

### Example Queries

- "What do you think about Tesla stock?"
- "Analyze the current market trends"
- "Should I invest in Apple?"
- "What's the outlook for tech stocks?"
- "Compare AAPL and MSFT"

### Stock Data Integration

The chatbot automatically detects stock symbols in your messages and fetches real-time data including:
- Current price
- Daily change and percentage
- Volume
- High/low prices
- Opening price

## API Endpoints

### `/api/chat`
- **Method**: POST
- **Description**: Send messages to the AI analyst
- **Body**: `{ message: string, stockData?: object }`

### `/api/stock`
- **Method**: GET
- **Description**: Fetch real-time stock data
- **Query**: `?symbol=AAPL`

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Gemini AI integration
│   │   └── stock/route.ts          # Stock data API
│   ├── components/
│   │   └── StockChatbot.tsx       # Main chatbot component
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page
├── .env.local                     # Environment variables
└── package.json                   # Dependencies
```

## Customization

### Adding More Stock Data Sources

You can integrate additional stock data providers by modifying `app/api/stock/route.ts`:

```typescript
// Example: Add Yahoo Finance API
const yahooResponse = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
```

### Customizing AI Prompts

Modify the prompt in `app/api/chat/route.ts` to customize the AI's behavior:

```typescript
const prompt = `
You are a specialized [your customization] stock analyst...
`;
```

### Styling

The app uses Tailwind CSS. Customize the appearance by modifying classes in `StockChatbot.tsx`.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `GEMINI_API_KEY` environment variable
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## Important Notes

⚠️ **Disclaimer**: This chatbot provides educational and informational content only. It is not financial advice. Always consult with qualified financial advisors before making investment decisions.

🔑 **API Keys**: Keep your Gemini API key secure and never commit it to version control.

📊 **Stock Data**: The demo uses Alpha Vantage's free tier. For production use, consider upgrading to a paid plan or using other data providers.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues, please open a GitHub issue or contact the development team.
