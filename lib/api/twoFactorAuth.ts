import { supabase } from '../supabase';
import { securityLogsApi } from './securityLogs';

export const twoFactorAuthApi = {
  async getStatus() {
    try {
      const { data, error } = await supabase
        .from('two_factor_auth')
        .select('*')
        .single();

      if (error) {
        // If the error is "no rows returned", return a default status
        if (error.code === 'PGRST116') {
          return { enabled: false, method: 'app' };
        }
        throw error;
      }
      
      return data || { enabled: false, method: 'app' };
    } catch (error) {
      console.error('Error fetching 2FA status:', error);
      return { enabled: false, method: 'app' };
    }
  },

  async enable(method: 'app' | 'sms' = 'app') {
    // First check if 2FA already exists
    const { data: existing } = await supabase
      .from('two_factor_auth')
      .select('id')
      .single();

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('two_factor_auth')
        .update({
          enabled: true,
          method,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      
      await securityLogsApi.logEvent({
        event_type: '2fa_enabled',
        details: { method }
      });
      
      return data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('two_factor_auth')
        .insert([{
          enabled: true,
          method,
          backup_codes: generateBackupCodes()
        }])
        .select()
        .single();

      if (error) throw error;
      
      await securityLogsApi.logEvent({
        event_type: '2fa_enabled',
        details: { method }
      });
      
      return data;
    }
  },

  async disable() {
    const { data, error } = await supabase
      .from('two_factor_auth')
      .update({
        enabled: false,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    
    await securityLogsApi.logEvent({
      event_type: '2fa_disabled'
    });
    
    return data;
  },

  async generateNewBackupCodes() {
    const backupCodes = generateBackupCodes();
    
    const { data, error } = await supabase
      .from('two_factor_auth')
      .update({
        backup_codes: backupCodes,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    
    await securityLogsApi.logEvent({
      event_type: '2fa_backup_codes_regenerated'
    });
    
    return backupCodes;
  },

  async verifyCode(code: string) {
    // In a real implementation, this would verify against TOTP algorithm
    // For demo purposes, we'll just log the attempt
    await securityLogsApi.logEvent({
      event_type: '2fa_verification_attempt',
      details: { success: true }
    });
    
    return { success: true };
  }
};

// Helper function to generate backup codes
function generateBackupCodes(count = 10): string[] {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    codes.push(code);
  }
  return codes;
}