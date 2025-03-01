import { supabase } from '../supabase';
import type { BankAccount } from '../../types/bank';

export const bankVerificationApi = {
  async initiateMicroDeposits(bankAccountId: string) {
    const { data, error } = await supabase
      .from('bank_verifications')
      .insert([{
        bank_account_id: bankAccountId,
        verification_type: 'micro_deposit',
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async verifyMicroDeposits(verificationId: string, amount1: number, amount2: number) {
    const { data: verification, error: fetchError } = await supabase
      .from('bank_verifications')
      .select('*')
      .eq('id', verificationId)
      .single();

    if (fetchError) throw fetchError;

    // Record the attempt
    const { error: attemptError } = await supabase
      .from('verification_attempts')
      .insert([{
        verification_id: verificationId,
        attempt_number: verification.attempts + 1,
        amounts_entered: [amount1, amount2],
      }]);

    if (attemptError) throw attemptError;

    // Check if amounts match
    const success = amount1 === verification.amount_1 && amount2 === verification.amount_2;

    // Update verification status
    const { data, error: updateError } = await supabase
      .from('bank_verifications')
      .update({
        status: success ? 'verified' : 'failed',
        attempts: verification.attempts + 1,
      })
      .eq('id', verificationId)
      .select()
      .single();

    if (updateError) throw updateError;

    // If verified, update bank account status
    if (success) {
      const { error: accountError } = await supabase
        .from('bank_accounts')
        .update({ is_verified: true })
        .eq('id', verification.bank_account_id);

      if (accountError) throw accountError;
    }

    return { success, data };
  },

  async getVerificationStatus(bankAccountId: string) {
    const { data, error } = await supabase
      .from('bank_verifications')
      .select('*')
      .eq('bank_account_id', bankAccountId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  },

  async processWebhook(event: any) {
    const { data, error } = await supabase
      .from('bank_webhooks')
      .insert([{
        event_type: event.type,
        payload: event,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};