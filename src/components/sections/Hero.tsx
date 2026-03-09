"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BookingWidget } from "@/components/ui/BookingWidget";

export const Hero = () => {
  const t = useTranslations("Hero");

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-visible pt-24 pb-8 lg:pb-0">
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center flex-grow flex-shrink-0 justify-center">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-[1.1] !text-[#E2DED3] tracking-wider"
        >
          {t('title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl !text-[#E2DED3]/90 mb-8 max-w-2xl mx-auto font-light leading-relaxed"
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="w-full z-20"
        >
          <BookingWidget />
        </motion.div>
      </div>
    </section>
  );
};
