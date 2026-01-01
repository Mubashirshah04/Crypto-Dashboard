import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const MarketCapLineChart: React.FC<any> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <XAxis dataKey="name" stroke="#64748b" />
      <YAxis stroke="#64748b" />
      <Tooltip />
      <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

export const MarketCapDistributionBar: React.FC<any> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="name" stroke="#64748b" />
      <YAxis stroke="#64748b" />
      <Tooltip />
      <Bar dataKey="market_cap" fill="#3b82f6" />
    </BarChart>
  </ResponsiveContainer>
);

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export const PriceChangePie: React.FC<any> = ({ data }) => (
  <ResponsiveContainer width="100%" height={200}>
    <PieChart>
      <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
        {data.map((_: any, index: number) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);
