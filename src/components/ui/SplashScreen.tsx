"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Wait for initial hydration + an enforced minimum display time (1200ms)
    // to give a smooth, native app-like first impression.
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white"
        >
          {/* Logo with breathing animation */}
          <motion.div
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [0.98, 1, 0.98],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <Image
              src="/icons/logo.png"
              alt="Black Diamond Transfer"
              width={200}
              height={200}
              priority
              className="object-contain"
            />
          </motion.div>

          {/* Golden Progress Line */}
          <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-gray-100">
            <motion.div
              className="h-full bg-[#C5A059] rounded-full"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
