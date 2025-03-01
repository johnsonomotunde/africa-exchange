import React, { useState } from 'react';
import { Ban as Bank, Check, Star, StarOff, Trash2, ShieldCheck } from 'lucide-react';
import type { BankAccount } from '../types/bank';
import BankVerificationForm from './BankVerificationForm';

interface BankAccountCardProps {
  account: BankAccount;
  onSetPrimary: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function BankAccountCard({ account, onSetPrimary, onDelete }: BankAccountCardProps) {
  const [showVerification, setShowVerification] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Bank className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{account.bank_name}</h3>
              <p className="text-sm text-gray-500">{account.account_type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {account.is_verified ? (
              <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                <Check className="w-4 h-4" />
                Verified
              </span>
            ) : (
              <button
                onClick={() => setShowVerification(true)}
                className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100"
              >
                <ShieldCheck className="w-4 h-4" />
                Verify Now
              </button>
            )}
            <span className={`px-2 py-1 rounded-full text-sm ${
              account.is_primary
                ? 'bg-blue-50 text-blue-700'
                : 'bg-gray-50 text-gray-600'
            }`}>
              {account.is_primary ? 'Primary' : 'Secondary'}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Account Holder</span>
            <span className="font-medium text-gray-900">{account.account_holder_name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Account Number</span>
            <span className="font-medium text-gray-900">
              ••••{account.account_number.slice(-4)}
            </span>
          </div>
          {account.routing_number && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Routing Number</span>
              <span className="font-medium text-gray-900">{account.routing_number}</span>
            </div>
          )}
          {account.swift_code && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">SWIFT/BIC</span>
              <span className="font-medium text-gray-900">{account.swift_code}</span>
            </div>
          )}
          {account.iban && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">IBAN</span>
              <span className="font-medium text-gray-900">{account.iban}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Currency</span>
            <span className="font-medium text-gray-900">{account.bank_currency}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          {!account.is_primary && (
            <button
              onClick={() => onSetPrimary(account.id)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Star className="w-4 h-4" />
              Set as Primary
            </button>
          )}
          {account.is_primary && (
            <button
              disabled
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
            >
              <StarOff className="w-4 h-4" />
              Primary Account
            </button>
          )}
          <button
            onClick={() => onDelete(account.id)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <BankVerificationForm
            bankAccountId={account.id}
            onVerified={() => setShowVerification(false)}
            onCancel={() => setShowVerification(false)}
          />
        </div>
      )}
    </>
  );
}