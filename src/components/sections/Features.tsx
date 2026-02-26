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
            Почему выбирают нас
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-400/30 transition-colors group text-center md:text-left"
            >
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-6 mx-auto md:mx-0 group-hover:bg-gold-400/20 transition-colors">
                <feature.icon className="w-7 h-7 text-gold-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gold-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
