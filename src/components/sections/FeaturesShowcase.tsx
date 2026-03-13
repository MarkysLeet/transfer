"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Wifi, Wind, Baby, Coffee, CreditCard, ShieldCheck, ChevronLeft, ChevronRight, X, Check, Plus, Info } from "lucide-react";
import { useBookingStore } from "@/store/useBookingStore";
import useEmblaCarousel from "embla-carousel-react";

const vitoInteriorImages = [
  "https://res.cloudinary.com/dcnwhciua/image/upload/v1772799821/625e27f6-4e60-4b98-a82b-59fda28c583c_ygkduq.jpg",
  "https://res.cloudinary.com/dcnwhciua/image/upload/v1772799813/WhatsApp_Image_2026-02-24_at_20.48.47_alltgr.jpg",
  "https://res.cloudinary.com/dcnwhciua/image/upload/v1772799814/WhatsApp_Image_2026-02-24_at_20.48.46_gwpc1z.jpg",
];

const vwInteriorImages = [
  "https://res.cloudinary.com/dcnwhciua/image/upload/v1773342349/468308041_18464263342065049_6129014434542481614_n_roqojc.jpg",
  "https://res.cloudinary.com/dcnwhciua/image/upload/v1773342349/468338109_18464263204065049_6378178145718819133_n_ollq9p.jpg",
  "https://res.cloudinary.com/dcnwhciua/image/upload/v1773342350/468389469_18464262997065049_5677012176024068913_n_nsrxkv.jpg",
  "https://res.cloudinary.com/dcnwhciua/image/upload/v1773342351/468397680_18464263072065049_6334717953885968324_n_gl59fg.jpg"
];

const vitoExteriorImage = "https://res.cloudinary.com/dcnwhciua/image/upload/v1772476361/Mercedes_V-Class_Mercedes-Benz_Viano_Mercedes-Benz_Vito_Mercedes-Benz_S-Class_Minivan_PNG-removebg-preview_jmtgkz.png";
const vwExteriorImage = "https://res.cloudinary.com/dcnwhciua/image/upload/v1773342091/upscalemedia-transformed_ldctp0.png";

type CarClass = "vw" | "vito";

