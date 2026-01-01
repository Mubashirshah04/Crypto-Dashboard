import { COINGECKO_BASE_URL } from '../constants';
import { Coin } from '../types';

// Cache storage
let cachedCoins: Coin[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Multiple API endpoints as fallback
const API_ENDPOINTS = [
  {
    name: 'CoinGecko',
    url: (currency: string, perPage: number) => 
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=24h`
  },
  {
    name: 'CoinGecko Demo',
    url: (currency: string, perPage: number) => 
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1&sparkline=false`
  },
  {
    name: 'Binance Proxy',
    url: () => 'https://api.binance.com/api/v3/ticker/24hr',
    transform: (data: any[]) => {
      // Transform Binance data to match our format
      return data.slice(0, 50).map((item, index) => ({
        id: item.symbol.toLowerCase(),
        symbol: item.symbol.replace('USDT', '').toLowerCase(),
        name: item.symbol.replace('USDT', ''),
        image: `https://cryptologos.cc/logos/${item.symbol.toLowerCase()}-logo.png`,
        current_price: parseFloat(item.lastPrice),
        market_cap: parseFloat(item.quoteVolume) * parseFloat(item.lastPrice),
        total_volume: parseFloat(item.quoteVolume),
        price_change_percentage_24h: parseFloat(item.priceChangePercent),
        sparkline_in_7d: { price: [] }
      }));
    }
  },
  {
    name: 'CoinCap',
    url: () => 'https://api.coincap.io/v2/assets?limit=50',
    transform: (response: any) => {
      return response.data.map((item: any) => ({
        id: item.id,
        symbol: item.symbol.toLowerCase(),
        name: item.name,
        image: `https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`,
        current_price: parseFloat(item.priceUsd),
        market_cap: parseFloat(item.marketCapUsd),
        total_volume: parseFloat(item.volumeUsd24Hr),
        price_change_percentage_24h: parseFloat(item.changePercent24Hr),
        sparkline_in_7d: { price: [] }
      }));
    }
  }
];

export const fetchCoins = async (vsCurrency = 'usd', perPage = 50): Promise<Coin[]> => {
  // Check cache first
  const now = Date.now();
  if (cachedCoins && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('✅ Returning cached data');
    return cachedCoins;
  }

  // Try each API endpoint
  for (const endpoint of API_ENDPOINTS) {
    try {
      console.log(`🔄 Trying ${endpoint.name}...`);
      
      const url = endpoint.url(vsCurrency, perPage);
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(8000) // 8 second timeout
      });

      if (!response.ok) {
        console.warn(`❌ ${endpoint.name} failed with status ${response.status}`);
        continue;
      }

      let data = await response.json();
      
      // Transform data if needed
      if (endpoint.transform) {
        data = endpoint.transform(data);
      }

      // Update cache
      cachedCoins = data;
      cacheTimestamp = now;
      
      console.log(`✅ ${endpoint.name} succeeded!`);
      return data;

    } catch (error) {
      console.warn(`❌ ${endpoint.name} error:`, error);
      continue;
    }
  }

  // If all APIs fail, return cached data if available
  if (cachedCoins) {
    console.log('⚠️ All APIs failed, returning stale cache');
    return cachedCoins;
  }

  // Last resort error
  throw new Error('All API endpoints failed and no cache available');
};

export const fetchCoinDetails = async (id: string) => {
  try {
    const response = await fetch(`${COINGECKO_BASE_URL}/coins/${id}?sparkline=true`, {
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error('Failed to fetch coin details');
    return response.json();
  } catch (error) {
    // Return from cache if available
    if (cachedCoins) {
      const coin = cachedCoins.find(c => c.id === id);
      if (coin) return coin;
    }
    throw error;
  }
};
