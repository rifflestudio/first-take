"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

import CustomCursor from "./components/CustomCursor";
import ThemeToggle from "./components/ThemeToggle";
import MuteToggle from "./components/MuteToggle";
import VinylRecord from "./components/VinylRecord";
import LogoSmall from "./components/logo-small/Logo.small";
import { useAppLink } from "./hooks/useAppLink";
import CollaborativeCursors from "./components/CollaborativeCursors";
import ProductHuntLive from "./components/ProductHuntLive";

const manifestoLinesLight: string[] = [
  "before we learned to speak, we had music.",
  "before instruments, we had hands and stones.",
  "before sound engineering, we had raw expression.",
  "until one day, instinct buckled under the weight of its own evolution.",
  "tools replaced traditions that had carried us for thousands of years.",
  "artists became operators, forced to navigate soulless interfaces that killed their natural instincts.",
  "systems designed to free the music within us, trapped it instead.",
  "because the truth is, human expression cannot survive technical obedience.",
  "the only path back to musical freedom is through play.",
  "we exist to restore that freedom.",
  "an infinite playground where music returns to what it's always been: the most human form of expression.",
];

const manifestoLinesDark: string[] = [
  "our bodies carried rhythm long before we gave it a name.",
  "before we chained music to tools, it existed as raw, human expression.",
  "expression that now lies buried under layers of systems and settings.",
  "interfaces have hijacked the instinct we were born with.",
  "now we think too much and feel too little.",
  "we are reduced to technical operators, navigating soulless interfaces in search of things to say.",
  "we sing from inside a cage and wonder why our songs sound sterile.",
  "why our music is embalmed with the hideous colour of conformity.",
  "here's the truth: the only path to musical freedom is through play.",
  "we exist to restore that freedom.",
  "an infinite playground where music returns to what it's always been: the most human form of expression.",
];

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [activeLine, setActiveLine] = useState<number>(-1);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [hasScrolledToManifesto, setHasScrolledToManifesto] = useState(false);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const manifestoRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect scroll to manifesto section
  useEffect(() => {
    const checkManifestoScroll = () => {
      if (manifestoRef.current && !hasScrolledToManifesto) {
        const rect = manifestoRef.current.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.75;

        if (isInView) {
          setHasScrolledToManifesto(true);
        }
      }
    };

    checkManifestoScroll();
    window.addEventListener("scroll", checkManifestoScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkManifestoScroll);
    };
  }, [hasScrolledToManifesto]);

  // Scroll-based highlighting for manifesto lines
  const updateActiveLine = useCallback(() => {
    const viewportCenter = window.innerHeight / 2;
    let closestIndex = -1;
    let closestDistance = Infinity;

    lineRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);

        // Only consider elements that are at least partially visible
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      }
    });

    setActiveLine(closestIndex);
  }, []);

  useEffect(() => {
    updateActiveLine();
    window.addEventListener("scroll", updateActiveLine, { passive: true });
    window.addEventListener("resize", updateActiveLine, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateActiveLine);
      window.removeEventListener("resize", updateActiveLine);
    };
  }, [updateActiveLine]);

  const isDark = mounted && resolvedTheme === "dark";
  const { onClick: appLinkClick } = useAppLink();
  const APP_URL = "https://app.riffle.studio/login";

  useEffect(() => {
    const targetDate = new Date("2025-12-11T21:20:00+05:30"); // 9:20 PM IST

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const countdownDigits = [
    String(timeLeft.days).padStart(2, "0"),
    String(timeLeft.hours).padStart(2, "0"),
    String(timeLeft.minutes).padStart(2, "0"),
    String(timeLeft.seconds).padStart(2, "0"),
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-surface text-primary transition-colors">
      <CustomCursor />

      <header className="relative z-30">
        <div className="mx-auto flex max-w-[1164px] items-center justify-between px-6 py-6 md:px-[138px]">
          <Link href="/" className="flex items-center">
            <LogoSmall className="h-8 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-5">
            <ProductHuntLive />
            <a
              href="https://app.riffle.studio/login"
              onClick={appLinkClick(APP_URL)}
              className="inline-flex items-center justify-center rounded-full border border-transparent px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] shadow-button transition hover:translate-y-0.5 active:translate-y-0.5"
              style={{
                backgroundColor: isDark ? "#E8F986" : "rgba(21, 21, 22, 0.80)",
                color: isDark ? "#000000" : "#ffffff",
              }}
            >
              log in
            </a>
          </div>
        </div>
      </header>

      {/* Mobile: login + toggle stacked top-right */}
      <div className="absolute right-6 top-6 z-40 flex flex-col items-end gap-4 md:hidden">
        <ThemeToggle />
      </div>

      {/* Desktop: toggle fixed on right side */}
      <div className="hidden md:fixed md:block md:right-12 md:top-1/2 md:-translate-y-1/2 z-40">
        <ThemeToggle />
      </div>

      <main className="relative z-10 flex-1 pb-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden flex flex-col items-center justify-center text-center px-6" style={{ minHeight: "clamp(50vh, 60vh, 75vh)" }}>
          <CollaborativeCursors />
          <ProductHuntLive mobile />
          <p style={{
            fontFamily: "var(--font-triplex-2mm)",
            fontSize: "clamp(11px, 3vw, 18px)",
            fontWeight: 400,
            color: "var(--text-muted)",
            marginBottom: "14px",
            letterSpacing: "0.02em",
          }}>
            a new playground for music creation
          </p>
          <p style={{
            fontFamily: "var(--font-triplex-2mm)",
            fontSize: "clamp(32px, 8vw, 58px)",
            fontWeight: 400,
            lineHeight: "1.1",
            color: isDark ? "rgba(255, 255, 255, 0.80)" : "rgba(21, 21, 22, 0.80)",
            maxWidth: "639px",
            marginBottom: "40px",
            letterSpacing: "0.02em",
          }}>
            make music with your friends
          </p>
          <a
            href="https://app.riffle.studio/login"
            onClick={appLinkClick(APP_URL)}
            data-cursor-dark
            className="inline-flex items-center justify-center rounded-full border border-transparent shadow-button transition hover:translate-y-0.5 active:translate-y-0.5 text-[11px] font-semibold uppercase tracking-[0.35em]"
            style={{
              backgroundColor: "#E8F986",
              color: "#000000",
              width: "clamp(160px, 50vw, 235px)",
              height: "clamp(46px, 8vw, 61px)",
              fontFamily: "var(--font-triplex-2mm)",
              letterSpacing: "0.5em",
              boxShadow: isDark ? undefined : "0 8px 20px rgba(15, 15, 15, 0.08)",
            }}
          >
            go to app
          </a>
        </section>

        {/* Manifesto Section with Sticky Vinyl */}
        <section className="mx-auto mt-8 md:mt-16 max-w-[1200px] px-6 md:px-[120px]">
          <div className="flex flex-col lg:flex-row items-start lg:items-stretch gap-16">
            {/* Left: Vinyl Player Column - Sticky Container */}
            <div className="w-full lg:w-[40%] flex-shrink-0">
              <div className="lg:sticky lg:top-24 lg:h-fit z-10">
                <VinylRecord />
                <div className="mt-6 flex justify-center">
                  <MuteToggle onScrollToManifesto={hasScrolledToManifesto} />
                </div>
              </div>
            </div>

            {/* Right: Manifesto Column */}
            <article
              ref={manifestoRef}
              id="manifesto"
              className="flex-1 space-y-6 text-left"
              style={{
                fontFamily: "var(--font-triplex-2mm)",
                fontSize: "28px",
                lineHeight: "1.35",
                fontWeight: 400,
              }}
            >
              {(isDark ? manifestoLinesDark : manifestoLinesLight).map(
                (line, index) => {
                  const isActive = index === activeLine;
                  const isHovered = index === hoveredLine;

                  // Determine opacity: active > hovered > default
                  const getColor = () => {
                    if (isActive) {
                      return isDark
                        ? "rgba(255, 255, 255, 0.80)"
                        : "rgba(21, 21, 22, 0.80)";
                    }
                    if (isHovered) {
                      return isDark
                        ? "rgba(255, 255, 255, 0.35)"
                        : "rgba(21, 21, 22, 0.35)";
                    }
                    return isDark
                      ? "rgba(255, 255, 255, 0.20)"
                      : "rgba(21, 21, 22, 0.20)";
                  };

                  return (
                    <p
                      key={`manifesto-line-${index}`}
                      ref={(el) => {
                        lineRefs.current[index] = el;
                      }}
                      className="text-balance cursor-default transition-colors duration-100"
                      onMouseEnter={() => setHoveredLine(index)}
                      onMouseLeave={() => setHoveredLine(null)}
                      style={{ color: getColor() }}
                    >
                      {line}
                    </p>
                  );
                }
              )}
            </article>
          </div>
        </section>
      </main>

      <footer className="mt-auto bg-surface px-6 py-12 md:px-[120px]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-12 md:flex-row md:justify-between">
          <div>
            <LogoSmall className="mb-6 h-8 w-auto" />
          </div>
          <div className="grid gap-12 sm:grid-cols-2 md:gap-16">
            <div>
              <p
                className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: isDark
                    ? "rgba(255, 255, 255, 0.64)"
                    : "rgba(21, 21, 22, 0.64)",
                }}
              >
                Company
              </p>
              <ul className="space-y-3 text-[13px] uppercase tracking-[0.15em]">
                <li>
                  <a
                    className="footer-link"
                    style={{
                      color: isDark
                        ? "rgba(255, 255, 255, 0.48)"
                        : "rgba(21, 21, 22, 0.48)",
                    }}
                    href="https://docs.riffle.studio/hiring"
                    target="_blank"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    className="footer-link"
                    style={{
                      color: isDark
                        ? "rgba(255, 255, 255, 0.48)"
                        : "rgba(21, 21, 22, 0.48)",
                    }}
                    href="mailto:hi@riffle.studio"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p
                className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: isDark
                    ? "rgba(255, 255, 255, 0.64)"
                    : "rgba(21, 21, 22, 0.64)",
                }}
              >
                Socials
              </p>
              <ul className="space-y-3 text-[13px] uppercase tracking-[0.15em]">
                <li>
                  <a
                    className="footer-link"
                    style={{
                      color: isDark
                        ? "rgba(255, 255, 255, 0.48)"
                        : "rgba(21, 21, 22, 0.48)",
                    }}
                    href="https://www.instagram.com/riffledotstudio"
                    target="_blank"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    className="footer-link"
                    style={{
                      color: isDark
                        ? "rgba(255, 255, 255, 0.48)"
                        : "rgba(21, 21, 22, 0.48)",
                    }}
                    href="https://x.com/riffledotstudio"
                    target="_blank"
                  >
                    X/Twitter
                  </a>
                </li>
                <li>
                  <a
                    className="footer-link"
                    style={{
                      color: isDark
                        ? "rgba(255, 255, 255, 0.48)"
                        : "rgba(21, 21, 22, 0.48)",
                    }}
                    href="https://www.linkedin.com/company/rifflestudio/"
                    target="_blank"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1200px] flex-wrap-reverse md:flex-wrap justify-between gap-4 md:gap-8 border-t border-soft pt-8 text-[11px] uppercase tracking-[0.15em]">
          <p
            style={{
              color: isDark
                ? "rgba(255, 255, 255, 0.48)"
                : "rgba(21, 21, 22, 0.48)",
              fontWeight: 400,
            }}
          >
            © 2026 Riffle. All rights reserved.
          </p>
          <Link
            className="footer-link"
            style={{
              color: isDark
                ? "rgba(255, 255, 255, 0.48)"
                : "rgba(21, 21, 22, 0.48)",
            }}
            href="/privacy"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
