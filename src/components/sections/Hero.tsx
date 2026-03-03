"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { BookingWidget } from "@/components/ui/BookingWidget";

export const Hero = () => {
  const t = useTranslations("Hero");

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-visible pt-32 pb-16 lg:pb-0">
      {/* Background with Subtle Glow/Texture */}
      <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center flex-grow flex-shrink-0 justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-sm font-medium text-slate-200 tracking-wider uppercase">Premium Service</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] text-white tracking-wider"
        >
          {t('title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
        >
          {t('subtitle')}
        </motion.p>

      </div>

      <div className="container mx-auto px-4 relative z-20 mt-12 lg:-mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <BookingWidget />
        </motion.div>
      </div>
    </section>
  );
};
