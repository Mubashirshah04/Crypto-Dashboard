import { COINGECKO_BASE_URL } from '../constants';
import { Coin } from '../types';

export const fetchCoins = async (vsCurrency = 'usd', perPage = 50): Promise<Coin[]> => {
  const response = await fetch(
    `${COINGECKO_BASE_URL}/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=24h`
  );
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. CoinGecko free tier has limits. Please wait a minute.');
    }
    throw new Error('Failed to fetch coin data');
  }
  
  return response.json();
};

export const fetchCoinDetails = async (id: string) => {
  const response = await fetch(`${COINGECKO_BASE_URL}/coins/${id}?sparkline=true`);
  if (!response.ok) throw new Error('Failed to fetch coin details');
  return response.json();
};
