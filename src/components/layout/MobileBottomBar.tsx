"use client";
import { useState } from "react";
import { Home, Map, Star, MessageCircle, Globe, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "@/i18n/routing";

export const MobileBottomBar = () => {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const whatsappUrl = `https://wa.me/905418462550?text=${encodeURIComponent(t("whatsappMessage"))}`;

  const [isLangSheetOpen, setIsLangSheetOpen] = useState(false);

  const locales = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'de', label: 'Deutsch' }
  ];

  const handleNavClick = (action: string) => {
    if (action === "home") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === "routes") {
      document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === "club") {
      document.getElementById('loyalty')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === "whatsapp") {
      window.open(whatsappUrl, '_blank');
    } else if (action === "language") {
      setIsLangSheetOpen(true);
    }
  };

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsLangSheetOpen(false);
  };

  const tabs = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'routes', icon: Map, label: t('routes') },
    { id: 'club', icon: Star, label: t('club') },
    { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' },
    { id: 'language', icon: Globe, label: locale.toUpperCase() },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-[#5D8093]/20 md:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className="flex flex-col items-center justify-center w-full h-full text-text-primary hover:text-accent transition-colors"
              >
                <Icon size={24} className="mb-1" strokeWidth={1.5} />
                <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Bottom Sheet */}
      <AnimatePresence>
        {isLangSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLangSheetOpen(false)}
              className="fixed inset-0 z-50 md:hidden"
            >
              <div className="absolute inset-0 bg-black/60" />
            </motion.div>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl shadow-2xl md:hidden overflow-hidden pb-[env(safe-area-inset-bottom)]"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-accent tracking-wide">Select Language</h3>
                  <button onClick={() => setIsLangSheetOpen(false)} className="p-2 text-text-primary hover:text-accent bg-[#5D8093]/10 rounded-full">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {locales.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => switchLocale(l.code)}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                        l.code === locale
                          ? "bg-accent text-button-text shadow-md"
                          : "bg-white text-text-primary hover:bg-[#5D8093]/5 border border-[#5D8093]/10"
                      }`}
                    >
                      <span className="text-lg font-medium">{l.label}</span>
                      <span className={`text-sm uppercase tracking-wider ${l.code === locale ? "text-button-text/70" : "text-text-primary/50"}`}>
                        {l.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
