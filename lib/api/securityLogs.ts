import { supabase } from '../supabase';

export interface SecurityLogEvent {
  event_type: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export const securityLogsApi = {
  async logEvent(event: SecurityLogEvent) {
    try {
      // Try to get client info, but don't fail if it doesn't work
      let clientInfo = null;
      try {
        const { data } = await supabase.functions.invoke('get-client-info');
        clientInfo = data;
      } catch (error) {
        console.warn('Could not get client info:', error);
      }
      
      const { data, error } = await supabase
        .from('security_logs')
        .insert([{
          event_type: event.event_type,
          details: event.details || {},
          ip_address: event.ip_address || clientInfo?.ip || '127.0.0.1',
          user_agent: event.user_agent || navigator.userAgent
        }]);

      if (error) {
        console.error('Error logging security event:', error);
      }
      
      return data;
    } catch (error) {
      console.error('Error in logEvent:', error);
      // Don't throw the error - security logging should not break the app
      return null;
    }
  },

  async getRecentLogs(limit = 20) {
    try {
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching security logs:', error);
      return [];
    }
  }
};