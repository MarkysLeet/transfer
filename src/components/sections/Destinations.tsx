"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/Button";

type CardData = { id: number; title: string; image: string; };

export const Destinations = () => {
  const tDestinations = useTranslations("Destinations");
  const tCards = useTranslations("DestinationsCards");
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  const cards: CardData[] = [
    {
      id: 1,
      title: tCards("cappadocia"),
      image: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=800&auto=format&fit=crop", // Moody Cappadocia
    },
    {
      id: 2,
      title: tCards("pamukkale"),
      image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop", // Pamukkale sunset
    },
    {
      id: 3,
      title: tCards("fethiyeKemer"),
      image: "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?q=80&w=800&auto=format&fit=crop", // Fethiye dark coast
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

        <div className="flex md:grid flex-nowrap md:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory overflow-x-auto md:overflow-visible pb-8 md:pb-0 hide-scrollbar">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onClick={() => setSelectedCard(card)}
              className="relative rounded-3xl overflow-hidden aspect-[3/4] min-w-[280px] snap-center group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500 bg-white"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Gradient Overlay - Only at the bottom for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />

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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-xl"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Controls Overlay */}
              <div className="absolute inset-x-0 top-1/3 -translate-y-1/2 flex justify-between px-4 z-20 pointer-events-none">
                <button
                  onClick={() => navigateCard('prev')}
                  className="p-3 rounded-full bg-white/40 text-slate-800 hover:text-slate-900 hover:bg-white/80 transition-colors backdrop-blur-md shadow-sm pointer-events-auto"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => navigateCard('next')}
                  className="p-3 rounded-full bg-white/40 text-slate-800 hover:text-slate-900 hover:bg-white/80 transition-colors backdrop-blur-md shadow-sm pointer-events-auto"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/40 text-slate-800 hover:text-slate-900 hover:bg-white/80 transition-colors backdrop-blur-md shadow-sm"
              >
                <X size={24} />
              </button>

              <div className="relative w-full h-64 md:h-80 shrink-0">
                <Image
                  src={selectedCard.image}
                  alt={selectedCard.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
              </div>

              <div className="p-8 pt-0 -mt-12 relative z-10 flex-1 overflow-y-auto">
                <h3 className="text-3xl md:text-4xl font-bold !text-slate-900 mb-4">
                  {selectedCard.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-8">
                  {tCards("placeholderDesc")}
                </p>
                <div className="flex justify-end">
                  <Button size="lg" onClick={handleSelect}>
                    {tCards("select")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
