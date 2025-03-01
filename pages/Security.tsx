import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, AlertTriangle, Activity, Lock, Eye, EyeOff, MapPin } from 'lucide-react';
import { twoFactorAuthApi } from '../lib/api/twoFactorAuth';
import TwoFactorSetup from '../components/TwoFactorSetup';
import ActivityMonitor from '../components/ActivityMonitor';
import FraudDetectionAlert from '../components/FraudDetectionAlert';
import IPTrackingHistory from '../components/IPTrackingHistory';
import FraudDetection from '../components/FraudDetection';
import toast from 'react-hot-toast';

// Mock data for fraud alerts
const mockAlerts = [
  {
    id: '1',
    type: 'new_device' as const,
    message: 'New device login detected from Lagos, Nigeria',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    severity: 'low' as const
  },
  {
    id: '2',
    type: 'unusual_activity' as const,
    message: 'Multiple failed login attempts detected',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    severity: 'medium' as const
  }
];

export default function Security() {
  const { user } = useAuth();
  const [twoFactorStatus, setTwoFactorStatus] = useState({ enabled: false, method: 'app' });
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    if (user) {
      loadTwoFactorStatus();
    }
  }, [user]);

  const loadTwoFactorStatus = async () => {
    try {
      const status = await twoFactorAuthApi.getStatus();
      setTwoFactorStatus(status);
    } catch (error) {
      console.error('Error loading 2FA status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    if (twoFactorStatus.enabled) {
      try {
        await twoFactorAuthApi.disable();
        setTwoFactorStatus({ ...twoFactorStatus, enabled: false });
        toast.success('Two-factor authentication disabled');
      } catch (error) {
        console.error('Error disabling 2FA:', error);
        toast.error('Failed to disable two-factor authentication');
      }
    } else {
      setShowTwoFactorSetup(true);
    }
  };

  const handleTwoFactorSetupComplete = () => {
    setShowTwoFactorSetup(false);
    setTwoFactorStatus({ ...twoFactorStatus, enabled: true });
    loadTwoFactorStatus();
  };

  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.success('Alert dismissed');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.new !== password.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (password.new.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    // In a real app, this would call the Supabase auth API
    toast.success('Password changed successfully');
    setPassword({ current: '', new: '', confirm: '' });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Account Security
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to manage your security settings
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
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-600">Manage your account security and monitor activity</p>
      </header>

      {/* Fraud Detection Status */}
      {user && <FraudDetection userId={user.id} />}

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-gray-900">Security Alerts</h2>
          </div>
          
          {alerts.map(alert => (
            <FraudDetectionAlert 
              key={alert.id} 
              alert={alert} 
              onDismiss={handleDismissAlert} 
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            Add an extra layer of security to your account by requiring a verification code in addition to your password.
          </p>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
            <div>
              <p className="font-medium text-gray-900">Status</p>
              <p className="text-sm text-gray-600">
                {loading ? 'Loading...' : twoFactorStatus.enabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <button
              onClick={handleToggleTwoFactor}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                twoFactorStatus.enabled
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {twoFactorStatus.enabled ? 'Disable' : 'Enable'}
            </button>
          </div>
          
          {twoFactorStatus.enabled && (
            <div className="text-sm text-gray-600">
              <p>
                You're using an authenticator app for two-factor authentication.
              </p>
              <button className="text-blue-600 hover:text-blue-800 mt-2">
                Generate new backup codes
              </button>
            </div>
          )}
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          </div>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password.current}
                  onChange={(e) => setPassword({...password, current: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password.new}
                onChange={(e) => setPassword({...password, new: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={password.confirm}
                onChange={(e) => setPassword({...password, confirm: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* IP Tracking History */}
      <IPTrackingHistory />

      {/* Activity Monitor */}
      <ActivityMonitor />

      {/* Two-Factor Setup Modal */}
      {showTwoFactorSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <TwoFactorSetup
            onComplete={handleTwoFactorSetupComplete}
            onCancel={() => setShowTwoFactorSetup(false)}
          />
        </div>
      )}
    </div>
  );
}