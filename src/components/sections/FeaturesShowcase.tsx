"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Wifi, Wind, Baby, Coffee, CreditCard, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

const interiorImages = [
  "https://res.cloudinary.com/dcnwhciua/image/upload/v1772799821/625e27f6-4e60-4b98-a82b-59fda28c583c_ygkduq.jpg",
  "https://res.cloudinary.com/dcnwhciua/image/upload/v1772799813/WhatsApp_Image_2026-02-24_at_20.48.47_alltgr.jpg",
  "https://res.cloudinary.com/dcnwhciua/image/upload/v1772799814/WhatsApp_Image_2026-02-24_at_20.48.46_gwpc1z.jpg",
];

export const FeaturesShowcase = () => {
  const t = useTranslations("Features");
  const [view, setView] = useState<"exterior" | "interior">("exterior");
  const [interiorIndex, setInteriorIndex] = useState(0);

  const features = [
    { icon: Wifi, title: t("wifi") },
    { icon: Wind, title: t("climate") },
    { icon: Baby, title: t("childSeat") },
    { icon: Coffee, title: t("minibar") },
    { icon: CreditCard, title: t("payment") },
    { icon: ShieldCheck, title: t("noHiddenFees") },
  ];

  const nextInterior = () => setInteriorIndex((prev) => (prev + 1) % interiorImages.length);
  const prevInterior = () => setInteriorIndex((prev) => (prev - 1 + interiorImages.length) % interiorImages.length);

  return (
    <section id="features" className="relative bg-[#FAFAFA] text-slate-900 py-16 md:py-24">
      <div className="flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full gap-12 lg:gap-20 px-4 md:px-8">

        {/* Left Side: Image Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center relative">

          {/* View Toggles */}
          <div className="flex justify-center gap-4 mb-8 z-20 relative">
            <button
              onClick={() => setView("exterior")}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                view === "exterior"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Exterior
            </button>
            <button
              onClick={() => setView("interior")}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                view === "interior"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Interior
            </button>
          </div>

          <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[4/3] flex items-center justify-center bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <AnimatePresence mode="wait">
              {view === "exterior" ? (
                <motion.div
                  key="exterior"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center p-8"
                >
                  {/* Halo glow behind the car */}
                  <div className="absolute w-[80%] h-[60%] bg-[#C5A028]/5 blur-[80px] rounded-full" />
                  <div className="relative w-full h-full z-10 flex items-center justify-center">
                    <Image
                      src="https://res.cloudinary.com/dcnwhciua/image/upload/v1772476361/Mercedes_V-Class_Mercedes-Benz_Viano_Mercedes-Benz_Vito_Mercedes-Benz_S-Class_Minivan_PNG-removebg-preview_jmtgkz.png"
                      alt="Mercedes Vito Exterior"
                      fill
                      className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] scale-110"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="interior"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={interiorImages[interiorIndex]}
                    alt={`Mercedes Vito Interior ${interiorIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Gallery Controls */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20">
                    <button
                      onClick={prevInterior}
                      className="p-2 rounded-full bg-white/80 text-slate-800 hover:bg-white hover:text-slate-900 shadow-md backdrop-blur-sm transition-all"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextInterior}
                      className="p-2 rounded-full bg-white/80 text-slate-800 hover:bg-white hover:text-slate-900 shadow-md backdrop-blur-sm transition-all"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                  {/* Gallery Dots */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-20">
                    {interiorImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInteriorIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === interiorIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Features */}
        <div className="w-full lg:w-1/2 flex items-center lg:py-12">
          <div className="max-w-xl mx-auto lg:mx-0 w-full">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="mb-12"
             >
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight tracking-wider uppercase text-slate-900">
                  Mercedes Benz <br />
                  <span>Vito</span>
                </h2>
                <div className="h-1 bg-slate-200 w-24 rounded-full" />
             </motion.div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {features.map((feature, idx) => (
                 <motion.div
                   key={idx}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: idx * 0.1 }}
                   className="p-6 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-[#C5A028]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group flex flex-col items-start gap-4"
                 >
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-[#C5A028]/20 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-[#C5A028] stroke-[1.5]" />
                    </div>
                    <p className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      {feature.title}
                    </p>
                 </motion.div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
