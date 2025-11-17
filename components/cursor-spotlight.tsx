"use client";

import { useEffect, useRef } from "react";

export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      node.style.opacity = "0";
      return;
    }

    let frame: number | null = null;
    let lastEvent: MouseEvent | null = null;

    const updateSpotlight = () => {
      if (!lastEvent) return;
      node.style.setProperty("--spot-x", `${lastEvent.clientX}px`);
      node.style.setProperty("--spot-y", `${lastEvent.clientY}px`);
      frame = null;
    };

    const handleMove = (event: MouseEvent) => {
      lastEvent = event;
      if (frame) return;
      frame = requestAnimationFrame(updateSpotlight);
    };

    window.addEventListener("pointermove", handleMove);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handleMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-70 mix-blend-screen"
      style={{
        background:
          "radial-gradient(600px at var(--spot-x, 50%) var(--spot-y, 50%), rgba(45, 212, 191, 0.25), transparent 70%)",
      }}
    />
  );
}
