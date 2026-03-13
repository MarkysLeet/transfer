
"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, X, MousePointerClick } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/Button";

type DestinationCard = {
  id: string;
  title: string;
  image: string;
};

export const Destinations = () => {
  const tDestinations = useTranslations("Destinations");
  const tCards = useTranslations("Destinations.Cards");
  const [selectedCard, setSelectedCard] = useState<DestinationCard | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tweenValues, setTweenValues] = useState<number[]>([]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;

    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) {
              diffToTarget = scrollSnap - (1 + scrollProgress);
            }
            if (sign === 1) {
              diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          }
        });
      }
      return Math.abs(diffToTarget);
    });
    setTweenValues(styles);
  }, [emblaApi, setTweenValues]);

  useEffect(() => {
    if (!emblaApi) return;

    const updateSelect = () => {
      setSelectedIndex((current) => {
        const next = emblaApi.selectedScrollSnap();
        return current === next ? current : next;
      });
    };

    onScroll();
    updateSelect();

    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
    emblaApi.on("select", updateSelect);
    emblaApi.on("reInit", updateSelect);
  }, [emblaApi, onScroll]);

  const cards: DestinationCard[] = [
    {
      id: "cappadocia",
      title: tCards("cappadocia"),
      image: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "pamukkale",
      title: tCards("pamukkale"),
      image: "https://images.unsplash.com/photo-1633282042122-fa4bb3646ce8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fethiye",
      title: tCards("fethiye"),
      image: "https://images.unsplash.com/photo-1698304685474-51e00e5bb4c2?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "istanbul",
      title: tCards("istanbul"),
      image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "alanya",
      title: tCards("alanya"),
      image: "https://images.unsplash.com/photo-1736547316493-18e917fc4fdd?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "bodrum",
      title: tCards("bodrum"),
      image: "https://images.unsplash.com/photo-1684858504602-677ac40eadfd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "kemer",
      title: tCards("kemer"),
      image: "https://images.unsplash.com/photo-1668537901164-964d87c96976?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  ];

  const handleBookSelect = () => {
    if (!selectedCard) return;
    const title = selectedCard.id; // Passing raw ID to sync with value in combobox better, but combobox uses "value" mapping.
    // Wait, the user said "To field auto populated with that specific city's name". Combobox value works best with raw ID/value.
    const rawValue = selectedCard.id === "fethiyeKemer" ? "fethiye" : selectedCard.id; // Just map it properly

    setSelectedCard(null);
    window.dispatchEvent(new CustomEvent('selectDestination', { detail: rawValue }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="destinations" className="py-20 md:py-32 bg-[#FAFAFA] overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-wider"
          >
            {tDestinations("title")}
          </motion.h2>
          <div className="h-1 bg-slate-200 w-24 rounded-full mx-auto" />
        </div>

        {/* Embla Cover Flow Carousel */}
        <div className="relative max-w-[1200px] mx-auto overflow-hidden py-24">
          <div
            className="overflow-visible"
            ref={emblaRef}
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
            }}
          >
            <div className="flex touch-pan-y -ml-4 md:-ml-6 items-center">
              {cards.map((card, index) => {
                const tweenValue = tweenValues.length > index ? tweenValues[index] : 0;
                const distance = Math.round(tweenValue * cards.length); // Rough distance estimation

                const isActive = index === selectedIndex;

                // Smooth scaling and opacity using tweenValue (which ranges 0-1 depending on distance from center)
                // Desktop Coverflow Logic: Center = 1, Distance 1 = ~0.9, >1 = 0.8
                const isCenter = tweenValue < 0.1;
                const isNearCenter = tweenValue >= 0.1 && tweenValue < 0.3;

                let desktopScale = "md:scale-80";
                let desktopZIndex = "md:z-0";
                let desktopOpacity = "md:opacity-40";

                if (isCenter) {
                  desktopScale = "md:scale-100";
                  desktopZIndex = "md:z-30";
                  desktopOpacity = "md:opacity-100 md:shadow-2xl";
                } else if (isNearCenter) {
                  desktopScale = "md:scale-90";
                  desktopZIndex = "md:z-20";
                  desktopOpacity = "md:opacity-70";
                }

                // Mobile/Tablet Coverflow Logic
                let mobileScale = "scale-90";
                let mobileZIndex = "z-10";
                let mobileOpacity = "opacity-50";

                if (isCenter) {
                  mobileScale = "scale-100";
                  mobileZIndex = "z-30";
                  mobileOpacity = "opacity-100 shadow-xl";
                }

                return (
                  <div
                    key={card.id}
                    className="flex-[0_0_65%] sm:flex-[0_0_50%] md:flex-[0_0_30%] lg:flex-[0_0_25%] min-w-0 pl-4 md:pl-6 relative"
                    onClick={() => {
                      if (isActive) {
                        setSelectedCard(card);
                      } else {
                        emblaApi?.scrollTo(index);
                      }
                    }}
                  >
                    <div
                      className={`relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer bg-white
                        ${mobileScale} ${desktopScale}
                        ${mobileZIndex} ${desktopZIndex}
                        ${mobileOpacity} ${desktopOpacity}
                        ${isActive ? "hover:scale-105 transition-transform duration-700" : ""}
                      `}
                    >
                      <div className="absolute inset-0">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover transition-transform duration-700 hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 transition-opacity duration-500 hover:opacity-90" />
                      <div className="absolute inset-0 flex flex-col justify-between p-8">
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                           {/* Empty or can add an icon */}
                        </div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl md:text-3xl font-bold !text-white tracking-wide">
                              {card.title}
                            </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white shadow-md hover:bg-slate-50 border border-slate-100 text-slate-800 transition-all hidden md:block"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white shadow-md hover:bg-slate-50 border border-slate-100 text-slate-800 transition-all hidden md:block"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCard(null)}
          >
            <div className="absolute inset-0 bg-[#F4EFEB]/90 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-center w-full h-full">

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCard.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <button
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white text-slate-800 shadow-md hover:bg-slate-50 transition-all border border-slate-100"
                >
                  <X size={24} />
                </button>

                <div className="relative w-full h-64 md:h-80 shrink-0 overflow-hidden">
                    <Image
                        src={selectedCard.image}
                        alt={selectedCard.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                </div>

                <div className="p-8 pt-0 -mt-8 relative z-10 flex-1 overflow-y-auto hide-scrollbar">
                  <h3 className="text-3xl md:text-4xl font-bold !text-slate-900 mb-4 mt-4">
                    {selectedCard.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-8 whitespace-pre-line">
                    {tCards(`${selectedCard.id}Desc`)}
                  </p>
                  <div className="flex justify-end mt-4">
                    <Button size="lg" onClick={handleBookSelect} className="px-8 text-lg w-full md:w-auto">
                      {tCards("bookTransfer")} {selectedCard.title}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
