import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, Calendar, Clock } from "lucide-react";
import { useBookingStore } from "@/store/useBookingStore";
import { Combobox } from "../Combobox";
import { Button } from "../Button";
import { useState, useRef, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";

const LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

export const Step1Route = ({ onNext }: { onNext: () => void }) => {
  const t = useTranslations("BookingWidget");
  const {
    roundTrip, setRoundTrip,
    from, setFrom, fromPlaceId, setFromPlaceId,
    to, setTo, toPlaceId, setToPlaceId,
    date, setDate, time, setTime,
    returnDate, setReturnDate, returnTime, setReturnTime,
    passengers, updatePassengers,
    setCoords,
  } = useBookingStore();

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isPassengersOpen, setIsPassengersOpen] = useState(false);
  const passengersRef = useRef<HTMLDivElement>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBIdr4O7lzMBsXWWTsxIT7P63UfT0oEYe4",
    libraries: LIBRARIES,
  });

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (passengersRef.current && !passengersRef.current.contains(event.target as Node)) {
        setIsPassengersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!date) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    }
  }, [date, setDate]);

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

  const isNextEnabled = from && to && date && time && (!roundTrip || (returnDate && returnTime));

  return (
    <div className="flex flex-col gap-6">
      {/* Trip Type Segmented Control */}
      <div className="bg-slate-200/50 p-1 rounded-xl flex items-center relative z-0">
        <button
          onClick={() => setRoundTrip(false)}
          className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-300 relative z-10 ${!roundTrip ? "text-slate-900 shadow-sm bg-white" : "text-slate-500 hover:text-slate-700"}`}
        >
          {t("oneWay")}
        </button>
        <button
          onClick={() => setRoundTrip(true)}
          className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-300 relative z-10 ${roundTrip ? "text-slate-900 shadow-sm bg-white" : "text-slate-500 hover:text-slate-700"}`}
        >
          {t("roundTrip")}
        </button>
      </div>

      {/* Locations */}
      <div className="flex flex-col gap-3">
        <div className="w-full h-14 relative z-[60]">
          <Combobox
            value={from}
            onChange={(val, placeId) => { setFrom(val); setFromPlaceId(placeId || ""); if (val !== t("myLocation")) setCoords(null); }}
            onClear={() => { setFrom(""); setFromPlaceId(""); setCoords(null); }}
            placeholder={t("from")}
            icon={<MapPin />}
            allowGeolocation={true}
            onGeolocationClick={handleGeolocation}
            isLoadingLocation={isLoadingLocation}
            isLoaded={isLoaded}
          />
        </div>
        <div className="w-full h-14 relative z-50">
          <Combobox
            value={to}
            onChange={(val, placeId) => { setTo(val); setToPlaceId(placeId || ""); }}
            onClear={() => { setTo(""); setToPlaceId(""); }}
            placeholder={t("to")}
            icon={<MapPin />}
            isLoaded={isLoaded}
          />
        </div>
      </div>

      {/* Date & Time */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none z-10" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-14 pl-10 pr-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] [color-scheme:dark]"
          />
        </div>
        <div className="w-1/3 relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none z-10" />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full h-14 pl-10 pr-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Return Date & Time (Round Trip only) */}
      <AnimatePresence>
        {roundTrip && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-3 pt-1">
              <div className="flex-1 relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none z-10" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full h-14 pl-10 pr-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] [color-scheme:dark]"
                />
              </div>
              <div className="w-1/3 relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none z-10" />
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full h-14 pl-10 pr-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] [color-scheme:dark]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Passengers Popover */}
      <div className="relative z-40" ref={passengersRef}>
        <button
          onClick={() => setIsPassengersOpen(!isPassengersOpen)}
          className="w-full h-14 px-4 bg-white/60 border border-slate-200/60 rounded-xl flex items-center gap-3 text-sm text-slate-900 transition-all focus:ring-2 focus:ring-accent/20"
        >
          <Users className="w-5 h-5 text-slate-400" />
          <span className="flex-1 text-left font-medium">
            {totalPassengers} {t("passengersCount")}
          </span>
        </button>

        <AnimatePresence>
          {isPassengersOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-slate-100 p-4 z-50 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900">{t("adults")}</div>
                  <div className="text-xs text-slate-500">12+ {t("years")}</div>
                </div>
                <Stepper value={passengers.adults} onChange={(v) => updatePassengers("adults", v)} min={1} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900">{t("children")}</div>
                  <div className="text-xs text-slate-500">2-12 {t("years")}</div>
                </div>
                <Stepper value={passengers.children} onChange={(v) => updatePassengers("children", v)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900">{t("infants")}</div>
                  <div className="text-xs text-slate-500">0-2 {t("years")}</div>
                </div>
                <Stepper value={passengers.infants} onChange={(v) => updatePassengers("infants", v)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Next Button */}
      <div className="lg:hidden mt-4">
        <Button
          onClick={onNext}
          disabled={!isNextEnabled}
          className="w-full h-14 rounded-xl"
          variant="primary"
        >
          {t("next")}
        </Button>
      </div>
    </div>
  );
};

const Stepper = ({ value, onChange, min = 0 }: { value: number; onChange: (v: number) => void; min?: number }) => (
  <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-100">
    <button
      onClick={() => value > min && onChange(value - 1)}
      disabled={value <= min}
      className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${value <= min ? "text-slate-300" : "bg-white shadow-sm text-slate-700 hover:text-slate-900"}`}
    >
      -
    </button>
    <span className="w-4 text-center text-sm font-medium text-slate-900">{value}</span>
    <button
      onClick={() => onChange(value + 1)}
      className="w-8 h-8 rounded-md bg-white shadow-sm flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors"
    >
      +
    </button>
  </div>
);
