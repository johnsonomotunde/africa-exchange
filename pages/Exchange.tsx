import React, { useState } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ExchangeRate {
  currency: string;
  rate: number;
  name: string;
  flag: string;
}

function Exchange() {
  const { user } = useAuth();
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('NGN');

  // Mock exchange rates - in production, fetch from Supabase
  const currencies: ExchangeRate[] = [
    { currency: 'USD', rate: 1, name: 'US Dollar', flag: '🇺🇸' },
    { currency: 'EUR', rate: 0.92, name: 'Euro', flag: '🇪🇺' },
    { currency: 'GBP', rate: 0.79, name: 'British Pound', flag: '🇬🇧' },
    { currency: 'NGN', rate: 460, name: 'Nigerian Naira', flag: '🇳🇬' },
    { currency: 'KES', rate: 127, name: 'Kenyan Shilling', flag: '🇰🇪' },
    { currency: 'ZAR', rate: 18.5, name: 'South African Rand', flag: '🇿🇦' },
  ];

  const calculateExchange = (value: string, from: string, to: string) => {
    const fromRate = currencies.find(c => c.currency === from)?.rate || 1;
    const toRate = currencies.find(c => c.currency === to)?.rate || 1;
    const usdAmount = parseFloat(value) / fromRate;
    return (usdAmount * toRate).toFixed(2);
  };

  const handleExchange = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would call the Supabase API to create a transaction
    console.log('Exchange initiated:', {
      amount,
      fromCurrency,
      toCurrency,
      calculatedAmount: calculateExchange(amount, fromCurrency, toCurrency),
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sign in to Start Trading
          </h1>
          <p className="text-gray-600 mb-8">
            Access competitive exchange rates and instant transfers
          </p>
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Currency Exchange</h1>
        
        <form onSubmit={handleExchange} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
                required
              />
            </div>

            {/* Exchange Rate Display */}
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Exchange Rate</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900">
                    1 {fromCurrency} = {calculateExchange('1', fromCurrency, toCurrency)} {toCurrency}
                  </span>
                  <RefreshCw className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.map((currency) => (
                  <option key={currency.currency} value={currency.currency}>
                    {currency.flag} {currency.name} ({currency.currency})
                  </option>
                ))}
              </select>
            </div>

            {/* To Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.map((currency) => (
                  <option key={currency.currency} value={currency.currency}>
                    {currency.flag} {currency.name} ({currency.currency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Calculated Amount */}
          {amount && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">You send</p>
                  <p className="text-xl font-bold text-gray-900">
                    {amount} {fromCurrency}
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400" />
                <div className="text-right">
                  <p className="text-sm text-gray-500">Recipient gets</p>
                  <p className="text-xl font-bold text-gray-900">
                    {calculateExchange(amount, fromCurrency, toCurrency)} {toCurrency}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default Exchange;