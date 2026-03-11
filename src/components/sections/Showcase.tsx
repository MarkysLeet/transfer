"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";

const fleetData = {
  vito: {
    title: "Mercedes Benz",
    subtitle: "Vito",
    description: "Ваш личный кабинет на колесах. Идеальное сочетание стиля, комфорта и безопасности для деловых поездок и семейного отдыха.",
    image: "https://res.cloudinary.com/dcnwhciua/image/upload/v1772476361/Mercedes_V-Class_Mercedes-Benz_Viano_Mercedes-Benz_Vito_Mercedes-Benz_S-Class_Minivan_PNG-removebg-preview_jmtgkz.png",
    features: [
      "Вместимость до 7 пассажиров",
      "Кожаный салон класса люкс",
      "Раздельный климат-контроль",
      "Wi-Fi и зарядки для устройств",
      "Детские кресла (по запросу)",
      "Вода для каждого пассажира",
    ]
  },
  vw: {
    title: "VW Transporter",
    subtitle: "VIP",
    description: "Простор и функциональность. Идеальное решение для комфортных поездок небольших групп с большим багажом.",
    image: "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?q=80&w=2000&auto=format&fit=crop",
    features: [
      "Вместимость до 5 пассажиров",
      "Просторный багажник",
      "Удобные сиденья",
      "Климат-контроль",
      "Детские кресла (по запросу)",
      "Вода для каждого пассажира",
    ]
  }
};

export const Showcase = () => {
  const [activeTab, setActiveTab] = useState<"vito" | "vw">("vito");

  const currentVehicle = fleetData[activeTab];

  return (
    <section className="py-20 md:py-32 bg-[#FAFAFA] overflow-hidden relative">
      <div className="container mx-auto px-4 relative">

        {/* Fleet Tabs */}
        <div className="flex justify-center mb-16 relative z-20">
          <div className="inline-flex bg-white p-1.5 rounded-full border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab("vito")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "vito"
                  ? "bg-[#2F4157] text-[#E2DED3] shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              MB Vito VIP
            </button>
            <button
              onClick={() => setActiveTab("vw")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "vw"
                  ? "bg-[#2F4157] text-[#E2DED3] shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              VW Transporter VIP
            </button>
          </div>
        </div>

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

            <div className="relative w-full aspect-[4/3] z-10 flex items-center justify-center overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src={currentVehicle.image}
                    alt={currentVehicle.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-cover ${activeTab === "vito" ? "object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" : ""}`}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Text Side */}
          <div className="w-full lg:w-1/2 lg:py-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 leading-[1.1] tracking-wider uppercase">
                  {currentVehicle.title} <br className="hidden md:block"/> {currentVehicle.subtitle}
                </h2>
                <p className="text-slate-600 text-lg md:text-xl mb-12 leading-relaxed font-light">
                  {currentVehicle.description}
                </p>

                <div className="flex flex-col gap-6">
                  {currentVehicle.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
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
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
