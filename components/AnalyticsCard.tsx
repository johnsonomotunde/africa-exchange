import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface AnalyticsCardProps {
  title: string;
  value: number;
  percentageChange: number;
  icon: React.ReactNode;
  currency?: string;
}

function AnalyticsCard({ title, value, percentageChange, icon, currency }: AnalyticsCardProps) {
  const isPositive = percentageChange >= 0;
  const formattedValue = currency ? formatCurrency(value, currency) : formatCurrency(value);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          {icon}
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'} text-sm font-medium`}>
          <span>{Math.abs(percentageChange)}%</span>
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">
        {formattedValue}
        {!currency && title === "Conversion Rate" && "%"}
      </p>
    </div>
  );
}

export default AnalyticsCard;