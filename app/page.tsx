"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import CustomCursor from "./components/CustomCursor";
import ThemeToggle from "./components/ThemeToggle";
import LogoSmall from "./components/logo-small/Logo.small";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [signedUpName, setSignedUpName] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("firsttake_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.display_name) setSignedUpName(parsed.display_name);
      }
    } catch {}
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div
      className="relative flex min-h-screen flex-col bg-surface text-primary transition-colors"
      style={{ overflowX: "hidden" }}
    >
      <CustomCursor />

      {/* Desktop theme toggle — fixed right */}
      <div className="hidden md:fixed md:block md:right-12 md:top-1/2 md:-translate-y-1/2 z-40">
        <ThemeToggle />
      </div>

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between px-6 py-6 md:px-12">
        <LogoSmall className="h-7 w-auto" />
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </header>

      {/* Main — poster layout */}
      <main className="relative z-10 flex flex-1 flex-col items-start justify-center px-6 pb-24 md:px-12">
        {/* Event label */}
        <p
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em]"
          style={{ color: isDark ? "rgba(255,255,255,0.48)" : "rgba(21,21,22,0.48)" }}
        >
          riffle · bangalore · april 11
        </p>

        {/* Event title — large display */}
        <h1
          style={{
            fontFamily: "var(--font-triplex-3mm)",
            fontSize: "clamp(64px, 18vw, 200px)",
            fontWeight: 400,
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            color: isDark ? "rgba(255,255,255,0.88)" : "rgba(21,21,22,0.88)",
            marginBottom: "clamp(16px, 4vw, 40px)",
          }}
        >
          first
          <br />
          take
        </h1>

        {/* Manifesto line */}
        <p
          style={{
            fontFamily: "var(--font-triplex-2mm)",
            fontSize: "clamp(16px, 3vw, 22px)",
            fontWeight: 400,
            lineHeight: 1.45,
            color: isDark ? "rgba(255,255,255,0.56)" : "rgba(21,21,22,0.56)",
            maxWidth: "420px",
            marginBottom: "clamp(24px, 5vw, 48px)",
          }}
        >
          no polish. no second takes.
          <br />
          just what you made.
        </p>

        {/* Event details */}
        <div
          className="mb-10 flex flex-col gap-1"
          style={{
            fontFamily: "var(--font-triplex-1mm)",
            fontSize: "13px",
            fontWeight: 400,
            letterSpacing: "0.08em",
            color: isDark ? "rgba(255,255,255,0.32)" : "rgba(21,21,22,0.32)",
          }}
        >
          <span>11:30 AM &nbsp;·&nbsp; The Draft by Riffle</span>
        </div>

        {/* CTAs — guided flow: sign up first, then book studio time */}
        {signedUpName ? (
          <>
            <p
              className="mb-4"
              style={{
                fontFamily: "var(--font-triplex-1mm)",
                fontSize: "12px",
                letterSpacing: "0.2em",
                color: isDark ? "rgba(255,255,255,0.40)" : "rgba(21,21,22,0.40)",
              }}
            >
              welcome back, {signedUpName}.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/queue"
                data-cursor-dark
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.35em] shadow-button transition hover:translate-y-0.5 active:translate-y-0.5"
                style={{
                  backgroundColor: "#d0ff54",
                  color: "#000000",
                  fontFamily: "var(--font-triplex-1mm)",
                }}
              >
                book studio time
              </Link>
              <Link
                href="/teams"
                className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.35em] transition hover:translate-y-0.5 active:translate-y-0.5"
                style={{
                  borderColor: isDark ? "rgba(255,255,255,0.16)" : "rgba(21,21,22,0.16)",
                  color: isDark ? "rgba(255,255,255,0.64)" : "rgba(21,21,22,0.64)",
                  fontFamily: "var(--font-triplex-1mm)",
                }}
              >
                see teams
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/join"
              data-cursor-dark
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.35em] shadow-button transition hover:translate-y-0.5 active:translate-y-0.5"
              style={{
                backgroundColor: "#d0ff54",
                color: "#000000",
                fontFamily: "var(--font-triplex-1mm)",
              }}
            >
              sign up
            </Link>
            <Link
              href="/queue"
              className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.35em] transition hover:translate-y-0.5 active:translate-y-0.5"
              style={{
                borderColor: isDark ? "rgba(255,255,255,0.16)" : "rgba(21,21,22,0.16)",
                color: isDark ? "rgba(255,255,255,0.64)" : "rgba(21,21,22,0.64)",
                fontFamily: "var(--font-triplex-1mm)",
              }}
            >
              book studio time
            </Link>
            <Link
              href="/teams"
              className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.35em] transition hover:translate-y-0.5 active:translate-y-0.5"
              style={{
                borderColor: isDark ? "rgba(255,255,255,0.16)" : "rgba(21,21,22,0.16)",
                color: isDark ? "rgba(255,255,255,0.64)" : "rgba(21,21,22,0.64)",
                fontFamily: "var(--font-triplex-1mm)",
              }}
            >
              see teams
            </Link>
          </div>
        )}
      </main>

      {/* Subtle bottom rule */}
      <footer className="relative z-10 px-6 py-6 md:px-12">
        <div
          className="flex items-center justify-between"
          style={{
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(21,21,22,0.08)"}`,
            paddingTop: "20px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-triplex-1mm)",
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: isDark ? "rgba(255,255,255,0.32)" : "rgba(21,21,22,0.32)",
              textTransform: "uppercase",
            }}
          >
            © 2026 Riffle
          </p>
          <Link
            href="/admin"
            style={{
              fontFamily: "var(--font-triplex-1mm)",
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: isDark ? "rgba(255,255,255,0.20)" : "rgba(21,21,22,0.20)",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
