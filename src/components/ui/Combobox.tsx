"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Locate } from "lucide-react";

// Ensure we're a client component (already has "use client" at top)

// Levenshtein distance for fuzzy search
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { label: string; value: string }[];
  icon?: React.ReactNode;
  allowGeolocation?: boolean;
  onGeolocationClick?: () => void;
  isLoadingLocation?: boolean;
}

export const Combobox = ({
  value,
  onChange,
  placeholder,
  options,
  icon,
  allowGeolocation,
  onGeolocationClick,
  isLoadingLocation,
}: ComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

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

  // To avoid hydration mismatch, check if window is defined without effect first if possible.
  // But for portals, effect is safest. NextJS might warn about cascading, so we suppress or refactor.
  useEffect(() => {
    // Adding setTimeout avoids the synchronous cascading render warning
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!value) return options;

    const searchTerm = value.toLowerCase().trim();

    // Exact or substring match first
    const substringMatches = options.filter(o => o.label.toLowerCase().includes(searchTerm));
    if (substringMatches.length > 0) return substringMatches;

    // Fuzzy search fallback
    return options
      .map(option => ({
        ...option,
        distance: levenshteinDistance(searchTerm, option.label.toLowerCase()),
      }))
      .filter(option => option.distance <= 3) // Max 3 typos allowed
      .sort((a, b) => a.distance - b.distance);
  }, [value, options]);

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
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className={`w-full h-full bg-transparent ${icon ? 'pl-12' : 'pl-5'} pr-12 text-sm text-[#2F4157] placeholder:text-[#2F4157]/60 focus:outline-none`}
      />

      {allowGeolocation && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onGeolocationClick) onGeolocationClick();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-[#2F4157]/80 hover:text-[#2F4157] transition-colors"
          title="Use my location"
        >
          <Locate className={`w-4 h-4 ${isLoadingLocation ? 'animate-pulse text-[#2F4157]' : ''}`} />
        </button>
      )}

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && filteredOptions.length > 0 && (
            <motion.div
              id="combobox-dropdown-portal"
              data-lenis-prevent="true"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: `${dropdownPosition.top + 8}px`, // 8px for mt-2 equivalent
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                zIndex: 9999,
              }}
            >
              <div className="relative bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto hide-scrollbar py-2">
                {filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.label);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    {option.label}
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