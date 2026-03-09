"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Wifi, Wind, Baby, Coffee, CreditCard, ShieldCheck, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { useBookingStore } from "@/store/useBookingStore";
import useEmblaCarousel from "embla-carousel-react";

const interiorImages = [
  "https://res.cloudinary.com/dcnwhciua/image/upload/v1772799821/625e27f6-4e60-4b98-a82b-59fda28c583c_ygkduq.jpg",
  "https://res.cloudinary.com/dcnwhciua/image/upload/v1772799813/WhatsApp_Image_2026-02-24_at_20.48.47_alltgr.jpg",
  "https://res.cloudinary.com/dcnwhciua/image/upload/v1772799814/WhatsApp_Image_2026-02-24_at_20.48.46_gwpc1z.jpg",
];

export const FeaturesShowcase = () => {
  const t = useTranslations("Features");
  const [view, setView] = useState<"exterior" | "interior">("exterior");
  const [interiorIndex, setInteriorIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { childSeat, minibar, toggleChildSeat, toggleMinibar } = useBookingStore();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [lightboxEmblaRef, lightboxEmblaApi] = useEmblaCarousel({ loop: true, startIndex: lightboxIndex });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setInteriorIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setInteriorIndex]);

  const onLightboxSelect = useCallback(() => {
    if (!lightboxEmblaApi) return;
    setLightboxIndex(lightboxEmblaApi.selectedScrollSnap());
  }, [lightboxEmblaApi, setLightboxIndex]);

  // Hook up event listeners for embla carousels
  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", onSelect);
      return () => { emblaApi.off("select", onSelect); };
    }
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (lightboxEmblaApi) {
      lightboxEmblaApi.on("select", onLightboxSelect);
      return () => { lightboxEmblaApi.off("select", onLightboxSelect); };
    }
  }, [lightboxEmblaApi, onLightboxSelect]);

  useEffect(() => {
    if (lightboxOpen && lightboxEmblaApi) {
      lightboxEmblaApi.scrollTo(lightboxIndex, true);
    }
  }, [lightboxOpen, lightboxEmblaApi, lightboxIndex]);

  const nextInterior = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const prevInterior = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const nextLightbox = useCallback(() => {
    if (lightboxEmblaApi) lightboxEmblaApi.scrollNext();
  }, [lightboxEmblaApi]);

  const prevLightbox = useCallback(() => {
    if (lightboxEmblaApi) lightboxEmblaApi.scrollPrev();
  }, [lightboxEmblaApi]);


  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };


  const features = [
    { id: "wifi", icon: Wifi, title: t("wifi"), isUpsell: false },
    { id: "climate", icon: Wind, title: t("climate"), isUpsell: false },
    { id: "childSeat", icon: Baby, title: t("childSeat"), isUpsell: true, active: childSeat, toggle: toggleChildSeat },
    { id: "minibar", icon: Coffee, title: t("minibar"), isUpsell: true, active: minibar, toggle: toggleMinibar },
    { id: "payment", icon: CreditCard, title: t("payment"), isUpsell: false },
    { id: "noHiddenFees", icon: ShieldCheck, title: t("noHiddenFees"), isUpsell: false },
  ];


  return (
    <section id="features" className="relative bg-[#FAFAFA] text-slate-900 py-16 md:py-24">
      <div className="flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full gap-12 lg:gap-20 px-4 md:px-8">

        {/* Left Side: Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex flex-col justify-center relative"
        >

          {/* View Toggles */}
          <div className="flex justify-center gap-4 mb-8 z-20 relative">
            <button
              onClick={() => setView("exterior")}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                view === "exterior"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {t("exterior")}
            </button>
            <button
              onClick={() => setView("interior")}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                view === "interior"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {t("interior")}
            </button>
          </div>

          <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[4/3] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {view === "exterior" ? (
                <motion.div
                  key="exterior"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
                >
                  {/* Halo glow behind the car */}
                  <div className="absolute w-[80%] h-[60%] bg-[#9A7B4F]/10 blur-[80px] rounded-full" />
                  <div className="relative w-full h-full z-10 flex items-center justify-center">
                    <Image
                      src="https://res.cloudinary.com/dcnwhciua/image/upload/v1772476361/Mercedes_V-Class_Mercedes-Benz_Viano_Mercedes-Benz_Vito_Mercedes-Benz_S-Class_Minivan_PNG-removebg-preview_jmtgkz.png"
                      alt="Mercedes Vito Exterior"
                      fill
                      className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] scale-110"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="interior"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col items-center justify-center w-[85%] mx-auto"
                >
                  <div className="relative w-full h-[85%] rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-white/60 bg-white">
                    <div className="overflow-hidden w-full h-full cursor-pointer" ref={emblaRef} onClick={() => openLightbox(interiorIndex)}>
                      <div className="flex h-full touch-pan-y">
                        {interiorImages.map((src, idx) => (
                          <div key={idx} className="flex-[0_0_100%] min-w-0 relative h-full">
                            <Image
                              src={src}
                              alt={`Mercedes Vito Interior ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              priority={idx === 0}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Gallery Controls outside the card */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between z-20 -mx-6 md:-mx-12 pointer-events-none">
                    <button
                      onClick={prevInterior}
                      className="p-3 rounded-full bg-white shadow-lg text-slate-800 hover:bg-slate-50 hover:text-slate-900 border border-slate-100 transition-all pointer-events-auto"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextInterior}
                      className="p-3 rounded-full bg-white shadow-lg text-slate-800 hover:bg-slate-50 hover:text-slate-900 border border-slate-100 transition-all pointer-events-auto"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>

                  {/* Gallery Dots below the card */}
                  <div className="absolute bottom-0 inset-x-0 flex justify-center gap-2 z-20 translate-y-8">
                    {interiorImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => emblaApi?.scrollTo(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          idx === interiorIndex ? "bg-slate-800 w-6" : "bg-slate-300 hover:bg-slate-400"
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Side: Features */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex items-center lg:py-12"
        >
          <div className="max-w-xl mx-auto lg:mx-0 w-full">
             <motion.div
               className="mb-12"
             >
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight tracking-wider uppercase text-slate-900">
                  Mercedes Benz <br />
                  <span>Vito</span>
                </h2>
                <div className="h-1 bg-slate-200 w-24 rounded-full" />
             </motion.div>

             <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
             >
               {features.map((feature) => (
                 <motion.button
                   key={feature.id}
                   variants={{
                     hidden: { opacity: 0, y: 30 },
                     visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                   }}
                   onClick={() => feature.isUpsell && feature.toggle && feature.toggle()}
                   className={`p-6 rounded-2xl bg-white border shadow-xl shadow-black/5 transition-all duration-300 group flex flex-col items-start gap-4 text-left w-full
                     ${feature.isUpsell
                        ? (feature.active ? "border-[#2F4157] bg-[#F4EFEB]/20" : "border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer")
                        : "border-slate-100 hover:border-slate-200 cursor-default"
                     }
                   `}
                 >
                    <div className={`p-3 rounded-xl border transition-transform duration-300 shadow-sm
                      ${feature.isUpsell && feature.active
                        ? "bg-[#2F4157] border-[#2F4157] scale-110"
                        : "bg-slate-50 border-slate-100 group-hover:scale-110"
                      }
                    `}>
                      {feature.isUpsell && feature.active ? (
                        <Check className="w-6 h-6 text-[#E2DED3] stroke-[2]" />
                      ) : (
                        <feature.icon className={`w-6 h-6 stroke-[1.5] ${feature.isUpsell ? "text-[#5D8093]" : "text-[#9A7B4F]"}`} />
                      )}
                    </div>
                    <p className={`font-medium transition-colors ${feature.isUpsell && feature.active ? "text-[#2F4157] font-semibold" : "text-slate-700 group-hover:text-slate-900"}`}>
                      {feature.title}
                    </p>
                 </motion.button>
               ))}
             </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm touch-none"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
            >
              <X size={28} />
            </button>

            <div className="w-full max-w-6xl mx-auto h-[80vh] relative flex items-center">
              <div className="overflow-hidden w-full h-full" ref={lightboxEmblaRef}>
                <div className="flex h-full items-center touch-pan-y">
                  {interiorImages.map((src, idx) => (
                    <div key={idx} className="flex-[0_0_100%] min-w-0 relative h-full flex items-center justify-center p-4">
                      <div className="relative w-full h-full max-h-full">
                        <Image
                          src={src}
                          alt={`Mercedes Vito Interior Fullscreen ${idx + 1}`}
                          fill
                          className="object-contain"
                          sizes="100vw"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lightbox Navigation */}
              <button
                onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
                className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
                className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
              >
                <ChevronRight size={32} />
              </button>

              {/* Lightbox Pagination */}
              <div className="absolute bottom-[-3rem] inset-x-0 flex justify-center gap-2 z-50">
                {interiorImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => lightboxEmblaApi?.scrollTo(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === lightboxIndex ? "bg-white w-6" : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
