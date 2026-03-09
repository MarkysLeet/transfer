"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/Button";

type CardData = { id: number; title: string; image: string; gallery: string[] };

export const Destinations = () => {
  const tDestinations = useTranslations("Destinations");
  const tCards = useTranslations("DestinationsCards");
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const cards: CardData[] = [
    {
      id: 1,
      title: tCards("cappadocia"),
      image: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=800&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1565134267718-4c28f7d98305?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=800&auto=format&fit=crop"
      ]
    },
    {
      id: 2,
      title: tCards("pamukkale"),
      image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1620802051705-ebcf742eb55b?q=80&w=800&auto=format&fit=crop"
      ]
    },
    {
      id: 3,
      title: tCards("fethiyeKemer"),
      image: "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?q=80&w=800&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542050212-9c16ebcb41fa?q=80&w=800&auto=format&fit=crop"
      ]
    },
  ];

  const handleSelect = () => {
    if (!selectedCard) return;
    const title = selectedCard.title;
    setSelectedCard(null);
    setGalleryIndex(0);
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
    setGalleryIndex(0);
  };

  const navigateGallery = (direction: 'next' | 'prev') => {
    if (!selectedCard) return;
    const maxIndex = selectedCard.gallery.length - 1;
    let newIndex = direction === 'next' ? galleryIndex + 1 : galleryIndex - 1;
    if (newIndex > maxIndex) newIndex = 0;
    if (newIndex < 0) newIndex = maxIndex;
    setGalleryIndex(newIndex);
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
            {/* Navigation Arrows Outside */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateCard('prev'); }}
              className="absolute left-4 md:left-12 z-50 text-slate-800 hover:text-slate-900 transition-colors hover:scale-110"
            >
              <ChevronLeft size={48} strokeWidth={1.5} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigateCard('next'); }}
              className="absolute right-4 md:right-12 z-50 text-slate-800 hover:text-slate-900 transition-colors hover:scale-110"
            >
              <ChevronRight size={48} strokeWidth={1.5} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCard.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              >
                <button
                  onClick={() => { setSelectedCard(null); setGalleryIndex(0); }}
                  className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/40 text-slate-800 hover:text-slate-900 hover:bg-white/80 transition-colors backdrop-blur-md shadow-sm"
                >
                  <X size={24} />
                </button>

                <div className="relative w-full h-64 md:h-80 shrink-0 overflow-hidden group">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={galleryIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(e, { offset, velocity }) => {
                        const swipe = Math.abs(offset.x) * velocity.x;
                        if (swipe < -100) {
                          navigateGallery('next');
                        } else if (swipe > 100) {
                          navigateGallery('prev');
                        }
                      }}
                      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                    >
                      <Image
                        src={selectedCard.gallery[galleryIndex]}
                        alt={`${selectedCard.title} - Image ${galleryIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Gallery Navigation Desktop */}
                  <button onClick={() => navigateGallery('prev')} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors backdrop-blur-sm hidden md:block opacity-0 group-hover:opacity-100">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={() => navigateGallery('next')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors backdrop-blur-sm hidden md:block opacity-0 group-hover:opacity-100">
                    <ChevronRight size={24} />
                  </button>

                  <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                </div>

                <div className="p-8 pt-0 -mt-8 relative z-10 flex-1 overflow-y-auto hide-scrollbar">
                  {/* Pagination Dots */}
                  <div className="flex justify-center gap-2 mb-6">
                    {selectedCard.gallery.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setGalleryIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === galleryIndex ? 'bg-accent w-4' : 'bg-slate-300'
                        }`}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>

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
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
