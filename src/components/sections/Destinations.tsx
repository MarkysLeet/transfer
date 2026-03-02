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
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: index * 0.1 }}
               className="min-w-[280px] md:min-w-0 flex-shrink-0 snap-center rounded-3xl overflow-hidden bg-white/[0.02] border border-white/5 shadow-2xl group relative backdrop-blur-sm hover:border-gold-400/30 transition-colors duration-500 flex flex-col h-full"
             >
               <div className="relative h-64 md:h-72 overflow-hidden rounded-t-3xl">
                 <Image
                   src={dest.image}
                   alt={dest.title}
                   fill
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                   className="object-cover group-hover:scale-110 transition-transform duration-[8s] ease-out"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight drop-shadow-md">{dest.title}</h3>
                    <div className="inline-block px-3 py-1 rounded-full bg-gold-400/20 backdrop-blur-md border border-gold-400/30">
                       <p className="text-gold-400 font-semibold text-sm">{dest.price}</p>
                    </div>
                 </div>
               </div>

               <div className="p-6 mt-auto">
                  <Button variant="outline" size="sm" className="w-full justify-between group-hover:bg-gold-400 group-hover:text-slate-950 transition-all duration-300" onClick={() => window.open(`https://wa.me/905550000000?text=Здравствуйте, меня интересует трансфер ${dest.title}`, '_blank')}>
                    <span className="font-semibold tracking-wide">Заказать</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
