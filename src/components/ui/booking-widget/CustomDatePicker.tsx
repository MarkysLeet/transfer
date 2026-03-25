import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export const CustomDatePicker = ({ value, onChange, icon }: { value: string; onChange: (v: string) => void; icon?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const t = useTranslations("BookingWidget");

  // Generate next 30 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      dates.push({
        value: `${year}-${month}-${day}`,
        label: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
      });
    }
    return dates;
  };

  const dates = generateDates();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const updatePosition = () => {
        const rect = triggerRef.current?.getBoundingClientRect();
        if (rect) {
          setDropdownStyle({
            top: `${rect.bottom + 8}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
          });
        }
      };

      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    let originalOverflow = "";
    if (isOpen) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (isOpen) {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [isOpen]);

  const displayLabel = dates.find(d => d.value === value)?.label || value;

  return (
    <div className="relative w-full h-full">
      <button
        type="button"
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 pl-10 pr-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] relative"
      >
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </span>
        )}
        <span className={value ? "text-white" : "text-white/50"}>{displayLabel || "Select Date"}</span>
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 max-h-56 overflow-y-auto z-[9999] py-2 scrollbar-hide overscroll-contain pointer-events-auto"
            style={{ ...dropdownStyle, touchAction: "pan-y" }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
          >
            {dates.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => {
                  onChange(d.value);
                  setIsOpen(false);
                }}
                className={`w-full min-h-[44px] flex items-center justify-center px-4 py-2 text-base hover:bg-slate-50 transition-colors ${value === d.value ? "bg-[#F4EFEB] text-[#2F4157] font-semibold" : "text-slate-700"}`}
              >
                {d.label}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
