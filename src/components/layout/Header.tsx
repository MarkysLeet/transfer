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
          "hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          scrolled ? "bg-[#F4EFEB] shadow-md border-slate-200 py-4" : "bg-transparent border-transparent py-6"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className={cn("text-xl md:text-2xl font-bold tracking-widest z-50 relative uppercase transition-colors duration-300", scrolled ? "text-[#2F4157]" : "text-[#E2DED3]")}>
            BLACK DIAMOND <span className={cn("font-light transition-colors duration-300", scrolled ? "text-[#2F4157]/70" : "text-[#E2DED3]/70")}>TRANSFER</span>
          </Link>
          <div className="flex items-center gap-6">
            <LanguageSwitcher isScrolled={scrolled} />
            <Button variant="primary" size="sm" className="flex gap-2" onClick={() => window.open(whatsappUrl, '_blank')}>
              <Phone size={18} />
              <span>{t("contact")}</span>
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl flex flex-col justify-center items-center overflow-hidden"
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
                    className="text-3xl font-semibold text-slate-900 hover:text-slate-600 transition-colors tracking-wider"
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
                    l === locale ? "text-slate-900 font-bold border-b-2 border-slate-900 pb-1" : "text-slate-500 hover:text-slate-900"
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
