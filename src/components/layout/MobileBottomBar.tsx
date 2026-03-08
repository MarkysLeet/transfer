"use client";
import { useState, useEffect } from "react";
import { Home, Map, Star, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export const MobileBottomBar = () => {
  const t = useTranslations("Navigation");
  const tDestinations = useTranslations("Destinations");
  const tLoyalty = useTranslations("Loyalty");
  const whatsappUrl = `https://wa.me/905418462550?text=${encodeURIComponent(t("whatsappMessage"))}`;

  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      const destinationsEl = document.getElementById("destinations");
      const loyaltyEl = document.getElementById("loyalty");

      if (loyaltyEl && scrollPos >= loyaltyEl.offsetTop) {
        setActiveTab("loyalty");
      } else if (destinationsEl && scrollPos >= destinationsEl.offsetTop) {
        setActiveTab("destinations");
      } else {
        setActiveTab("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 md:hidden pb-safe">
      <div className="flex justify-around items-center px-2 py-3">
        <button
          onClick={() => scrollToSection("home")}
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${
            activeTab === "home" ? "text-slate-900" : "text-slate-400"
          }`}
        >
          <Home size={22} className={activeTab === "home" ? "fill-slate-900/10" : ""} />
          <span className="text-[10px] font-medium tracking-wide">Home</span>
        </button>

        <button
          onClick={() => scrollToSection("destinations")}
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${
            activeTab === "destinations" ? "text-slate-900" : "text-slate-400"
          }`}
        >
          <Map size={22} className={activeTab === "destinations" ? "fill-slate-900/10" : ""} />
          <span className="text-[10px] font-medium tracking-wide">Routes</span>
        </button>

        <button
          onClick={() => scrollToSection("loyalty")}
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${
            activeTab === "loyalty" ? "text-slate-900" : "text-slate-400"
          }`}
        >
          <Star size={22} className={activeTab === "loyalty" ? "fill-slate-900/10" : ""} />
          <span className="text-[10px] font-medium tracking-wide">Club</span>
        </button>

        <button
          onClick={() => window.open(whatsappUrl, "_blank")}
          className="flex flex-col items-center gap-1 w-16 transition-colors text-emerald-600"
        >
          <MessageCircle size={22} className="fill-emerald-600/10" />
          <span className="text-[10px] font-medium tracking-wide">WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
