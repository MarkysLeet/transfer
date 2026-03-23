"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { useBookingStore } from "@/store/useBookingStore";
import { ChevronRight } from "lucide-react";

export const BookingWidget = () => {
  const t = useTranslations("BookingWidget");
  const { setIsOpen } = useBookingStore();

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-4 relative z-50 mt-12">
      <div className="w-full">
        <Button
          onClick={() => setIsOpen(true)}
          variant="primary"
          className="w-full h-16 md:h-18 px-10 rounded-2xl flex items-center justify-center gap-3 text-lg md:text-xl font-medium shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:scale-[1.02] hover:opacity-95 transition-all duration-300 group"
        >
          {t("bookButton")}
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <span className="text-sm md:text-base text-white/90 font-medium tracking-wide drop-shadow-md">
        {t("trustMessage")}
      </span>
    </div>
  );
};
