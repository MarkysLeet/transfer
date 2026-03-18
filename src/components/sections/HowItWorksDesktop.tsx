"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FileText, UserCheck, Car } from "lucide-react";

export const HowItWorksDesktop = () => {
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

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Automatically cycle through steps once in view
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3500); // 3.5 seconds per step
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section id="how-it-works-desktop" className="h-screen w-full flex items-center justify-center overflow-hidden bg-white relative lg:snap-start lg:snap-always">
      <div className="container mx-auto px-8 w-full max-w-7xl h-full flex flex-row items-center justify-between gap-16">

        {/* Left Side: Timeline */}
        <div className="w-1/2 flex flex-col justify-center h-full relative">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold mb-16 text-slate-900 tracking-wider">
              {t("title")}
              <div className="h-1 bg-[#2F4157] w-24 rounded-full mt-6" />
            </h2>

            <div className="relative pl-8">
              {/* Background Timeline Line */}
              <div className="absolute left-[39px] top-4 bottom-12 w-[2px] bg-slate-100 z-0" />

              <div className="flex flex-col gap-16 relative z-20">
                {steps.map((step, index) => {
                  const isActive = index === activeStep;
                  const isPast = index < activeStep;

                  return (
                    <motion.div
                      key={index}
                      initial={false}
                      animate={{
                        opacity: isActive || isPast ? 1 : 0.4,
                        scale: isActive ? 1.05 : 1
                      }}
                      transition={{ duration: 0.4 }}
                      className="flex items-start gap-8 cursor-pointer"
                      onClick={() => setActiveStep(index)}
                    >
                      <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full border shadow-lg flex items-center justify-center transition-colors duration-500 ${isActive ? 'bg-[#2F4157] border-[#2F4157]' : 'bg-white border-slate-200'}`}>
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-colors duration-500 ${isActive ? 'bg-white text-[#2F4157]' : 'bg-[#2F4157] text-white'}`}>
                          {index + 1}
                        </div>
                        <step.icon className={`w-8 h-8 transition-colors duration-500 ${isActive ? 'text-white' : 'text-[#2F4157]'}`} strokeWidth={1.5} />
                      </div>
                      <div className="pt-2">
                        <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-wide">
                          {step.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed font-light text-xl">
                          {step.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Auto-fading Images */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="w-1/2 h-[70vh] relative rounded-3xl overflow-hidden shadow-2xl"
        >
          <AnimatePresence mode="wait">
             <motion.div
               key={activeStep === 0 ? 'step0' : 'step1'}
               initial={{ opacity: 0, scale: 1.05 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.8, ease: "easeInOut" }}
               className="absolute inset-0"
             >
               <Image
                 src={activeStep === 0 ? "https://storage.yandexcloud.net/arina-reels-storage/how_work.jpg" : "https://storage.yandexcloud.net/arina-reels-storage/client.jpg"}
                 alt="How it works phase"
                 fill
                 className="object-cover"
                 sizes="50vw"
                 priority
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
             </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
