"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { MapPin, Check, Plus, Car } from "lucide-react";
import { Combobox } from "./Combobox";
import { GooglePlacesCombobox } from "./GooglePlacesCombobox";
import { useBookingStore } from "@/store/useBookingStore";
import { useLoadScript } from "@react-google-maps/api";

const LIBRARIES: "places"[] = ["places"];

const PRICING_DICTIONARY: Record<string, { vw: number; vito: number }> = {
  "lara": { vw: 30, vito: 40 },
  "kundu": { vw: 30, vito: 40 },
  "belek": { vw: 35, vito: 45 },
  "bogazkent": { vw: 40, vito: 50 },
  "side": { vw: 45, vito: 55 },
  "sorgun": { vw: 45, vito: 55 },
  "kumkoy": { vw: 45, vito: 55 },
  "evrenseki": { vw: 45, vito: 55 },
  "colakli": { vw: 45, vito: 55 },
  "gundogdu": { vw: 45, vito: 55 },
  "kizilagac": { vw: 55, vito: 65 },
  "kizilot": { vw: 55, vito: 65 },
  "okurcalar": { vw: 60, vito: 70 },
  "avsallar": { vw: 60, vito: 70 },
  "turkler": { vw: 65, vito: 75 },
  "konakli": { vw: 65, vito: 75 },
  "alanya": { vw: 70, vito: 80 },
  "kemer": { vw: 50, vito: 60 },
};

export const BookingWidget = () => {
  const t = useTranslations("BookingWidget");
  const tCities = useTranslations("Cities");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [carType, setCarType] = useState<"vito" | "vw">("vito");
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [distanceFailed, setDistanceFailed] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: LIBRARIES,
  });

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

  const calculatePrice = async (destinationStr: string, placeId?: string) => {
    setEstimatedPrice(null);
    setDistanceFailed(false);
    if (!destinationStr) return;

    setIsPriceLoading(true);

    const destLower = destinationStr.toLowerCase();

    // Step 1: Dictionary match
    let matchedKey = Object.keys(PRICING_DICTIONARY).find(key => destLower.includes(key));

    // If we have a placeId, let's also try to get the detailed place info to check address components
    if (!matchedKey && placeId && isLoaded && window.google) {
      try {
        const service = new google.maps.places.PlacesService(document.createElement("div"));
        const place: google.maps.places.PlaceResult = await new Promise((resolve, reject) => {
          service.getDetails({ placeId, fields: ["address_components", "formatted_address", "name"] }, (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && result) {
              resolve(result);
            } else {
              reject(status);
            }
          });
        });

        const fullAddressLower = `${place.name} ${place.formatted_address} ${place.address_components?.map(c => c.long_name).join(" ")}`.toLowerCase();
        matchedKey = Object.keys(PRICING_DICTIONARY).find(key => fullAddressLower.includes(key));
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    }

    if (matchedKey) {
      setEstimatedPrice(PRICING_DICTIONARY[matchedKey][carType]);
      setIsPriceLoading(false);
      return;
    }

    // Step 2: Distance Matrix fallback
    if (isLoaded && window.google) {
      try {
        const service = new google.maps.DistanceMatrixService();
        // Antalya Airport (AYT) coordinates
        const origin = new google.maps.LatLng(36.8987, 30.8005);

        const response = await service.getDistanceMatrix({
          origins: [origin],
          destinations: [placeId ? { placeId } : destinationStr],
          travelMode: google.maps.TravelMode.DRIVING,
        });

        if (response.rows[0].elements[0].status === "OK") {
          const distanceInMeters = response.rows[0].elements[0].distance.value;
          const distanceInKm = distanceInMeters / 1000;

          let calculatedPrice = 0;
          if (carType === "vw") {
             calculatedPrice = Math.max(30, distanceInKm * 1.0);
          } else {
             calculatedPrice = Math.max(40, distanceInKm * 1.2);
          }
          setEstimatedPrice(Math.round(calculatedPrice));
        } else {
          setDistanceFailed(true);
        }
      } catch (error) {
        console.error("Distance Matrix error:", error);
        setDistanceFailed(true);
      }
    } else {
       setDistanceFailed(true);
    }

    setIsPriceLoading(false);
  };

  useEffect(() => {
    if (to) {
      calculatePrice(to);
    }
  }, [carType, to]);

  const handleFromChange = (val: string) => {
    setFrom(val);
    if (val !== t("myLocation")) {
      setCoords(null);
    }
  };

  const handleToChange = (val: string, placeId?: string) => {
    setTo(val);
    if (val && placeId) {
       calculatePrice(val, placeId);
    } else if (!val) {
       setEstimatedPrice(null);
       setDistanceFailed(false);
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

    const carName = carType === "vito" ? t("carVito") : t("carVw");
    message += `\nCar: ${carName}`;

    if (estimatedPrice) {
       message += `\nEstimated Price: €${estimatedPrice}`;
    } else if (distanceFailed) {
       message += `\nEstimated Price: Upon Request`;
    }

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
      {/* Car Type Selector */}
      <div className="flex justify-center mb-2">
        <div className="inline-flex bg-white/20 backdrop-blur-sm p-1.5 rounded-2xl border border-white/30 shadow-sm">
          <button
            onClick={() => setCarType("vito")}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              carType === "vito"
                ? "bg-white text-slate-900 shadow-md scale-100"
                : "text-white/80 hover:text-white hover:bg-white/10 scale-95"
            }`}
          >
            <Car size={16} />
            {t("carVito")}
          </button>
          <button
            onClick={() => setCarType("vw")}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              carType === "vw"
                ? "bg-white text-slate-900 shadow-md scale-100"
                : "text-white/80 hover:text-white hover:bg-white/10 scale-95"
            }`}
          >
            <Car size={16} />
            {t("carVw")}
          </button>
        </div>
      </div>

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
          {isLoaded ? (
            <GooglePlacesCombobox
              value={to}
              onChange={handleToChange}
              placeholder={t("to")}
              icon={<MapPin />}
            />
          ) : (
             <Combobox
              value={to}
              onChange={(val) => setTo(val)}
              placeholder={t("to")}
              options={cities}
              icon={<MapPin />}
            />
          )}
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
      <div className="flex justify-center relative z-40 h-8">
         <AnimatePresence mode="wait">
            {isPriceLoading ? (
               <motion.div
                 key="loading"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="text-[#E2DED3] text-sm font-medium tracking-wide animate-pulse"
               >
                  Calculating...
               </motion.div>
            ) : estimatedPrice ? (
               <motion.div
                 key="price"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="text-[#E2DED3] text-lg font-semibold tracking-wide bg-[#2F4157]/80 px-6 py-1.5 rounded-full border border-[#E2DED3]/20 shadow-lg backdrop-blur-sm"
               >
                  {t("estimatedPrice", { price: estimatedPrice })}
               </motion.div>
            ) : distanceFailed && to ? (
               <motion.div
                 key="failed"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="text-[#E2DED3] text-lg font-medium tracking-wide bg-[#2F4157]/80 px-6 py-1.5 rounded-full border border-[#E2DED3]/20 shadow-lg backdrop-blur-sm"
               >
                  {t("priceUponRequest")}
               </motion.div>
            ) : null}
         </AnimatePresence>
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