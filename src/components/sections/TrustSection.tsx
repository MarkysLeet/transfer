"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Reviews } from "./Reviews";
import { FAQ } from "./FAQ";
import { Star, Award, ShieldCheck, CheckCircle2 } from "lucide-react";

export const TrustSection = () => {
  const tReviews = useTranslations("Reviews");
  const tFAQ = useTranslations("FAQ");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(true); // Default to desktop for SSR, then update
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Phase 1 (Trigger) -> Phase 2 (Details) transitions
  const triggerOpacity = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 1, 0]);
  const triggerScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.1]);
  const triggerY = useTransform(scrollYProgress, [0, 0.4], [0, -50]);

  const detailsOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const detailsY = useTransform(scrollYProgress, [0.35, 0.5], [100, 0]);
  const detailsPointerEvents = useTransform(scrollYProgress, [0.35, 0.4], ["none", "auto"]);

  const triggerBadges = [
    { icon: Star, text: "5.0", sub: "Google", x: -150, y: -100, delay: 0.2 },
    { icon: Award, text: "Top Rated", sub: "2024", x: 150, y: -80, delay: 0.4 },
    { icon: ShieldCheck, text: "Verified", sub: "Service", x: -120, y: 100, delay: 0.6 },
    { icon: CheckCircle2, text: "100%", sub: "Reliable", x: 130, y: 120, delay: 0.8 },
  ];

  return (
    <>
      {!mounted && <section className="min-h-screen bg-[#FAFAFA]" />}

      {mounted && !isDesktop && (
        <div className="flex flex-col">
          <Reviews />
          <FAQ />
        </div>
      )}

      <section ref={containerRef} className={`relative h-[300vh] bg-white text-slate-900 border-t border-slate-100 ${!mounted || !isDesktop ? 'hidden' : 'block'}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">

        {/* Phase 1: Trigger (Hero Title & Badges) */}
        <motion.div
          style={{ opacity: triggerOpacity, scale: triggerScale, y: triggerY, willChange: "transform, opacity" }}
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          <div className="text-center relative">
            <h2 className="text-6xl md:text-7xl font-bold mb-6 text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto px-4">
              {tReviews("title") || "Service Recommended Worldwide"}
            </h2>
            <div className="h-1 bg-[#2F4157] w-32 rounded-full mx-auto opacity-80" />

            {/* Floating Badges */}
            {triggerBadges.map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5, x: badge.x * 0.5, y: badge.y * 0.5 }}
                whileInView={{ opacity: 1, scale: 1, x: badge.x, y: badge.y }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.8, delay: badge.delay, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 backdrop-blur-md"
                style={{ marginLeft: "-75px", marginTop: "-30px" }} // Rough centering offset
              >
                <div className="bg-[#F4EFEB] p-2 rounded-full text-[#2F4157]">
                  <badge.icon size={24} strokeWidth={2} className="fill-current text-[#2F4157]" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-bold text-slate-900 leading-none">{badge.text}</span>
                  <span className="text-xs text-slate-500 font-medium">{badge.sub}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Phase 2: Details (Reviews & FAQ Slider) */}
        <motion.div
          style={{ opacity: detailsOpacity, y: detailsY, pointerEvents: detailsPointerEvents, willChange: "transform, opacity" }}
          className="absolute inset-0 z-20 flex items-center justify-center bg-white/95 backdrop-blur-sm overflow-y-auto"
        >
           <div className="container mx-auto px-4 max-w-6xl py-24 flex flex-col gap-24 h-full overflow-y-auto hide-scrollbar">
              {/* Embedded Reviews Content (Desktop Layout Only) */}
              <div className="w-full">
                <div className="text-center mb-16">
                  <h3 className="text-4xl font-bold mb-4 text-slate-900 tracking-wider">
                    {tReviews("title")}
                  </h3>
                  <div className="h-1 bg-slate-200 w-16 rounded-full mx-auto" />
                </div>
                <div className="grid grid-cols-3 gap-8">
                   {[1, 2, 3].map((num) => (
                      <div key={num} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-md shadow-black/5 flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
                        <div className="flex gap-1 mb-6">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-slate-600 leading-relaxed font-light mb-8 flex-grow text-lg italic">
                          &quot;{tReviews(`review${num}Text`)}&quot;
                        </p>
                        <div className="mt-auto">
                          <div className="h-[2px] w-12 bg-[#2F4157]/20 mb-4" />
                          <p className="font-semibold text-slate-900 tracking-wide text-lg">
                            {tReviews(`review${num}Name`)}
                          </p>
                        </div>
                      </div>
                   ))}
                </div>
              </div>

              {/* Embedded FAQ Content (Desktop Layout Only) */}
              <div className="w-full max-w-4xl mx-auto pb-24">
                <div className="text-center mb-16">
                  <h3 className="text-4xl font-bold mb-4 text-slate-900 tracking-wider">
                    {tFAQ("title")}
                  </h3>
                  <div className="h-1 bg-slate-200 w-16 rounded-full mx-auto" />
                </div>
                <div className="flex flex-col gap-4">
                  {[1, 2, 3, 4].map((num) => (
                     <div key={num} className="border rounded-2xl overflow-hidden bg-white border-slate-200 hover:border-[#2F4157]/30 transition-colors duration-300 shadow-sm">
                       <div className="w-full text-left px-8 py-6 flex items-start gap-4">
                         <div className="p-2 rounded-full bg-[#F4EFEB] text-[#2F4157] shrink-0 mt-1">
                           <ShieldCheck size={20} />
                         </div>
                         <div>
                            <h4 className="font-medium text-xl text-slate-800 mb-3">{tFAQ(`q${num}`)}</h4>
                            <p className="text-slate-600 font-light leading-relaxed text-lg">{tFAQ(`a${num}`)}</p>
                         </div>
                       </div>
                     </div>
                  ))}
                </div>
              </div>
           </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: triggerOpacity }}
          className="absolute bottom-10 inset-x-0 flex flex-col items-center justify-center gap-2 pointer-events-none z-30"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-medium">Scroll</span>
          <div className="w-[1px] h-12 bg-slate-300 relative overflow-hidden">
            <motion.div
              animate={{ y: [0, 48] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-x-0 top-0 h-4 bg-[#2F4157]"
            />
          </div>
        </motion.div>

      </div>
    </section>
    </>
  );
};
