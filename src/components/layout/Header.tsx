"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // Basic navigation replacement: remove current locale from path, add new locale
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath || `/${newLocale}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled ? "bg-slate-900/80 backdrop-blur-md border-white/10 py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-xl md:text-2xl tracking-wider text-white font-serif flex items-center gap-2">
          <span className="font-bold">BLACK</span> <span className="text-gold-400">DIAMOND</span>
        </Link>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm font-medium text-slate-200 hover:text-gold-400 transition-colors uppercase">
                {locale} <ChevronDown size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-slate-200 min-w-[80px]">
              {["en", "ru", "tr", "de"].map((l) => (
                <DropdownMenuItem
                  key={l}
                  onClick={() => handleLanguageChange(l)}
                  className={cn(
                    "cursor-pointer uppercase justify-center hover:bg-white/5 hover:text-gold-400",
                    locale === l && "text-gold-400 font-bold bg-white/5"
                  )}
                >
                  {l}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="primary" size="sm" className="hidden md:flex gap-2 group bg-gold-500 hover:bg-gold-600 text-slate-900" onClick={() => window.open('https://wa.me/905550000000', '_blank')}>
            <Phone size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-slate-900">Contact Us</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
