"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { FileText, UserCheck, Car } from "lucide-react";
import Image from "next/image";

export const HowItWorks = () => {
  const t = useTranslations("HowItWorks");
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Fade from image 1 to image 2 based on scroll progress
  // Phase 1: 0% - 40%, Crossfade: 40% - 60%, Phase 2: 60% - 100%
  const img1Opacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 0]);
  const img2Opacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);

  // Timeline progress lines
  const line1Progress = useTransform(scrollYProgress, [0, 0.3], ["0%", "100%"]);
  const line2Progress = useTransform(scrollYProgress, [0.5, 0.8], ["0%", "100%"]);
  const timelineProgress = useTransform(scrollYProgress, [0, 0.4, 0.8], ["0%", "50%", "100%"]);

  // Pre-calculate step transforms at the top level
  const step0IsActive = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 1, 0.5]);
  const step0Scale = useTransform(scrollYProgress, [0, 0.3, 0.4], [1.1, 1.1, 1]);

  const step1IsActive = useTransform(scrollYProgress, [0.2, 0.4, 0.7, 0.8], [0.5, 1, 1, 0.5]);
  const step1Scale = useTransform(scrollYProgress, [0.2, 0.4, 0.7, 0.8], [1, 1.1, 1.1, 1]);

  const step2IsActive = useTransform(scrollYProgress, [0.6, 0.8, 1], [0.5, 1, 1]);
  const step2Scale = useTransform(scrollYProgress, [0.6, 0.8, 1], [1, 1.1, 1.1]);

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
    <section id="how-it-works" className="bg-white relative overflow-hidden border-t border-slate-100">

      {/* DESKTOP NARRATIVE SCROLL (>= 1024px) */}
      <div ref={containerRef} className="hidden lg:block h-[300vh] relative w-full">
        <div className="sticky top-0 h-screen w-full flex items-center">
          <div className="container mx-auto px-4 max-w-7xl flex h-[80vh] gap-16 items-center">

            {/* Left: Sticky Timeline */}
            <div className="flex-1 h-full flex flex-col justify-center relative pl-8">
               <div className="mb-16">
                 <h2 className="text-5xl font-bold mb-6 text-slate-900 tracking-wider">
                   {t("title")}
                 </h2>
                 <div className="h-1 bg-[#2F4157] w-24 rounded-full opacity-80" />
               </div>

               <div className="relative flex flex-col gap-24">
                  {/* Timeline track */}
                  <div className="absolute left-8 top-12 bottom-12 w-[2px] bg-slate-100 z-0">
                    <motion.div
                      className="absolute top-0 w-full bg-[#2F4157]"
                      style={{ height: timelineProgress }}
                    />
                  </div>

                  {steps.map((step, idx) => {
                    // Select pre-calculated transforms
                    const isActive = idx === 0 ? step0IsActive : idx === 1 ? step1IsActive : step2IsActive;
                    const scale = idx === 0 ? step0Scale : idx === 1 ? step1Scale : step2Scale;

                    return (
                      <motion.div key={idx} style={{ opacity: isActive, scale, originX: 0 }} className="flex items-start gap-8 relative z-10">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-2 bg-white ${idx === 0 ? 'border-[#2F4157]' : 'border-slate-200'}`}>
                           <step.icon className={`w-6 h-6 ${idx === 0 ? 'text-[#2F4157]' : 'text-slate-400'}`} />
                        </div>
                        <div className="pt-3">
                           <h3 className="text-3xl font-bold text-slate-900 mb-3">{step.title}</h3>
                           <p className="text-slate-600 leading-relaxed font-light text-xl max-w-md">{step.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
               </div>
            </div>

            {/* Right: Crossfading Images */}
            <div className="flex-1 h-full flex items-center justify-center relative">
               <div className="w-full aspect-[4/5] relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
                 <motion.div style={{ opacity: img1Opacity }} className="absolute inset-0">
                   <Image
                     src="https://storage.yandexcloud.net/arina-reels-storage/how_work.jpg"
                     alt="Chauffeur"
                     fill
                     className="object-cover"
                     sizes="50vw"
                   />
                 </motion.div>
                 <motion.div style={{ opacity: img2Opacity }} className="absolute inset-0">
                   <Image
                     src="https://storage.yandexcloud.net/arina-reels-storage/client.jpg"
                     alt="Passenger"
                     fill
                     className="object-cover"
                     sizes="50vw"
                   />
                 </motion.div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE VERTICAL LAYOUT (< 1024px) */}
      <div className="lg:hidden py-20 md:py-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
            viewport={{ once: true, margin: "-50px" }}
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
                viewport={{ once: true }}
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
      </div>
    </section>
  );
};
