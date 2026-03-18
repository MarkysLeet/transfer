"use client";
import { ReactLenis } from "lenis/react";

import { useEffect, useState } from "react";

export default function SmoothScroll({
  children,
  isMobile,
}: {
  children: React.ReactNode;
  isMobile: boolean;
}) {
  // If on desktop where we apply CSS native scroll snapping, we disable Lenis smooth scroll
  // completely by not wrapping in ReactLenis. We use the server-side detected `isMobile` flag
  // to avoid hydration mismatches entirely.
  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 0.8, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
