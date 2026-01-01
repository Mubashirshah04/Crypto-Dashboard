import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  icon: any;
  color: string;
  change?: number;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, color, change }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-slate-400 text-sm mb-2">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
      {change !== undefined && (
        <p className={`text-sm mt-2 ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </p>
      )}
    </div>
  );
};

export default KPICard;
