import { useState, useEffect } from 'react';
import { bankAccountsApi } from '../lib/api/bankAccounts';
import type { BankAccount } from '../types/bank';
import toast from 'react-hot-toast';

export function useBankAccounts() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    try {
      const data = await bankAccountsApi.list();
      setAccounts(data);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
      toast.error('Failed to load bank accounts');
    } finally {
      setLoading(false);
    }
  }

  async function addAccount(account: Omit<BankAccount, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const newAccount = await bankAccountsApi.create(account);
      setAccounts(prev => [...prev, newAccount]);
      toast.success('Bank account added successfully');
      return newAccount;
    } catch (error) {
      console.error('Error adding bank account:', error);
      toast.error('Failed to add bank account');
      throw error;
    }
  }

  async function updateAccount(id: string, updates: Partial<BankAccount>) {
    try {
      const updated = await bankAccountsApi.update(id, updates);
      setAccounts(prev => prev.map(acc => acc.id === id ? updated : acc));
      toast.success('Bank account updated successfully');
      return updated;
    } catch (error) {
      console.error('Error updating bank account:', error);
      toast.error('Failed to update bank account');
      throw error;
    }
  }

  async function deleteAccount(id: string) {
    try {
      await bankAccountsApi.delete(id);
      setAccounts(prev => prev.filter(acc => acc.id !== id));
      toast.success('Bank account removed successfully');
    } catch (error) {
      console.error('Error deleting bank account:', error);
      toast.error('Failed to remove bank account');
      throw error;
    }
  }

  async function setPrimaryAccount(id: string) {
    try {
      const updated = await bankAccountsApi.setPrimary(id);
      setAccounts(prev => prev.map(acc => ({
        ...acc,
        is_primary: acc.id === id
      })));
      toast.success('Primary account updated successfully');
      return updated;
    } catch (error) {
      console.error('Error setting primary account:', error);
      toast.error('Failed to update primary account');
      throw error;
    }
  }

  async function verifyAccount(id: string) {
    try {
      const updated = await bankAccountsApi.verify(id);
      setAccounts(prev => prev.map(acc => acc.id === id ? updated : acc));
      toast.success('Bank account verified successfully');
      return updated;
    } catch (error) {
      console.error('Error verifying bank account:', error);
      toast.error('Failed to verify bank account');
      throw error;
    }
  }

  return {
    accounts,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
    setPrimaryAccount,
    verifyAccount,
    refresh: loadAccounts
  };
}