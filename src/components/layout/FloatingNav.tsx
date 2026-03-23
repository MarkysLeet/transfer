"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";

import { useTranslations } from "next-intl";

export const FloatingNav = () => {
  const t = useTranslations("Navigation");
  const [activeSection, setActiveSection] = useState("hero");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSectionRef = useRef<string | null>(null);

  const throttledSetActiveSection = useCallback((id: string) => {
    if (timeoutRef.current === null) {
      setActiveSection(id);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        if (pendingSectionRef.current) {
          setActiveSection(pendingSectionRef.current);
          pendingSectionRef.current = null;
        }
      }, 100);
    } else {
      pendingSectionRef.current = id;
    }
  }, []);

  const sections = useMemo(() => [
    { id: "hero", label: t("home") },
    { id: "fleet", label: t("fleet") },
    { id: "destinations", label: t("routes") },
    { id: "how-it-works", label: t("booking") },
    { id: "reviews", label: t("reviews") },
    { id: "faq", label: t("faq") }
  ], [t]);

  const [isDesktop, setIsDesktop] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            throttledSetActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px", // Trigger when section is around the center
        threshold: 0
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isDesktop, throttledSetActiveSection, sections]);

  const scrollTo = (id: string) => {
    if (lenis) {
      lenis.scrollTo(`#${id}`, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isDesktop) return null;

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-end gap-4 mix-blend-difference text-white">
      {sections.map(({ id, label }) => {
        const isActive = activeSection === id;
        return (
          <div key={id} className="group relative flex items-center justify-end cursor-pointer" onClick={() => scrollTo(id)}>
            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-6 text-sm font-medium tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
            <div className="relative flex items-center justify-center w-1.5 h-8">
              <div className={`w-1.5 h-1.5 rounded-full bg-white transition-all duration-300 ${isActive ? "opacity-0" : "opacity-50 group-hover:opacity-100 group-hover:h-3"}`} />
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute w-1.5 h-8 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
