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

  const calculateFixedPrice = useCallback((fromStr: string, toStr: string, carClass: CarClass): number | null => {
    const fromLower = fromStr.toLowerCase();
    const toLower = toStr.toLowerCase();

    // Check for airport synonyms in multiple languages
    const airportKeywords = [
      "ayt", "antalya", "антали", "havaliman", "airport", "flughafen"
    ];

    const isAirport = airportKeywords.some(kw => fromLower.includes(kw) || toLower.includes(kw));

    if (!isAirport) return null;

    const combinedStr = fromLower + " " + toLower;

    // Check for resort synonyms in multiple languages
    if (combinedStr.includes("lara") || combinedStr.includes("kundu") || combinedStr.includes("лара") || combinedStr.includes("кунду")) return carClass === "vw" ? 30 : 40;
    if (combinedStr.includes("belek") || combinedStr.includes("белек")) return carClass === "vw" ? 35 : 45;
    if (combinedStr.includes("bogazkent") || combinedStr.includes("boğazkent") || combinedStr.includes("богазкент")) return carClass === "vw" ? 40 : 50;
    if (combinedStr.includes("side") || combinedStr.includes("sorgun") || combinedStr.includes("kumkoy") || combinedStr.includes("kumköy") || combinedStr.includes("evrenseki") || combinedStr.includes("colakli") || combinedStr.includes("çolaklı") || combinedStr.includes("gundogdu") || combinedStr.includes("gündoğdu") || combinedStr.includes("сиде") || combinedStr.includes("соргун") || combinedStr.includes("кумкой") || combinedStr.includes("эвренсеки") || combinedStr.includes("чолаклы") || combinedStr.includes("гюндогду")) return carClass === "vw" ? 45 : 55;
    if (combinedStr.includes("kizilagac") || combinedStr.includes("kızılağaç") || combinedStr.includes("kizilot") || combinedStr.includes("kızılot") || combinedStr.includes("кызылагач") || combinedStr.includes("кызылот")) return carClass === "vw" ? 55 : 65;
    if (combinedStr.includes("okurcalar") || combinedStr.includes("avsallar") || combinedStr.includes("окурджалар") || combinedStr.includes("авсаллар")) return carClass === "vw" ? 60 : 70;
    if (combinedStr.includes("turkler") || combinedStr.includes("türkler") || combinedStr.includes("konakli") || combinedStr.includes("konaklı") || combinedStr.includes("тюрклер") || combinedStr.includes("конаклы")) return carClass === "vw" ? 65 : 75;
    if (combinedStr.includes("alanya") || combinedStr.includes("алания") || combinedStr.includes("аланья")) return carClass === "vw" ? 70 : 80;
    if (combinedStr.includes("kemer") || combinedStr.includes("кемер")) return carClass === "vw" ? 50 : 60;

    return null;
  }, []);

  useEffect(() => {
    if (!debouncedFrom || !debouncedTo || !isLoaded) {
      setEstimatedPrice(null);
      setPriceError(false);
      return;
    }

    const fixedPrice = calculateFixedPrice(debouncedFrom, debouncedTo, selectedClass);
    if (fixedPrice !== null) {
      setEstimatedPrice(fixedPrice);
      setPriceError(false);
      return;
    }

    // Use Distance Matrix
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
            calculatedPrice = Math.max(30, Math.round(distanceInKm * 1.0));
          } else {
            calculatedPrice = Math.max(40, Math.round(distanceInKm * 1.2));
          }
          setEstimatedPrice(calculatedPrice);
        } else {
          setEstimatedPrice(null);
          setPriceError(true);
        }
      }
    );

  }, [debouncedFrom, debouncedTo, fromPlaceId, toPlaceId, selectedClass, isLoaded, calculateFixedPrice]);

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
      const carClassName = selectedClass === "vw" ? "VW Transporter" : "MB Vito";
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
            placeholder={t("to")}
            icon={<MapPin />}
            isLoaded={isLoaded}
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
            ? "bg-[#2F4157] text-[#E2DED3] shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)]"
            : "bg-white text-[#2F4157] shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5"
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