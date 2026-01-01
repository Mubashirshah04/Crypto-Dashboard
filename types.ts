
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface WatchlistItem {
  id: string;
  coin_id: string;
  created_at: string;
}

export interface DashboardStats {
  totalMarketCap: number;
  totalVolume: number;
  avgChange24h: number;
  topGainer: Coin | null;
}

export type SortField = 'market_cap' | 'current_price' | 'price_change_percentage_24h';
export type SortOrder = 'asc' | 'desc';
