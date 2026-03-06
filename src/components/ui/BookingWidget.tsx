"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { MapPin, Calendar, Clock, ChevronDown, Check } from "lucide-react";
import { Combobox } from "./Combobox";

export const BookingWidget = () => {
  const t = useTranslations("BookingWidget");
  const tCities = useTranslations("Cities");
  const [showDetails, setShowDetails] = useState(false);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [roundTrip, setRoundTrip] = useState(false);
  const [childSeat, setChildSeat] = useState(false);
  const [minibar, setMinibar] = useState(false);

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

    if (date || time || options.length > 0) {
      const optionsStr = options.length > 0 ? options.join(", ") : "-";
      const detailsMsg = t("waDetails", {
        date: date || "-",
        time: time || "-",
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
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 rounded-3xl bg-white/50 backdrop-blur-3xl border border-white/60 shadow-2xl shadow-black/5">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Combobox
            value={to}
            onChange={(val) => setTo(val)}
            placeholder={t("to")}
            options={cities}
            icon={<MapPin />}
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <span>{t("addDetails")}</span>
            <motion.div
              animate={{ rotate: showDetails ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/40">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    placeholder={t("date")}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/70 focus:bg-white border border-white/60 focus:border-white focus:shadow-md rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-500 focus:outline-none transition-all duration-300 [color-scheme:light]"
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="time"
                    placeholder={t("time")}
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-white/70 focus:bg-white border border-white/60 focus:border-white focus:shadow-md rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-500 focus:outline-none transition-all duration-300 [color-scheme:light]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mt-6">
                <Checkbox
                  label={t("roundTrip")}
                  checked={roundTrip}
                  onChange={() => setRoundTrip(!roundTrip)}
                />
                <Checkbox
                  label={t("childSeat")}
                  subtitle={`(${t("free")})`}
                  checked={childSeat}
                  onChange={() => setChildSeat(!childSeat)}
                />
                <Checkbox
                  label={t("minibar")}
                  checked={minibar}
                  onChange={() => setMinibar(!minibar)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center mt-6">
          <Button onClick={handleBook} size="lg" className="w-full md:w-auto px-12">
            {t("bookButton")}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Checkbox = ({
  label,
  subtitle,
  checked,
  onChange,
}: {
  label: string;
  subtitle?: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className="flex items-center gap-3 group focus:outline-none"
  >
    <div
      className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
        checked
          ? "bg-slate-900 border-slate-900 text-white"
          : "border-slate-300 group-hover:border-slate-500 text-transparent"
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
