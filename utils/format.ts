export function formatCurrency(amount: number, currency?: string): string {
  if (!currency) {
    return amount.toLocaleString('en-US');
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}