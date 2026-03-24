"use client";

import { useEffect, useState } from "react";
import { Currency, useCurrencyStore } from "@/store/useCurrencyStore";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { setRates, setCurrency } = useCurrencyStore();

  useEffect(() => {
    // 1. Initial Logic & Cache
    const savedCurrency = localStorage.getItem('selected_currency') as Currency | null;
    if (savedCurrency && ['EUR', 'USD', 'TRY'].includes(savedCurrency)) {
      setCurrency(savedCurrency);
    } else {
      // Auto-detect based on browser language for first visit
      const browserLang = navigator.language || navigator.languages?.[0] || 'en';
      if (browserLang.toLowerCase().startsWith('tr')) {
        setCurrency('TRY');
      } else {
        setCurrency('EUR');
      }
    }

    // 2. Fetch live rates
    const fetchRates = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_URL || 'https://v6.exchangerate-api.com/v6/60ad81c7424f6f83932dc47c/latest/EUR';
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          if (data && data.conversion_rates) {
            setRates({
              EUR: data.conversion_rates.EUR || 1,
              USD: data.conversion_rates.USD || 1.08,
              TRY: data.conversion_rates.TRY || 35.0,
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch currency rates:', error);
      }
    };

    fetchRates();
  }, [setRates, setCurrency]);

  return <>{children}</>;
}
