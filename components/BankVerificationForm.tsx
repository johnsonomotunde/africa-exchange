import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { bankVerificationApi } from '../lib/api/bankVerification';
import toast from 'react-hot-toast';

interface BankVerificationFormProps {
  bankAccountId: string;
  onVerified: () => void;
  onCancel: () => void;
}

export default function BankVerificationForm({ bankAccountId, onVerified, onCancel }: BankVerificationFormProps) {
  const [step, setStep] = useState<'init' | 'verify'>('init');
  const [verificationId, setVerificationId] = useState<string>('');
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInitiate = async () => {
    setLoading(true);
    try {
      const verification = await bankVerificationApi.initiateMicroDeposits(bankAccountId);
      setVerificationId(verification.id);
      setStep('verify');
      toast.success('Micro-deposits initiated! Check your bank account in 1-3 business days.');
    } catch (error) {
      console.error('Error initiating verification:', error);
      toast.error('Failed to initiate verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { success } = await bankVerificationApi.verifyMicroDeposits(
        verificationId,
        parseFloat(amount1),
        parseFloat(amount2)
      );

      if (success) {
        toast.success('Bank account verified successfully!');
        onVerified();
      } else {
        toast.error('Incorrect amounts. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying amounts:', error);
      toast.error('Failed to verify amounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Verify Bank Account</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {step === 'init' ? (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Verification Process</h4>
              <p className="text-sm text-blue-700 mt-1">
                We'll make two small deposits to your bank account within 1-3 business days.
                You'll need to verify these amounts to confirm your account ownership.
              </p>
            </div>
          </div>

          <button
            onClick={handleInitiate}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Initiating...' : 'Start Verification'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-900">Enter Deposit Amounts</h4>
              <p className="text-sm text-green-700 mt-1">
                Enter the exact amounts of the two deposits we made to your account.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Deposit Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={amount1}
                onChange={(e) => setAmount1(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Second Deposit Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={amount2}
                onChange={(e) => setAmount2(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}