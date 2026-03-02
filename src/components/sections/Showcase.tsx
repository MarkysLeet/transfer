"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Crown, Sparkles } from "lucide-react";

export const Showcase = () => {
  const t = useTranslations("Club");

  return (
    <section className="py-20 md:py-32 bg-slate-950 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-gold-500/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold font-serif mb-4 text-white tracking-wide"
          >
            {t("title")}
          </motion.h2>
          <div className="h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent w-48 mx-auto opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Privilege 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-12 rounded-[2rem] bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 hover:border-gold-400/30 transition-colors duration-500 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gold-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center mb-6 text-gold-400 ring-1 ring-gold-400/30">
                <Crown size={32} />
              </div>
              <h3 className="text-2xl font-serif font-semibold text-white mb-4 group-hover:text-gold-400 transition-colors">
                {t("privilege_1_title")}
              </h3>
              <p className="text-slate-400 leading-relaxed font-light text-lg">
                {t("privilege_1_desc")}
              </p>
            </div>
          </motion.div>

          {/* Privilege 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 md:p-12 rounded-[2rem] bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 hover:border-gold-400/30 transition-colors duration-500 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gold-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6 text-slate-300 ring-1 ring-slate-600 group-hover:ring-gold-400/30 group-hover:text-gold-400 transition-all">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl font-serif font-semibold text-white mb-4 group-hover:text-gold-400 transition-colors">
                {t("privilege_2_title")}
              </h3>
              <p className="text-slate-400 leading-relaxed font-light text-lg">
                {t("privilege_2_desc")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
