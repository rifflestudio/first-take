"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import CustomCursor from "../components/CustomCursor";
import ThemeToggle from "../components/ThemeToggle";
import LogoSmall from "../components/logo-small/Logo.small";
import type { User } from "@/lib/supabase/client";

interface TeamWithMembers {
  id: string;
  name: string;
  color: string;
  created_at: string;
  members: User[];
}

const ROLE_LABELS: Record<string, string> = {
  rapper: "rapper",
  producer: "producer",
  dj: "dj",
  singer: "singer",
  artist: "artist",
  other: "other",
};

export default function TeamsPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    fetch("/api/teams")
      .then((r) => r.json())
      .then((data) => {
        if (data.teams) setTeams(data.teams);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const labelStyle = {
    fontFamily: "var(--font-triplex-1mm)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.35em",
    textTransform: "uppercase" as const,
    color: isDark ? "rgba(255,255,255,0.40)" : "rgba(21,21,22,0.40)",
  };

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
        <div className="mb-8">
          <p style={labelStyle} className="mb-2">
            first take · bangalore
          </p>
          <h1
            style={{
              fontFamily: "var(--font-triplex-2mm)",
              fontSize: "clamp(28px, 6vw, 44px)",
              fontWeight: 400,
              color: isDark ? "rgba(255,255,255,0.88)" : "rgba(21,21,22,0.88)",
              lineHeight: 1.1,
            }}
          >
            the crews
          </h1>
        </div>

        {loading ? (
          <div style={{ ...labelStyle, color: isDark ? "rgba(255,255,255,0.32)" : "rgba(21,21,22,0.32)" }}>
            loading...
          </div>
        ) : teams.length === 0 ? (
          <div className="mt-8">
            <p
              style={{
                fontFamily: "var(--font-triplex-2mm)",
                fontSize: "20px",
                color: isDark ? "rgba(255,255,255,0.32)" : "rgba(21,21,22,0.32)",
                lineHeight: 1.4,
              }}
            >
              no teams yet.
              <br />
              first take is a solo affair today.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: isDark ? "var(--surface-card)" : "var(--surface-panel)",
                  borderLeft: `3px solid ${team.color}`,
                  boxShadow: isDark
                    ? `0 0 40px ${team.color}0a`
                    : "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                {/* Team name */}
                <h2
                  style={{
                    fontFamily: "var(--font-triplex-2mm)",
                    fontSize: "clamp(20px, 4vw, 26px)",
                    fontWeight: 400,
                    color: isDark ? "rgba(255,255,255,0.88)" : "rgba(21,21,22,0.88)",
                    marginBottom: "20px",
                    lineHeight: 1.1,
                  }}
                >
                  {team.name}
                </h2>

                {/* Members */}
                {team.members && team.members.length > 0 ? (
                  <ul className="flex flex-col gap-3">
                    {team.members.map((member) => (
                      <li key={member.id} className="flex items-center gap-3">
                        {/* Color dot */}
                        <span
                          className="flex-shrink-0 rounded-full"
                          style={{
                            width: "6px",
                            height: "6px",
                            backgroundColor: team.color,
                            opacity: 0.8,
                          }}
                        />
                        <div className="flex flex-col gap-0.5">
                          <span
                            style={{
                              fontFamily: "var(--font-triplex-2mm)",
                              fontSize: "16px",
                              color: isDark ? "rgba(255,255,255,0.72)" : "rgba(21,21,22,0.72)",
                            }}
                          >
                            {member.display_name}
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-triplex-1mm)",
                              fontSize: "11px",
                              letterSpacing: "0.2em",
                              textTransform: "uppercase",
                              color: isDark ? "rgba(255,255,255,0.32)" : "rgba(21,21,22,0.32)",
                            }}
                          >
                            {ROLE_LABELS[member.role] ?? member.role}
                          </span>
                        </div>
                        {member.instagram && (
                          <a
                            href={`https://instagram.com/${member.instagram.replace(/^@/, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              marginLeft: "auto",
                              fontFamily: "var(--font-triplex-1mm)",
                              fontSize: "11px",
                              letterSpacing: "0.15em",
                              textTransform: "uppercase",
                              color: isDark ? "rgba(255,255,255,0.24)" : "rgba(21,21,22,0.24)",
                              textDecoration: "none",
                            }}
                          >
                            @{member.instagram.replace(/^@/, "")}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    style={{
                      fontFamily: "var(--font-triplex-1mm)",
                      fontSize: "13px",
                      color: isDark ? "rgba(255,255,255,0.24)" : "rgba(21,21,22,0.24)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    no members yet
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
