import React from 'react';
import { AlertTriangle, Shield, X } from 'lucide-react';

interface FraudDetectionAlertProps {
  alert: {
    id: string;
    type: 'suspicious_login' | 'unusual_activity' | 'new_device' | 'large_transaction';
    message: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high';
  };
  onDismiss: (id: string) => void;
}

export default function FraudDetectionAlert({ alert, onDismiss }: FraudDetectionAlertProps) {
  const getSeverityColor = () => {
    switch (alert.severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (alert.severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'low':
        return <Shield className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getSeverityColor()} mb-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">
            {alert.type === 'suspicious_login' && 'Suspicious Login Detected'}
            {alert.type === 'unusual_activity' && 'Unusual Account Activity'}
            {alert.type === 'new_device' && 'New Device Login'}
            {alert.type === 'large_transaction' && 'Large Transaction Alert'}
          </h3>
          <p className="text-sm mt-1">{alert.message}</p>
          <div className="mt-2 text-xs">
            {new Date(alert.timestamp).toLocaleString()}
          </div>
        </div>
        <button 
          onClick={() => onDismiss(alert.id)}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}