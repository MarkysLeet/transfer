"use client";
import { Home, CarFront, MapPin, Star, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useBookingStore } from "@/store/useBookingStore";
import { motion } from "framer-motion";

export const MobileBottomBar = () => {
  const t = useTranslations("Navigation");

  const handleNavClick = (action: string) => {
    if (action === "home") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === "fleet") {
      document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === "order") {
      useBookingStore.getState().setIsOpen(true);
    } else if (action === "reviews") {
      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === "concierge") {
      window.open('tel:+905418462550', '_self');
    }
  };

  const tabs = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'fleet', icon: CarFront, label: t('fleet') },
    { id: 'order', icon: MapPin, label: t('booking'), isAccent: true },
    { id: 'reviews', icon: Star, label: t('reviews') },
    { id: 'concierge', icon: Phone, label: t('contact') },
  ];

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.6 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-slate-200/50 md:hidden pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.1)]"
    >
      <div className="flex justify-around items-end h-[72px] px-2 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          if (tab.isAccent) {
            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className="relative flex flex-col items-center justify-center w-[72px] h-full group -mt-6"
              >
                <div className="absolute top-0 flex items-center justify-center w-14 h-14 bg-[#2F4157] text-[#E2DED3] rounded-full shadow-lg shadow-[#2F4157]/30 border-4 border-[#FAFAFA] transition-transform active:scale-95">
                  <Icon size={26} strokeWidth={1.5} />
                </div>
                <span className="mt-auto text-[10px] font-semibold text-[#2F4157] tracking-wide pb-1">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className="flex flex-col items-center justify-center w-full h-full text-slate-500 active:text-[#2F4157] transition-colors"
            >
              <Icon size={24} className="mb-1.5" strokeWidth={1.5} />
              <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
