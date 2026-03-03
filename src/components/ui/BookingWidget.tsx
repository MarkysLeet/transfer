"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { MapPin, Calendar, Clock, ChevronDown, Check } from "lucide-react";

export const BookingWidget = () => {
  const t = useTranslations("BookingWidget");
  const [showDetails, setShowDetails] = useState(false);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [roundTrip, setRoundTrip] = useState(false);
  const [childSeat, setChildSeat] = useState(false);
  const [minibar, setMinibar] = useState(false);

  const handleBook = () => {
    let message = "";

    if (from && to) {
      message = t("waBoth", { from, to });
    } else if (from) {
      message = t("waOnlyFrom", { from });
    } else if (to) {
      message = t("waOnlyTo", { to });
    }

    const options = [];
    if (roundTrip) options.push(t("roundTrip"));
    if (childSeat) options.push(t("childSeat"));
    if (minibar) options.push(t("minibar"));

    if (date || time || options.length > 0) {
      const optionsStr = options.length > 0 ? options.join(", ") : "-";
      const detailsMsg = t("waDetails", {
        date: date || "-",
        time: time || "-",
        options: optionsStr,
      });
      message += `\n${detailsMsg}`;
    }

    const whatsappUrl = `https://wa.me/905550000000?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-lg border border-white/10 shadow-2xl">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t("from")}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 pb-2 pt-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50 transition-colors"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t("to")}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 pb-2 pt-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <span>{t("addDetails")}</span>
            <motion.div
              animate={{ rotate: showDetails ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    placeholder={t("date")}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 pb-2 pt-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50 transition-colors [color-scheme:dark]"
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="time"
                    placeholder={t("time")}
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 pb-2 pt-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mt-6">
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
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center mt-6">
          <Button onClick={handleBook} size="lg" className="w-full md:w-auto px-12">
            {t("bookButton")}
          </Button>
        </div>
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
          ? "bg-white border-white text-slate-900"
          : "border-slate-500 group-hover:border-white text-transparent"
      }`}
    >
      <Check strokeWidth={3} className="w-3.5 h-3.5" />
    </div>
    <div className="flex items-baseline gap-1.5">
      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
        {label}
      </span>
      {subtitle && (
        <span className="text-xs text-slate-500">{subtitle}</span>
      )}
    </div>
  </button>
);
