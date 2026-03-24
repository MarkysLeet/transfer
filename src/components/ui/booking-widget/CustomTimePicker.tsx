import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export const CustomTimePicker = ({ value, onChange, icon }: { value: string; onChange: (v: string) => void; icon?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  // Generate 15-minute intervals
  const generateTimes = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour = h.toString().padStart(2, "0");
        const min = m.toString().padStart(2, "0");
        times.push(`${hour}:${min}`);
      }
    }
    return times;
  };

  const times = generateTimes();

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
          // Adjust position and width to match the trigger exactly
          // We add window.scrollY if needed, though on mobile inside a fixed modal this works.
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

  // Prevent scroll propagation from portal to parent modal, preserving existing scroll locks
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
        <span className={value ? "text-white" : "text-white/50"}>{value || "00:00"}</span>
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
            {times.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => {
                  onChange(time);
                  setIsOpen(false);
                }}
                className={`w-full min-h-[44px] flex items-center justify-center px-4 py-2 text-base hover:bg-slate-50 transition-colors ${value === time ? "bg-[#F4EFEB] text-[#2F4157] font-semibold" : "text-slate-700"}`}
              >
                {time}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
