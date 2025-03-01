export interface BankAccount {
  id: string;
  user_id: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  routing_number?: string;
  swift_code?: string;
  iban?: string;
  bank_country: string;
  bank_currency: string;
  account_type: 'checking' | 'savings' | 'current';
  is_primary: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface BankDetails {
  name: string;
  code: string;
  swift: string;
  countries: string[];
  currencies: string[];
}

export const SUPPORTED_BANKS: Record<string, BankDetails[]> = {
  US: [
    {
      name: 'Chase',
      code: 'CHASUS33',
      swift: 'CHASUS33',
      countries: ['US'],
      currencies: ['USD']
    },
    {
      name: 'Bank of America',
      code: 'BOFAUS3N',
      swift: 'BOFAUS3N',
      countries: ['US'],
      currencies: ['USD']
    },
    {
      name: 'Wells Fargo',
      code: 'WFBIUS6S',
      swift: 'WFBIUS6S',
      countries: ['US'],
      currencies: ['USD']
    },
    {
      name: 'Citibank',
      code: 'CITIUS33',
      swift: 'CITIUS33',
      countries: ['US'],
      currencies: ['USD']
    }
  ],
  UK: [
    {
      name: 'Barclays',
      code: 'BARCGB22',
      swift: 'BARCGB22',
      countries: ['UK'],
      currencies: ['GBP', 'EUR']
    },
    {
      name: 'HSBC',
      code: 'HBUKGB4B',
      swift: 'HBUKGB4B',
      countries: ['UK'],
      currencies: ['GBP', 'EUR']
    },
    {
      name: 'Lloyds',
      code: 'LOYDGB21',
      swift: 'LOYDGB21',
      countries: ['UK'],
      currencies: ['GBP', 'EUR']
    }
  ],
  EU: [
    {
      name: 'Deutsche Bank',
      code: 'DEUTDEFF',
      swift: 'DEUTDEFF',
      countries: ['DE', 'EU'],
      currencies: ['EUR']
    },
    {
      name: 'BNP Paribas',
      code: 'BNPAFRPP',
      swift: 'BNPAFRPP',
      countries: ['FR', 'EU'],
      currencies: ['EUR']
    },
    {
      name: 'Santander',
      code: 'BSCHESM',
      swift: 'BSCHESM',
      countries: ['ES', 'EU'],
      currencies: ['EUR']
    }
  ]
};

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' }
] as const;