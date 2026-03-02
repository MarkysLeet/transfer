"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const Hero = () => {
  const t = useTranslations("Hero");
  const { scrollY } = useScroll();

  // Background moves up slightly slower than the user scrolls down
  const yBg = useTransform(scrollY, [0, 1000], [0, 300]);

  // Content moves up slightly faster to create depth
  const yContent = useTransform(scrollY, [0, 1000], [0, -150]);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background with Subtle Glow/Texture */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900" />
      </motion.div>

      <motion.div style={{ y: yContent }} className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center mt-16">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Button
            size="lg"
            className="group"
            onClick={() => window.open('https://wa.me/905550000000', '_blank')}
          >
            <MessageCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            {t('cta')}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};
