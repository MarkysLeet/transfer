"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/Button";

type CardData = { id: number; key: string; title: string; images: string[]; };

export const Destinations = () => {
  const tDestinations = useTranslations("Destinations");
  const tCards = useTranslations("DestinationsCards");
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const cards: CardData[] = [
    {
      id: 1,
      key: "antalya",
      title: tCards("antalya"),
      images: [
        "https://images.unsplash.com/photo-1589030343991-69ea1433b941?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1586202476532-6804a9af3e3c?q=80&w=800&auto=format&fit=crop"
      ],
    },
    {
      id: 2,
      key: "cappadocia",
      title: tCards("cappadocia"),
      images: [
        "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1527635676239-2ce1b1eeb36e?q=80&w=800&auto=format&fit=crop"
      ],
    },
    {
      id: 3,
      key: "pamukkale",
      title: tCards("pamukkale"),
      images: [
        "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580193183574-8b63e803c739?q=80&w=800&auto=format&fit=crop"
      ],
    },
  ];

  const handleSelect = () => {
    if (!selectedCard) return;
    const title = selectedCard.title;
    setSelectedCard(null);
    window.dispatchEvent(new CustomEvent('selectDestination', { detail: title }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateCard = (direction: 'next' | 'prev') => {
    if (!selectedCard) return;
    const currentIndex = cards.findIndex(c => c.id === selectedCard.id);
    if (currentIndex === -1) return;

    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= cards.length) newIndex = 0;
    if (newIndex < 0) newIndex = cards.length - 1;

    setSelectedCard(cards[newIndex]);
    setCurrentImageIndex(0);
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    if (!selectedCard) return;
    let newIndex = direction === 'next' ? currentImageIndex + 1 : currentImageIndex - 1;
    if (newIndex >= selectedCard.images.length) newIndex = 0;
    if (newIndex < 0) newIndex = selectedCard.images.length - 1;
    setCurrentImageIndex(newIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) navigateImage('next');
    if (isRightSwipe) navigateImage('prev');

    setTouchStart(null);
    setTouchEnd(null);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

        <div className="flex flex-nowrap md:flex-row gap-6 md:gap-4 snap-x snap-mandatory overflow-x-auto md:overflow-visible pb-8 md:pb-0 hide-scrollbar h-[500px]">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onClick={() => setSelectedCard(card)}
              className="relative rounded-3xl overflow-hidden min-w-[280px] md:min-w-0 flex-1 md:flex-[1] md:hover:flex-[1.5] snap-center group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-700 ease-in-out bg-white"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={card.images[0]}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Gradient Overlay - Only at the bottom for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-8">
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-2 border border-white/30 text-white">
                    <MousePointerClick size={20} />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold !text-white tracking-wide transition-transform duration-500 group-hover:-translate-y-2">
                  {card.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-md"
            onClick={() => setSelectedCard(null)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCard.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh]"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors backdrop-blur-md"
                >
                  <X size={24} />
                </button>

                {/* Gallery Section */}
                <div
                  className="relative w-full h-72 md:h-[400px] shrink-0 overflow-hidden bg-slate-100"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={selectedCard.images[currentImageIndex]}
                        alt={`${selectedCard.title} - ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />

                  {/* Desktop Gallery Arrows */}
                  <button
                    onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                    className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-white/30 text-white hover:bg-white/50 hover:text-slate-900 transition-all backdrop-blur-md"
                  >
                    <ChevronLeft size={32} strokeWidth={2} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                    className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-white/30 text-white hover:bg-white/50 hover:text-slate-900 transition-all backdrop-blur-md"
                  >
                    <ChevronRight size={32} strokeWidth={2} />
                  </button>

                  {/* Mobile Pagination Dots */}
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-40 md:hidden">
                    {selectedCard.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentImageIndex === idx ? 'bg-white w-4' : 'bg-white/50'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-10 pt-4 md:pt-6 relative z-10 flex-1 overflow-y-auto hide-scrollbar flex flex-col">
                  {/* Global Card Navigation Arrows - Desktop Only */}
                  <div className="hidden md:flex absolute top-10 right-10 gap-2">
                     <button
                        onClick={(e) => { e.stopPropagation(); navigateCard('prev'); }}
                        className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigateCard('next'); }}
                        className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        <ChevronRight size={24} />
                      </button>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 pr-24">
                    {selectedCard.title}
                  </h3>
                  <div className="text-slate-600 leading-relaxed mb-8 flex-1 text-base md:text-lg">
                     {tCards(`${selectedCard.key}Desc`)}
                  </div>

                  <div className="flex justify-end mt-auto pt-4 border-t border-slate-100">
                    <Button size="lg" onClick={handleSelect} className="w-full md:w-auto px-10">
                      {tCards("select")}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