export const FeaturesShowcase = () => {
  const t = useTranslations("Features");
  const tWidget = useTranslations("BookingWidget");
  const [selectedClass, setSelectedClass] = useState<CarClass>("vw");
  const [view, setView] = useState<"exterior" | "interior">("exterior");

  const currentInteriorImages = selectedClass === "vw" ? vwInteriorImages : vitoInteriorImages;
  const currentExteriorImage = selectedClass === "vw" ? vwExteriorImage : vitoExteriorImage;
  const currentCarTitle = selectedClass === "vw" ? ["VW", "Transporter"] : ["Mercedes Benz", "Vito"];

  const [interiorIndex, setInteriorIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [minibarTooltipOpen, setMinibarTooltipOpen] = useState(false);

  const { childSeat, minibar, toggleChildSeat, toggleMinibar } = useBookingStore();
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setMinibarTooltipOpen(false);
      }
    };
    if (minibarTooltipOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [minibarTooltipOpen]);

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
    { id: "minibar", icon: Coffee, title: t("minibar"), isUpsell: true, active: minibar, toggle: toggleMinibar, hasTooltip: true },
    { id: "payment", icon: CreditCard, title: t("payment"), isUpsell: false },
    { id: "noHiddenFees", icon: ShieldCheck, title: t("noHiddenFees"), isUpsell: false },
  ];


  // Reset interior index when changing cars
  useEffect(() => {
    setInteriorIndex(0);
    if (emblaApi) emblaApi.scrollTo(0);
  }, [selectedClass, emblaApi]);

  return (
    <section id="features" className="relative bg-[#FAFAFA] text-slate-900 py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 tracking-wider"
          >
            {t("title") || "Our Fleet"}
          </motion.h2>
          <div className="h-1 bg-slate-200 w-24 rounded-full mx-auto mb-10" />

          {/* Car Class Selector Tab */}
          <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-2xl shadow-sm border border-slate-200/60 mx-auto w-full max-w-md relative z-40">
            <button
              type="button"
              onClick={() => setSelectedClass("vw")}
              className={`flex-1 relative py-3 text-sm font-medium transition-colors z-10 rounded-xl ${
                selectedClass === "vw" ? "text-[#E2DED3]" : "text-[#2F4157] hover:bg-white/40"
              }`}
            >
              {selectedClass === "vw" && (
                <motion.div
                  layoutId="fleetClassBg"
                  className="absolute inset-0 bg-[#2F4157] rounded-xl shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-20">{tWidget("vwClassShort")}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedClass("vito")}
              className={`flex-1 relative py-3 text-sm font-medium transition-colors z-10 rounded-xl ${
                selectedClass === "vito" ? "text-[#E2DED3]" : "text-[#2F4157] hover:bg-white/40"
              }`}
            >
              {selectedClass === "vito" && (
                <motion.div
                  layoutId="fleetClassBg"
                  className="absolute inset-0 bg-[#2F4157] rounded-xl shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-20">{tWidget("vitoClassShort")}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full gap-12 lg:gap-20 px-4 md:px-8">

        {/* Left Side: Image Gallery */}
        <motion.div
          key={selectedClass} // Force re-animation on car change
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
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
                  <div className="absolute w-[80%] h-[60%] bg-[#2F4157]/10 blur-[80px] rounded-full" />
                  <div className="relative w-full h-full z-10 flex items-center justify-center">
                    <Image
                      src={currentExteriorImage}
                      alt={`${currentCarTitle.join(" ")} Exterior`}
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
                        {currentInteriorImages.map((src, idx) => (
                          <div key={idx} className="flex-[0_0_100%] min-w-0 relative h-full">
                            <Image
                              src={src}
                              alt={`${currentCarTitle.join(" ")} Interior ${idx + 1}`}
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
                    {currentInteriorImages.map((_, idx) => (
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
               key={selectedClass}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className="mb-6"
             >
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight tracking-wider uppercase text-slate-900">
                  {currentCarTitle[0]} <br />
                  <span>{currentCarTitle[1]}</span>
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
                   className={`relative p-6 rounded-2xl bg-white border shadow-xl shadow-black/5 transition-all duration-300 group flex flex-col items-start gap-4 text-left w-full
                     ${feature.isUpsell
                        ? (feature.active ? "border-[#2F4157] bg-[#F4EFEB]/20" : "border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer")
                        : "border-slate-100 hover:border-slate-200 cursor-default"
                     }
                   `}
                 >
                    {feature.isUpsell && (
                      <div className="absolute top-4 right-4 text-[#2F4157] transition-colors">
                        <AnimatePresence mode="wait">
                          {feature.active ? (
                            <motion.div
                              key="check"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              <Check size={20} className="text-[#2F4157]" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="plus"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              <Plus size={20} className="text-[#2F4157]" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                    <div className={`p-3 rounded-xl border transition-transform duration-300 shadow-sm
                      ${feature.isUpsell && feature.active
                        ? "bg-[#2F4157] border-[#2F4157] scale-110"
                        : "bg-slate-50 border-slate-100 group-hover:scale-110"
                      }
                    `}>
                      {feature.isUpsell && feature.active ? (
                        <Check className="w-6 h-6 text-[#E2DED3] stroke-[2]" />
                      ) : (
                        <feature.icon className={`w-6 h-6 stroke-[1.5] ${feature.isUpsell ? "text-[#5D8093]" : "text-[#2F4157]"}`} />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className={`font-medium transition-colors ${feature.isUpsell && feature.active ? "text-[#2F4157] font-semibold" : "text-slate-700 group-hover:text-slate-900"}`}>
                        {feature.title}
                      </p>
                    </div>

                    {feature.hasTooltip && (
                      <div
                        ref={tooltipRef}
                        className="absolute bottom-4 right-4 z-20"
                        onMouseEnter={() => setMinibarTooltipOpen(true)}
                        onMouseLeave={() => setMinibarTooltipOpen(false)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMinibarTooltipOpen(!minibarTooltipOpen);
                        }}
                      >
                        <Info
                          size={20}
                          strokeWidth={1.5}
                          className={`cursor-pointer transition-colors ${feature.active ? "text-[#2F4157]" : "text-[#5D8093] hover:text-[#2F4157]"}`}
                        />
                        <AnimatePresence>
                          {minibarTooltipOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="absolute bottom-full right-0 mb-3 w-[280px] sm:w-[320px] bg-slate-900 text-[#E2DED3] text-sm p-4 rounded-2xl shadow-2xl"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="relative">
                                {t("minibarTooltip")}
                                <div className="absolute -bottom-[22px] right-1 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-900" />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F4EFEB] touch-none"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 rounded-full bg-white shadow-md hover:bg-slate-50 text-slate-800 transition-colors z-50"
            >
              <X size={28} />
            </button>

            <div className="w-full max-w-6xl mx-auto h-[80vh] relative flex items-center">
              <div className="overflow-hidden w-full h-full rounded-3xl shadow-xl bg-white/5" ref={lightboxEmblaRef}>
                <div className="flex h-full items-center touch-pan-y">
                  {currentInteriorImages.map((src, idx) => (
                    <div key={idx} className="flex-[0_0_100%] min-w-0 relative h-full flex items-center justify-center p-4">
                      <div className="relative w-full h-full max-h-full">
                        <Image
                          src={src}
                          alt={`${currentCarTitle.join(" ")} Interior Fullscreen ${idx + 1}`}
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
                className="absolute left-4 md:left-8 p-3 rounded-full bg-white shadow-md hover:bg-slate-50 border border-slate-100 text-slate-800 transition-colors z-50"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
                className="absolute right-4 md:right-8 p-3 rounded-full bg-white shadow-md hover:bg-slate-50 border border-slate-100 text-slate-800 transition-colors z-50"
              >
                <ChevronRight size={32} />
              </button>

              {/* Lightbox Pagination */}
              <div className="absolute bottom-[-3rem] inset-x-0 flex justify-center gap-2 z-50">
                {currentInteriorImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => lightboxEmblaApi?.scrollTo(idx)}
                    className={`h-2.5 rounded-full transition-all shadow-sm ${
                      idx === lightboxIndex ? "bg-slate-800 w-6" : "bg-slate-300 w-2.5 hover:bg-slate-400"
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
