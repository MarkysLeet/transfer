"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export type CarClass = "vw" | "vito";

interface CarClassSelectorProps {
  selectedClass: CarClass;
  onChange: (value: CarClass) => void;
}

export const CarClassSelector = ({ selectedClass, onChange }: CarClassSelectorProps) => {
  const t = useTranslations("BookingWidget");

  return (
    <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-2xl shadow-sm border border-slate-200/60 mx-auto w-full max-w-md relative z-40 mb-2">
      <button
        type="button"
        onClick={() => onChange("vw")}
        className={`flex-1 relative py-2.5 text-sm font-medium transition-colors z-10 rounded-xl ${
          selectedClass === "vw" ? "text-[#E2DED3]" : "text-[#2F4157] hover:bg-white/40"
        }`}
      >
        {selectedClass === "vw" && (
          <motion.div
            layoutId="carClassBg"
            className="absolute inset-0 bg-[#2F4157] rounded-xl shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] z-[-1]"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-20">{t("vwClass")}</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("vito")}
        className={`flex-1 relative py-2.5 text-sm font-medium transition-colors z-10 rounded-xl ${
          selectedClass === "vito" ? "text-[#E2DED3]" : "text-[#2F4157] hover:bg-white/40"
        }`}
      >
        {selectedClass === "vito" && (
          <motion.div
            layoutId="carClassBg"
            className="absolute inset-0 bg-[#2F4157] rounded-xl shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] z-[-1]"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-20">{t("vitoClass")}</span>
      </button>
    </div>
  );
};
