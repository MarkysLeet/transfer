"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const Destinations = () => {
  const tDestinations = useTranslations("Destinations");
  const tCards = useTranslations("DestinationsCards");

  const cards = [
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

  return (
    <section id="destinations" className="py-20 md:py-32 bg-[#0F172A] overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-wider"
          >
            {tDestinations("title")}
          </motion.h2>
          <div className="h-1 bg-white/20 w-24 rounded-full mx-auto" />
        </div>

        <div className="flex md:grid flex-nowrap md:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory overflow-x-auto md:overflow-visible pb-8 md:pb-0 hide-scrollbar">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative rounded-3xl overflow-hidden aspect-[4/5] min-w-[280px] snap-center group cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-80" />

              {/* Content */}
              <div className="absolute inset-0 flex items-end p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                  {card.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
