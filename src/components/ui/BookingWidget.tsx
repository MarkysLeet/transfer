"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { MapPin, Check, Plus } from "lucide-react";
import { Combobox } from "./Combobox";
import { useBookingStore } from "@/store/useBookingStore";
import { CarClassSelector, CarClass } from "./CarClassSelector";
import { useLoadScript } from "@react-google-maps/api";

const LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

export const BookingWidget = () => {
  const t = useTranslations("BookingWidget");
  const tCities = useTranslations("Cities");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromPlaceId, setFromPlaceId] = useState("");
  const [toPlaceId, setToPlaceId] = useState("");
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedClass, setSelectedClass] = useState<CarClass>("vito");
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState(false);

  // Debounced values for Distance Matrix API
  const [debouncedFrom, setDebouncedFrom] = useState("");
  const [debouncedTo, setDebouncedTo] = useState("");


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFrom(from);
      setDebouncedTo(to);
    }, 500);
    return () => clearTimeout(timer);
  }, [from, to]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBIdr4O7lzMBsXWWTsxIT7P63UfT0oEYe4",
    libraries: LIBRARIES,
  });

  const { roundTrip, childSeat, minibar, toggleChildSeat, toggleMinibar, setRoundTrip } = useBookingStore();


  useEffect(() => {
    const handleSelectDestination = (e: CustomEvent<string>) => {
      setTo(e.detail);
      setToPlaceId("");
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


  useEffect(() => {
    if (!debouncedFrom || !debouncedTo || !isLoaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEstimatedPrice(null);
      setPriceError(false);
      return;
    }

    // Use Distance Matrix for all calculations
    setIsPriceLoading(true);
    setPriceError(false);

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [fromPlaceId ? { placeId: fromPlaceId } : debouncedFrom],
        destinations: [toPlaceId ? { placeId: toPlaceId } : debouncedTo],
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        setIsPriceLoading(false);
        if (status === "OK" && response && response.rows[0].elements[0].status === "OK") {
          const distanceInKm = response.rows[0].elements[0].distance.value / 1000;
          let calculatedPrice = 0;
          if (selectedClass === "vw") {
            calculatedPrice = Math.max(30, Math.round(24 + (distanceInKm * 0.37)));
          } else {
            calculatedPrice = Math.max(30, Math.round(34 + (distanceInKm * 0.37)));
          }
          setEstimatedPrice(calculatedPrice);
        } else {
          // eslint-disable-next-line react-hooks/set-state-in-effect
      setEstimatedPrice(null);
          setPriceError(true);
        }
      }
    );

  }, [debouncedFrom, debouncedTo, fromPlaceId, toPlaceId, selectedClass, isLoaded]);

  const handleFromChange = (val: string, placeId?: string) => {
    setFrom(val);
    setFromPlaceId(placeId || "");
    if (val !== t("myLocation")) {
      setCoords(null);
    }
  };

  const handleToChange = (val: string, placeId?: string) => {
    setTo(val);
    setToPlaceId(placeId || "");
  };

  const handleClearFrom = () => {
    setFrom("");
    setFromPlaceId("");
    setCoords(null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
      setEstimatedPrice(null);
  };

  const handleClearTo = () => {
    setTo("");
    setToPlaceId("");
    // eslint-disable-next-line react-hooks/set-state-in-effect
      setEstimatedPrice(null);
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

    if (selectedClass) {
      const carClassName = selectedClass === "vw" ? "Volkswagen Transporter" : "MB Vito";
      message += `\nClass: ${carClassName}`;
    }

    if (estimatedPrice) {
      message += `\nPrice: €${estimatedPrice}`;
    }

    const whatsappUrl = `https://wa.me/905418462550?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 relative z-50">
      <CarClassSelector selectedClass={selectedClass} onChange={setSelectedClass} />

      {/* Container with Inputs (Glass) & Button (Outside) */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch relative z-50">
        {/* Main Glass Widget Container with Inputs */}
        <div className="flex-1 w-full h-14">
          <Combobox
            value={from}
            onChange={handleFromChange}
            onClear={handleClearFrom}
            placeholder={t("from")}
            icon={<MapPin />}
            allowGeolocation={true}
            onGeolocationClick={handleGeolocation}
            isLoadingLocation={isLoadingLocation}
            isLoaded={isLoaded}
          />
        </div>
        <div className="flex-1 w-full h-14">
          <Combobox
            value={to}
            onChange={handleToChange}
            onClear={handleClearTo}
            placeholder={t("to")}
            icon={<MapPin />}
            isLoaded={isLoaded}
          />
        </div>

        {/* Button Outside Glass Container */}
        <div className="w-full md:w-auto flex flex-col items-center md:items-stretch gap-2">
          <Button
            onClick={handleBook}
            variant="primary"
            className="w-full h-14 px-10 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300"
          >
            {t("bookButton")}
          </Button>
          <span className="text-xs text-slate-500 font-medium tracking-wide">
            {t("trustMessage")}
          </span>
        </div>
      </div>

      {/* Price Display */}
      <AnimatePresence>
        {(estimatedPrice || priceError || isPriceLoading) && from && to && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-center -mt-2 mb-2"
          >
            <div className="bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-2xl shadow-sm border border-slate-200/50 flex items-center gap-2">
              {isPriceLoading ? (
                <div className="w-4 h-4 rounded-full border-2 border-[#2F4157]/20 border-t-[#2F4157] animate-spin" />
              ) : priceError ? (
                <span className="text-sm font-medium text-slate-700">{t("priceOnRequest")}</span>
              ) : estimatedPrice ? (
                <span className="text-[15px] font-semibold text-[#2F4157]">
                  {t("estimatedPrice", { price: estimatedPrice })}
                </span>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkboxes Outside */}
      <div className="flex flex-wrap gap-2 md:gap-8 justify-center items-center relative z-40 mt-2">
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
        className={`flex items-center gap-1.5 md:gap-2 group focus:outline-none px-3.5 py-2 md:px-6 md:py-2.5 rounded-full md:rounded-xl transition-all duration-300 ${
          checked
            ? "bg-[#2F4157] text-[#E2DED3] shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)]"
            : "bg-white/90 backdrop-blur-sm text-[#2F4157] shadow-sm border border-slate-200/60 hover:shadow-md hover:-translate-y-0.5 hover:bg-white"
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