import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useBookingStore } from "@/store/useBookingStore";
import { CarClassSelector } from "../CarClassSelector";
import { Button } from "../Button";
import { useLoadScript } from "@react-google-maps/api";

const LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

export const Step2Car = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const t = useTranslations("BookingWidget");
  const {
    selectedClass, setSelectedClass,
    childSeat, setChildSeat,
    minibar, toggleMinibar,
    englishDriver, toggleEnglishDriver,
    estimatedPrice, setEstimatedPrice,
    from, to, fromPlaceId, toPlaceId
  } = useBookingStore();

  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState(false);

  // Debounced values for Distance Matrix API (since they aren't changing dynamically in step 2, this is mostly safe, but good practice)
  const [debouncedFrom, setDebouncedFrom] = useState(from);
  const [debouncedTo, setDebouncedTo] = useState(to);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFrom(from);
      setDebouncedTo(to);
    }, 500);
    return () => clearTimeout(timer);
  }, [from, to]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBIdr4O7lzMBsXWWTsxIT7P63UfT0oEYe4",
    libraries: LIBRARIES,
  });

  useEffect(() => {
    if (!debouncedFrom || !debouncedTo || !isLoaded) {
      setEstimatedPrice(null);
      setPriceError(false);
      return;
    }

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
          setEstimatedPrice(null);
          setPriceError(true);
        }
      }
    );
  }, [debouncedFrom, debouncedTo, fromPlaceId, toPlaceId, selectedClass, isLoaded, setEstimatedPrice]);

  return (
    <div className="flex flex-col gap-6">
      {/* Back Button */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        {t("back")}
      </button>

      {/* Car Selector */}
      <div className="-mx-4 md:mx-0">
        <CarClassSelector selectedClass={selectedClass} onChange={setSelectedClass} />
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Child Seat Stepper */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
          <div>
            <div className="text-sm font-medium text-slate-900">{t("childSeat")}</div>
            <div className="text-xs text-slate-500">{t("free")}</div>
          </div>
          <Stepper value={childSeat} onChange={setChildSeat} min={0} />
        </div>

        {/* Minibar Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
          <div>
            <div className="text-sm font-medium text-slate-900">{t("minibar")}</div>
            <div className="text-xs text-slate-500">{t("extraCharge")}</div>
          </div>
          <Toggle checked={minibar} onChange={toggleMinibar} />
        </div>

        {/* English Driver Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl md:col-span-2">
          <div>
            <div className="text-sm font-medium text-slate-900">{t("englishDriver")}</div>
            <div className="text-xs text-slate-500">{t("free")}</div>
          </div>
          <Toggle checked={englishDriver} onChange={toggleEnglishDriver} />
        </div>
      </div>

      {/* Next Button & Price */}
      <div className="mt-8">
        <AnimatePresence>
          {(estimatedPrice || priceError || isPriceLoading) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-center mb-4"
            >
              <div className="bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-2xl shadow-sm border border-slate-200/50 flex items-center gap-2 min-w-[200px] justify-center">
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

        <Button onClick={onNext} className="w-full h-14 rounded-xl" variant="primary">
          {t("next")}
        </Button>
      </div>
    </div>
  );
};

const Stepper = ({ value, onChange, min = 0 }: { value: number; onChange: (v: number) => void; min?: number }) => (
  <div className="flex items-center gap-3 bg-white rounded-lg p-1 border border-slate-100 shadow-sm">
    <button
      onClick={() => value > min && onChange(value - 1)}
      disabled={value <= min}
      className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${value <= min ? "text-slate-300" : "bg-slate-50 text-slate-700 hover:text-slate-900"}`}
    >
      -
    </button>
    <span className="w-4 text-center text-sm font-medium text-slate-900">{value}</span>
    <button
      onClick={() => onChange(value + 1)}
      className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors"
    >
      +
    </button>
  </div>
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-accent' : 'bg-slate-200'}`}
  >
    <span className="sr-only">Toggle</span>
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
    />
  </button>
);
