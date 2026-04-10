"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface VinylRecordProps {
  className?: string;
}

export default function VinylRecord({ className = "" }: VinylRecordProps) {
  const [mounted, setMounted] = useState(false);
  const vinylRef = useRef<HTMLDivElement>(null);
  const vinylDiscRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const targetRotation = useRef(0);
  const displayedRotation = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    // Smoothing factor: lower = smoother/slower, higher = snappier
    // 0.12 gives a nice physics-like feel
    const smoothing = 0.12;

    const animate = () => {
      if (!vinylDiscRef.current) {
        animationFrameId.current = requestAnimationFrame(animate);
        return;
      }

      // Interpolate toward target rotation
      const diff = targetRotation.current - displayedRotation.current;

      // Only update if there's a meaningful difference
      if (Math.abs(diff) > 0.01) {
        displayedRotation.current += diff * smoothing;
        vinylDiscRef.current.style.transform = `rotate(${displayedRotation.current}deg)`;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      // Rotation speed multiplier (adjust for faster/slower rotation)
      const rotationSpeed = 0.15;

      // Update target rotation based on scroll
      // Scroll down = clockwise (positive), scroll up = counter-clockwise (negative)
      targetRotation.current += scrollDelta * rotationSpeed;

      lastScrollY.current = currentScrollY;
    };

    // Initialize
    lastScrollY.current = window.scrollY;

    // Start animation loop
    animationFrameId.current = requestAnimationFrame(animate);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div ref={vinylRef} className={className}>
      {/* Vinyl Record */}
      <div className="relative mx-auto w-full max-w-[480px]">
        {/* Glow effect */}
        <div className="pointer-events-none absolute inset-4 -z-10 bg-[radial-gradient(circle_at_top,#ffffff_0%,transparent_60%)] opacity-60 blur-[90px] dark:bg-[radial-gradient(circle_at_top,#ffffff33_0%,transparent_70%)] dark:opacity-40" />

        {/* Outer vinyl */}
        <div
          ref={vinylDiscRef}
          className="relative aspect-square w-full rounded-full shadow-record"
          style={{
            willChange: "transform",
            background: isDark
              ? "radial-gradient(circle at 35% 35%, #fdfdfd 0%, #9e9e9e 50%, #505050 85%)"
              : "radial-gradient(circle at 30% 30%, #4a4a4a 0%, #2a2a2a 40%, #1a1a1a 70%, #101010 100%)",
          }}
        >
          {/* Grooves */}
          <div
            className="absolute inset-[5%] rounded-full"
            style={{
              background: isDark
                ? "radial-gradient(circle, #f7f7f7 0%, #8d8d8d 60%, #505050 100%)"
                : "radial-gradient(circle, #3a3a3a 0%, #252525 50%, #151515 100%)",
            }}
          >
            {Array.from({ length: 36 }).map((_, i) => {
              const percentage = 100 - (i + 1) * 2;
              if (percentage <= 0) return null;
              return (
                <div
                  key={`groove-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${percentage}%`,
                    height: `${percentage}%`,
                    top: `${(100 - percentage) / 2}%`,
                    left: `${(100 - percentage) / 2}%`,
                    opacity: Math.max(0.05, 0.65 - i * 0.015),
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(255,255,255,0.15)",
                  }}
                />
              );
            })}
          </div>

          {/* Center label - rotates with the vinyl */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex aspect-square w-[58%] items-center justify-center overflow-hidden rounded-full">
              {/* Vinyl cover image */}
              <img
                src={isDark ? "/vinyl-cover-2.png" : "/vinyl-cover-3.png"}
                alt="Vinyl cover"
                className="h-full w-full object-cover"
              />
              {/* Center hole */}
              <div className="absolute h-6 w-6 rounded-full bg-gradient-to-b from-[#161616] to-[#000000]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
