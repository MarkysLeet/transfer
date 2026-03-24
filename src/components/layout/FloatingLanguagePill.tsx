"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrencyStore, Currency } from "@/store/useCurrencyStore";
import { motion, AnimatePresence } from "framer-motion";

// Simple flag components instead of images to keep it light
const FlagEN = () => (
  <svg viewBox="0 0 60 30" width="24" height="16" className="rounded-sm shadow-sm object-cover">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v-15 h-30 z h-30 v-15 z v15 h30 z"/>
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

const FlagRU = () => (
  <svg viewBox="0 0 9 6" width="24" height="16" className="rounded-sm shadow-sm object-cover">
    <rect fill="#fff" width="9" height="3"/>
    <rect fill="#d52b1e" y="3" width="9" height="3"/>
    <rect fill="#0039a6" y="2" width="9" height="2"/>
  </svg>
);

const FlagTR = () => (
  <svg viewBox="0 0 1200 800" width="24" height="16" className="rounded-sm shadow-sm object-cover">
    <rect width="1200" height="800" fill="#E30A17"/>
    <circle cx="425" cy="400" r="200" fill="#fff"/>
    <circle cx="475" cy="400" r="160" fill="#E30A17"/>
    <polygon points="766.6,400 621.1,447.2 666.2,308.2 666.2,491.8 621.1,352.8" fill="#fff"/>
  </svg>
);

const FlagDE = () => (
  <svg viewBox="0 0 5 3" width="24" height="16" className="rounded-sm shadow-sm object-cover">
    <rect y="0" width="5" height="3" fill="#000"/>
    <rect y="1" width="5" height="2" fill="#D00"/>
    <rect y="2" width="5" height="1" fill="#FFCE00"/>
  </svg>
);

const flags: Record<string, React.ReactNode> = {
  en: <FlagEN />,
  ru: <FlagRU />,
  tr: <FlagTR />,
  de: <FlagDE />
};

export function FloatingLanguagePill() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currency, setCurrency, symbols } = useCurrencyStore();
  const currencies: Currency[] = ['EUR', 'USD', 'TRY'];

  const locales = ['ru', 'en', 'tr', 'de'];

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

  const switchLocale = (newLocale: string) => {
    setIsOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="md:hidden fixed top-6 right-6 z-[100]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 bg-white/70 backdrop-blur-md border border-white/40 shadow-sm rounded-full transition-all active:scale-95"
      >
        <div className="flex items-center gap-1">
          {flags[locale] || <FlagEN />}
          <span className="text-xs font-medium text-slate-700 ml-1">{symbols[currency]}</span>
        </div>
        <ChevronDown size={14} className={`text-slate-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 p-3 bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl flex flex-col gap-4 min-w-[140px] z-[110]"
          >
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Language</div>
              <div className="grid grid-cols-2 gap-1">
                {locales.map((l) => (
                  <button
                    key={l}
                    onClick={() => switchLocale(l)}
                    className={`flex justify-center items-center p-2 rounded-xl transition-colors ${
                      l === locale ? "bg-slate-100 shadow-inner" : "hover:bg-slate-50 active:bg-slate-200"
                    }`}
                  >
                    {flags[l]}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Currency</div>
              <div className="flex flex-col gap-1">
                {currencies.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrency(c);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors text-xs font-medium ${
                      c === currency ? "bg-slate-100 text-slate-900 shadow-inner" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-200"
                    }`}
                  >
                    <span>{c}</span>
                    <span className="text-slate-400">{symbols[c]}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
