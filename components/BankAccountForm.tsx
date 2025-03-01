import React, { useState } from 'react';
import { Globe, AlertCircle } from 'lucide-react';
import { SUPPORTED_BANKS, CURRENCIES, type BankDetails } from '../types/bank';

interface BankAccountFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function BankAccountForm({ onSubmit, onCancel }: BankAccountFormProps) {
  const [region, setRegion] = useState('');
  const [selectedBank, setSelectedBank] = useState<BankDetails | null>(null);
  const [formData, setFormData] = useState({
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
    swiftCode: '',
    iban: '',
    currency: '',
    accountType: 'checking'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank) return;

    try {
      await onSubmit({
        bank_name: selectedBank.name,
        bank_country: region,
        bank_currency: formData.currency,
        account_holder_name: formData.accountHolderName,
        account_number: formData.accountNumber,
        routing_number: formData.routingNumber,
        swift_code: formData.swiftCode,
        iban: formData.iban,
        account_type: formData.accountType,
        is_primary: false,
        is_verified: false
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Add Bank Account</h2>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Region Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Region
          </label>
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setSelectedBank(null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Choose a region</option>
            {Object.keys(SUPPORTED_BANKS).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>

        {region && (
          <>
            {/* Bank Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Bank
              </label>
              <select
                value={selectedBank?.name || ''}
                onChange={(e) => {
                  const bank = SUPPORTED_BANKS[region].find(b => b.name === e.target.value);
                  setSelectedBank(bank || null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a bank</option>
                {SUPPORTED_BANKS[region].map((bank) => (
                  <option key={bank.name} value={bank.name}>{bank.name}</option>
                ))}
              </select>
            </div>

            {selectedBank && (
              <>
                {/* Account Holder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountHolderName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account holder name"
                    required
                  />
                </div>

                {/* Currency Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select currency</option>
                    {selectedBank.currencies.map((code) => {
                      const currency = CURRENCIES.find(c => c.code === code);
                      return currency ? (
                        <option key={code} value={code}>
                          {currency.symbol} {currency.name} ({code})
                        </option>
                      ) : null;
                    })}
                  </select>
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                    <option value="current">Current Account</option>
                  </select>
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account number"
                    required
                  />
                </div>

                {/* Region-specific fields */}
                {region === 'US' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Routing Number (ABA)
                    </label>
                    <input
                      type="text"
                      value={formData.routingNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, routingNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter 9-digit routing number"
                      pattern="[0-9]{9}"
                      required
                    />
                  </div>
                )}

                {(region === 'UK' || region === 'EU') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SWIFT/BIC Code
                      </label>
                      <input
                        type="text"
                        value={formData.swiftCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, swiftCode: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter SWIFT/BIC code"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        IBAN
                      </label>
                      <input
                        type="text"
                        value={formData.iban}
                        onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter IBAN"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Verification Notice */}
                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Verification Required</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your bank account will need to be verified before you can receive payments.
                      This typically takes 2-3 business days.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Bank Account
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </form>
    </div>
  );
}