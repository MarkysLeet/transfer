
"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, X, MousePointerClick } from "lucide-react";
import { useLenis } from "lenis/react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/Button";

type DestinationCard = {
  id: string;
  title: string;
  image: string;
  images: string[];
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

  // Embla instance for the modal image gallery
  const [modalEmblaRef, modalEmblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });
  const [modalSelectedIndex, setModalSelectedIndex] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    if (!modalEmblaApi) return;
    const updateModalSelect = () => {
      setModalSelectedIndex(modalEmblaApi.selectedScrollSnap());
    };
    updateModalSelect();
    modalEmblaApi.on("select", updateModalSelect);
    modalEmblaApi.on("reInit", updateModalSelect);
  }, [modalEmblaApi]);

  // Reset modal image gallery index when selected card changes
  useEffect(() => {
    if (selectedCard) {
      setModalSelectedIndex(0);
      modalEmblaApi?.scrollTo(0, true);
    }
  }, [selectedCard, modalEmblaApi]);

  const tweenScale = useCallback(() => {
    if (!emblaApi) return;

    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const isScrollEvent = emblaApi.scrollSnapList().length > 0;

    if (!isScrollEvent) return;

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (emblaApi.slideNodes()[slideIndex] == null) return;

        // Ensure infinite loop values are correctly wrapped
        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();

            if (slideIndex === loopItem.index && target !== 0) {
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

        // Calculate dynamic scale and opacity
        const tweenValue = 1 - Math.abs(diffToTarget * 1.5); // Adjust multiplier to control falloff
        const scale = Math.max(0.8, Math.min(1, tweenValue));
        const opacity = Math.max(0.4, Math.min(1, tweenValue + 0.2));
        const zIndex = Math.round(scale * 100);

        const slideNode = emblaApi.slideNodes()[slideIndex];
        const innerCard = slideNode.querySelector('.embla-card-inner') as HTMLElement;
        if (innerCard) {
            innerCard.style.transform = `scale(${scale})`;
            innerCard.style.opacity = `${opacity}`;
            slideNode.style.zIndex = `${zIndex}`;

            // Apply drop shadow on the center card
            if (scale > 0.95) {
                innerCard.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
            } else {
                innerCard.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }
        }
      });
    });
  }, [emblaApi]);

  useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [selectedCard, lenis]);

  useEffect(() => {
    if (!emblaApi) return;

    const updateSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    updateSelect();
    tweenScale();

    emblaApi.on("select", updateSelect);
    emblaApi.on("scroll", tweenScale);
    emblaApi.on("reInit", tweenScale);

    // Request animation frame for smooth tweening during momentum scroll
    const onFrame = () => {
      if (!emblaApi.internalEngine().scrollBody.settled()) {
        tweenScale();
        requestAnimationFrame(onFrame);
      }
    };
    emblaApi.on("pointerUp", () => requestAnimationFrame(onFrame));

  }, [emblaApi, tweenScale]);

  const cards: DestinationCard[] = [
    {
      id: "cappadocia",
      title: tCards("cappadocia"),
      image: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=800&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1714675166166-4ee5150ab1c9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ]
    },
    {
      id: "pamukkale",
      title: tCards("pamukkale"),
      image: "https://images.unsplash.com/photo-1633282042122-fa4bb3646ce8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      images: [
        "https://images.unsplash.com/photo-1633282042122-fa4bb3646ce8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1433854471391-5603c019de62?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1720974613570-b19a22889b4d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ]
    },
    {
      id: "fethiye",
      title: tCards("fethiye"),
      image: "https://images.unsplash.com/photo-1698304685474-51e00e5bb4c2?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      images: [
        "https://images.unsplash.com/photo-1698304685474-51e00e5bb4c2?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1695036737908-acd0c97f7604?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1715079143750-55b29afd6ad6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ]
    },
    {
      id: "istanbul",
      title: tCards("istanbul"),
      image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1626956291772-3aa243614fd0?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1661962550248-59cf249e078b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ]
    },
    {
      id: "alanya",
      title: tCards("alanya"),
      image: "https://images.unsplash.com/photo-1736547316493-18e917fc4fdd?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      images: [
        "https://images.unsplash.com/photo-1736547316493-18e917fc4fdd?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1663338122129-d70bc4dd0d8e?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1713885637459-33fd40013531?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ]
    },
    {
      id: "bodrum",
      title: tCards("bodrum"),
      image: "https://images.unsplash.com/photo-1684858504602-677ac40eadfd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      images: [
        "https://images.unsplash.com/photo-1684858504602-677ac40eadfd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1600194795031-e8c60926db4f?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1583062482795-d2bef78e9bc1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ]
    },
    {
      id: "kemer",
      title: tCards("kemer"),
      image: "https://images.unsplash.com/photo-1668537901164-964d87c96976?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      images: [
        "https://images.unsplash.com/photo-1668537901164-964d87c96976?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1694605500374-c895eb93d38f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1730196568851-382fa149eaa3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ]
    }
  ];

  const handlePrevDestination = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCard) return;
    const currentIndex = cards.findIndex(c => c.id === selectedCard.id);
    const newIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
    setSelectedCard(cards[newIndex]);
  };

  const handleNextDestination = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCard) return;
    const currentIndex = cards.findIndex(c => c.id === selectedCard.id);
    const newIndex = currentIndex === cards.length - 1 ? 0 : currentIndex + 1;
    setSelectedCard(cards[newIndex]);
  };

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
                const isActive = index === selectedIndex;

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
                      className={`embla-card-inner relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer bg-white`}
                      style={{ willChange: "transform, opacity", transition: "transform 0.1s ease-out, opacity 0.1s ease-out, box-shadow 0.1s ease-out" }}
                    >
                      <div className="absolute inset-0">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover transition-transform duration-700 hover:scale-110"
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
            className="absolute -left-2 md:-left-10 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/80 hover:bg-white shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] border border-slate-100/50 text-slate-800 transition-all backdrop-blur-sm hidden md:flex items-center justify-center hover:scale-105"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute -right-2 md:-right-10 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/80 hover:bg-white shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] border border-slate-100/50 text-slate-800 transition-all backdrop-blur-sm hidden md:flex items-center justify-center hover:scale-105"
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedCard(null)}
          >
            <div className="absolute inset-0 bg-[#F4EFEB]/90 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-center w-full h-full">

              {/* Global Navigation - Previous */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevDestination(e);
                }}
                className="group absolute left-1 md:left-6 top-1/2 -translate-y-1/2 z-50 p-2 hover:scale-110 transition-transform duration-300"
              >
                <ChevronLeft size={36} strokeWidth={1.5} className="text-slate-800 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCard.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-visible flex flex-col max-h-[90vh] pb-4 md:pb-6 mb-6"
              >
                <button
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white text-slate-800 shadow-md hover:bg-slate-50 transition-all border border-slate-100"
                >
                  <X size={24} />
                </button>

                <div className="relative w-full h-64 md:h-80 shrink-0 overflow-hidden rounded-t-3xl group/gallery">
                  <div className="overflow-hidden h-full" ref={modalEmblaRef}>
                    <div className="flex h-full touch-pan-y">
                      {selectedCard.images?.map((imgSrc, idx) => (
                        <div className="flex-[0_0_100%] min-w-0 relative h-full" key={idx}>
                          <Image
                            src={imgSrc}
                            alt={`${selectedCard.title} ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                            priority={idx === 0}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subtle dark gradient for dot visibility */}
                  <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                  {/* Pagination Dots */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-50 pointer-events-auto">
                    {selectedCard.images?.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          modalEmblaApi?.scrollTo(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === modalSelectedIndex
                            ? "bg-white w-4"
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Optional desktop arrows for gallery (can be helpful) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      modalEmblaApi?.scrollPrev();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-black/40 md:flex hidden"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      modalEmblaApi?.scrollNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-black/40 md:flex hidden"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="p-8 pt-0 relative z-10 flex-1 overflow-y-auto hide-scrollbar">
                  <h3 className="text-3xl md:text-4xl font-bold !text-slate-900 mb-4 mt-4">
                    {selectedCard.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-8 whitespace-pre-line">
                    {tCards(`${selectedCard.id}Desc`)}
                  </p>
                </div>

                {/* 3D-effect CTA Button placed on bottom edge */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-50 w-full px-4 md:px-0 flex justify-center">
                  <Button size="lg" onClick={handleBookSelect} className="px-8 text-lg w-full md:w-auto shadow-xl">
                    {tCards("bookTransfer")} {selectedCard.title}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

              {/* Global Navigation - Next */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextDestination(e);
                }}
                className="group absolute right-1 md:right-6 top-1/2 -translate-y-1/2 z-50 p-2 hover:scale-110 transition-transform duration-300"
              >
                <ChevronRight size={36} strokeWidth={1.5} className="text-slate-800 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
