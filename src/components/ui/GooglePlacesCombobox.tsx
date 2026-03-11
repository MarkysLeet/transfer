"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import usePlacesAutocomplete from "use-places-autocomplete";

interface GooglePlacesComboboxProps {
  value: string;
  onChange: (value: string, placeId?: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
}

export const GooglePlacesCombobox = ({
  value,
  onChange,
  placeholder,
  icon,
}: GooglePlacesComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "tr" },
    },
    debounce: 300,
    defaultValue: value,
  });

  useEffect(() => {
    if (value !== inputValue) {
      setValue(value, false);
    }
  }, [value, inputValue, setValue]);

  const updateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition, { passive: true });
      window.addEventListener("resize", updateDropdownPosition);
    }

    return () => {
      window.removeEventListener("scroll", updateDropdownPosition);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        const dropdownElement = document.getElementById("google-combobox-dropdown-portal");
        if (dropdownElement && dropdownElement.contains(event.target as Node)) {
           return;
        }
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = ({ description, place_id }: { description: string; place_id: string }) => {
    setValue(description, false);
    clearSuggestions();
    setIsOpen(false);
    onChange(description, place_id);
  };

  return (
    <div
      className="relative h-14 bg-white rounded-xl transition-all duration-300 shadow-sm border border-slate-200 focus-within:shadow-md focus-within:border-slate-300 focus-within:-translate-y-0.5"
      ref={containerRef}
    >
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2F4157]">
          {icon}
        </div>
      )}

      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
        }}
        disabled={!ready}
        onFocus={() => setIsOpen(true)}
        className={`w-full h-full bg-transparent ${icon ? 'pl-12' : 'pl-5'} pr-12 text-sm text-[#2F4157] placeholder:text-[#2F4157]/60 focus:outline-none`}
      />

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && status === "OK" && data.length > 0 && (
            <motion.div
              id="google-combobox-dropdown-portal"
              data-lenis-prevent="true"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: `${dropdownPosition.top + 8}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                zIndex: 9999,
              }}
            >
              <div className="relative bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto hide-scrollbar py-2">
                {data.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    onClick={() => handleSelect(suggestion)}
                    className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-center gap-3"
                  >
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{suggestion.description}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
