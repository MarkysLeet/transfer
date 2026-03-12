"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Locate, MapPin, X } from "lucide-react";
import { useTranslations } from "next-intl";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";

interface ComboboxProps {
  value: string;
  onChange: (value: string, placeId?: string) => void;
  onClear?: () => void;
  placeholder: string;
  icon?: React.ReactNode;
  allowGeolocation?: boolean;
  onGeolocationClick?: () => void;
  isLoadingLocation?: boolean;
  isLoaded?: boolean;
}

export const Combobox = ({
  value,
  onChange,
  onClear,
  placeholder,
  icon,
  allowGeolocation,
  onGeolocationClick,
  isLoadingLocation,
  isLoaded,
}: ComboboxProps) => {
  const t = useTranslations("BookingWidget");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const {
    ready,
    value: autocompleteValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
    init,
  } = usePlacesAutocomplete({
    requestOptions: {
      // Prioritize Turkey
      componentRestrictions: { country: "tr" },
      language: "en",
    },
    debounce: 300,
    initOnMount: false,
  });

  // Initialize once Google API is loaded
  useEffect(() => {
    if (isLoaded) {
      init();
    }
  }, [isLoaded, init]);

  // Sync external value
  useEffect(() => {
    setValue(value, false);
  }, [value, setValue]);

  const updateDropdownPosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);

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
  }, [isOpen, updateDropdownPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Also check if click is inside the portal dropdown
        const dropdownElement = document.getElementById("combobox-dropdown-portal");
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

  const handleSelect = (description: string, placeId: string) => {
    setValue(description, false);
    clearSuggestions();
    onChange(description, placeId);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
    setIsOpen(true);
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
        value={autocompleteValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        disabled={!ready}
        className={`w-full h-full bg-transparent ${icon ? 'pl-12' : 'pl-5'} pr-12 text-sm text-[#2F4157] placeholder:text-[#2F4157]/60 focus:outline-none`}
      />

      {allowGeolocation ? (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#2F4157]/80 hover:text-[#2F4157] transition-colors">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onClear) onClear();
            }}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
              autocompleteValue.length > 0 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            title="Clear"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onGeolocationClick) onGeolocationClick();
            }}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
              autocompleteValue.length === 0 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            title="Use my location"
          >
            <Locate className={`w-4 h-4 ${isLoadingLocation ? "animate-pulse text-[#2F4157]" : ""}`} />
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onClear) onClear();
          }}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-[#2F4157]/80 hover:text-[#2F4157] transition-opacity duration-200 ${
            autocompleteValue.length > 0 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          title="Clear"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (autocompleteValue.trim().length > 0) && (
            <motion.div
              id="combobox-dropdown-portal"
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
                {status === "OK" ? (
                  data.map(({ place_id, description, structured_formatting: { main_text, secondary_text } }) => (
                    <button
                      key={place_id}
                      onClick={() => handleSelect(description, place_id)}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-start gap-3"
                    >
                      <MapPin className="w-4 h-4 text-[#2F4157] mt-1 shrink-0 opacity-50" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">{main_text}</span>
                        <span className="text-xs text-slate-500">{secondary_text}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-500 flex items-center gap-2">
                    {status === "ZERO_RESULTS" ? (
                      <>
                        <MapPin className="w-4 h-4 text-[#2F4157] mt-1 shrink-0 opacity-50" />
                        <span>{t("noResults", { defaultMessage: "No results found" })}</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-[#2F4157] animate-spin" />
                        <span>{t("searching", { defaultMessage: "Searching..." })}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
