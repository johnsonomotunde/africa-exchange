import React from 'react';
import { Wallet, ArrowUpDown, TrendingUp, Users, DollarSign, LineChart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AnalyticsCard from '../components/AnalyticsCard';
import RevenueChart from '../components/RevenueChart';
import TopCustomers from '../components/TopCustomers';
import TransactionList from '../components/TransactionList';

function Dashboard() {
  const { user } = useAuth();

  // Mock data - in production, this would come from Supabase
  const revenueData = [
    { date: '2024-02-01', value: 45000 },
    { date: '2024-02-02', value: 52000 },
    { date: '2024-02-03', value: 49000 },
    { date: '2024-02-04', value: 47000 },
    { date: '2024-02-05', value: 55000 },
    { date: '2024-02-06', value: 58000 },
    { date: '2024-02-07', value: 62000 },
  ];

  const topCustomers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      totalSpent: 15000,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      totalSpent: 12500,
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    },
    {
      id: '3',
      name: 'Amanda Silva',
      email: 'amanda@example.com',
      totalSpent: 11000,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david@example.com',
      totalSpent: 9500,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to AfriExchange
          </h1>
          <p className="text-gray-600 mb-8">
            The secure platform for African freelancers to manage global payments
          </p>
          <a
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.email}</h1>
        <p className="text-gray-600">Here's what's happening with your business today</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Balance"
          value={245000}
          percentageChange={12.5}
          icon={<Wallet className="w-6 h-6 text-blue-600" />}
        />
        <AnalyticsCard
          title="Total Revenue"
          value={62000}
          percentageChange={8.2}
          icon={<DollarSign className="w-6 h-6 text-blue-600" />}
        />
        <AnalyticsCard
          title="Active Users"
          value={1250}
          percentageChange={-2.3}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          currency=""
        />
        <AnalyticsCard
          title="Conversion Rate"
          value={64}
          percentageChange={5.7}
          icon={<LineChart className="w-6 h-6 text-blue-600" />}
          currency=""
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div>
          <TopCustomers customers={topCustomers} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <TransactionList limit={5} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Exchange Rates</h2>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            {[
              { from: 'USD', to: 'NGN', rate: 460 },
              { from: 'EUR', to: 'NGN', rate: 500 },
              { from: 'GBP', to: 'NGN', rate: 580 },
              { from: 'USD', to: 'KES', rate: 127 },
              { from: 'USD', to: 'ZAR', rate: 18.5 },
            ].map((rate) => (
              <div key={`${rate.from}-${rate.to}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{rate.from}</span>
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{rate.to}</span>
                </div>
                <span className="text-gray-900 font-medium">
                  1 {rate.from} = {rate.rate} {rate.to}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;