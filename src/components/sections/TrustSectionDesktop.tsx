"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star, MessageSquare, ChevronDown } from "lucide-react";

export const TrustSectionDesktop = () => {
  const tReviews = useTranslations("Reviews");
  const tFAQ = useTranslations("FAQ");
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Title animates up
  const titleY = useTransform(scrollYProgress, [0, 0.4], [0, -250]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.8]);

  // Content animates up from the bottom
  const contentY = useTransform(scrollYProgress, [0.2, 0.6], [800, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} id="trust-desktop" className="h-[200vh] bg-[#FAFAFA] relative">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

        {/* Phase 1: Fixed empty background with "Highly Recommended Service" + badges */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity, scale: titleScale }}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        >
          <div className="flex gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-12 h-12 fill-yellow-400 text-yellow-400 drop-shadow-md" />
            ))}
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-slate-900 tracking-wider text-center max-w-4xl leading-tight">
            {tReviews("trustSectionTitle")}
          </h2>
          <div className="h-1 bg-[#2F4157] w-32 rounded-full" />
        </motion.div>

        {/* Phase 2: Grid of Reviews & FAQ comes up */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="absolute inset-0 z-20 flex items-center justify-center"
        >
          <div className="container mx-auto px-4 max-w-7xl pt-24 h-[80vh] flex flex-row gap-12">

            {/* Left Side: Reviews */}
            <div className="w-1/2 flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-24 pr-4" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
              <h3 className="text-3xl font-bold text-slate-900 mb-4 sticky top-0 bg-[#FAFAFA] py-4 z-10">{tReviews("title")}</h3>
              {reviews.map((review, index) => (
                <div key={index} className="relative p-8 rounded-3xl bg-white border border-slate-100 shadow-xl flex flex-col">
                  <div className="absolute -top-5 -left-5 w-14 h-14 bg-[#F4EFEB] rounded-full flex items-center justify-center border border-slate-200 shadow-md">
                    <MessageSquare className="w-6 h-6 text-[#2F4157]" />
                  </div>
                  <div className="flex gap-1 mb-6 mt-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed font-light text-lg mb-8 flex-grow">
                    "{review.text}"
                  </p>
                  <div className="mt-auto">
                    <div className="h-[2px] w-16 bg-slate-200 mb-4" />
                    <p className="font-bold text-slate-900 tracking-wide text-xl">
                      {review.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side: FAQ */}
            <div className="w-1/2 flex flex-col gap-4 overflow-y-auto hide-scrollbar pb-24 pr-4" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
               <h3 className="text-3xl font-bold text-slate-900 mb-4 sticky top-0 bg-[#FAFAFA] py-4 z-10">{tFAQ("title")}</h3>
               {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                      isOpen ? "bg-slate-50 border-[#2F4157]/30 shadow-lg" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full text-left px-8 py-6 flex items-center justify-between gap-4 focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className={`font-semibold text-xl transition-colors ${isOpen ? "text-[#2F4157]" : "text-slate-800"}`}>
                        {faq.question}
                      </span>
                      <div className={`p-3 rounded-full transition-transform duration-300 ${isOpen ? "bg-[#2F4157] text-white rotate-180" : "bg-slate-100 text-slate-500"}`}>
                        <ChevronDown size={24} />
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
                          <div className="px-8 pb-8 text-slate-600 font-light text-lg leading-relaxed">
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

      </div>
    </section>
  );
};
