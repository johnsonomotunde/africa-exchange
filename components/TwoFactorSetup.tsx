import React, { useState, useEffect } from 'react';
import { Shield, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { twoFactorAuthApi } from '../lib/api/twoFactorAuth';
import toast from 'react-hot-toast';

interface TwoFactorSetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'intro' | 'setup' | 'verify' | 'backup'>('intro');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (step === 'setup') {
      generateSecret();
    } else if (step === 'backup') {
      generateBackupCodes();
    }
  }, [step]);

  const generateSecret = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would generate a TOTP secret
      // and create a QR code for scanning with authenticator apps
      const mockSecret = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      setSecret(mockSecret);
      
      // Mock QR code URL - in production this would be a real QR code
      setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/AfriExchange:user@example.com?secret=' + mockSecret);
    } catch (error) {
      console.error('Error generating 2FA secret:', error);
      toast.error('Failed to generate 2FA setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateBackupCodes = async () => {
    setLoading(true);
    try {
      const codes = await twoFactorAuthApi.generateNewBackupCodes();
      setBackupCodes(codes);
    } catch (error) {
      console.error('Error generating backup codes:', error);
      toast.error('Failed to generate backup codes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      const { success } = await twoFactorAuthApi.verifyCode(verificationCode);
      
      if (success) {
        await twoFactorAuthApi.enable();
        setStep('backup');
      } else {
        toast.error('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopied(true);
    toast.success('Backup codes copied to clipboard');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleComplete = () => {
    toast.success('Two-factor authentication enabled successfully!');
    onComplete();
  };

  return (
    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {step === 'intro' && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Enhanced Security</h4>
              <p className="text-sm text-blue-700 mt-1">
                Two-factor authentication adds an extra layer of security to your account.
                Each time you sign in or make sensitive changes, you'll need to provide a verification code.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">1</div>
              <p className="text-gray-700">Set up an authenticator app on your phone</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">2</div>
              <p className="text-gray-700">Scan the QR code or enter the secret key</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">3</div>
              <p className="text-gray-700">Enter the verification code to confirm setup</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setStep('setup')}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 'setup' && (
        <div className="space-y-6">
          <p className="text-gray-700">
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </p>

          <div className="flex justify-center">
            {loading ? (
              <div className="w-48 h-48 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <img src={qrCode} alt="QR Code" className="w-48 h-48 border rounded-lg" />
            )}
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Or enter this code manually:</p>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg font-mono text-sm">
              {secret}
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(secret);
                  toast.success('Secret copied to clipboard');
                }}
                className="ml-auto text-blue-600 hover:text-blue-800"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter 6-digit code"
              maxLength={6}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep('intro')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Back
            </button>
            <button
              onClick={handleVerify}
              disabled={loading || verificationCode.length !== 6}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </div>
      )}

      {step === 'backup' && (
        <div className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-900">Save Your Backup Codes</h4>
              <p className="text-sm text-yellow-700 mt-1">
                If you lose access to your authenticator app, you can use these backup codes to sign in.
                Each code can only be used once. Store them securely.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              {loading ? (
                <div className="col-span-2 flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                backupCodes.map((code, index) => (
                  <div key={index} className="font-mono text-sm p-2 bg-white border border-gray-200 rounded">
                    {code}
                  </div>
                ))
              )}
            </div>
            <button
              onClick={handleCopyBackupCodes}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              disabled={loading}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy All Codes
                </>
              )}
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleComplete}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              Complete Setup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}