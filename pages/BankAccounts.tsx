import React, { useState } from 'react';
import { Plus, Globe, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBankAccounts } from '../hooks/useBankAccounts';
import BankAccountCard from '../components/BankAccountCard';
import BankAccountForm from '../components/BankAccountForm';

export default function BankAccounts() {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const {
    accounts,
    loading,
    addAccount,
    deleteAccount,
    setPrimaryAccount
  } = useBankAccounts();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Manage Your Bank Accounts
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to add and manage your bank accounts
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

  const handleAddAccount = async (data: any) => {
    await addAccount({
      user_id: user.id,
      ...data
    });
    setShowAddForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bank Accounts</h1>
          <p className="text-gray-600">Manage your linked bank accounts for withdrawals</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Bank Account
        </button>
      </header>

      {/* Bank Accounts Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your bank accounts...</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Bank Accounts Yet</h3>
          <p className="text-gray-600 mb-6">
            Add your first bank account to start receiving payments
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Bank Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map((account) => (
            <BankAccountCard
              key={account.id}
              account={account}
              onSetPrimary={setPrimaryAccount}
              onDelete={deleteAccount}
            />
          ))}
        </div>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">International Transfers</h3>
              <p className="text-sm text-gray-600">
                Receive payments from clients worldwide directly to your local bank account.
                Support for USD, EUR, GBP, and more.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Banking</h3>
              <p className="text-sm text-gray-600">
                Your banking information is encrypted and protected. We use
                industry-standard security measures to keep your data safe.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Bank Account Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <BankAccountForm
            onSubmit={handleAddAccount}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}
    </div>
  );
}