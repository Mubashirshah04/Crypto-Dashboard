import React from 'react';

const CoinTable: React.FC<any> = ({ coins, watchlist, onToggleWatchlist, onSelectCoin, sortField, sortOrder, onSort }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-4 text-left text-slate-400">Coin</th>
            <th className="p-4 text-right text-slate-400">Price</th>
            <th className="p-4 text-right text-slate-400">24h %</th>
            <th className="p-4 text-right text-slate-400">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin: any) => (
            <tr key={coin.id} className="border-b border-slate-800 hover:bg-slate-800/50">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                  <span className="text-white font-medium">{coin.name}</span>
                </div>
              </td>
              <td className="p-4 text-right text-white">${coin.current_price.toFixed(2)}</td>
              <td className={`p-4 text-right ${coin.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td className="p-4 text-right text-slate-400">${(coin.market_cap / 1e9).toFixed(2)}B</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoinTable;
