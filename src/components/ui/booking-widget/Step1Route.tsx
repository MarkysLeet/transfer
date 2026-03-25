import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, Calendar, Clock, ArrowUpDown } from "lucide-react";
import { useBookingStore } from "@/store/useBookingStore";
import { Combobox } from "../Combobox";
import { Button } from "../Button";
import { useState, useRef, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { CustomTimePicker } from "./CustomTimePicker";
import { CustomDatePicker } from "./CustomDatePicker";

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

  const handleSwap = () => {
    const tempFrom = from;
    const tempFromPlaceId = fromPlaceId;
    setFrom(to);
    setFromPlaceId(toPlaceId);
    setTo(tempFrom);
    setToPlaceId(tempFromPlaceId);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
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
      <div className="flex flex-col relative">
        <div className="w-full h-14 relative z-[60]">
          <Combobox
            id="pickup"
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

        {/* Swap Button */}
        <div className="absolute top-1/2 left-[calc(100%-3rem)] sm:left-[calc(100%-3.5rem)] -translate-y-1/2 z-[65] flex items-center justify-center pointer-events-none">
           <button
             type="button"
             onClick={handleSwap}
             className="w-8 h-8 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all pointer-events-auto active:scale-95"
             title="Swap locations"
           >
             <ArrowUpDown className="w-4 h-4" />
           </button>
        </div>

        <div className="w-full h-14 mt-3 relative z-50">
          <Combobox
            id="dropoff"
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1.5fr_1fr]">
        <div className="relative z-[46]">
          <CustomDatePicker
            value={date}
            onChange={setDate}
            icon={<Calendar className="w-5 h-5 text-white/70" />}
          />
        </div>
        <div className="relative z-[45]">
          <CustomTimePicker
             value={time}
             onChange={setTime}
             icon={<Clock className="w-5 h-5 text-white/70" />}
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
            className="overflow-visible"
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1.5fr_1fr] pt-1">
              <div className="relative z-[44]">
                <CustomDatePicker
                  value={returnDate}
                  onChange={setReturnDate}
                  icon={<Calendar className="w-5 h-5 text-white/70" />}
                />
              </div>
              <div className="relative z-40">
                <CustomTimePicker
                   value={returnTime}
                   onChange={setReturnTime}
                   icon={<Clock className="w-5 h-5 text-white/70" />}
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
