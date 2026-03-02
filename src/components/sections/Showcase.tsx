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
    <section className="py-20 md:py-32 bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative h-[350px] md:h-[450px] lg:h-[550px]"
          >
             {/* Decorative Elements */}
            <div className="absolute inset-0 bg-gold-400/10 blur-3xl rounded-full scale-90 translate-x-10 translate-y-10" />
            <div className="absolute -inset-4 border border-gold-400/20 rounded-[2.5rem] hidden md:block" />

            <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10">
              <Image
                src="https://images.unsplash.com/photo-1569388330292-7a6a84165c6c?q=80&w=2070&auto=format&fit=crop" // Interior
                alt="Mercedes Vito Interior"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:scale-110 transition-transform duration-[10s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-6 text-white leading-[1.1] tracking-tight">
              Mercedes Benz <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600">Vito</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed font-light">
              Ваш личный кабинет на колесах. Идеальное сочетание стиля, комфорта и безопасности для деловых поездок и семейного отдыха.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-gold-400" />
                  </div>
                  <span className="text-slate-200">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
