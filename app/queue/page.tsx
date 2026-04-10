"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { getSupabaseClient, type QueueEntry } from "@/lib/supabase/client";
import CustomCursor from "../components/CustomCursor";
import ThemeToggle from "../components/ThemeToggle";
import LogoSmall from "../components/logo-small/Logo.small";

// Slot duration = 30 minutes
const SLOT_DURATION_MS = 30 * 60 * 1000;

function formatTime(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function CountdownTimer({ startedAt }: { startedAt: string }) {
  const [remaining, setRemaining] = useState(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const update = () => {
      const startMs = new Date(startedAt).getTime();
      const endMs = startMs + SLOT_DURATION_MS;
      const now = Date.now();
      setRemaining(Math.max(0, endMs - now));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const isDark = mounted && resolvedTheme === "dark";
  const isWarning = remaining > 0 && remaining < 5 * 60 * 1000;
  const isOver = remaining === 0;

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="countdown-timer tabular-nums transition-colors"
        style={{
          fontFamily: "var(--font-triplex-3mm)",
          color: isOver
            ? isDark ? "rgba(255,100,100,0.9)" : "rgba(180,0,0,0.8)"
            : isWarning
            ? isDark ? "rgba(255,165,0,0.9)" : "rgba(180,100,0,0.9)"
            : "#d0ff54",
          lineHeight: 1,
          display: "block",
        }}
      >
        {formatTime(remaining)}
      </span>
      <span
        style={{
          fontFamily: "var(--font-triplex-1mm)",
          fontSize: "11px",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: isDark ? "rgba(255,255,255,0.40)" : "rgba(21,21,22,0.40)",
        }}
      >
        {isOver ? "time up" : "remaining"}
      </span>
    </div>
  );
}

export default function QueuePage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinDrawer, setShowJoinDrawer] = useState(false);
  const [joinName, setJoinName] = useState("");
  const [joinSubmitting, setJoinSubmitting] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const fetchQueue = useCallback(async () => {
    const res = await fetch("/api/queue");
    const data = await res.json();
    if (data.queue) {
      setQueue(data.queue);
    }
    setLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  // Realtime subscription
  useEffect(() => {
    const client = getSupabaseClient();
    const channel = client
      .channel("queue-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "queue" },
        () => {
          fetchQueue();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [fetchQueue]);

  // Close drawer on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setShowJoinDrawer(false);
      }
    };
    if (showJoinDrawer) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showJoinDrawer]);

  const handleJoin = async () => {
    if (!joinName.trim()) {
      setJoinError("enter your name to join");
      return;
    }

    setJoinSubmitting(true);
    setJoinError("");

    const res = await fetch("/api/queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: joinName.trim() }),
    });

    const data = await res.json();

    if (!res.ok) {
      setJoinError(data.error || "something went wrong");
      setJoinSubmitting(false);
      return;
    }

    setJoinSuccess(true);
    setJoinName("");
    setJoinSubmitting(false);
    fetchQueue();

    setTimeout(() => {
      setJoinSuccess(false);
      setShowJoinDrawer(false);
    }, 2500);
  };

  const activeEntry = queue.find((e) => e.status === "active");
  const waitingEntries = queue.filter((e) => e.status === "waiting");
  const pastEntries = queue.filter((e) => e.status === "done" || e.status === "no_show");

  const labelStyle = {
    fontFamily: "var(--font-triplex-1mm)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.35em",
    textTransform: "uppercase" as const,
    color: isDark ? "rgba(255,255,255,0.40)" : "rgba(21,21,22,0.40)",
  };

  const nameStyle = {
    fontFamily: "var(--font-triplex-2mm)",
    fontSize: "clamp(18px, 4vw, 24px)",
    fontWeight: 400,
    color: isDark ? "rgba(255,255,255,0.88)" : "rgba(21,21,22,0.88)",
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

      <main className="relative z-10 flex-1 px-6 pb-32 md:px-12">
        {/* Page title */}
        <div className="mb-8">
          <p style={labelStyle} className="mb-2">
            studio queue
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
            who&apos;s on deck
          </h1>
        </div>

        {loading ? (
          <div style={{ ...labelStyle, color: isDark ? "rgba(255,255,255,0.32)" : "rgba(21,21,22,0.32)" }}>
            loading...
          </div>
        ) : (
          <>
            {/* Active slot */}
            <section className="mb-10">
              <p style={labelStyle} className="mb-4">
                now playing
              </p>
              {activeEntry ? (
                <div
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: isDark ? "var(--surface-card)" : "var(--surface-panel)",
                    borderLeft: "3px solid #d0ff54",
                    boxShadow: isDark
                      ? "0 0 40px rgba(208,255,84,0.06)"
                      : "0 4px 20px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <span
                        className="mb-1 block"
                        style={{
                          ...labelStyle,
                          color: "#d0ff54",
                          fontSize: "10px",
                        }}
                      >
                        #{activeEntry.position}
                      </span>
                      <span style={nameStyle}>{activeEntry.display_name}</span>
                    </div>
                    {activeEntry.started_at && (
                      <CountdownTimer startedAt={activeEntry.started_at} />
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: isDark ? "var(--surface-card)" : "var(--surface-panel)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(21,21,22,0.06)"}`,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-triplex-2mm)",
                      fontSize: "18px",
                      color: isDark ? "rgba(255,255,255,0.32)" : "rgba(21,21,22,0.32)",
                    }}
                  >
                    the stage is open.
                  </p>
                </div>
              )}
            </section>

            {/* Waiting list */}
            {waitingEntries.length > 0 && (
              <section className="mb-10">
                <p style={labelStyle} className="mb-4">
                  waiting ({waitingEntries.length})
                </p>
                <div className="flex flex-col gap-2">
                  {waitingEntries.map((entry, i) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-4 rounded-xl px-5 py-4 transition-colors"
                      style={{
                        backgroundColor:
                          i === 0
                            ? isDark
                              ? "rgba(208,255,84,0.06)"
                              : "rgba(208,255,84,0.12)"
                            : isDark
                            ? "var(--surface-card)"
                            : "var(--surface-panel)",
                        border: `1px solid ${
                          i === 0
                            ? "rgba(208,255,84,0.20)"
                            : isDark
                            ? "rgba(255,255,255,0.04)"
                            : "rgba(21,21,22,0.06)"
                        }`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-triplex-3mm)",
                          fontSize: "20px",
                          color: i === 0 ? "#d0ff54" : isDark ? "rgba(255,255,255,0.24)" : "rgba(21,21,22,0.24)",
                          minWidth: "32px",
                          lineHeight: 1,
                        }}
                      >
                        {entry.position}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-triplex-2mm)",
                          fontSize: "18px",
                          color:
                            i === 0
                              ? isDark ? "rgba(255,255,255,0.88)" : "rgba(21,21,22,0.88)"
                              : isDark ? "rgba(255,255,255,0.56)" : "rgba(21,21,22,0.56)",
                        }}
                      >
                        {entry.display_name}
                      </span>
                      {i === 0 && (
                        <span
                          style={{
                            marginLeft: "auto",
                            ...labelStyle,
                            color: "#d0ff54",
                            fontSize: "10px",
                          }}
                        >
                          up next
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Done / No-show (collapsed) */}
            {pastEntries.length > 0 && (
              <section>
                <p style={labelStyle} className="mb-4">
                  played ({pastEntries.length})
                </p>
                <div className="flex flex-col gap-1">
                  {pastEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-4 rounded-xl px-5 py-3"
                      style={{
                        backgroundColor: "transparent",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-triplex-1mm)",
                          fontSize: "13px",
                          color: isDark ? "rgba(255,255,255,0.20)" : "rgba(21,21,22,0.20)",
                          minWidth: "32px",
                        }}
                      >
                        {entry.position}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-triplex-2mm)",
                          fontSize: "16px",
                          color: isDark ? "rgba(255,255,255,0.24)" : "rgba(21,21,22,0.24)",
                          textDecoration: entry.status === "no_show" ? "line-through" : "none",
                        }}
                      >
                        {entry.display_name}
                      </span>
                      <span
                        style={{
                          marginLeft: "auto",
                          ...labelStyle,
                          fontSize: "10px",
                          color: isDark ? "rgba(255,255,255,0.20)" : "rgba(21,21,22,0.20)",
                        }}
                      >
                        {entry.status === "no_show" ? "no show" : "done"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {queue.length === 0 && (
              <div className="mt-8">
                <p
                  style={{
                    fontFamily: "var(--font-triplex-2mm)",
                    fontSize: "20px",
                    color: isDark ? "rgba(255,255,255,0.32)" : "rgba(21,21,22,0.32)",
                    lineHeight: 1.4,
                  }}
                >
                  no one&apos;s in the queue yet.
                  <br />
                  be the first.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Join FAB */}
      {!showJoinDrawer && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
          <button
            onClick={() => {
              setShowJoinDrawer(true);
              setJoinSuccess(false);
              setJoinError("");
            }}
            data-cursor-dark
            className="inline-flex items-center justify-center rounded-full px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.35em] shadow-button transition hover:translate-y-0.5 active:translate-y-0.5 whitespace-nowrap"
            style={{
              backgroundColor: "#d0ff54",
              color: "#000000",
              fontFamily: "var(--font-triplex-1mm)",
            }}
          >
            join queue
          </button>
        </div>
      )}

      {/* Join Drawer */}
      {showJoinDrawer && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)" }}
            onClick={() => setShowJoinDrawer(false)}
          />

          {/* Drawer */}
          <div
            ref={drawerRef}
            className="relative w-full max-w-lg rounded-t-3xl p-8"
            style={{
              backgroundColor: isDark ? "var(--surface-panel)" : "var(--surface-card)",
              boxShadow: "0 -20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {joinSuccess ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <span style={{ fontSize: "40px" }}>🎵</span>
                <p
                  style={{
                    fontFamily: "var(--font-triplex-2mm)",
                    fontSize: "24px",
                    color: "#d0ff54",
                  }}
                >
                  you&apos;re in the queue.
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-triplex-1mm)",
                    fontSize: "13px",
                    color: isDark ? "rgba(255,255,255,0.48)" : "rgba(21,21,22,0.48)",
                  }}
                >
                  we&apos;ll call your name when it&apos;s your time.
                </p>
              </div>
            ) : (
              <>
                <p
                  style={{
                    fontFamily: "var(--font-triplex-2mm)",
                    fontSize: "22px",
                    color: isDark ? "rgba(255,255,255,0.88)" : "rgba(21,21,22,0.88)",
                    marginBottom: "24px",
                  }}
                >
                  join the queue
                </p>

                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="join-name"
                    style={{
                      fontFamily: "var(--font-triplex-1mm)",
                      fontSize: "11px",
                      letterSpacing: "0.35em",
                      textTransform: "uppercase",
                      color: isDark ? "rgba(255,255,255,0.48)" : "rgba(21,21,22,0.48)",
                    }}
                  >
                    your name
                  </label>
                  <input
                    id="join-name"
                    type="text"
                    autoFocus
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                    placeholder="what should we call you?"
                    className="waitlist-input w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors focus:border-[#d0ff54]"
                    style={{
                      fontFamily: "var(--font-triplex-2mm)",
                      fontSize: "18px",
                      backgroundColor: isDark ? "var(--surface-card)" : "var(--surface-muted)",
                      color: isDark ? "rgba(255,255,255,0.88)" : "rgba(21,21,22,0.88)",
                      borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(21,21,22,0.12)",
                    }}
                  />

                  {joinError && (
                    <p
                      style={{
                        fontFamily: "var(--font-triplex-1mm)",
                        fontSize: "12px",
                        color: "#ff6b6b",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {joinError}
                    </p>
                  )}

                  <button
                    onClick={handleJoin}
                    disabled={joinSubmitting}
                    data-cursor-dark
                    className="mt-2 w-full rounded-full py-4 text-[11px] font-semibold uppercase tracking-[0.35em] transition hover:translate-y-0.5 active:translate-y-0.5 disabled:opacity-50"
                    style={{
                      backgroundColor: "#d0ff54",
                      color: "#000000",
                      fontFamily: "var(--font-triplex-1mm)",
                    }}
                  >
                    {joinSubmitting ? "joining..." : "get in line"}
                  </button>

                  <button
                    onClick={() => setShowJoinDrawer(false)}
                    className="mt-1 w-full py-3 text-[11px] uppercase tracking-[0.35em] transition-opacity hover:opacity-80"
                    style={{
                      fontFamily: "var(--font-triplex-1mm)",
                      color: isDark ? "rgba(255,255,255,0.32)" : "rgba(21,21,22,0.32)",
                    }}
                  >
                    cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
