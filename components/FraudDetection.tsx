import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Check } from 'lucide-react';

interface FraudDetectionProps {
  userId: string;
}

// This would be connected to a real fraud detection system in production
export default function FraudDetection({ userId }: FraudDetectionProps) {
  const [status, setStatus] = useState<'loading' | 'safe' | 'warning' | 'danger'>('loading');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    // Simulate fraud detection check
    const checkFraudStatus = async () => {
      try {
        // In a real app, this would call a Supabase function or API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, randomly select a status
        const statuses = ['safe', 'warning', 'safe', 'safe'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)] as 'safe' | 'warning' | 'danger';
        
        setStatus(randomStatus);
        
        if (randomStatus === 'warning') {
          setDetails('Unusual login pattern detected. We recommend enabling two-factor authentication.');
        } else if (randomStatus === 'danger') {
          setDetails('Multiple failed login attempts detected from unusual locations.');
        } else {
          setDetails('No suspicious activity detected on your account.');
        }
      } catch (error) {
        console.error('Error checking fraud status:', error);
        setStatus('safe');
        setDetails('Unable to check fraud status. Default protection is active.');
      }
    };
    
    checkFraudStatus();
  }, [userId]);

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'bg-gray-50 border-gray-200';
      case 'safe':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'danger':
        return 'bg-red-50 border-red-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>;
      case 'safe':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'loading':
        return 'Checking account security...';
      case 'safe':
        return 'Your account is secure';
      case 'warning':
        return 'Security recommendation';
      case 'danger':
        return 'Security alert';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getStatusIcon()}
        </div>
        <div>
          <h3 className="font-medium">{getStatusTitle()}</h3>
          <p className="text-sm mt-1">{details}</p>
          
          {status === 'warning' && (
            <button className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <Shield className="w-4 h-4 mr-1" />
              Enable 2FA
            </button>
          )}
          
          {status === 'danger' && (
            <button className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
              <Shield className="w-4 h-4 mr-1" />
              Secure Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}