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

  // On desktop, we want native CSS scroll-snapping (which usually conflicts with Lenis smooth scrolling).
  // Therefore, we disable Lenis (or remove it entirely from the tree) on lg+ screens to let snap-y work flawlessly.
  if (isDesktop) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 0.8, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
