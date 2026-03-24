"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "@/store/useBookingStore";
import { BookingModalContent } from "./BookingModalContent";

export const BookingModalDesktop = () => {
  const { isOpen, setIsOpen } = useBookingStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: "100%", y: 0 }}
          animate={{ x: 0, y: 0 }}
          exit={{ x: "100%", y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-[450px] max-w-[100vw] bg-[#F4EFEB] h-[100dvh] shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="flex flex-col flex-1 min-h-0 relative">
            <BookingModalContent />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
