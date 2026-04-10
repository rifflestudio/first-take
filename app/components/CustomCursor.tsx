"use client";

import { useEffect, useRef, useState } from "react";

interface TrailParticle {
  x: number;
  y: number;
  timestamp: number;
}

// Check if device has touch capability and no fine pointer (i.e., touch-only device)
function isTouchDevice(): boolean {
  if (typeof window === "undefined") return true;
  return !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

// Check if an element is clickable
function isClickableElement(element: HTMLElement): boolean {
  return !!(
    element.closest("button") ||
    element.closest("a") ||
    element.closest("[data-slot='button']") ||
    element.closest("[role='button']") ||
    element.tagName === "BUTTON" ||
    element.tagName === "A"
  );
}

// Check if cursor should invert to dark (e.g. over a light/lime button)
function isCursorDarkElement(element: HTMLElement): boolean {
  return !!(
    element.closest("[data-cursor-dark]")
  );
}

export default function CustomCursor() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isClickable, setIsClickable] = useState(false);
  const [isCursorDark, setIsCursorDark] = useState(false);
  const [isTouchOnly, setIsTouchOnly] = useState(true);
  const trailsRef = useRef<TrailParticle[]>([]);
  const [, forceUpdate] = useState(0);
  const lastUpdateRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);

  // Check for touch device on mount
  useEffect(() => {
    setIsTouchOnly(isTouchDevice());

    // Also listen for media query changes
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsTouchOnly(!e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Don't set up cursor tracking on touch devices
    if (isTouchOnly) return;

    let lastTrailTime = 0;
    const trailDelay = 20; // More frequent trail particles
    const maxAge = 200; // Particles decay after 200ms
    const maxTrails = 15; // More dense trail

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      setCursorPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      setIsClickable(isClickableElement(target));
      setIsCursorDark(isCursorDarkElement(target));

      // Add trail particle
      if (now - lastTrailTime > trailDelay) {
        trailsRef.current.push({
          x: e.clientX,
          y: e.clientY,
          timestamp: now,
        });

        // Keep only maxTrails particles
        if (trailsRef.current.length > maxTrails) {
          trailsRef.current.shift();
        }

        lastTrailTime = now;
      }
    };

    // Cleanup old trails on each animation frame
    const cleanupLoop = () => {
      const now = performance.now();

      // Only update if 16ms has passed (60fps)
      if (now - lastUpdateRef.current > 16) {
        // Remove particles older than maxAge
        trailsRef.current = trailsRef.current.filter(
          (particle) => now - particle.timestamp < maxAge
        );

        // Force re-render only if trails changed
        if (trailsRef.current.length > 0) {
          forceUpdate((n) => n + 1);
        }

        lastUpdateRef.current = now;
      }

      rafRef.current = requestAnimationFrame(cleanupLoop);
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(cleanupLoop);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isTouchOnly]);

  // Don't render on touch devices
  if (isTouchOnly) return null;

  const now = performance.now();

  return (
    <>
      {/* Main cursor */}
      <div
        className={`cursor-main ${isClickable ? "cursor-clickable" : ""}`}
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          ...(isCursorDark && { backgroundColor: "#000000" }),
        }}
      />

      {/* Trail particles */}
      {trailsRef.current.map((particle, index) => {
        const age = now - particle.timestamp;
        const ageProgress = age / 200; // 0 to 1 over 200ms
        const positionProgress = (index + 1) / trailsRef.current.length;

        // Size decreases with age and position
        const size = 16 * (1 - ageProgress * 0.7);
        // Opacity decreases quickly with age
        const opacity = (1 - ageProgress) * positionProgress * 0.6;

        return (
          <div
            key={`${particle.timestamp}-${index}`}
            className={`cursor-trail ${isClickable ? "cursor-clickable" : ""}`}
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity,
              transform: `translate(-50%, -50%)`,
              willChange: "opacity, transform",
            }}
          />
        );
      })}
    </>
  );
}
