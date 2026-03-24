"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { useBookingStore } from "@/store/useBookingStore";
import { BookingModalDesktop } from "./BookingModalDesktop";
import { BookingModalMobile } from "./BookingModalMobile";

export const BookingModal = () => {
  const { isOpen } = useBookingStore();
  const lenis = useLenis();

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle global scroll lock for lenis and body
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

  if (!mounted) return null;

  return isMobile ? <BookingModalMobile /> : <BookingModalDesktop />;
};
