import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Monitor, AlertTriangle } from 'lucide-react';
import { securityLogsApi } from '../lib/api/securityLogs';
import { format } from 'date-fns';

interface SecurityLog {
  id: string;
  event_type: string;
  ip_address: string;
  user_agent: string;
  details: any;
  created_at: string;
}

export default function ActivityMonitor() {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await securityLogsApi.getRecentLogs();
      setLogs(data);
    } catch (error) {
      console.error('Error loading security logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    if (eventType.includes('login')) {
      return <Monitor className="w-5 h-5 text-blue-600" />;
    } else if (eventType.includes('2fa')) {
      return <Clock className="w-5 h-5 text-green-600" />;
    } else if (eventType.includes('bank')) {
      return <MapPin className="w-5 h-5 text-purple-600" />;
    } else {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const formatEventType = (eventType: string) => {
    return eventType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      
      {logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No recent activity to display
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-white rounded-full shadow-sm">
                {getEventIcon(log.event_type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">
                    {formatEventType(log.event_type)}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatDate(log.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {log.ip_address && (
                    <span className="inline-flex items-center gap-1 mr-3">
                      <MapPin className="w-3 h-3" /> {log.ip_address}
                    </span>
                  )}
                  {log.user_agent && (
                    <span className="text-xs text-gray-500 truncate block">
                      {log.user_agent.split(' ')[0]}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}