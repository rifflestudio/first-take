"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import CustomCursor from "../components/CustomCursor";
import ThemeToggle from "../components/ThemeToggle";
import LogoSmall from "../components/logo-small/Logo.small";
import type { Team } from "@/lib/supabase/client";

const ROLES = [
  { value: "rapper", label: "rapper" },
  { value: "producer", label: "producer" },
  { value: "dj", label: "dj" },
  { value: "singer", label: "singer" },
  { value: "artist", label: "artist / other creative" },
  { value: "other", label: "just here for the vibes" },
];

export default function JoinPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [role, setRole] = useState("other");
  const [teamId, setTeamId] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    fetch("/api/teams")
      .then((r) => r.json())
      .then((data) => {
        if (data.teams) setTeams(data.teams);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      setError("your name is required");
      return;
    }

    setSubmitting(true);
    setError("");

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_name: displayName.trim(),
        instagram: instagram.trim() || null,
        role,
        team_id: teamId || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "something went wrong. try again.");
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
  };

  const labelStyle = {
    fontFamily: "var(--font-triplex-1mm)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.35em",
    textTransform: "uppercase" as const,
    color: isDark ? "rgba(255,255,255,0.48)" : "rgba(21,21,22,0.48)",
    display: "block",
    marginBottom: "8px",
  };

  const inputStyle = {
    fontFamily: "var(--font-triplex-2mm)",
    fontSize: "18px",
    backgroundColor: isDark ? "var(--surface-card)" : "var(--surface-panel)",
    color: isDark ? "rgba(255,255,255,0.88)" : "rgba(21,21,22,0.88)",
    borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(21,21,22,0.12)",
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    borderWidth: "1px",
    borderStyle: "solid",
    outline: "none",
    transition: "border-color 0.2s",
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col bg-surface text-primary transition-colors">
        <CustomCursor />
        <header className="relative z-30 flex items-center justify-between px-6 py-6 md:px-12">
          <Link href="/">
            <LogoSmall className="h-7 w-auto" />
          </Link>
        </header>
        <main className="flex flex-1 flex-col items-start justify-center px-6 pb-24 md:px-12">
          <p
            style={{
              fontFamily: "var(--font-triplex-1mm)",
              fontSize: "11px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#d0ff54",
              marginBottom: "16px",
            }}
          >
            you&apos;re in.
          </p>
          <h1
            style={{
              fontFamily: "var(--font-triplex-2mm)",
              fontSize: "clamp(28px, 6vw, 48px)",
              fontWeight: 400,
              color: isDark ? "rgba(255,255,255,0.88)" : "rgba(21,21,22,0.88)",
              lineHeight: 1.1,
              marginBottom: "24px",
            }}
          >
            welcome to
            <br />
            first take.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-triplex-2mm)",
              fontSize: "18px",
              color: isDark ? "rgba(255,255,255,0.48)" : "rgba(21,21,22,0.48)",
              lineHeight: 1.4,
              marginBottom: "40px",
              maxWidth: "400px",
            }}
          >
            bring the rawest thing you&apos;ve got. the first take is always the most honest.
          </p>
          <div className="flex gap-3 flex-wrap">
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
              join the queue
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.35em] transition hover:translate-y-0.5"
              style={{
                borderColor: isDark ? "rgba(255,255,255,0.16)" : "rgba(21,21,22,0.16)",
                color: isDark ? "rgba(255,255,255,0.64)" : "rgba(21,21,22,0.64)",
                fontFamily: "var(--font-triplex-1mm)",
              }}
            >
              back home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-surface text-primary transition-colors">
      <CustomCursor />

      {/* Desktop theme toggle */}
      <div className="hidden md:fixed md:block md:right-12 md:top-1/2 md:-translate-y-1/2 z-40">
        <ThemeToggle />
      </div>

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/">
          <LogoSmall className="h-7 w-auto" />
        </Link>
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 pb-24 md:px-12">
        {/* Page title */}
        <div className="mb-8 max-w-lg">
          <p
            style={{
              fontFamily: "var(--font-triplex-1mm)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: isDark ? "rgba(255,255,255,0.40)" : "rgba(21,21,22,0.40)",
              marginBottom: "8px",
            }}
          >
            first take · bangalore
          </p>
          <h1
            style={{
              fontFamily: "var(--font-triplex-2mm)",
              fontSize: "clamp(28px, 6vw, 44px)",
              fontWeight: 400,
              color: isDark ? "rgba(255,255,255,0.88)" : "rgba(21,21,22,0.88)",
              lineHeight: 1.1,
              marginBottom: "12px",
            }}
          >
            sign up
          </h1>
          <p
            style={{
              fontFamily: "var(--font-triplex-2mm)",
              fontSize: "16px",
              color: isDark ? "rgba(255,255,255,0.40)" : "rgba(21,21,22,0.40)",
              lineHeight: 1.4,
            }}
          >
            let everyone know you&apos;re here.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" style={labelStyle}>
              your name *
            </label>
            <input
              id="name"
              type="text"
              required
              autoFocus
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="what do people call you?"
              className="waitlist-input focus:border-[#d0ff54]"
              style={inputStyle}
            />
          </div>

          {/* Instagram */}
          <div>
            <label htmlFor="instagram" style={labelStyle}>
              instagram
            </label>
            <input
              id="instagram"
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@handle (optional)"
              className="waitlist-input focus:border-[#d0ff54]"
              style={inputStyle}
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" style={labelStyle}>
              what do you make?
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="focus:border-[#d0ff54]"
              style={{
                ...inputStyle,
                appearance: "none",
                cursor: "pointer",
              }}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Team */}
          {teams.length > 0 && (
            <div>
              <label htmlFor="team" style={labelStyle}>
                team (optional)
              </label>
              <select
                id="team"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="focus:border-[#d0ff54]"
                style={{
                  ...inputStyle,
                  appearance: "none",
                  cursor: "pointer",
                }}
              >
                <option value="">no team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <p
              style={{
                fontFamily: "var(--font-triplex-1mm)",
                fontSize: "12px",
                color: "#ff6b6b",
                letterSpacing: "0.1em",
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            data-cursor-dark
            className="w-full rounded-full py-4 text-[11px] font-semibold uppercase tracking-[0.35em] shadow-button transition hover:translate-y-0.5 active:translate-y-0.5 disabled:opacity-50"
            style={{
              backgroundColor: "#d0ff54",
              color: "#000000",
              fontFamily: "var(--font-triplex-1mm)",
            }}
          >
            {submitting ? "signing up..." : "i'm here"}
          </button>
        </form>
      </main>
    </div>
  );
}
