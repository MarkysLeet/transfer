"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Locate, MapPin, X, ChevronLeft, Plane, Building, Target } from "lucide-react";
import { useTranslations } from "next-intl";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";
import { useBookingStore } from "@/store/useBookingStore";

interface ComboboxProps {
  id?: string;
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
  id,
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => setMounted(true), 0);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const { activeMobileOverlayId, setActiveMobileOverlayId, setCoords } = useBookingStore();

  // Use a locally generated ID if none provided, to ensure safe fallback
  const internalId = useRef(Math.random().toString(36).substring(7)).current;
  const overlayId = id || internalId;

  const isMobileOverlayOpen = activeMobileOverlayId === overlayId;

  // We add this geolocation state here for the mobile Empty State
  // to avoid passing it down when it should be tightly coupled with the location input itself.
  const [isLocating, setIsLocating] = useState(false);

  const handleGeolocationClick = () => {
    if (onGeolocationClick) {
      onGeolocationClick();
      return;
    }

    // Default geolocation logic for the Empty State button if not provided via props
    if (!navigator.geolocation) {
      alert(t("locateError", { defaultMessage: "Could not determine location" }));
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });

        try {
          // Attempt reverse geocoding to get a readable address
          const geocoder = new window.google.maps.Geocoder();
          const response = await geocoder.geocode({ location: { lat, lng } });
          if (response.results && response.results[0]) {
             const address = response.results[0].formatted_address;
             const placeId = response.results[0].place_id;
             setValue(address, false);
             onChange(address, placeId);
          } else {
             alert(t("locateError", { defaultMessage: "Could not determine location" }));
          }
        } catch (error) {
          console.error("Geocoder failed due to: " + error);
          alert(t("locateError", { defaultMessage: "Could not determine location" }));
        } finally {
          setIsLocating(false);
          setActiveMobileOverlayId(null);
        }
      },
      (error) => {
        console.error("Error getting location", error);
        alert(t("locateError", { defaultMessage: "Could not determine location" }));
        setIsLocating(false);
      }
    );
  };
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // When overlay opens, focus input inside
  useEffect(() => {
    if (isMobileOverlayOpen && mobileInputRef.current) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 100);
    }
  }, [isMobileOverlayOpen]);

  // Lock body scroll when overlay is open and clean up state on unmount
  useEffect(() => {
    let originalOverflow = "";
    if (isMobileOverlayOpen) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      clearSuggestions();
    }
    return () => {
      if (isMobileOverlayOpen) {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [isMobileOverlayOpen, clearSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (description: string, placeId: string) => {
    setValue(description, false);
    clearSuggestions();
    onChange(description, placeId);
    setIsOpen(false);
    setActiveMobileOverlayId(null);
  };

  const renderIcon = (types?: string[]) => {
    if (!types) return <MapPin className="w-4 h-4 text-[#2F4157]" />;
    if (types.includes("airport")) return <Plane className="w-4 h-4 text-[#2F4157]" />;
    if (types.includes("lodging") || types.includes("establishment")) return <Building className="w-4 h-4 text-[#2F4157]" />;
    return <MapPin className="w-4 h-4 text-[#2F4157]" />;
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
        onFocus={(e) => {
          if (isMobile) {
            e.preventDefault();
            e.target.blur();
            setActiveMobileOverlayId(overlayId);
          } else {
            setIsOpen(true);
          }
        }}
        disabled={!ready}
        className={`w-full h-full bg-transparent ${icon ? 'pl-12' : 'pl-5'} pr-12 text-[16px] md:text-sm text-[#2F4157] placeholder:text-[#2F4157]/60 focus:outline-none`}
        readOnly={isMobile} // prevent double keyboard pop-up while clicking background input
      />

      {allowGeolocation ? (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#2F4157]/80 hover:text-[#2F4157] transition-colors">
          <button
            onPointerDown={(e) => {
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
            onPointerDown={(e) => {
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
          onPointerDown={(e) => {
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


      {mounted && (
        isMobile ? (
          createPortal(
            <AnimatePresence>
              {isMobileOverlayOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute bottom-0 left-0 w-full h-[100dvh] z-[99999] bg-[#F4EFEB] flex flex-col pointer-events-auto"
                  style={{ touchAction: "none" }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* data-vaul-no-drag is needed to prevent Vaul from stealing interaction. We also use pointer-events-auto */}
                  {/* data-vaul-no-drag is needed to prevent Vaul from stealing interaction. We also use pointer-events-auto */}
                  <div
                    className="flex-none flex items-center gap-3 p-4 bg-white border-b border-slate-200 shadow-sm pt-[env(safe-area-inset-top,16px)] pointer-events-auto"
                    data-vaul-no-drag
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setActiveMobileOverlayId(null)}
                      className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="relative flex-1 flex items-center">
                      {icon && (
                        <div className="absolute left-3 flex items-center justify-center w-4 h-4 text-[#2F4157] opacity-50 pointer-events-none">
                          {icon}
                        </div>
                      )}
                      <input
                        ref={mobileInputRef}
                        type="text"
                        placeholder={placeholder}
                        value={autocompleteValue}
                        onChange={(e) => {
                          setValue(e.target.value);
                          onChange(e.target.value);
                          setIsOpen(true);
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        autoFocus
                        className={`w-full h-12 bg-slate-100/50 border border-slate-200 rounded-xl ${icon ? 'pl-9' : 'pl-4'} pr-10 text-[16px] text-[#2F4157] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2F4157]/20 transition-shadow leading-normal`}
                      />
                      {autocompleteValue.length > 0 && (
                        <button
                          onClick={() => {
                            if (onClear) onClear();
                            setValue("");
                            onChange("");
                            mobileInputRef.current?.focus();
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div
                    className="flex-1 overflow-y-auto overscroll-contain bg-white pb-[env(safe-area-inset-bottom)]"
                    style={{ touchAction: "pan-y" }}
                  >
                    <AnimatePresence mode="wait">
                      {autocompleteValue.trim().length === 0 ? (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col"
                        >
                          {/* Current Location Action */}
                          <button
                            onPointerDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleGeolocationClick();
                            }}
                            className="w-full text-left px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors flex items-center gap-4 group"
                          >
                            <div className="p-2 bg-[#2F4157]/5 rounded-full shrink-0 group-hover:bg-[#2F4157]/10 transition-colors">
                              {isLocating || isLoadingLocation ? (
                                <div className="w-5 h-5 rounded-full border-2 border-[#2F4157]/20 border-t-[#2F4157] animate-spin" />
                              ) : (
                                <Target className="w-5 h-5 text-[#2F4157]" />
                              )}
                            </div>
                            <span className="text-[15px] font-medium text-[#2F4157]">
                              {t("UI.myCurrentLocation")}
                            </span>
                          </button>

                          {/* Popular Routes */}
                          <div className="px-5 pt-6 pb-2">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              {t("UI.popularRoutes")}
                            </h3>
                          </div>

                          <button
                            onPointerDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelect(t("PopularRoutes.antalyaAirport"), "ChIJY52Xz0R9wxQRMqPoy77YVJw"); // Approximate placeId for Antalya Airport
                            }}
                            className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors flex items-center gap-4"
                          >
                            <div className="p-2 bg-slate-100 rounded-full shrink-0">
                              <Plane className="w-4 h-4 text-[#2F4157]" />
                            </div>
                            <span className="text-[15px] font-medium text-slate-900">{t("PopularRoutes.antalyaAirport")}</span>
                          </button>

                          <button
                            onPointerDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelect(t("PopularRoutes.kemer"), "ChIJmZ92d8jBwhQRH7Xo3G7qX2U"); // Approximate placeId for Kemer
                            }}
                            className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors flex items-center gap-4"
                          >
                            <div className="p-2 bg-slate-100 rounded-full shrink-0">
                              <Building className="w-4 h-4 text-[#2F4157]" />
                            </div>
                            <span className="text-[15px] font-medium text-slate-900">{t("PopularRoutes.kemer")}</span>
                          </button>

                          <button
                            onPointerDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelect(t("PopularRoutes.alanya"), "ChIJj51b_3ykwxQRXy5q0W3r1rA"); // Approximate placeId for Alanya
                            }}
                            className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors flex items-center gap-4"
                          >
                            <div className="p-2 bg-slate-100 rounded-full shrink-0">
                              <Building className="w-4 h-4 text-[#2F4157]" />
                            </div>
                            <span className="text-[15px] font-medium text-slate-900">{t("PopularRoutes.alanya")}</span>
                          </button>

                        </motion.div>
                      ) : (
                        <motion.div
                          key="results"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col"
                        >
                          {status === "OK" ? (
                            data.map(({ place_id, description, types, structured_formatting: { main_text, secondary_text } }) => (
                              <button
                                key={place_id}
                                onPointerDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSelect(description, place_id);
                                }}
                                className="w-full text-left px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors flex items-start gap-4"
                              >
                                <div className="mt-0.5 p-2 bg-slate-100 rounded-full shrink-0">
                                  {renderIcon(types)}
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[15px] font-medium text-slate-900">{main_text}</span>
                                  <span className="text-[13px] text-slate-500 line-clamp-1">{secondary_text}</span>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-5 py-6 text-[15px] text-slate-500 flex flex-col items-center justify-center gap-3 text-center">
                              {status === "ZERO_RESULTS" ? (
                                <>
                                  <div className="p-3 bg-slate-100 rounded-full">
                                    <MapPin className="w-6 h-6 text-[#2F4157] opacity-40" />
                                  </div>
                                  <span>{t("noResults", { defaultMessage: "No results found" })}</span>
                                </>
                              ) : (
                                <>
                                  <div className="w-6 h-6 rounded-full border-2 border-slate-200 border-t-[#2F4157] animate-spin" />
                                  <span>{t("searching", { defaultMessage: "Searching..." })}</span>
                                </>
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.getElementById("mobile-overlay-root") || document.body
          )
        ) : (
          createPortal(
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
                          onPointerDown={(e) => {
                            e.preventDefault();
                            handleSelect(description, place_id);
                          }}
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
          )
        )
      )}
    </div>
  );
};
