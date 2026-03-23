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
    from, to, fromPlaceId, toPlaceId,
    passengers, fleetOrder, setFleetOrder
  } = useBookingStore();

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;
  const isGroup = totalPassengers >= 8;
  const totalCapacity = (fleetOrder.vito * 7) + (fleetOrder.transporter * 7);
  const isGroupValid = totalCapacity >= totalPassengers;

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

      {/* Group Fleet Selection vs Single Car Selector */}
      {isGroup ? (
        <div className="flex flex-col gap-4">
          <div className="text-sm font-medium text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
            {t("groupFleetSelection")}
          </div>
          <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div>
              <div className="font-medium text-slate-900">{t("vitoClass")}</div>
              <div className="text-xs text-slate-500">{t("capacity", { count: 7 })}</div>
            </div>
            <Stepper value={fleetOrder.vito} onChange={(v) => setFleetOrder(v, fleetOrder.transporter)} min={0} />
          </div>
          <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div>
              <div className="font-medium text-slate-900">{t("vwClass")}</div>
              <div className="text-xs text-slate-500">{t("capacity", { count: 7 })}</div>
            </div>
            <Stepper value={fleetOrder.transporter} onChange={(v) => setFleetOrder(fleetOrder.vito, v)} min={0} />
          </div>
          <AnimatePresence>
            {!isGroupValid && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg mt-2">
                  {t("groupCapacityWarning", { passengers: totalPassengers, capacity: totalCapacity })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="-mx-4 md:mx-0">
          <CarClassSelector selectedClass={selectedClass} onChange={setSelectedClass} />
        </div>
      )}

      {/* Options List */}
      <div className="flex flex-col gap-3 mt-4 w-full">
        {/* Child Seat Toggle & Stepper */}
        <div className="flex flex-col p-4 bg-slate-50 border border-slate-100 rounded-xl gap-3 w-full">
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="text-sm font-medium text-slate-900">{t("childSeat")}</div>
              <div className="text-xs text-slate-500">{t("free")}</div>
            </div>
            <Toggle
              checked={childSeat > 0}
              onChange={() => {
                if (childSeat > 0) {
                  setChildSeat(0);
                } else {
                  setChildSeat(1);
                }
              }}
            />
          </div>
          <AnimatePresence>
            {childSeat > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden flex items-center justify-between border-t border-slate-200/50 pt-3 w-full"
              >
                <div className="text-sm text-slate-600 pl-1">{t("passengersCount")}</div>
                {/* Max 3 seats based on typical vehicle limits */}
                <Stepper value={childSeat} onChange={setChildSeat} min={1} max={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minibar Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl w-full">
          <div>
            <div className="text-sm font-medium text-slate-900">{t("minibar")}</div>
            <div className="text-xs text-slate-500">{t("extraCharge")}</div>
          </div>
          <Toggle checked={minibar} onChange={toggleMinibar} />
        </div>

        {/* English Driver Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl w-full">
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

        <Button onClick={onNext} disabled={isGroup && !isGroupValid} className="w-full h-14 rounded-xl" variant="primary">
          {t("next")}
        </Button>
      </div>
    </div>
  );
};

const Stepper = ({ value, onChange, min = 0, max = 100 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) => (
  <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-100">
    <button
      onClick={() => value > min && onChange(value - 1)}
      disabled={value <= min}
      className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${value <= min ? "text-slate-300" : "bg-white shadow-sm text-slate-700 hover:text-slate-900"}`}
    >
      -
    </button>
    <span className="w-4 text-center text-sm font-medium text-slate-900">{value}</span>
    <button
      onClick={() => value < max && onChange(value + 1)}
      disabled={value >= max}
      className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${value >= max ? "text-slate-300" : "bg-white shadow-sm text-slate-700 hover:text-slate-900"}`}
    >
      +
    </button>
  </div>
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    role="switch"
    aria-checked={checked}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F4157]/20 focus:ring-offset-2 ${checked ? 'bg-[#2F4157]' : 'bg-slate-300'}`}
  >
    <span className="sr-only">Toggle</span>
    <motion.span
      layout
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transform ${checked ? 'translate-x-5' : 'translate-x-1'}`}
    />
  </button>
);
