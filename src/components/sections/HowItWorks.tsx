"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FileText, UserCheck, Car } from "lucide-react";

export const HowItWorks = () => {
  const t = useTranslations("HowItWorks");

  const steps = [
    {
      icon: FileText,
      title: t("step1Title"),
      desc: t("step1Desc"),
    },
    {
      icon: UserCheck,
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      icon: Car,
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-white relative overflow-hidden border-t border-slate-100 lg:min-h-screen ">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 tracking-wider"
          >
            {t("title")}
          </motion.h2>
          <div className="h-1 bg-slate-200 w-24 rounded-full mx-auto" />
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
                staggerChildren: 0.2,
              },
            },
          }}
          className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto relative"
        >
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-[2px] bg-slate-100 z-0">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-[#2F4157]/20 via-[#2F4157] to-[#2F4157]/20 origin-left"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
              }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 mb-8 rounded-full bg-slate-50 border border-slate-100 shadow-lg shadow-black/5 flex items-center justify-center group-hover:scale-110 group-hover:shadow-xl transition-all duration-500 relative bg-white">
                {/* Number Badge */}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#2F4157] text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {index + 1}
                </div>
                <step.icon className="w-10 h-10 text-[#2F4157] transition-colors duration-300" strokeWidth={1.5} />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-wide group-hover:text-[#2F4157] transition-colors duration-300">
                {step.title}
              </h3>

              <p className="text-slate-600 leading-relaxed font-light text-lg px-4">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
