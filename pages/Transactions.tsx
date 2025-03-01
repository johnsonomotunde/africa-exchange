import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import TransactionList from '../components/TransactionList';

function Transactions() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            View Your Transaction History
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to access your transaction history
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h1>
        <TransactionList />
      </div>
    </div>
  );
}

export default Transactions;