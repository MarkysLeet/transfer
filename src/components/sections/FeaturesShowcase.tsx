"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Wifi, Wind, Baby, Coffee, CreditCard, ShieldCheck } from "lucide-react";
import { useRef } from "react";

export const FeaturesShowcase = () => {
  const t = useTranslations("Features");
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yCar = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yGrid = useTransform(scrollYProgress, [0, 1], ["10%", "-30%"]);

  // Shadow breathing effect on scroll
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4]);
  const shadowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const features = [
    { icon: Wifi, title: t("wifi") },
    { icon: Wind, title: t("climate") },
    { icon: Baby, title: t("childSeat") },
    { icon: Coffee, title: t("minibar") },
    { icon: CreditCard, title: t("payment") },
    { icon: ShieldCheck, title: t("noHiddenFees") },
  ];

  return (
    <section ref={sectionRef} id="features" className="relative bg-slate-950 text-white min-h-screen overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-screen max-w-[1400px] mx-auto w-full">

        {/* Left Side: Sticky Image */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-0 h-[50vh] lg:h-screen flex flex-col justify-center p-8 relative">
          <motion.div style={{ y: yCar }} className="absolute inset-0 flex items-center justify-center">
            {/* Halo glow behind the car */}
            <div className="absolute w-[80%] h-[60%] bg-[#C5A028]/15 blur-[120px] rounded-full" />

            <div className="relative w-[90%] lg:w-[120%] max-w-3xl aspect-[16/9] -ml-4 lg:-ml-20 flex flex-col items-center justify-center">
              <div className="relative w-full h-full z-10">
                <Image
                  src="https://res.cloudinary.com/dcnwhciua/image/upload/v1772476361/Mercedes_V-Class_Mercedes-Benz_Viano_Mercedes-Benz_Vito_Mercedes-Benz_S-Class_Minivan_PNG-removebg-preview_jmtgkz.png"
                  alt="Mercedes Vito"
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              </div>

              {/* Grounding soft elliptical shadow */}
              <motion.div style={{ opacity: shadowOpacity, scaleX: shadowScale }} className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[80%] h-12 bg-black/90 blur-2xl rounded-[100%] z-0" />
            </div>
          </motion.div>
        </div>

        {/* Right Side: Scrollable Features */}
        <div className="w-full lg:w-1/2 flex items-center p-8 lg:p-20 py-20 lg:py-32">
          <motion.div style={{ y: yGrid }} className="max-w-xl mx-auto lg:mx-0 w-full relative z-20">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6 }}
               className="mb-12"
             >
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight tracking-wider uppercase text-white">
                  Mercedes Benz <br />
                  <span>Vito</span>
                </h2>
                <div className="h-1 bg-white/20 w-24 rounded-full" />
             </motion.div>

             <motion.div
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-100px" }}
               variants={{
                 visible: { transition: { staggerChildren: 0.1 } },
                 hidden: {}
               }}
               className="grid grid-cols-1 sm:grid-cols-2 gap-6"
             >
               {features.map((feature, idx) => (
                 <motion.div
                   key={idx}
                   variants={{
                     hidden: { opacity: 0, filter: "blur(20px)", y: 30 },
                     visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.7, ease: "easeOut" } }
                   }}
                   className="p-6 rounded-2xl bg-white/[0.03] border border-neutral-800/30 backdrop-blur-md shadow-lg shadow-black/10 hover:border-[#C5A028]/30 hover:bg-white/[0.06] transition-all duration-300 group flex flex-col items-start gap-4"
                 >
                    <div className="p-3 rounded-xl bg-black/20 border border-white/5 group-hover:border-[#C5A028]/20 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-[#C5A028] stroke-[1.5]" />
                    </div>
                    <p className="font-medium text-slate-300 group-hover:text-white transition-colors">
                      {feature.title}
                    </p>
                 </motion.div>
               ))}
             </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
