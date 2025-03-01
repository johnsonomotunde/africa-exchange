import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  counterparty: string;
}

interface TransactionListProps {
  limit?: number;
}

function TransactionList({ limit = 5 }: TransactionListProps) {
  // This is mock data - in a real app, we'd fetch from Supabase
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'receive',
      amount: 1500,
      currency: 'USD',
      date: '2024-02-18T10:00:00Z',
      status: 'completed',
      counterparty: 'Client A'
    },
    {
      id: '2',
      type: 'send',
      amount: 500,
      currency: 'EUR',
      date: '2024-02-17T15:30:00Z',
      status: 'completed',
      counterparty: 'Supplier B'
    },
    {
      id: '3',
      type: 'receive',
      amount: 2000,
      currency: 'GBP',
      date: '2024-02-16T09:15:00Z',
      status: 'pending',
      counterparty: 'Client C'
    },
    {
      id: '4',
      type: 'send',
      amount: 750,
      currency: 'USD',
      date: '2024-02-15T14:45:00Z',
      status: 'completed',
      counterparty: 'Vendor D'
    },
    {
      id: '5',
      type: 'receive',
      amount: 1200,
      currency: 'EUR',
      date: '2024-02-14T11:20:00Z',
      status: 'failed',
      counterparty: 'Client E'
    }
  ].slice(0, limit);

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${
              transaction.type === 'receive' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              {transaction.type === 'receive' ? (
                <ArrowDownRight className="w-5 h-5 text-green-600" />
              ) : (
                <ArrowUpRight className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{transaction.counterparty}</p>
              <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-medium ${
              transaction.type === 'receive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'receive' ? '+' : '-'}
              {transaction.amount} {transaction.currency}
            </p>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
              {transaction.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransactionList;