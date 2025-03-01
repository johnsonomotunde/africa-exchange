import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { formatCurrency } from '../utils/format';

interface DataPoint {
  date: string;
  value: number;
}

interface RevenueChartProps {
  data: DataPoint[];
}

function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
        <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'MMM d')}
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{ background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
              formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              labelFormatter={(date) => format(new Date(date as string), 'MMMM d, yyyy')}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;