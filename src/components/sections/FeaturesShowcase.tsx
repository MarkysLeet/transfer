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
  "https://storage.yandexcloud.net/arina-reels-storage/VW1.jpg",
  "https://storage.yandexcloud.net/arina-reels-storage/VW2.jpg",
  "https://storage.yandexcloud.net/arina-reels-storage/VW3.jpg"
];

const vitoExteriorImage = "https://res.cloudinary.com/dcnwhciua/image/upload/v1772476361/Mercedes_V-Class_Mercedes-Benz_Viano_Mercedes-Benz_Vito_Mercedes-Benz_S-Class_Minivan_PNG-removebg-preview_jmtgkz.png";
const vwExteriorImage = "https://res.cloudinary.com/dcnwhciua/image/upload/v1773342091/upscalemedia-transformed_ldctp0.png";

type CarClass = "vw" | "vito";
type ViewType = "exterior" | "interior";

// --- Extracted FeatureCard Component ---
const FeatureCard = ({ feature, className = "", minibarTooltipText }: { feature: any, className?: string, minibarTooltipText?: string }) => {
  const [minibarTooltipOpen, setMinibarTooltipOpen] = useState(false);
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

  return (
    <motion.button
      onClick={() => feature.isUpsell && feature.toggle && feature.toggle()}
      className={`relative p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur-sm border shadow-xl shadow-black/5 transition-all duration-300 group flex flex-col items-start gap-4 text-left w-full h-full
        ${feature.isUpsell
           ? (feature.active ? "border-[#2F4157] bg-[#F4EFEB]/30" : "border-slate-100/50 hover:border-slate-300 hover:bg-white cursor-pointer")
           : "border-slate-100/50 hover:border-slate-200 cursor-default bg-white/80"
        } ${className}
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
                   {minibarTooltipText}
                   <div className="absolute -bottom-[22px] right-1 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-900" />
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
         </div>
       )}
    </motion.button>
  );
};


export const FeaturesShowcase = () => {
  const t = useTranslations("Features");
  const tWidget = useTranslations("BookingWidget");
  const [selectedClass, setSelectedClass] = useState<CarClass>("vw");
  const [currentView, setCurrentView] = useState<ViewType>("exterior");

  const currentInteriorImages = selectedClass === "vw" ? vwInteriorImages : vitoInteriorImages;
  const currentExteriorImage = selectedClass === "vw" ? vwExteriorImage : vitoExteriorImage;
  const currentCarTitle = selectedClass === "vw" ? ["Volkswagen", "Transporter"] : ["Mercedes Benz", "Vito"];

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

  // Split features
  const exteriorFeatures = [
    { id: "childSeat", icon: Baby, title: t("childSeat"), isUpsell: true, active: childSeat, toggle: toggleChildSeat },
    { id: "noHiddenFees", icon: ShieldCheck, title: t("noHiddenFees"), isUpsell: false },
    { id: "wifi", icon: Wifi, title: t("wifi"), isUpsell: false },
  ];

  const interiorFeatures = [
    { id: "climate", icon: Wind, title: t("climate"), isUpsell: false },
    { id: "minibar", icon: Coffee, title: t("minibar"), isUpsell: true, active: minibar, toggle: toggleMinibar, hasTooltip: true },
    { id: "payment", icon: CreditCard, title: t("payment"), isUpsell: false },
  ];

  useEffect(() => {
    setInteriorIndex(0);
    if (emblaApi) emblaApi.scrollTo(0);
  }, [selectedClass, emblaApi]);

  const [activeInteriorSlide, setActiveInteriorSlide] = useState(0);

  // Auto-play interior slideshow on desktop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveInteriorSlide((prev) => (prev + 1) % currentInteriorImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [currentInteriorImages.length]);

  return (
    <section id="features" className="relative bg-[#FAFAFA] text-slate-900 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header Title (Shared) */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-wider"
          >
            {t("title") || "Our Fleet"}
          </motion.h2>
          <div className="h-1 bg-slate-200 w-24 rounded-full mx-auto" />
        </div>

        {/* =========================================
            DESKTOP LAYOUT (>= 1024px)
            ========================================= */}
        <div className="hidden lg:flex gap-12 min-h-[600px]">

          {/* Left Column - Visuals (~60%) */}
          <div className="w-3/5 flex flex-col justify-between">
            <div className="relative w-full flex-1 flex items-center justify-center rounded-3xl mb-8">
              <AnimatePresence mode="wait">
                {currentView === "exterior" ? (
                  <motion.div
                    key={`ext-${selectedClass}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {/* Soft Shadow */}
                    <div className="absolute top-[75%] w-[80%] h-[30%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/20 via-black/5 to-transparent blur-xl rounded-full pointer-events-none" />

                    <div className="relative w-full h-[400px]">
                      <Image
                        src={currentExteriorImage}
                        alt={`${currentCarTitle.join(" ")} Exterior`}
                        fill
                        className="object-contain drop-shadow-2xl"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        priority
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`int-${selectedClass}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60 bg-white">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeInteriorSlide}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={currentInteriorImages[activeInteriorSlide]}
                            alt={`${currentCarTitle.join(" ")} Interior`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 60vw"
                          />
                        </motion.div>
                      </AnimatePresence>
                      <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 z-20">
                        {currentInteriorImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveInteriorSlide(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all shadow-sm ${
                              idx === activeInteriorSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Apple-style Segmented Control (View Toggle) */}
            <div className="flex justify-center mt-auto">
              <div className="flex bg-slate-100/80 p-1.5 rounded-full shadow-inner border border-slate-200 w-full max-w-[400px]">
                <button
                  onClick={() => setCurrentView("exterior")}
                  className={`flex-1 relative py-2.5 text-sm font-semibold transition-colors z-10 rounded-full ${
                    currentView === "exterior" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {currentView === "exterior" && (
                    <motion.div
                      layoutId="viewToggleBgDesk"
                      className="absolute inset-0 bg-white rounded-full shadow-md z-[-1]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-20">{t("exterior")}</span>
                </button>
                <button
                  onClick={() => setCurrentView("interior")}
                  className={`flex-1 relative py-2.5 text-sm font-semibold transition-colors z-10 rounded-full ${
                    currentView === "interior" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {currentView === "interior" && (
                    <motion.div
                      layoutId="viewToggleBgDesk"
                      className="absolute inset-0 bg-white rounded-full shadow-md z-[-1]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-20">{t("interior")}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Information (~40%) */}
          <div className="w-2/5 flex flex-col justify-between">

            {/* Car Model Tabs */}
            <div className="flex flex-col gap-6">
              <div className="flex bg-slate-100/80 p-1.5 rounded-2xl shadow-inner border border-slate-200">
                <button
                  onClick={() => setSelectedClass("vw")}
                  className={`flex-1 relative py-3.5 text-sm font-semibold transition-colors z-10 rounded-xl ${
                    selectedClass === "vw" ? "text-slate-900" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
                >
                  {selectedClass === "vw" && (
                    <motion.div
                      layoutId="fleetClassBgDesk"
                      className="absolute inset-0 bg-white rounded-xl shadow-md z-[-1]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-20">{tWidget("vwClassShort")}</span>
                </button>
                <button
                  onClick={() => setSelectedClass("vito")}
                  className={`flex-1 relative py-3.5 text-sm font-semibold transition-colors z-10 rounded-xl ${
                    selectedClass === "vito" ? "text-slate-900" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
                >
                  {selectedClass === "vito" && (
                    <motion.div
                      layoutId="fleetClassBgDesk"
                      className="absolute inset-0 bg-white rounded-xl shadow-md z-[-1]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-20">{tWidget("vitoClassShort")}</span>
                </button>
              </div>

              {/* Large Selected Car Title */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedClass}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <h3 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                    <span className="block text-slate-400 text-xl font-medium mb-1">{currentCarTitle[0]}</span>
                    {currentCarTitle[1]}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Feature Cards Grid */}
            <div className="mt-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentView}-${selectedClass}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {(currentView === "exterior" ? exteriorFeatures : interiorFeatures).map((feature) => (
                    <div key={feature.id} className="min-h-[140px]">
                      <FeatureCard feature={feature} minibarTooltipText={t("minibarTooltip")} />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* =========================================
            MOBILE LAYOUT (< 1024px)
            ========================================= */}
        <div className="lg:hidden flex flex-col gap-8">

          {/* Car Class Tabs */}
          <div className="flex bg-slate-100/80 p-1.5 rounded-2xl shadow-inner border border-slate-200 max-w-md mx-auto w-full">
            <button
              onClick={() => setSelectedClass("vw")}
              className={`flex-1 relative py-3 text-sm font-semibold transition-colors z-10 rounded-xl ${
                selectedClass === "vw" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {selectedClass === "vw" && (
                <motion.div
                  layoutId="fleetClassBgMob"
                  className="absolute inset-0 bg-white rounded-xl shadow-md z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-20">{tWidget("vwClassShort")}</span>
            </button>
            <button
              onClick={() => setSelectedClass("vito")}
              className={`flex-1 relative py-3 text-sm font-semibold transition-colors z-10 rounded-xl ${
                selectedClass === "vito" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {selectedClass === "vito" && (
                <motion.div
                  layoutId="fleetClassBgMob"
                  className="absolute inset-0 bg-white rounded-xl shadow-md z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-20">{tWidget("vitoClassShort")}</span>
            </button>
          </div>

          <div className="text-center">
            <AnimatePresence mode="wait">
                <motion.h3
                  key={selectedClass}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-bold text-slate-900"
                >
                  <span className="block text-slate-500 text-sm font-medium mb-1 uppercase tracking-widest">{currentCarTitle[0]}</span>
                  {currentCarTitle[1]}
                </motion.h3>
            </AnimatePresence>
          </div>

          {/* Visual Area (Photo / Carousel) */}
          <div className="relative w-full aspect-[4/3] flex items-center justify-center rounded-3xl">
            <AnimatePresence mode="wait">
              {currentView === "exterior" ? (
                <motion.div
                  key={`ext-mob-${selectedClass}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Soft Shadow */}
                  <div className="absolute top-[75%] w-[80%] h-[30%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/20 via-black/5 to-transparent blur-xl rounded-full pointer-events-none" />

                  <div className="relative w-full h-[300px] sm:h-[400px]">
                    <Image
                      src={currentExteriorImage}
                      alt={`${currentCarTitle.join(" ")} Exterior`}
                      fill
                      className="object-contain drop-shadow-2xl"
                      sizes="100vw"
                      priority
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`int-mob-${selectedClass}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/60 bg-white">
                    <div className="overflow-hidden w-full h-full cursor-pointer" ref={emblaRef} onClick={() => openLightbox(interiorIndex)}>
                      <div className="flex h-full touch-pan-y">
                        {currentInteriorImages.map((src, idx) => (
                          <div key={idx} className="flex-[0_0_100%] min-w-0 relative h-full">
                            <Image
                              src={src}
                              alt={`${currentCarTitle.join(" ")} Interior ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="100vw"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Dots */}
                    <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-20 pointer-events-none">
                      {currentInteriorImages.map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-2.5 h-2.5 rounded-full transition-all shadow-sm ${
                            idx === interiorIndex ? "bg-white w-6" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Toggle (Segmented Control) */}
          <div className="flex bg-slate-100/80 p-1.5 rounded-full shadow-inner border border-slate-200 w-full max-w-sm mx-auto">
            <button
              onClick={() => setCurrentView("exterior")}
              className={`flex-1 relative py-2.5 text-sm font-semibold transition-colors z-10 rounded-full ${
                currentView === "exterior" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {currentView === "exterior" && (
                <motion.div
                  layoutId="viewToggleBgMob"
                  className="absolute inset-0 bg-white rounded-full shadow-md z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
                  <span className="relative z-20">{t("exterior")}</span>
            </button>
            <button
              onClick={() => setCurrentView("interior")}
              className={`flex-1 relative py-2.5 text-sm font-semibold transition-colors z-10 rounded-full ${
                currentView === "interior" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {currentView === "interior" && (
                <motion.div
                  layoutId="viewToggleBgMob"
                  className="absolute inset-0 bg-white rounded-full shadow-md z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
                  <span className="relative z-20">{t("interior")}</span>
            </button>
          </div>

          {/* Feature Cards Grid (2x2) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentView}-${selectedClass}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >
              {(currentView === "exterior" ? exteriorFeatures : interiorFeatures).map((feature) => (
                <div key={feature.id} className="min-h-[120px] sm:min-h-[140px]">
                  <FeatureCard feature={feature} minibarTooltipText={t("minibarTooltip")} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Lightbox Modal (Shared) */}
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
                className="absolute left-4 md:left-8 p-3 rounded-full bg-white shadow-md hover:bg-slate-50 border border-slate-100 text-slate-800 transition-colors z-50 hidden sm:block"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
                className="absolute right-4 md:right-8 p-3 rounded-full bg-white shadow-md hover:bg-slate-50 border border-slate-100 text-slate-800 transition-colors z-50 hidden sm:block"
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
