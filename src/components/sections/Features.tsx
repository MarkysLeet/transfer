"use client";
import { motion } from "framer-motion";
import { Banknote, Baby, Wifi, Snowflake, GlassWater, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const Features = () => {
  const t = useTranslations("Features");

  const features = [
    {
      icon: Wifi,
      title: t("wifi"),
    },
    {
      icon: Snowflake,
      title: t("climate"),
    },
    {
      icon: Baby,
      title: t("child_seat"),
    },
    {
      icon: GlassWater,
      title: t("minibar"),
    },
    {
      icon: Banknote,
      title: t("payment"),
    },
    {
      icon: ShieldCheck,
      title: t("no_hidden_fees"),
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold font-serif mb-4 text-white"
          >
            {t("title")}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-1 bg-gold-400 mx-auto rounded-full"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] hover:border-gold-400/20 transition-all duration-500 group overflow-hidden flex flex-col items-center sm:items-start text-center sm:text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gold-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 w-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mb-6 mx-auto sm:mx-0 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-white/5 relative">
                  <div className="absolute inset-0 bg-gold-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <feature.icon className="w-8 h-8 text-gold-400 relative z-10 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                </div>
                <h3 className="text-lg font-medium text-white tracking-wide group-hover:text-gold-400 transition-colors duration-300">
                  {feature.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
