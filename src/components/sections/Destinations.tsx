"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Destinations = () => {
  const t = useTranslations("Destinations");

  const resortsList = t("resorts_desc").split(", ");
  const toursList = t("tours_desc").split(", ");

  return (
    <section className="py-20 md:py-32 bg-slate-900" id="routes">
      <div className="container mx-auto px-4 mb-12">
         <div className="text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold font-serif mb-4 text-white"
            >
              {t("title")}
            </motion.h2>
            <div className="h-1 bg-gold-400 w-24 rounded-full mx-auto md:mx-0" />
         </div>
      </div>

      <div className="container mx-auto px-4">
        <Tabs defaultValue="airports" className="w-full">
          <div className="overflow-x-auto pb-4 mb-4 scrollbar-hide snap-x">
            <TabsList className="bg-white/5 border border-white/10 text-slate-300 w-full justify-start md:justify-center p-1 inline-flex rounded-xl min-w-max">
              <TabsTrigger value="airports" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400 rounded-lg px-6 py-2 transition-all">
                {t("tab_airports")}
              </TabsTrigger>
              <TabsTrigger value="resorts" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400 rounded-lg px-6 py-2 transition-all">
                {t("tab_resorts")}
              </TabsTrigger>
              <TabsTrigger value="tours" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400 rounded-lg px-6 py-2 transition-all">
                {t("tab_tours")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="airports" className="mt-4 focus-visible:outline-none focus-visible:ring-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm"
            >
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                {t("airports_desc")}
              </p>
            </motion.div>
          </TabsContent>

          <TabsContent value="resorts" className="mt-4 focus-visible:outline-none focus-visible:ring-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {resortsList.map((resort, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-slate-300 hover:text-gold-400 hover:border-gold-400/20 transition-all">
                  <span className="font-light">{resort}</span>
                </div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="tours" className="mt-4 focus-visible:outline-none focus-visible:ring-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              {toursList.map((tour, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-slate-300 hover:text-gold-400 hover:border-gold-400/20 transition-all">
                  <span className="font-light">{tour}</span>
                </div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
