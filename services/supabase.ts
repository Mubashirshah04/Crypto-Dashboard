import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchWatchlist = async () => {
  const { data, error } = await supabase.from('watchlist').select('*');
  if (error) throw error;
  return data || [];
};

export const addToWatchlist = async (coinId: string) => {
  const { error } = await supabase.from('watchlist').insert([{ coin_id: coinId }]);
  if (error) throw error;
};

export const removeFromWatchlist = async (coinId: string) => {
  const { error } = await supabase.from('watchlist').delete().eq('coin_id', coinId);
  if (error) throw error;
};
