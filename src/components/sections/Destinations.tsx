
"use client";

import { useState, useEffect } from "react";
import { DestinationsDesktop } from "./DestinationsDesktop";
import { DestinationsMobile } from "./DestinationsMobile";

export const Destinations = () => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  if (isDesktop === null) {
    return <section className="min-h-screen bg-[#FAFAFA]" aria-hidden="true" />;
  }

  return isDesktop ? <DestinationsDesktop /> : <DestinationsMobile />;
};
