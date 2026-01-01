# Crypto Analytics Dashboard

A modern, production-ready analytics dashboard that fetches real-world cryptocurrency data from CoinGecko's public API and visualizes market insights through interactive charts, filters, and tables.

## 🚀 Features

### Data Fetching
- Real-time cryptocurrency market data from CoinGecko API
- Global market statistics (total market cap, volume, BTC dominance)
- Historical price data with 7-day sparklines
- Rate-limited API calls to prevent throttling
- Graceful error handling with retry logic

### Data Transformation
- Automatic data normalization and cleaning
- Derived metrics (market trends, sentiment analysis)
- Aggregated statistics (averages, totals, distributions)
- Sparkline data transformation for mini charts

### Interactive Filters
- **Search**: Debounced search by coin name or symbol
- **Sorting**: By market cap, price, 24h change, or volume
- **Categories**: All coins, Top 10, Gainers, Losers
- **Pagination**: Navigate through large datasets
- Real-time chart updates on filter changes

### Data Visualization
- **Line Chart**: Bitcoin 7-day price trend with gradient fill
- **Bar Chart**: Top 10 cryptocurrencies by 24h trading volume
- **Pie Chart**: Market cap distribution (donut style)
- **Sparklines**: Mini 7-day price charts in table rows

### Dashboard UI
- Clean, responsive dark theme design
- KPI cards with trend indicators
- Market sentiment analysis widget
- Professional typography with JetBrains Mono for numbers
- Smooth animations and loading states

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design tokens
- **Components**: shadcn/ui (customized)
- **Charts**: Recharts
- **Data Fetching**: TanStack Query (React Query)
- **State Management**: React hooks + custom filter logic

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx    # Main layout wrapper
│   │   ├── KPIStatCard.tsx        # KPI metric cards
│   │   ├── FilterBar.tsx          # Search & filter controls
│   │   ├── LineChartComponent.tsx # Area/line chart
│   │   ├── BarChartComponent.tsx  # Horizontal bar chart
│   │   ├── PieChartComponent.tsx  # Donut pie chart
│   │   ├── SparklineChart.tsx     # Mini inline charts
│   │   ├── DataTable.tsx          # Paginated data table
│   │   ├── MarketTrends.tsx       # Sentiment widget
│   │   └── ErrorState.tsx         # Error boundary UI
│   └── ui/                        # shadcn components
├── hooks/
│   ├── useCryptoData.ts           # React Query hooks
│   ├── useDebounce.ts             # Debounce utility
│   └── useFilters.ts              # Filter state management
├── services/
│   └── api.ts                     # CoinGecko API layer
├── types/
│   └── crypto.ts                  # TypeScript interfaces
├── utils/
│   ├── formatters.ts              # Number/currency formatters
│   └── transformers.ts            # Data transformation logic
└── pages/
    └── Index.tsx                  # Main dashboard page
```

## 🔌 API Sources

### CoinGecko API (Free Tier)
- **Base URL**: `https://api.coingecko.com/api/v3`
- **Endpoints Used**:
  - `/coins/markets` - Market data with sparklines
  - `/global` - Global market statistics
  - `/coins/{id}/market_chart` - Historical price data

### Rate Limiting
- Built-in 1.5-second delay between requests
- Automatic retry with exponential backoff
- User-friendly error messages for rate limits

## 🎨 Design System

### Colors (HSL)
- **Primary**: Cyan (`187 85% 53%`)
- **Background**: Deep navy (`222 47% 6%`)
- **Success**: Green (`142 76% 36%`)
- **Destructive**: Red (`0 72% 51%`)
- **Chart colors**: 8-color palette for data visualization

### Typography
- **Sans**: Inter (UI text)
- **Mono**: JetBrains Mono (numbers, stats)

### Effects
- Glass-morphism cards with backdrop blur
- Gradient text for branding
- Subtle glow effects on primary elements
- Smooth slide-up animations

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📈 How Filters Work

1. **Search**: User types in search box → 300ms debounce → filters coins by name/symbol
2. **Sort**: Select sort field → data re-sorted → charts + table update
3. **Category**: Select filter → coins filtered (gainers show only positive 24h change)
4. **Pagination**: Click next/prev → table shows next batch of 20 items

All filters are composable and update the UI in real-time.

## 🌐 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Deploy (auto-detected Vite config)

### Environment Variables
No API keys required - CoinGecko free tier is public.

## 🔮 Future Improvements

- [ ] Add more cryptocurrency detail pages
- [ ] Implement WebSocket for real-time price updates
- [ ] Add portfolio tracking feature
- [ ] Dark/light theme toggle
- [ ] Export data to CSV
- [ ] Add more chart types (candlestick, heatmap)
- [ ] Integrate backend for caching (Supabase Edge Functions)
- [ ] Add user authentication for saved preferences

## 📜 License

MIT License - feel free to use for interviews, portfolios, or client projects.
