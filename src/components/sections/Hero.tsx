"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BookingWidget } from "@/components/ui/BookingWidget";
import { Star } from "lucide-react";

export const Hero = () => {
  const t = useTranslations("Hero");

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-visible pt-20 md:pt-32 pb-8 lg:pb-0">
      {/* Background Video with Dark Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://res.cloudinary.com/dcnwhciua/video/upload/v1772799653/19121857-hd_1920_1080_30fps_zkw81f.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.1,
            },
          },
        }}
        className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center flex-grow flex-shrink-0 justify-center"
      >
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
          }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-[1.1] !text-[#E2DED3] tracking-wider"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
          }}
          className="text-lg md:text-xl !text-[#E2DED3]/90 mb-8 max-w-2xl mx-auto font-light leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
          }}
          className="w-full z-20"
        >
          <BookingWidget />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.3 } },
          }}
          className="mt-8 flex flex-col items-center justify-center gap-2"
        >
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 fill-[#E2DED3] text-[#E2DED3]"
              />
            ))}
          </div>
          <span className="text-sm text-[#E2DED3]/80 font-light tracking-wide">
            {t("trustBadge")}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};
