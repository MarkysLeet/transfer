"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2 } from "lucide-react";
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
      className={`relative p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur-sm border shadow-xl shadow-black/5 transition-all duration-300 group flex flex-col items-start gap-4 text-left w-full
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

  const currentInteriorImages = selectedClass === "vw" ? vwInteriorImages : vitoInteriorImages;
  const currentExteriorImage = selectedClass === "vw" ? vwExteriorImage : vitoExteriorImage;
  const currentCarTitle = selectedClass === "vw" ? ["VW", "Transporter"] : ["Mercedes Benz", "Vito"];

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
    <section id="features" className="relative bg-[#FAFAFA] text-slate-900">

      {/* Top Header - Mobile only, since Desktop uses absolute bottom tabs */}
      <div className="pt-16 md:pt-24 pb-8 lg:hidden">
        <div className="container mx-auto px-4">
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
            <div className="flex bg-white/80 backdrop-blur-md p-1 rounded-2xl shadow-sm border border-slate-200/60 mx-auto w-full max-w-md relative">
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
      </div>

      {/* =========================================
          DESKTOP CINEMATIC SNAP SLIDES (>=1024px)
          ========================================= */}
      <div className="hidden lg:block relative">

        {/* SLIDE 1: EXTERIOR */}
        <div className="h-screen w-full relative overflow-hidden flex items-center justify-center lg:snap-start">
          <div className="absolute inset-0 max-w-[1400px] mx-auto w-full px-8 flex items-center justify-center">

            {/* Background Title Overlay */}
            <div className="absolute top-[20%] left-10 opacity-30 pointer-events-none z-0">
               <h2 className="text-[8rem] font-bold leading-none tracking-tighter uppercase text-slate-300 whitespace-nowrap">
                  {currentCarTitle[0]}<br/>{currentCarTitle[1]}
               </h2>
            </div>

            {/* Car Exterior Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.5 }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              {/* Soft radial shadow under the car */}
              <div className="absolute top-[60%] w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/20 via-black/5 to-transparent blur-2xl rounded-full pointer-events-none" />

              <div className="relative w-[800px] h-[500px]">
                <Image
                  src={currentExteriorImage}
                  alt={`${currentCarTitle.join(" ")} Exterior`}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="50vw"
                  priority
                />
              </div>
            </motion.div>

            {/* Exterior Cards Animation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.5 }}
              className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center"
            >
              {/* Left Card */}
              <div className="absolute left-[5%] top-[30%] w-[300px] pointer-events-auto">
                <FeatureCard feature={exteriorFeatures[0]} minibarTooltipText={t("minibarTooltip")} />
              </div>
              {/* Right Top Card */}
              <div className="absolute right-[5%] top-[25%] w-[300px] pointer-events-auto">
                <FeatureCard feature={exteriorFeatures[1]} minibarTooltipText={t("minibarTooltip")} />
              </div>
              {/* Right Bottom Card */}
              <div className="absolute right-[10%] top-[60%] w-[300px] pointer-events-auto">
                <FeatureCard feature={exteriorFeatures[2]} minibarTooltipText={t("minibarTooltip")} />
              </div>
            </motion.div>

          </div>
        </div>

        {/* SLIDE 2: INTERIOR */}
        <div className="h-screen w-full relative overflow-hidden flex items-center justify-center lg:snap-start">
          <div className="absolute inset-0 max-w-[1400px] mx-auto w-full px-8 flex items-center justify-center">

            {/* Background Title Overlay */}
            <div className="absolute top-[20%] left-10 opacity-30 pointer-events-none z-0">
               <h2 className="text-[8rem] font-bold leading-none tracking-tighter uppercase text-slate-300 whitespace-nowrap">
                  {currentCarTitle[0]}<br/>{currentCarTitle[1]}
               </h2>
            </div>

            {/* Interior Photo Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.5 }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="relative w-[900px] h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/40">
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
                      sizes="60vw"
                    />
                  </motion.div>
                </AnimatePresence>
                {/* Dots indicator inside desktop interior slider */}
                <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 z-20">
                  {currentInteriorImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveInteriorSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-all shadow-sm ${
                        idx === activeInteriorSlide ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Interior Cards Animation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.5 }}
              className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center"
            >
               {/* Left Top Card */}
               <div className="absolute left-[2%] top-[20%] w-[300px] pointer-events-auto">
                <FeatureCard feature={interiorFeatures[0]} minibarTooltipText={t("minibarTooltip")} />
              </div>
              {/* Left Bottom Card */}
              <div className="absolute left-[5%] top-[65%] w-[300px] pointer-events-auto">
                <FeatureCard feature={interiorFeatures[1]} minibarTooltipText={t("minibarTooltip")} />
              </div>
              {/* Right Center Card */}
              <div className="absolute right-[2%] top-[45%] w-[300px] pointer-events-auto">
                <FeatureCard feature={interiorFeatures[2]} minibarTooltipText={t("minibarTooltip")} />
              </div>
            </motion.div>

            {/* Scroll Indicator (Quiet Luxury) */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              viewport={{ once: false }}
              className="absolute bottom-10 inset-x-0 flex flex-col items-center justify-center gap-2 pointer-events-none z-30"
            >
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-medium">Scroll</span>
              <div className="w-[1px] h-12 bg-slate-300 relative overflow-hidden">
                <motion.div
                  animate={{ y: [0, 48] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-x-0 top-0 h-4 bg-slate-600"
                />
              </div>
            </motion.div>

          </div>
        </div>

        {/* Floating Global Car Tabs (Desktop) */}
        <div className="fixed bottom-12 inset-x-0 flex justify-center z-50 pointer-events-none">
          <div className="flex bg-white/60 backdrop-blur-md rounded-full p-1.5 shadow-xl border border-white/40 pointer-events-auto">
            <button
              onClick={() => setSelectedClass("vw")}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedClass === "vw"
                  ? "bg-[#2F4157] text-[#E2DED3] shadow-md"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
              }`}
            >
              {tWidget("vwClassShort")}
            </button>
            <button
              onClick={() => setSelectedClass("vito")}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedClass === "vito"
                  ? "bg-[#2F4157] text-[#E2DED3] shadow-md"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
              }`}
            >
              {tWidget("vitoClassShort")}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          MOBILE & TABLET VERTICAL STACK (<1024px)
          ========================================= */}
      <div className="lg:hidden flex flex-col px-4 pb-20 gap-16">

        {/* Exterior Section */}
        <div className="flex flex-col gap-8">
          <div className="relative w-full aspect-[4/3] flex items-center justify-center">
             {/* Soft shadow */}
             <div className="absolute top-[65%] w-[80%] h-[40%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/20 via-black/5 to-transparent blur-xl rounded-full" />
             <Image
                src={currentExteriorImage}
                alt={`${currentCarTitle.join(" ")} Exterior`}
                fill
                className="object-contain drop-shadow-xl z-10"
                sizes="100vw"
                priority
              />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exteriorFeatures.map(f => <FeatureCard key={f.id} feature={f} minibarTooltipText={t("minibarTooltip")} />)}
          </div>
        </div>

        <div className="w-full h-px bg-slate-200" />

        {/* Interior Section */}
        <div className="flex flex-col gap-8">
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-white/60 bg-white">
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

            {/* Mobile Dots */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-20">
              {currentInteriorImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => emblaApi?.scrollTo(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all shadow-sm ${
                    idx === interiorIndex ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {interiorFeatures.map(f => <FeatureCard key={f.id} feature={f} minibarTooltipText={t("minibarTooltip")} />)}
          </div>
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
