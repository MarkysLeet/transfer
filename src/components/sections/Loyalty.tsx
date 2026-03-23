"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Gem, Gift } from "lucide-react";

export const Loyalty = () => {
  const t = useTranslations("Loyalty");

  const privileges = [
    {
      icon: Gem,
      title: t("privilege1Title"),
      desc: t("privilege1Desc"),
    },
    {
      icon: Gift,
      title: t("privilege2Title"),
      desc: t("privilege2Desc"),
    },
  ];

  return (
    <section id="loyalty" className="py-20 md:py-32 bg-[#FAFAFA] relative overflow-hidden border-t border-slate-200 lg:min-h-screen lg:snap-start lg:snap-always flex items-center">
      {/* Soft Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-slate-100 mb-8 shadow-md"
          >
            <Gem className="w-8 h-8 text-[#2F4157]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 tracking-wider"
          >
            {t("title")}
          </motion.h2>
          <div className="h-[2px] bg-gradient-to-r from-transparent via-slate-300 to-transparent w-48 mx-auto" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {privileges.map((privilege, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
              }}
              className="relative p-8 md:p-12 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-black/5 group hover:border-[#2F4157]/30 hover:shadow-2xl hover:shadow-[#2F4157]/10 transition-all duration-500 overflow-hidden"
            >
              {/* Internal Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2F4157]/10 via-[#2F4157]/40 to-[#2F4157]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex flex-col gap-6">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-[#2F4157]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  <privilege.icon className="w-6 h-6 text-[#2F4157] transition-colors duration-300" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 tracking-wide transition-colors duration-300 group-hover:text-[#2F4157]/90">
                  {privilege.title}
                </h3>

                <p className="text-slate-600 leading-relaxed font-light text-lg">
                  {privilege.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
