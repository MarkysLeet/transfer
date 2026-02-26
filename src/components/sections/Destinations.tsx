"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const destinations = [
  {
    title: "Аэропорт Анталья - Кемер",
    image: "https://images.unsplash.com/photo-1622547748225-3fc4abd2d00d?q=80&w=2070&auto=format&fit=crop",
    price: "от 60 €",
  },
  {
    title: "Аэропорт Анталья - Аланья",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    price: "от 90 €",
  },
  {
    title: "Аэропорт Анталья - Белек",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2070&auto=format&fit=crop",
    price: "от 50 €",
  },
  {
    title: "Аэропорт Анталья - Сиде",
    image: "https://images.unsplash.com/photo-1635548166842-bf67bacbefaa?q=80&w=2070&auto=format&fit=crop",
    price: "от 70 €",
  },
];

export const Destinations = () => {
  return (
    <section className="py-20 md:py-32 bg-slate-900">
      <div className="container mx-auto px-4 mb-12">
         <div className="text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold font-serif mb-4 text-white"
            >
              Популярные направления
            </motion.h2>
            <div className="h-1 bg-gold-400 w-24 rounded-full mx-auto md:mx-0" />
         </div>
      </div>

      <div className="container mx-auto px-4 overflow-x-hidden"> {/* Limit container width */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide">
          {destinations.map((dest, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: index * 0.1 }}
               className="min-w-[280px] md:min-w-0 flex-shrink-0 snap-center rounded-2xl overflow-hidden bg-slate-800 shadow-lg group relative"
             >
               <div className="relative h-64 overflow-hidden">
                 <Image
                   src={dest.image}
                   alt={dest.title}
                   fill
                   className="object-cover group-hover:scale-110 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
                 <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{dest.title}</h3>
                    <p className="text-gold-400 font-medium">{dest.price}</p>
                 </div>
               </div>

               <div className="p-4">
                  <Button variant="outline" size="sm" className="w-full justify-between group-hover:bg-gold-400 group-hover:text-slate-900" onClick={() => window.open(`https://wa.me/905550000000?text=Здравствуйте, меня интересует трансфер ${dest.title}`, '_blank')}>
                    <span>Заказать</span>
                    <ArrowRight size={16} />
                  </Button>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
