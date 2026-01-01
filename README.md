
# CryptoPulse Analytics Dashboard

A professional-grade cryptocurrency analytics dashboard built with React, TypeScript, and Tailwind CSS.

## 🚀 Key Features

- **Real-time Market Data:** Consumes live data from the CoinGecko API (Markets, Sparklines).
- **Interactive Visualizations:** Powered by Recharts with custom tooltips, gradients, and responsive containers.
- **Dynamic Watchlist:** Integrated with Supabase for persistent tracking of your favorite assets.
- **Advanced Filtering:** Real-time search, sorting by market cap, price, or 24h change.
- **Responsive UX:** Mobile-first design with a collapsible sidebar and optimized table layouts.

## 🏗️ Architecture

- **Frontend:** React 18 (Functional Components, Hooks).
- **Data Fetching:** Service-oriented architecture for clean API/Supabase calls.
- **Styling:** Tailwind CSS for high-performance utility-first styling.
- **State Management:** Local React state for UI/Filter state; Derived state for analytics calculations.
- **Supabase Integration:** Real database interaction for the "Watchlist" feature.

## 📊 Supabase Schema

To use the watchlist feature, create the following table in your Supabase project:

```sql
create table watchlist (
  id uuid default uuid_generate_v4() primary key,
  coin_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Optional: Enable RLS
alter table watchlist enable row level security;
create policy "Allow public access for this demo" on watchlist for all using (true);
```

## 🛠️ Local Development

1. Ensure you have Node.js installed.
2. Clone this repository.
3. Environment variables are pre-configured in `constants.ts` for this demo.
4. Run `npm install` and `npm start`.

## 🌐 API Credits

- [CoinGecko API](https://www.coingecko.com/en/api) - Market data source.
- [Lucide Icons](https://lucide.dev/) - Icon library.
- [Supabase](https://supabase.com/) - Backend and database.
