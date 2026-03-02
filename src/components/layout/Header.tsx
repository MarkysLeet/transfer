"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Phone, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
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
  const t = useTranslations("Navigation");

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

  const whatsappUrl = `https://wa.me/905550000000?text=${encodeURIComponent(t("whatsappMessage"))}`;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          scrolled ? "bg-[#0F172A]/80 backdrop-blur-md border-white/10 py-4" : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold tracking-widest text-white z-50 relative uppercase">
            TURKEY VIP <span className="text-white/70">TRANSFER</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <LanguageSwitcher />
            <Button variant="primary" size="sm" className="flex gap-2" onClick={() => window.open(whatsappUrl, '_blank')}>
              <Phone size={18} />
              <span>{t("contact")}</span>
            </Button>
          </div>
          <button
            onClick={toggleMenu}
            className="md:hidden text-white z-50 relative p-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md"
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
            className="fixed inset-0 z-40 bg-[#0F172A]/95 backdrop-blur-xl flex flex-col justify-center items-center overflow-hidden"
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
                    className="text-3xl font-semibold text-white hover:text-white/70 transition-colors tracking-wider"
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
                    l === locale ? "text-white font-bold border-b-2 border-white pb-1" : "text-slate-400 hover:text-white"
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
