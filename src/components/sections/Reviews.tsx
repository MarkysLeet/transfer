"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star, MessageSquare } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

export const Reviews = () => {
  const t = useTranslations("Reviews");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const reviews = [
    {
      name: t("review1Name"),
      text: t("review1Text"),
      rating: 5,
    },
    {
      name: t("review2Name"),
      text: t("review2Text"),
      rating: 5,
    },
    {
      name: t("review3Name"),
      text: t("review3Text"),
      rating: 5,
    },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps"
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const updateSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", updateSelect);
  }, [emblaApi]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const ReviewCard = ({ review, index }: { review: any, index: number }) => (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
      }}
      className="relative p-6 md:p-8 rounded-2xl bg-white border border-slate-100 shadow-md shadow-black/5 flex flex-col h-full"
    >
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#F4EFEB] rounded-full flex items-center justify-center border border-slate-200 shadow-sm hidden md:flex">
        <MessageSquare className="w-5 h-5 text-[#2F4157]" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100/50 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Verified Trip
        </span>
      </div>

      <p className="text-slate-600 leading-relaxed font-light mb-6 flex-grow">
        &quot;{review.text}&quot;
      </p>

      <div className="mt-auto">
        <div className="h-[1px] w-12 bg-slate-200 mb-4" />
        <p className="font-semibold text-slate-900 tracking-wide">
          {review.name}
        </p>
      </div>
    </motion.div>
  );

  return (
    <section id="reviews" className="py-20 md:py-32 bg-[#FAFAFA] relative overflow-hidden border-t border-slate-100 lg:min-h-screen ">
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

        {isMobile ? (
          <div className="overflow-hidden pb-12 -mx-4 px-4" ref={emblaRef}>
            <div className="flex touch-pan-y gap-4">
              {reviews.map((review, index) => (
                <div key={index} className="flex-[0_0_85%] min-w-0 h-auto">
                  <ReviewCard review={review} index={index} />
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => emblaApi?.scrollTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === selectedIndex ? "w-8 bg-[#2F4157]" : "w-2 bg-slate-300"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative pt-4"
          >
            {reviews.map((review, index) => (
              <ReviewCard key={index} review={review} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
