
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BarChart,
  TrendingUp,
  Activity,
  PieChart as PieIcon,
  RefreshCw,
  AlertCircle,
  Search
} from 'lucide-react';
import { fetchCoins } from './services/api.ts';
import { fetchWatchlist, addToWatchlist, removeFromWatchlist } from './services/supabase.ts';
import { Coin, DashboardStats, SortField, SortOrder } from './types';
import { formatCurrency, formatCompactNumber, formatPercent, classNames } from './utils/formatters';
import Layout from './components/Layout';
import KPICard from './components/KPICard';
import CoinTable from './components/CoinTable';
import { MarketCapLineChart, MarketCapDistributionBar, PriceChangePie } from './components/Charts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('market_cap');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Fetch data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [coinsData, watchlistData] = await Promise.all([
        fetchCoins(),
        fetchWatchlist()
      ]);

      setCoins(coinsData);
      setWatchlist(watchlistData.map(item => item.coin_id));

      if (!selectedCoin && coinsData.length > 0) {
        setSelectedCoin(coinsData[0]);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [selectedCoin]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived Statistics
  const stats = useMemo<DashboardStats>(() => {
    if (coins.length === 0) return { totalMarketCap: 0, totalVolume: 0, avgChange24h: 0, topGainer: null };

    // Fixed Error: Changed 'once' to 'reduce'
    const totalMarketCap = coins.reduce((acc, coin) => acc + coin.market_cap, 0);
    const totalVolume = coins.reduce((acc, coin) => acc + coin.total_volume, 0);
    const avgChange24h = coins.reduce((acc, coin) => acc + coin.price_change_percentage_24h, 0) / coins.length;
    const topGainer = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)[0];

    return { totalMarketCap, totalVolume, avgChange24h, topGainer };
  }, [coins]);

  // Filtering and Sorting
  const filteredAndSortedCoins = useMemo(() => {
    let result = coins.filter(coin =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeTab === 'watchlist') {
      result = result.filter(coin => watchlist.includes(coin.id));
    }

    result.sort((a, b) => {
      const aVal = a[sortField] || 0;
      const bVal = b[sortField] || 0;
      return sortOrder === 'desc' ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
    });

    return result;
  }, [coins, searchQuery, activeTab, watchlist, sortField, sortOrder]);

  // Handlers
  const handleToggleWatchlist = async (coinId: string) => {
    try {
      if (watchlist.includes(coinId)) {
        await removeFromWatchlist(coinId);
        setWatchlist(prev => prev.filter(id => id !== coinId));
      } else {
        await addToWatchlist(coinId);
        setWatchlist(prev => [...prev, coinId]);
      }
    } catch (err) {
      console.error('Failed to update watchlist', err);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Chart Data Preparation
  const lineChartData = useMemo(() => {
    if (!selectedCoin || !selectedCoin.sparkline_in_7d) return [];
    return selectedCoin.sparkline_in_7d.price.map((price, idx) => ({
      name: `Point ${idx}`,
      price
    }));
  }, [selectedCoin]);

  const barChartData = useMemo(() => {
    return coins.slice(0, 7).map(coin => ({
      name: coin.symbol.toUpperCase(),
      market_cap: coin.market_cap
    }));
  }, [coins]);

  const pieChartData = useMemo(() => {
    const bullish = coins.filter(c => c.price_change_percentage_24h > 1).length;
    const neutral = coins.filter(c => c.price_change_percentage_24h >= -1 && c.price_change_percentage_24h <= 1).length;
    const bearish = coins.filter(c => c.price_change_percentage_24h < -1).length;

    return [
      { name: 'Bullish (>1%)', value: bullish },
      { name: 'Neutral', value: neutral },
      { name: 'Bearish (<-1%)', value: bearish }
    ];
  }, [coins]);

  if (loading && coins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 gap-4">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-medium">Powering up real-time markets...</p>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="space-y-8">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Market Overview</h1>
            <p className="text-slate-400">Track and analyze over {coins.length} global crypto assets in real-time.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => loadData()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all text-sm font-medium">
              Buy Assets
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Market Cap"
            value={formatCompactNumber(stats.totalMarketCap)}
            icon={TrendingUp}
            color="bg-blue-600"
          />
          <KPICard
            title="Total Volume (24h)"
            value={formatCompactNumber(stats.totalVolume)}
            icon={Activity}
            color="bg-emerald-600"
          />
          <KPICard
            title="Avg Market Change"
            value={formatPercent(stats.avgChange24h)}
            change={stats.avgChange24h}
            icon={BarChart}
            color="bg-purple-600"
          />
          <KPICard
            title="Top Gainer"
            value={stats.topGainer?.name || '-'}
            change={stats.topGainer?.price_change_percentage_24h}
            icon={TrendingUp}
            color="bg-amber-600"
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img src={selectedCoin?.image} alt={selectedCoin?.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <h2 className="text-lg font-bold text-white leading-none">{selectedCoin?.name} Price</h2>
                    <p className="text-slate-500 text-sm mt-1">7-day performance trend</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{formatCurrency(selectedCoin?.current_price || 0)}</p>
                  <p className={classNames(
                    "text-sm font-semibold",
                    (selectedCoin?.price_change_percentage_24h || 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                  )}>
                    {formatPercent(selectedCoin?.price_change_percentage_24h || 0)}
                  </p>
                </div>
              </div>
              <MarketCapLineChart data={lineChartData} />
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-6">Market Cap Distribution (Top Assets)</h2>
              <MarketCapDistributionBar data={barChartData} />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-blue-400" />
                Sentiment Analysis
              </h2>
              <p className="text-slate-500 text-sm mb-6">Market breadth based on 24h performance</p>
              <PriceChangePie data={pieChartData} />
              <div className="space-y-3 mt-4">
                {pieChartData.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={classNames("w-3 h-3 rounded-full",
                        idx === 0 ? "bg-emerald-500" : idx === 1 ? "bg-amber-500" : "bg-rose-500"
                      )}></div>
                      <span className="text-slate-400 text-sm">{item.name}</span>
                    </div>
                    <span className="text-white font-semibold text-sm">{item.value} Assets</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white">
              <h3 className="text-lg font-bold mb-2">Portfolio Insights</h3>
              <p className="text-blue-100 text-sm mb-4">You have {watchlist.length} assets in your watchlist. Tracking these can help you identify trends early.</p>
              <button className="w-full bg-white text-blue-600 font-bold py-2 rounded-xl text-sm transition-transform active:scale-95">
                View Detailed Report
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white">Market Statistics</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Filter by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <CoinTable
            coins={filteredAndSortedCoins}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectCoin={setSelectedCoin}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          {filteredAndSortedCoins.length === 0 && (
            <div className="p-12 text-center">
              <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No assets found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;
