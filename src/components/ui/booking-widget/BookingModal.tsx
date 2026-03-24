"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X } from "lucide-react";
import { useBookingStore } from "@/store/useBookingStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { Step1Route } from "./Step1Route";
import { Step2Car } from "./Step2Car";
import { Step3Contacts } from "./Step3Contacts";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";

export const BookingModal = () => {
  const t = useTranslations("BookingWidget");
  const { isOpen, setIsOpen, step, setStep } = useBookingStore();
  const { formatPrice } = useCurrencyStore();
  const lenis = useLenis();

  const [isMobile, setIsMobile] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [isOpen, lenis]);

  if (!isOpen) return null;

  const variants = isMobile
    ? {
        hidden: { y: "100%", x: 0 },
        visible: { y: 0, x: 0 },
        exit: { y: "100%", x: 0 }
      }
    : {
        hidden: { x: "100%", y: 0 },
        visible: { x: 0, y: 0 },
        exit: { x: "100%", y: 0 }
      };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer / Bottom Sheet Panel */}
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          drag={isMobile ? "y" : false}
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            if (isMobile && (offset.y > 150 || velocity.y > 500)) {
              setIsOpen(false);
            }
          }}
          className="relative w-full max-w-[450px] bg-[#F4EFEB] h-full shadow-2xl overflow-x-hidden
                     max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:top-auto max-lg:h-[90dvh] max-lg:max-w-none
                     max-lg:rounded-t-3xl flex flex-col"
        >
           {/* Mobile Drag Handle */}
          <div
            className="lg:hidden w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing shrink-0 sticky top-0 bg-[#F4EFEB] z-10 touch-none"
            onPointerDown={(e) => {
              if (isMobile) {
                dragControls.start(e);
              }
            }}
          >
            <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          </div>

          <div
            className="p-6 md:p-8 flex flex-col flex-1 min-h-0 pb-20 max-lg:pb-[env(safe-area-inset-bottom,24px)]"
          >
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
            <div
              className="flex-1 overflow-y-auto overscroll-y-contain min-h-0"
              style={isMobile ? { touchAction: "pan-y" } : undefined}
            >
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
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

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
};
