"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Locate } from "lucide-react";

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    <div className="relative" ref={containerRef}>
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400">
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
        className={`w-full bg-white/70 focus:bg-white border border-white/60 focus:border-white focus:shadow-md rounded-2xl py-3.5 ${icon ? 'pl-12' : 'pl-5'} pr-12 text-slate-900 placeholder:text-slate-500 focus:outline-none transition-all duration-300`}
      />

      {allowGeolocation && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onGeolocationClick) onGeolocationClick();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Use my location"
        >
          <Locate className={`w-4 h-4 ${isLoadingLocation ? 'animate-pulse text-slate-900' : ''}`} />
        </button>
      )}

      <AnimatePresence>
        {isOpen && filteredOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 py-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-60 overflow-y-auto hide-scrollbar"
          >
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.label);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};