import React from 'react';
import { MoreVertical } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  avatar: string;
}

interface TopCustomersProps {
  customers: Customer[];
}

function TopCustomers({ customers }: TopCustomersProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Top Customers</h2>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        {customers.map((customer) => (
          <div key={customer.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.email}</p>
              </div>
            </div>
            <p className="font-medium text-gray-900">
              {formatCurrency(customer.totalSpent)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopCustomers;