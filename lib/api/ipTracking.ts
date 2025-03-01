import { supabase } from '../supabase';
import { securityLogsApi } from './securityLogs';

export const ipTrackingApi = {
  async trackLogin() {
    try {
      const { data: clientInfo } = await supabase.functions.invoke('get-client-info');
      
      if (clientInfo) {
        await securityLogsApi.logEvent({
          event_type: 'login_ip_tracked',
          details: {
            ip: clientInfo.ip,
            location: clientInfo.location,
            isp: clientInfo.isp
          }
        });
      }
    } catch (error) {
      console.error('Error tracking IP:', error);
    }
  },

  async trackBankAccountChange(bankAccountId: string) {
    try {
      const { data: clientInfo } = await supabase.functions.invoke('get-client-info');
      
      if (clientInfo) {
        await securityLogsApi.logEvent({
          event_type: 'bank_account_change',
          details: {
            bank_account_id: bankAccountId,
            ip: clientInfo.ip,
            location: clientInfo.location
          }
        });
      }
    } catch (error) {
      console.error('Error tracking bank account change:', error);
    }
  },

  async getRecentIpHistory() {
    try {
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .or('event_type.eq.login_ip_tracked,event_type.eq.bank_account_change')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching IP history:', error);
      throw error;
    }
  }
};