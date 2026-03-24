import { create } from 'zustand';

export type Currency = 'EUR' | 'USD' | 'TRY';

interface CurrencyRates {
  [key: string]: number;
}

interface CurrencyStore {
  currency: Currency;
  rates: CurrencyRates;
  symbols: Record<Currency, string>;
  setCurrency: (c: Currency) => void;
  setRates: (rates: CurrencyRates) => void;
  formatPrice: (priceInEur: number) => string;
}

const symbols: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  TRY: '₺',
};

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  currency: 'EUR',
  rates: { EUR: 1, USD: 1.08, TRY: 35.0 }, // Fallback rates
  symbols,
  setCurrency: (c) => {
    localStorage.setItem('selected_currency', c);
    set({ currency: c });
  },
  setRates: (rates) => set({ rates }),
  formatPrice: (priceInEur: number) => {
    const { currency, rates, symbols } = get();
    const rate = rates[currency] || 1;
    const converted = Math.round(priceInEur * rate);
    return `${symbols[currency]}${converted}`;
  },
}));
