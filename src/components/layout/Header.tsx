"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";


export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  const links = [
    { label: t("fleet"), href: "#fleet" },
    { label: t("routes"), href: "#destinations" },
    { label: t("club"), href: "#loyalty" },
  ];

  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for custom events to hide/show header when modals are open
  useEffect(() => {
    const handleHide = () => setIsHidden(true);
    const handleShow = () => setIsHidden(false);

    window.addEventListener("hideHeader", handleHide);
    window.addEventListener("showHeader", handleShow);

    return () => {
      window.removeEventListener("hideHeader", handleHide);
      window.removeEventListener("showHeader", handleShow);
    };
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
          scrolled ? "bg-[#F4EFEB] shadow-md border-slate-200 py-4" : "bg-transparent border-transparent py-6",
          isHidden ? "opacity-0 pointer-events-none -translate-y-full" : "opacity-100 translate-y-0"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className={cn("text-xl md:text-2xl font-bold tracking-widest z-50 relative uppercase transition-colors duration-300", scrolled ? "text-[#2F4157]" : "text-[#E2DED3]")}>
            BLACK DIAMOND <span className={cn("font-light transition-colors duration-300", scrolled ? "text-[#2F4157]/70" : "text-[#E2DED3]/70")}>TRANSFER</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <LanguageSwitcher isScrolled={scrolled} />
              <CurrencySwitcher isScrolled={scrolled} />
            </div>
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
            className="fixed inset-0 z-40"
          >
            <div className="absolute inset-0 bg-[#F4EFEB] shadow-[inset_0_4px_8px_rgba(0,0,0,0.1)]" />
            <div className="relative z-10 flex flex-col justify-center items-center h-full overflow-hidden">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
