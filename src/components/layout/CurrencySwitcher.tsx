"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrencyStore, Currency } from "@/store/useCurrencyStore";

interface CurrencySwitcherProps {
  isScrolled?: boolean;
}

export function CurrencySwitcher({ isScrolled = true }: CurrencySwitcherProps) {
  const { currency, setCurrency, symbols } = useCurrencyStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currencies: Currency[] = ['EUR', 'USD', 'TRY'];

  const switchCurrency = (newCurrency: Currency) => {
    setIsOpen(false);
    setCurrency(newCurrency);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors duration-300 uppercase tracking-widest px-2 py-1",
          isScrolled ? "text-[#2F4157] hover:text-[#2F4157]/80" : "text-[#E2DED3] hover:text-white"
        )}
      >
        <span>{symbols[currency]} {currency}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 py-2 w-24 bg-white shadow-lg border border-slate-200 rounded-xl z-20 flex flex-col">
          {currencies.map((c) => (
            <button
              key={c}
              onClick={() => switchCurrency(c)}
              className={`text-left px-4 py-2 text-sm uppercase tracking-widest transition-colors ${
                c === currency ? "text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {symbols[c]} {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
