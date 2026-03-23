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

  const leftTabs = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'fleet', icon: CarFront, label: t('fleet') },
  ];

  const WhatsAppIcon = ({ size = 24, strokeWidth = 1.25, className = "" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 3.2L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );

  const rightTabs = [
    { id: 'reviews', icon: Star, label: t('reviews') },
    { id: 'concierge', icon: WhatsAppIcon, label: "WhatsApp" },
  ];

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.6 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden pointer-events-none pb-[env(safe-area-inset-bottom)] flex flex-col justify-end"
    >
      {/* Increased height from 72px to 84px to accommodate the text below FAB without overlapping the safe area */}
      <div className="relative w-full h-[84px] pointer-events-auto filter drop-shadow-[0_-4px_24px_rgba(0,0,0,0.08)] mt-6">
        {/* SVG background for the notched glassmorphism bar */}
        <div className="absolute inset-0 w-full h-full overflow-hidden rounded-t-[10px]">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 390 72"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-white/85"
            style={{ filter: "drop-shadow(0px -4px 12px rgba(0, 0, 0, 0.05))" }}
          >
            {/*
              Smooth Notch Path explanation:
              - Starts at top left (0,0)
              - Goes to width 140px (before notch)
              - Cubic bezier curves down to center (195, 42)
              - Cubic bezier curves back up to width 250px (after notch)
              - Goes to top right (390, 0)
              - Completes rectangle down to bottom
            */}
            <path
              d="M0 0 H140 C148 0 154 3 158 10 C168 28 178 40 195 40 C212 40 222 28 232 10 C236 3 242 0 250 0 H390 V84 H0 Z"
              fill="currentColor"
              className="backdrop-blur-xl"
            />
            {/* Soft inner top border to enhance glass effect */}
            <path
              d="M0 0 H140 C148 0 154 3 158 10 C168 28 178 40 195 40 C212 40 222 28 232 10 C236 3 242 0 250 0 H390"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="1.5"
            />
            {/* Subtle outer top border for definition */}
            <path
              d="M0 0 H140 C148 0 154 3 158 10 C168 28 178 40 195 40 C212 40 222 28 232 10 C236 3 242 0 250 0 H390"
              fill="none"
              stroke="rgba(203, 213, 225, 0.4)"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* FAB (Floating Action Button) with Text Below */}
        <div className="absolute left-1/2 -top-8 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-auto">
          <button
            onClick={() => handleNavClick("order")}
            className="group relative flex items-center justify-center w-[60px] h-[60px] bg-[#2F4157] text-[#E2DED3] rounded-full shadow-lg shadow-[#2F4157]/40 transition-all duration-200 active:scale-95 active:opacity-90 overflow-hidden border border-[#3e5672]/50 mb-1"
            aria-label={t('booking')}
          >
            {/* Sweep glare effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:animate-[sweep_2s_ease-in-out_infinite] pointer-events-none" style={{ transform: 'translateX(-150%) skewX(-25deg)' }} />
            <MapPin size={24} strokeWidth={1.25} className="relative z-10 transition-transform duration-300 group-active:scale-95" />
          </button>
          {/* Label below FAB, fine-tuned position, no hover effects needed as it is just label */}
          <span className="text-[10px] font-medium tracking-wide text-slate-500 mt-1">
            {t('booking')}
          </span>
        </div>

        {/* Navigation Tabs */}
        {/* Added top padding to tabs to adjust for increased bar height */}
        <div className="absolute inset-0 pt-3 flex justify-between px-2 pointer-events-none" style={{ pointerEvents: 'none' }}>
          {/* Left Tabs */}
          <div className="flex w-[40%] justify-around items-end pb-2 pointer-events-auto" style={{ pointerEvents: 'auto' }}>
            {leftTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className="flex flex-col items-center justify-center w-full h-[60px] text-slate-400 hover:text-slate-600 active:text-[#2F4157] transition-all duration-300 active:scale-95 group"
                >
                  <Icon size={24} strokeWidth={1.25} className="mb-1.5 transition-colors duration-300 group-active:text-[#2F4157]" />
                  <span className="text-[10px] font-medium tracking-wide transition-colors duration-300 group-active:text-[#2F4157] group-active:font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Tabs */}
          <div className="flex w-[40%] justify-around items-end pb-2 pointer-events-auto" style={{ pointerEvents: 'auto' }}>
             {rightTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className="flex flex-col items-center justify-center w-full h-[60px] text-slate-400 hover:text-slate-600 active:text-[#2F4157] transition-all duration-300 active:scale-95 group"
                >
                  <Icon size={24} strokeWidth={1.25} className="mb-1.5 transition-colors duration-300 group-active:text-[#2F4157]" />
                  <span className="text-[10px] font-medium tracking-wide transition-colors duration-300 group-active:text-[#2F4157] group-active:font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
