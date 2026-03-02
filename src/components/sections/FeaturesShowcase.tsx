"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Wifi, Wind, Baby, Coffee, CreditCard, ShieldCheck } from "lucide-react";

export const FeaturesShowcase = () => {
  const t = useTranslations("Features");

  const features = [
    { icon: Wifi, title: t("wifi") },
    { icon: Wind, title: t("climate") },
    { icon: Baby, title: t("childSeat") },
    { icon: Coffee, title: t("minibar") },
    { icon: CreditCard, title: t("payment") },
    { icon: ShieldCheck, title: t("noHiddenFees") },
  ];

  return (
    <section id="features" className="relative bg-slate-950 text-white min-h-screen">
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* Left Side: Sticky Image */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-0 h-[50vh] lg:h-screen">
          <div className="relative w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1569388330292-7a6a84165c6c?q=80&w=2070&auto=format&fit=crop"
              alt="Mercedes Vito Interior"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
          </div>
        </div>

        {/* Right Side: Scrollable Features */}
        <div className="w-full lg:w-1/2 flex items-center p-8 lg:p-20 py-20 lg:py-32">
          <div className="max-w-xl mx-auto lg:mx-0 w-full">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6 }}
               className="mb-12"
             >
                <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 leading-tight tracking-tight">
                  Mercedes Benz <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600">Vito Premium</span>
                </h2>
                <div className="h-1 bg-gold-400 w-24 rounded-full" />
             </motion.div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {features.map((feature, idx) => (
                 <motion.div
                   key={idx}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: "-50px" }}
                   transition={{ duration: 0.5, delay: idx * 0.1 }}
                   className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-gold-400/30 hover:bg-white/[0.04] transition-all duration-300 group flex flex-col items-start gap-4"
                 >
                    <div className="p-3 rounded-xl bg-slate-900 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-gold-400 stroke-[1.5]" />
                    </div>
                    <p className="font-medium text-slate-200 group-hover:text-white transition-colors">
                      {feature.title}
                    </p>
                 </motion.div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
