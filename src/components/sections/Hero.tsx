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
          className="object-cover brightness-[0.4]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif mb-6 leading-tight text-white drop-shadow-lg"
        >
          Ваш премиальный трансфер <br className="hidden md:block" />
          <span className="text-gold-400">в Турции</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto drop-shadow-md font-medium"
        >
          Комфорт бизнес-класса на новом Mercedes Vito. Встреча в аэропорту, поездки по городам и экскурсии.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Button
            size="lg"
            className="animate-pulse shadow-[0_0_20px_rgba(212,175,55,0.5)]"
            onClick={() => window.open('https://wa.me/905550000000', '_blank')}
          >
            <MessageCircle className="mr-2" />
            Рассчитать стоимость
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
