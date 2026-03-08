"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { MapPin, Check } from "lucide-react";
import { Combobox } from "./Combobox";

export const BookingWidget = () => {
  const t = useTranslations("BookingWidget");
  const tCities = useTranslations("Cities");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
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

    if (options.length > 0) {
      const optionsStr = options.join(", ");
      const detailsMsg = t("waDetails", {
        date: "-",
        time: "-",
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
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-4 md:items-stretch">
      {/* Main Glass Widget Container */}
      <div className="flex-1 p-6 md:p-8 rounded-3xl bg-white/50 backdrop-blur-3xl border border-white/60 shadow-2xl shadow-black/5">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="flex-1">
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
            <div className="flex-1">
              <Combobox
                value={to}
                onChange={(val) => setTo(val)}
                placeholder={t("to")}
                options={cities}
                icon={<MapPin />}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6 pt-2">
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
        </div>
      </div>

      {/* Book Button (Outside Widget) */}
      <div className="flex md:flex-col justify-end">
        <Button onClick={handleBook} variant="outline" size="sm" className="w-full md:w-auto h-auto min-h-[44px] md:h-full px-6 py-2 rounded-full font-medium transition-transform shadow-none bg-transparent backdrop-blur-none border-white/50 text-white hover:bg-white/10 flex items-center justify-center gap-2">
          {t("bookButton")}
        </Button>
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
