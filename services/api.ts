import { Coin } from '../types';

// Cache storage
let cachedCoins: Coin[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// CORS-free proxy endpoints
const API_ENDPOINTS = [
  {
    name: 'CoinGecko via Proxy',
    url: () => 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h',
  },
  {
    name: 'CryptoCompare',
    url: () => 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=50&tsym=USD',
    transform: (data: any) => {
      if (!data.Data) return [];
      return data.Data.map((item: any) => ({
        id: item.CoinInfo.Name.toLowerCase(),
        symbol: item.CoinInfo.Name.toLowerCase(),
        name: item.CoinInfo.FullName,
        image: `https://www.cryptocompare.com${item.CoinInfo.ImageUrl}`,
        current_price: item.RAW?.USD?.PRICE || 0,
        market_cap: item.RAW?.USD?.MKTCAP || 0,
        total_volume: item.RAW?.USD?.TOTALVOLUME24H || 0,
        price_change_percentage_24h: item.RAW?.USD?.CHANGEPCT24HOUR || 0,
        sparkline_in_7d: { price: [] }
      }));
    }
  },
  {
    name: 'CoinCap',
    url: () => 'https://api.coincap.io/v2/assets?limit=50',
    transform: (response: any) => {
      if (!response.data) return [];
      return response.data.map((item: any) => ({
        id: item.id,
        symbol: item.symbol.toLowerCase(),
        name: item.name,
        image: `https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`,
        current_price: parseFloat(item.priceUsd) || 0,
        market_cap: parseFloat(item.marketCapUsd) || 0,
        total_volume: parseFloat(item.volumeUsd24Hr) || 0,
        price_change_percentage_24h: parseFloat(item.changePercent24Hr) || 0,
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
      
      const response = await fetch(endpoint.url(), {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`❌ ${endpoint.name} failed: ${response.status}`);
        continue;
      }

      let data = await response.json();
      
      // Transform data if needed
      if (endpoint.transform) {
        data = endpoint.transform(data);
      }

      // Validate data
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn(`❌ ${endpoint.name} returned invalid data`);
        continue;
      }

      // Update cache
      cachedCoins = data;
      cacheTimestamp = now;
      
      console.log(`✅ ${endpoint.name} succeeded with ${data.length} coins!`);
      return data;

    } catch (error: any) {
      console.warn(`❌ ${endpoint.name} error:`, error.message);
      continue;
    }
  }

  // If all APIs fail, return cached data if available
  if (cachedCoins) {
    console.warn('⚠️ All APIs failed, returning stale cache');
    return cachedCoins;
  }

  // Last resort - throw error
  throw new Error('Unable to fetch cryptocurrency data. Please check your internet connection.');
};

export const fetchCoinDetails = async (id: string) => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?sparkline=true`);
    if (!response.ok) throw new Error('Failed to fetch details');
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
