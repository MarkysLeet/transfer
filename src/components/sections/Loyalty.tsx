"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Gem, Gift } from "lucide-react";
import { useRef } from "react";

export const Loyalty = () => {
  const t = useTranslations("Loyalty");
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yCards = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

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
    <section ref={sectionRef} id="loyalty" className="py-20 md:py-32 bg-[#111111] relative overflow-hidden border-t border-white/5">
      {/* Soft Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 mb-8 shadow-xl"
          >
            <Gem className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-wider"
          >
            {t("title")}
          </motion.h2>
          <div className="h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent w-48 mx-auto" />
        </div>

        <motion.div
          style={{ y: yCards }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
            hidden: {}
          }}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {privileges.map((privilege, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, filter: "blur(20px)", y: 40 },
                visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="relative p-8 md:p-12 rounded-3xl bg-white/[0.03] border border-neutral-800/30 backdrop-blur-md shadow-2xl shadow-black/20 group hover:border-[#C5A028]/50 hover:shadow-[0_0_30px_rgba(197,160,40,0.15)] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
            >
              {/* Internal Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C5A028]/10 via-[#C5A028]/60 to-[#C5A028]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex flex-col gap-6">
                <div className="w-12 h-12 rounded-xl bg-black/20 border border-white/5 group-hover:border-[#C5A028]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <privilege.icon className="w-6 h-6 text-[#C5A028] transition-colors duration-300" />
                </div>

                <h3 className="text-2xl font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-[#C5A028]">
                  {privilege.title}
                </h3>

                <p className="text-slate-400 leading-relaxed font-light text-lg relative z-10">
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
