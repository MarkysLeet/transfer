"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";

const features = [
  "Вместимость до 7 пассажиров",
  "Кожаный салон класса люкс",
  "Раздельный климат-контроль",
  "Wi-Fi и зарядки для устройств",
  "Детские кресла (по запросу)",
  "Вода для каждого пассажира",
];

export const Showcase = () => {
  return (
    <section className="py-20 md:py-32 bg-[#FAFAFA] overflow-hidden relative">
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative h-[350px] md:h-[450px] lg:h-auto lg:sticky lg:top-32 flex items-center justify-center"
          >
             {/* Decorative Elements */}
            <div className="absolute inset-0 bg-slate-200/50 blur-3xl rounded-full scale-110" />

            <div className="relative w-full aspect-[4/3] z-10 flex items-center justify-center">
              <Image
                src="https://res.cloudinary.com/dcnwhciua/image/upload/v1772476361/Mercedes_V-Class_Mercedes-Benz_Viano_Mercedes-Benz_Vito_Mercedes-Benz_S-Class_Minivan_PNG-removebg-preview_jmtgkz.png"
                alt="Mercedes Vito"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              />
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="w-full lg:w-1/2 lg:py-20"
          >
            <motion.h2
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
              }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 leading-[1.1] tracking-wider uppercase"
            >
              Mercedes Benz <br className="hidden md:block"/> Vito
            </motion.h2>
            <motion.p
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
              }}
              className="text-slate-600 text-lg md:text-xl mb-12 leading-relaxed font-light"
            >
              Ваш личный кабинет на колесах. Идеальное сочетание стиля, комфорта и безопасности для деловых поездок и семейного отдыха.
            </motion.p>

            <div className="flex flex-col gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
                  }}
                  className="flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
                    <Check size={16} className="text-[#2F4157]" />
                  </div>
                  <span className="text-slate-700 text-lg">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
