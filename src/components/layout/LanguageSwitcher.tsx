"use client";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  isScrolled?: boolean;
}

export function LanguageSwitcher({ isScrolled = true }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const locales = ['en', 'ru', 'tr', 'de'];

  const switchLocale = (newLocale: string) => {
    setIsOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors duration-300 uppercase tracking-widest px-2 py-1",
          isScrolled ? "text-[#2F4157] hover:text-[#2F4157]/80" : "text-[#E2DED3] hover:text-white"
        )}
      >
        {locale}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 py-2 w-24 bg-white border border-slate-200 rounded-xl shadow-xl backdrop-blur-md z-20 flex flex-col">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={`text-left px-4 py-2 text-sm uppercase tracking-widest transition-colors ${
                  l === locale ? "text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
