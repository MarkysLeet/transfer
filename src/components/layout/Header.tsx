"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Phone, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Оснащение", href: "#features" },
  { label: "Маршруты", href: "#destinations" },
  { label: "Black Diamond Club", href: "#loyalty" },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    closeMenu();
  };

  const locales = ['en', 'ru', 'tr', 'de'];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          scrolled ? "bg-slate-900/80 backdrop-blur-md border-white/10 py-4" : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold tracking-wider text-white font-serif z-50 relative">
            TURKEY VIP <span className="text-gold-400">TRANSFER</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <LanguageSwitcher />
            <Button variant="primary" size="sm" className="flex gap-2" onClick={() => window.open('https://wa.me/905550000000', '_blank')}>
              <Phone size={18} />
              <span>Связаться</span>
            </Button>
          </div>
          <button
            onClick={toggleMenu}
            className="md:hidden text-white z-50 relative p-2 focus:outline-none focus:ring-2 focus:ring-gold-400 rounded-md"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-center items-center overflow-hidden"
          >
             <nav className="flex flex-col items-center gap-8 mb-16">
              {links.map((link, idx) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx + 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="text-3xl font-serif text-white hover:text-gold-400 transition-colors tracking-wide"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="absolute bottom-24 w-full flex justify-center gap-8 px-6"
            >
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={`text-xl uppercase tracking-widest transition-colors ${
                    l === locale ? "text-gold-400 font-bold border-b-2 border-gold-400 pb-1" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {l}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
