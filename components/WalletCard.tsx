import React from 'react';

interface WalletCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
}

function WalletCard({ icon, title, value, change }: WalletCardProps) {
  const isPositive = change.startsWith('+');

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          {icon}
        </div>
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default WalletCard;