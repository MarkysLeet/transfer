"use client";
import { motion } from "framer-motion";
import { Banknote, Baby, Wifi, Globe } from "lucide-react";

const features = [
  {
    icon: Banknote,
    title: "Оплата по факту",
    description: "Никаких скрытых комиссий. Оплачивайте поездку наличными или картой водителю.",
  },
  {
    icon: Baby,
    title: "Детские кресла",
    description: "Бесплатно предоставим комфортные и безопасные детские кресла для любого возраста.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi и вода",
    description: "В каждом автомобиле есть бесплатный Wi-Fi, вода и зарядные устройства.",
  },
  {
    icon: Globe,
    title: "Русскоговорящий водитель",
    description: "Наши водители говорят на русском языке и помогут с любыми вопросами.",
  },
];

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
  return (
    <section className="py-20 md:py-32 bg-[#0F172A]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-wider"
          >
            Почему выбирают нас
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-1 bg-white/20 mx-auto rounded-full"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 text-center md:text-left">
                <div className="w-16 h-16 rounded-2xl bg-[#111111] flex items-center justify-center mb-6 mx-auto md:mx-0 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-white/5 relative">
                  <div className="absolute inset-0 bg-white/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <feature.icon className="w-8 h-8 text-white relative z-10 drop-shadow-lg" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white tracking-wide transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
