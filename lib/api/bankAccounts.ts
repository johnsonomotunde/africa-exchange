import { supabase } from '../supabase';
import type { BankAccount } from '../../types/bank';

export const bankAccountsApi = {
  async list() {
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as BankAccount[];
  },

  async create(bankAccount: Omit<BankAccount, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('bank_accounts')
      .insert([bankAccount])
      .select()
      .single();

    if (error) throw error;
    return data as BankAccount;
  },

  async update(id: string, updates: Partial<BankAccount>) {
    const { data, error } = await supabase
      .from('bank_accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BankAccount;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('bank_accounts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async setPrimary(id: string) {
    const { error: resetError } = await supabase
      .from('bank_accounts')
      .update({ is_primary: false })
      .neq('id', id);

    if (resetError) throw resetError;

    const { data, error } = await supabase
      .from('bank_accounts')
      .update({ is_primary: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BankAccount;
  },

  async verify(id: string) {
    const { data, error } = await supabase
      .from('bank_accounts')
      .update({ is_verified: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BankAccount;
  }
};