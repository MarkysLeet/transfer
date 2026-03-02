"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1549144511-30052825ac38?q=80&w=2070&auto=format&fit=crop"
          alt="Turkey VIP Transfer"
          fill
          className="object-cover scale-105 animate-[slow-zoom_20s_ease-in-out_infinite_alternate]"
          priority
        />
        <div className="absolute inset-0 bg-slate-950/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/80" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-sm font-medium text-slate-200 tracking-wider uppercase">Premium Service</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold font-serif mb-6 leading-[1.1] text-white tracking-tight"
        >
          Ваш премиальный <br className="hidden md:block" />
          трансфер <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500">в Турции</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Комфорт бизнес-класса на новом Mercedes Vito. Встреча в аэропорту, поездки по городам и экскурсии.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Button
            size="lg"
            className="group"
            onClick={() => window.open('https://wa.me/905550000000', '_blank')}
          >
            <MessageCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Рассчитать стоимость
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
