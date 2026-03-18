"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star, MessageSquare, ChevronDown } from "lucide-react";

export const TrustSectionDesktop = () => {
  const tReviews = useTranslations("Reviews");
  const tFAQ = useTranslations("FAQ");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<1 | 2>(1);

  const reviews = [
    { name: tReviews("review1Name"), text: tReviews("review1Text"), rating: 5 },
    { name: tReviews("review2Name"), text: tReviews("review2Text"), rating: 5 },
    { name: tReviews("review3Name"), text: tReviews("review3Text"), rating: 5 },
  ];

  const faqs = [
    { question: tFAQ("q1"), answer: tFAQ("a1") },
    { question: tFAQ("q2"), answer: tFAQ("a2") },
    { question: tFAQ("q3"), answer: tFAQ("a3") },
    { question: tFAQ("q4"), answer: tFAQ("a4") },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    // Phase 1 lasts for 3 seconds, then we switch to Phase 2 (the actual content)
    // We only trigger this when the section comes into view, but to keep it simple
    // without `useInView` tracking, we can just let `whileInView` handle the container
    // and rely on a local intersection observer to trigger the phase shift.

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => setPhase(2), 2500);
        }
      });
    }, { threshold: 0.5 });

    const el = document.getElementById("trust-desktop");
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="trust-desktop" className="h-screen w-full bg-[#FAFAFA] relative overflow-hidden lg:snap-start lg:snap-always flex items-center justify-center">

      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.div
            key="phase1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
          >
            <div className="flex gap-3 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-16 h-16 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
              ))}
            </div>
            <h2 className="text-6xl md:text-8xl font-bold mb-6 text-slate-900 tracking-wider text-center max-w-5xl leading-tight">
              {tReviews("trustSectionTitle")}
            </h2>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            key="phase2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="absolute inset-0 z-20 flex flex-col items-center pt-24 pb-12 w-full max-w-7xl mx-auto px-8"
          >
            {/* Top Half: Marquee Reviews */}
            <div className="w-full mb-16 overflow-hidden">
              <h3 className="text-3xl font-bold text-slate-900 mb-8">{tReviews("title")}</h3>

              <div className="relative flex overflow-x-hidden w-full group mask-linear-fade">
                <motion.div
                  animate={{ x: ["0%", "-100%"] }}
                  transition={{ ease: "linear", duration: 25, repeat: Infinity }}
                  className="flex flex-row gap-6 whitespace-nowrap"
                >
                  {/* Duplicate array for seamless infinite scrolling */}
                  {[...reviews, ...reviews, ...reviews].map((review, index) => (
                    <div key={index} className="flex-none w-[400px] p-6 rounded-2xl bg-white border border-slate-100 shadow-lg flex flex-col hover:scale-105 transition-transform duration-300 cursor-pointer">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-[#F4EFEB] rounded-full flex items-center justify-center border border-slate-200">
                          <MessageSquare className="w-5 h-5 text-[#2F4157]" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 tracking-wide text-lg">{review.name}</p>
                          <div className="flex gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-600 font-light text-base whitespace-normal line-clamp-3">
                        "{review.text}"
                      </p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Bottom Half: Full-width FAQ */}
            <div className="w-full flex-1 overflow-y-auto hide-scrollbar">
               <h3 className="text-3xl font-bold text-slate-900 mb-8">{tFAQ("title")}</h3>
               <div className="flex flex-col gap-4">
                 {faqs.map((faq, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div
                      key={index}
                      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                        isOpen ? "bg-slate-50 border-[#2F4157]/30 shadow-md" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full text-left px-8 py-5 flex items-center justify-between gap-4 focus:outline-none"
                        aria-expanded={isOpen}
                      >
                        <span className={`font-semibold text-xl transition-colors ${isOpen ? "text-[#2F4157]" : "text-slate-800"}`}>
                          {faq.question}
                        </span>
                        <div className={`p-3 rounded-full transition-transform duration-300 ${isOpen ? "bg-[#2F4157] text-white rotate-180" : "bg-slate-100 text-slate-500"}`}>
                          <ChevronDown size={20} />
                        </div>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-8 pb-6 text-slate-600 font-light text-lg leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
               </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
