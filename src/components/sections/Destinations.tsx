"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export const Destinations = () => {
  const t = useTranslations("Destinations");
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, title: t("tabAirports") },
    { id: 1, title: t("tabResorts") },
    { id: 2, title: t("tabTours") },
  ];

  const contents = [
    {
      id: 0,
      text: t("airportsDesc"),
    },
    {
      id: 1,
      text: t("resortsDesc"),
    },
    {
      id: 2,
      text: t("toursDesc"),
    },
  ];

  return (
    <section id="destinations" className="py-20 md:py-32 bg-[#0F172A] overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-wider"
          >
            {t("title")}
          </motion.h2>
          <div className="h-1 bg-white/20 w-24 rounded-full mx-auto" />
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 mb-12">
          <div className="flex overflow-x-auto w-full md:w-auto p-1 rounded-full bg-[#111111]/50 border border-white/5 scrollbar-hide snap-x">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 md:px-8 py-3 rounded-full text-sm md:text-base font-medium transition-colors whitespace-nowrap snap-center ${
                  activeTab === tab.id ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-white/10 border border-white/20 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative min-h-[150px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-start justify-center text-center px-4"
            >
              <div className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-2xl max-w-3xl w-full">
                <p className="text-lg md:text-xl leading-relaxed text-slate-300 font-light">
                  {contents[activeTab].text}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
