"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FileText, UserCheck, Car, LucideIcon } from "lucide-react";

const StepItem = ({
  step,
  index,
  totalSteps,
  scrollYProgress
}: {
  step: { title: string; desc: string; icon: LucideIcon };
  index: number;
  totalSteps: number;
  scrollYProgress: MotionValue<number>;
}) => {
  const stepStart = index * (1 / (totalSteps - 1)) - 0.2;
  const stepEnd = index * (1 / (totalSteps - 1)) + 0.1;

  const opacity = useTransform(scrollYProgress, [stepStart, Math.max(0, stepStart + 0.1), stepEnd, Math.min(1, stepEnd + 0.1)], [0.3, 1, 1, 1]);
  const scale = useTransform(scrollYProgress, [stepStart, Math.max(0, stepStart + 0.1)], [0.9, 1]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="flex items-start gap-8"
    >
      <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center">
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#2F4157] text-white flex items-center justify-center font-bold text-xs shadow-md">
          {index + 1}
        </div>
        <step.icon className="w-8 h-8 text-[#2F4157]" strokeWidth={1.5} />
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
};

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

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const timelineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Opacity for the images
  const driverImageOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [1, 1, 0, 0]);
  const passengerImageOpacity = useTransform(scrollYProgress, [0.4, 0.6, 1], [0, 1, 1]);

  return (
    <section ref={sectionRef} id="how-it-works-desktop" className="h-[200vh] bg-white relative lg:snap-start">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-8 w-full max-w-7xl h-full flex flex-row items-center justify-between gap-16">

          {/* Left Side: Timeline */}
          <div className="w-1/2 flex flex-col justify-center h-full relative">
            <h2 className="text-5xl font-bold mb-16 text-slate-900 tracking-wider">
              {t("title")}
              <div className="h-1 bg-slate-200 w-24 rounded-full mt-6" />
            </h2>

            <div className="relative pl-8">
              {/* Background Timeline Line */}
              <div className="absolute left-[39px] top-4 bottom-12 w-[2px] bg-slate-100 z-0" />

              {/* Active Timeline Line */}
              <motion.div
                className="absolute left-[39px] top-4 w-[2px] bg-gradient-to-b from-[#2F4157] to-[#2F4157]/50 z-10 origin-top"
                style={{ height: timelineHeight }}
              />

              <div className="flex flex-col gap-16 relative z-20">
                {steps.map((step, index) => (
                  <StepItem
                    key={index}
                    step={step}
                    index={index}
                    totalSteps={steps.length}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Images */}
          <div className="w-1/2 h-[70vh] relative rounded-3xl overflow-hidden shadow-2xl">
             <motion.div style={{ opacity: driverImageOpacity }} className="absolute inset-0">
               <Image
                 src="https://storage.yandexcloud.net/arina-reels-storage/how_work.jpg"
                 alt="How it works phase 1"
                 fill
                 className="object-cover"
                 sizes="50vw"
               />
             </motion.div>
             <motion.div style={{ opacity: passengerImageOpacity }} className="absolute inset-0">
               <Image
                 src="https://storage.yandexcloud.net/arina-reels-storage/client.jpg"
                 alt="How it works phase 2"
                 fill
                 className="object-cover"
                 sizes="50vw"
               />
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
