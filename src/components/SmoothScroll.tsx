"use client";
import { ReactLenis } from "lenis/react";

import { useEffect, useState } from "react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // If on desktop where we apply CSS native scroll snapping, we disable Lenis smooth scroll
  // Because Lenis and native CSS scroll-snap fight each other.
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 0.8, smoothWheel: true, orientation: 'vertical', gestureOrientation: 'vertical' }} autoProps={{ enable: !isDesktop }}>
      {children}
    </ReactLenis>
  );
}
