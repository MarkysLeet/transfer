"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useBookingStore } from "@/store/useBookingStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { Step1Route } from "./Step1Route";
import { Step2Car } from "./Step2Car";
import { Step3Contacts } from "./Step3Contacts";

export const BookingModalContent = () => {
  const t = useTranslations("BookingWidget");
  const { step, setStep, setIsOpen } = useBookingStore();
  const { formatPrice } = useCurrencyStore();

  function handleConfirm() {
    const store = useBookingStore.getState();
    const {
      roundTrip, from, to, date, time, returnDate, returnTime,
      passengers, selectedClass, childSeat, minibar, englishDriver,
      name, phone, paymentMethod, estimatedPrice, fleetOrder
    } = store;

    let message = `💎 *New Booking Request*\n\n`;

    // Route
    message += `📍 *Route:* ${from} ➡️ ${to}\n`;

    // Dates
    message += `📅 *Outbound:* ${date} at ${time}\n`;
    if (roundTrip) {
      message += `🔄 *Return:* ${returnDate} at ${returnTime}\n`;
    }

    // Passengers
    const totalPassengers = passengers.adults + passengers.children + passengers.infants;
    message += `\n👥 *Passengers:* ${passengers.adults} Adults, ${passengers.children} Children, ${passengers.infants} Infants\n`;

    // Car / Fleet Logic
    if (totalPassengers >= 8) {
      message += `\n🚘 *Group Fleet (${totalPassengers} pax):*\n`;
      if (fleetOrder.vito > 0) message += `   - ${fleetOrder.vito}x Mercedes-Benz Vito\n`;
      if (fleetOrder.transporter > 0) message += `   - ${fleetOrder.transporter}x Volkswagen Transporter\n`;
    } else {
      const carClassName = selectedClass === "vw" ? "Volkswagen Transporter" : "Mercedes-Benz Vito";
      message += `\n🚘 *Car Class:* ${carClassName}\n`;
    }

    // Options
    const options = [];
    if (childSeat > 0) options.push(`${childSeat}x Child Seat`);
    if (minibar) options.push(`Mini-bar`);
    if (englishDriver) options.push(`English Driver`);

    if (options.length > 0) {
       message += `✨ *Extras:* ${options.join(', ')}\n`;
    }

    // Contacts & Payment
    message += `\n👤 *Client:* ${name}\n`;
    message += `📞 *Phone:* ${phone}\n`;
    message += `💳 *Payment Method:* ${paymentMethod.toUpperCase()}\n`;

    if (estimatedPrice) {
       const convertedPrice = formatPrice(estimatedPrice);
       message += `\n💰 *Estimated Total:* ${convertedPrice}\n`;
    }

    const whatsappUrl = `https://wa.me/905418462550?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    // Close and reset
    setIsOpen(false);
    setTimeout(() => {
        store.resetBooking();
    }, 500);
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <h2 className="text-2xl font-semibold text-slate-900">
          {step === 1 && t("step1Title")}
          {step === 2 && t("step2Title")}
          {step === 3 && t("step3Title")}
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 -mr-2 text-slate-400 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-200/50"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto overscroll-y-contain min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && <Step1Route onNext={() => setStep(2)} />}
            {step === 2 && <Step2Car onBack={() => setStep(1)} onNext={() => setStep(3)} />}
            {step === 3 && <Step3Contacts onBack={() => setStep(2)} onConfirm={handleConfirm} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};
