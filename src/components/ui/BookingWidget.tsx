"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { MapPin, Check, Plus } from "lucide-react";
import { Combobox } from "./Combobox";
import { useBookingStore } from "@/store/useBookingStore";

export const BookingWidget = () => {
  const t = useTranslations("BookingWidget");
  const tCities = useTranslations("Cities");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const { roundTrip, childSeat, minibar, toggleChildSeat, toggleMinibar, setRoundTrip } = useBookingStore();

  useEffect(() => {
    const handleSelectDestination = (e: CustomEvent<string>) => {
      setTo(e.detail);
    };
    window.addEventListener('selectDestination', handleSelectDestination as EventListener);
    return () => window.removeEventListener('selectDestination', handleSelectDestination as EventListener);
  }, []);

  const cities = [
    { value: "antalya", label: tCities("antalya") },
    { value: "istanbul", label: tCities("istanbul") },
    { value: "kemer", label: tCities("kemer") },
    { value: "belek", label: tCities("belek") },
    { value: "alanya", label: tCities("alanya") },
    { value: "side", label: tCities("side") },
    { value: "fethiye", label: tCities("fethiye") },
    { value: "bodrum", label: tCities("bodrum") },
    { value: "marmaris", label: tCities("marmaris") },
    { value: "cappadocia", label: tCities("cappadocia") },
  ];

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert(t("locateError"));
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setFrom(t("myLocation"));
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location", error);
        alert(t("locateError"));
        setIsLoadingLocation(false);
      }
    );
  };

  const handleFromChange = (val: string) => {
    setFrom(val);
    if (val !== t("myLocation")) {
      setCoords(null);
    }
  };

  const handleBook = () => {
    let message = "";

    const finalFrom = coords ? `https://maps.google.com/?q=${coords.lat},${coords.lng}` : from;

    if (finalFrom && to) {
      message = t("waBoth", { from: finalFrom, to });
    } else if (finalFrom) {
      message = t("waOnlyFrom", { from: finalFrom });
    } else if (to) {
      message = t("waOnlyTo", { to });
    }

    const options = [];
    if (roundTrip) options.push(t("roundTrip"));
    if (childSeat) options.push(t("childSeat"));
    if (minibar) options.push(t("minibar"));

    if (options.length > 0) {
      const optionsStr = options.join(", ");
      const detailsMsg = t("waDetails", {
        options: optionsStr,
      });
      message += `\n${detailsMsg}`;
    }

    const whatsappUrl = `https://wa.me/905418462550?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 relative z-50">
      {/* Container with Inputs (Glass) & Button (Outside) */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch relative z-50">
        {/* Main Glass Widget Container with Inputs */}
        <div className="flex-1 w-full h-14">
          <Combobox
            value={from}
            onChange={handleFromChange}
            placeholder={t("from")}
            options={cities}
            icon={<MapPin />}
            allowGeolocation={true}
            onGeolocationClick={handleGeolocation}
            isLoadingLocation={isLoadingLocation}
          />
        </div>
        <div className="flex-1 w-full h-14">
          <Combobox
            value={to}
            onChange={(val) => setTo(val)}
            placeholder={t("to")}
            options={cities}
            icon={<MapPin />}
          />
        </div>

        {/* Button Outside Glass Container */}
        <div className="w-full md:w-auto flex items-stretch">
          <Button
            onClick={handleBook}
            variant="primary"
            className="w-full md:w-auto h-14 px-10 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300"
          >
            {t("bookButton")}
          </Button>
        </div>
      </div>

      {/* Checkboxes Outside */}
      <div className="flex flex-wrap gap-2 md:gap-8 justify-center items-center relative z-40">
        <Checkbox
          label={t("roundTrip")}
          checked={roundTrip}
          onChange={() => setRoundTrip(!roundTrip)}
          outside
        />
        <Checkbox
          label={t("childSeat")}
          subtitle={"(" + t("free") + ")"}
          checked={childSeat}
          onChange={() => toggleChildSeat()}
          outside
        />
        <Checkbox
          label={t("minibar")}
          checked={minibar}
          onChange={() => toggleMinibar()}
          outside
        />
      </div>
    </div>
  );
};

const Checkbox = ({
  label,
  subtitle,
  checked,
  onChange,
  outside = false
}: {
  label: string;
  subtitle?: string;
  checked: boolean;
  onChange: () => void;
  outside?: boolean;
}) => {
  if (outside) {
    return (
      <button
        onClick={onChange}
        className={`flex items-center gap-1.5 md:gap-2 group focus:outline-none px-3 py-1.5 md:px-6 md:py-2.5 rounded-xl transition-all duration-300 ${
          checked
            ? "bg-[#2F4157] text-[#E2DED3] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]"
            : "bg-[#F4EFEB] text-[#2F4157] shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]"
        }`}
      >
        <div className="relative w-3 h-3 md:w-4 md:h-4 flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            {checked ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check strokeWidth={3} className="w-3 h-3 md:w-4 md:h-4 text-[#E2DED3]" />
              </motion.div>
            ) : (
              <motion.div
                key="plus"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Plus strokeWidth={3} className="w-3 h-3 md:w-4 md:h-4 text-[#2F4157]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-baseline gap-1 md:gap-1.5">
          <span className="text-xs md:text-sm font-medium">
            {label}
          </span>
          {subtitle && (
            <span className={`text-[10px] md:text-xs ${checked ? 'text-[#E2DED3]/80' : 'text-[#2F4157]/70'}`}>
              {subtitle}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onChange}
      className="flex items-center gap-3 group focus:outline-none"
    >
      <div
        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
          checked
            ? "bg-accent border-accent text-button-text"
            : "border-[#5D8093] text-transparent"
        }`}
      >
        <Check strokeWidth={3} className="w-3.5 h-3.5" />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
          {label}
        </span>
        {subtitle && (
          <span className="text-xs text-slate-400">{subtitle}</span>
        )}
      </div>
    </button>
  );
};