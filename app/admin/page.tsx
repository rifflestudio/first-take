"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import CustomCursor from "../components/CustomCursor";
import LogoSmall from "../components/logo-small/Logo.small";
import type { Team, User, QueueEntry } from "@/lib/supabase/client";

type Tab = "queue" | "people" | "teams";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "firsttake2026";

const ROLE_OPTIONS = ["rapper", "producer", "dj", "singer", "artist", "other"];

// ──────────────────────────────────────────────
// Small shared helpers
// ──────────────────────────────────────────────

function formatTime(ms: number): string {
  if (ms <= 0) return "00:00";
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ──────────────────────────────────────────────
// Queue tab
// ──────────────────────────────────────────────

function QueueTab({ isDark }: { isDark: boolean }) {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [timers, setTimers] = useState<Record<string, number>>({});

  const fetchQueue = useCallback(async () => {
    const r = await fetch("/api/queue");
    const d = await r.json();
    if (d.queue) setQueue(d.queue);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  // Countdown timers for active entries
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const updated: Record<string, number> = {};
      queue.forEach((e) => {
        if (e.status === "active" && e.started_at) {
          const end = new Date(e.started_at).getTime() + 30 * 60 * 1000;
          updated[e.id] = Math.max(0, end - now);
        }
      });
      setTimers(updated);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [queue]);

  const action = async (body: object) => {
    setActing(true);
    await fetch("/api/queue", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await fetchQueue();
    setActing(false);
  };

  const removeEntry = async (id: string) => {
    if (!confirm("remove this entry?")) return;
    setActing(true);
    await fetch(`/api/queue?id=${id}`, { method: "DELETE" });
    await fetchQueue();
    setActing(false);
  };

  const rowStyle = (status: string) => ({
    backgroundColor:
      status === "active"
        ? isDark ? "rgba(208,255,84,0.06)" : "rgba(208,255,84,0.10)"
        : isDark ? "var(--surface-card)" : "var(--surface-panel)",
    border: `1px solid ${
      status === "active"
        ? "rgba(208,255,84,0.20)"
        : isDark ? "rgba(255,255,255,0.06)" : "rgba(21,21,22,0.06)"
    }`,
    borderRadius: "10px",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "6px",
  });

  const mutedText = {
    fontFamily: "var(--font-triplex-1mm)",
    fontSize: "12px",
    letterSpacing: "0.1em",
    color: isDark ? "rgba(255,255,255,0.40)" : "rgba(21,21,22,0.40)",
  };

  const nameText = {
    fontFamily: "var(--font-triplex-2mm)",
    fontSize: "16px",
    color: isDark ? "rgba(255,255,255,0.80)" : "rgba(21,21,22,0.80)",
  };

  if (loading) return <p style={mutedText}>loading...</p>;

  const active = queue.filter((e) => e.status === "active");
  const waiting = queue.filter((e) => e.status === "waiting");
  const past = queue.filter((e) => e.status === "done" || e.status === "no_show");

  return (
    <div>
      {/* Global actions */}
      <div className="mb-6 flex flex-wrap gap-2">
        <AdminBtn
          isDark={isDark}
          onClick={() => action({ action: "advance" })}
          disabled={acting}
          variant="brand"
        >
          advance queue
        </AdminBtn>
        <AdminBtn
          isDark={isDark}
          onClick={() => {
            if (confirm("clear all waiting entries?")) action({ action: "clear" });
          }}
          disabled={acting}
          variant="ghost"
        >
          clear waiting
        </AdminBtn>
      </div>

      {/* Active */}
      {active.length > 0 && (
        <div className="mb-4">
          <SectionLabel isDark={isDark}>now on — active</SectionLabel>
          {active.map((e) => (
            <div key={e.id} style={rowStyle("active")}>
              <span style={{ fontFamily: "var(--font-triplex-3mm)", fontSize: "18px", color: "#d0ff54", minWidth: "28px" }}>
                {e.position}
              </span>
              <span style={nameText}>{e.display_name}</span>
              {timers[e.id] !== undefined && (
                <span style={{ ...mutedText, color: "#d0ff54", marginLeft: "auto", fontFamily: "var(--font-triplex-3mm)", fontSize: "16px" }}>
                  {formatTime(timers[e.id])}
                </span>
              )}
              <AdminBtn isDark={isDark} onClick={() => action({ action: "done", id: e.id })} disabled={acting} variant="ghost" small>done</AdminBtn>
              <AdminBtn isDark={isDark} onClick={() => action({ action: "no-show", id: e.id })} disabled={acting} variant="ghost" small>no-show</AdminBtn>
            </div>
          ))}
        </div>
      )}

      {/* Waiting */}
      {waiting.length > 0 && (
        <div className="mb-4">
          <SectionLabel isDark={isDark}>waiting ({waiting.length})</SectionLabel>
          {waiting.map((e) => (
            <div key={e.id} style={rowStyle("waiting")}>
              <span style={{ fontFamily: "var(--font-triplex-1mm)", fontSize: "14px", color: isDark ? "rgba(255,255,255,0.32)" : "rgba(21,21,22,0.32)", minWidth: "28px" }}>
                {e.position}
              </span>
              <span style={nameText}>{e.display_name}</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                <AdminBtn isDark={isDark} onClick={() => action({ action: "start", id: e.id })} disabled={acting} variant="ghost" small>start</AdminBtn>
                <AdminBtn isDark={isDark} onClick={() => removeEntry(e.id)} disabled={acting} variant="ghost" small>remove</AdminBtn>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div>
          <SectionLabel isDark={isDark}>history</SectionLabel>
          {past.map((e) => (
            <div key={e.id} style={{ ...rowStyle("past"), opacity: 0.5 }}>
              <span style={{ fontFamily: "var(--font-triplex-1mm)", fontSize: "14px", color: isDark ? "rgba(255,255,255,0.24)" : "rgba(21,21,22,0.24)", minWidth: "28px" }}>
                {e.position}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-triplex-2mm)",
                  fontSize: "15px",
                  color: isDark ? "rgba(255,255,255,0.40)" : "rgba(21,21,22,0.40)",
                  textDecoration: e.status === "no_show" ? "line-through" : "none",
                }}
              >
                {e.display_name}
              </span>
              <span style={{ ...mutedText, marginLeft: "auto" }}>
                {e.status === "no_show" ? "no show" : "done"}
              </span>
            </div>
          ))}
        </div>
      )}

      {queue.length === 0 && (
        <p style={mutedText}>queue is empty.</p>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// People tab
// ──────────────────────────────────────────────

function PeopleTab({ isDark }: { isDark: boolean }) {
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newName, setNewName] = useState("");
  const [newInstagram, setNewInstagram] = useState("");
  const [newRole, setNewRole] = useState("other");
  const [newTeamId, setNewTeamId] = useState("");

  const fetchAll = useCallback(async () => {
    const [ur, tr] = await Promise.all([fetch("/api/users"), fetch("/api/teams")]);
    const [ud, td] = await Promise.all([ur.json(), tr.json()]);
    if (ud.users) setUsers(ud.users);
    if (td.teams) setTeams(td.teams);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: newName, instagram: newInstagram, role: newRole, team_id: newTeamId || null }),
    });
    setNewName(""); setNewInstagram(""); setNewRole("other"); setNewTeamId("");
    setShowForm(false);
    setSaving(false);
    fetchAll();
  };

  const deleteUser = async (id: string) => {
    if (!confirm("delete this person?")) return;
    await fetch(`/api/users?id=${id}`, { method: "DELETE" });
    fetchAll();
  };

  const mutedText = { fontFamily: "var(--font-triplex-1mm)", fontSize: "12px", letterSpacing: "0.1em", color: isDark ? "rgba(255,255,255,0.40)" : "rgba(21,21,22,0.40)" };

  if (loading) return <p style={mutedText}>loading...</p>;

  const inputStyle = {
    fontFamily: "var(--font-triplex-2mm)", fontSize: "16px",
    backgroundColor: isDark ? "var(--surface-card)" : "var(--surface-muted)",
    color: isDark ? "rgba(255,255,255,0.88)" : "rgba(21,21,22,0.88)",
    borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(21,21,22,0.12)",
    padding: "10px 14px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", outline: "none", width: "100%",
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span style={mutedText}>{users.length} attendees</span>
        <AdminBtn isDark={isDark} onClick={() => setShowForm(!showForm)} variant="brand">
          {showForm ? "cancel" : "+ add person"}
        </AdminBtn>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-3 rounded-xl p-4" style={{ backgroundColor: isDark ? "var(--surface-card)" : "var(--surface-panel)", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(21,21,22,0.08)"}` }}>
          <input required style={inputStyle} placeholder="name *" value={newName} onChange={e => setNewName(e.target.value)} className="waitlist-input" />
          <input style={inputStyle} placeholder="instagram" value={newInstagram} onChange={e => setNewInstagram(e.target.value)} className="waitlist-input" />
          <select style={{ ...inputStyle, appearance: "none", cursor: "pointer" }} value={newRole} onChange={e => setNewRole(e.target.value)}>
            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {teams.length > 0 && (
            <select style={{ ...inputStyle, appearance: "none", cursor: "pointer" }} value={newTeamId} onChange={e => setNewTeamId(e.target.value)}>
              <option value="">no team</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          )}
          <AdminBtn isDark={isDark} type="submit" disabled={saving} variant="brand">
            {saving ? "saving..." : "add person"}
          </AdminBtn>
        </form>
      )}

      <div className="flex flex-col gap-1">
        {users.map((u) => (
          <div key={u.id} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ backgroundColor: isDark ? "var(--surface-card)" : "var(--surface-panel)" }}>
            <div className="flex flex-1 flex-col gap-0.5 min-w-0">
              <span style={{ fontFamily: "var(--font-triplex-2mm)", fontSize: "16px", color: isDark ? "rgba(255,255,255,0.80)" : "rgba(21,21,22,0.80)" }}>
                {u.display_name}
              </span>
              <span style={{ ...mutedText, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {u.role}{u.team ? ` · ${(u.team as Team).name}` : ""}{u.instagram ? ` · @${u.instagram}` : ""}
              </span>
            </div>
            <button onClick={() => deleteUser(u.id)} style={{ ...mutedText, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", flexShrink: 0 }}>✕</button>
          </div>
        ))}
        {users.length === 0 && <p style={mutedText}>no attendees yet.</p>}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Teams tab
// ──────────────────────────────────────────────

const PRESET_COLORS = [
  "#d0ff54", "#ff6b6b", "#6bffb8", "#6bb3ff", "#ff6bf2",
  "#ffa96b", "#ffffff", "#b8b8ff",
];

function TeamsTab({ isDark }: { isDark: boolean }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#d0ff54");

  const fetchTeams = useCallback(async () => {
    const r = await fetch("/api/teams");
    const d = await r.json();
    if (d.teams) setTeams(d.teams);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, color: newColor }),
    });
    setNewName(""); setNewColor("#d0ff54");
    setShowForm(false);
    setSaving(false);
    fetchTeams();
  };

  const deleteTeam = async (id: string) => {
    if (!confirm("delete this team?")) return;
    await fetch(`/api/teams?id=${id}`, { method: "DELETE" });
    fetchTeams();
  };

  const mutedText = { fontFamily: "var(--font-triplex-1mm)", fontSize: "12px", letterSpacing: "0.1em", color: isDark ? "rgba(255,255,255,0.40)" : "rgba(21,21,22,0.40)" };

  const inputStyle = {
    fontFamily: "var(--font-triplex-2mm)", fontSize: "16px",
    backgroundColor: isDark ? "var(--surface-card)" : "var(--surface-muted)",
    color: isDark ? "rgba(255,255,255,0.88)" : "rgba(21,21,22,0.88)",
    borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(21,21,22,0.12)",
    padding: "10px 14px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", outline: "none", width: "100%",
  };

  if (loading) return <p style={mutedText}>loading...</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span style={mutedText}>{teams.length} teams</span>
        <AdminBtn isDark={isDark} onClick={() => setShowForm(!showForm)} variant="brand">
          {showForm ? "cancel" : "+ add team"}
        </AdminBtn>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-3 rounded-xl p-4" style={{ backgroundColor: isDark ? "var(--surface-card)" : "var(--surface-panel)", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(21,21,22,0.08)"}` }}>
          <input required style={inputStyle} placeholder="team name *" value={newName} onChange={e => setNewName(e.target.value)} className="waitlist-input" />
          <div>
            <p style={{ ...mutedText, marginBottom: "8px" }}>color</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewColor(c)}
                  style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    backgroundColor: c,
                    border: newColor === c ? "2px solid white" : "2px solid transparent",
                    cursor: "pointer",
                    outline: newColor === c ? "2px solid rgba(255,255,255,0.3)" : "none",
                  }}
                />
              ))}
            </div>
          </div>
          <AdminBtn isDark={isDark} type="submit" disabled={saving} variant="brand">
            {saving ? "saving..." : "create team"}
          </AdminBtn>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {teams.map((t) => (
          <div key={t.id} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ backgroundColor: isDark ? "var(--surface-card)" : "var(--surface-panel)", borderLeft: `3px solid ${t.color}` }}>
            <span style={{ fontFamily: "var(--font-triplex-2mm)", fontSize: "17px", color: isDark ? "rgba(255,255,255,0.80)" : "rgba(21,21,22,0.80)", flex: 1 }}>
              {t.name}
            </span>
            <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: t.color, flexShrink: 0, display: "block" }} />
            <button onClick={() => deleteTeam(t.id)} style={{ ...mutedText, background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}>✕</button>
          </div>
        ))}
        {teams.length === 0 && <p style={mutedText}>no teams yet.</p>}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Shared micro-components
// ──────────────────────────────────────────────

function SectionLabel({ isDark, children }: { isDark: boolean; children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-triplex-1mm)",
        fontSize: "10px",
        letterSpacing: "0.35em",
        textTransform: "uppercase",
        color: isDark ? "rgba(255,255,255,0.32)" : "rgba(21,21,22,0.32)",
        marginBottom: "8px",
      }}
    >
      {children}
    </p>
  );
}

function AdminBtn({
  isDark, onClick, disabled, children, variant = "ghost", small = false, type = "button",
}: {
  isDark: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "brand" | "ghost";
  small?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: "var(--font-triplex-1mm)",
        fontSize: small ? "10px" : "11px",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        padding: small ? "6px 10px" : "8px 14px",
        borderRadius: "999px",
        cursor: "pointer",
        transition: "opacity 0.2s",
        opacity: disabled ? 0.5 : 1,
        backgroundColor: variant === "brand" ? "#d0ff54" : "transparent",
        color: variant === "brand" ? "#000" : isDark ? "rgba(255,255,255,0.56)" : "rgba(21,21,22,0.56)",
        border: variant === "ghost" ? `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(21,21,22,0.12)"}` : "none",
      }}
    >
      {children}
    </button>
  );
}

// ──────────────────────────────────────────────
// Admin page
// ──────────────────────────────────────────────

export default function AdminPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [tab, setTab] = useState<Tab>("queue");

  useEffect(() => {
    setMounted(true);
    // Check if previously authenticated this session
    if (typeof window !== "undefined" && sessionStorage.getItem("admin_auth") === "1") {
      setAuthenticated(true);
    }
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "1");
      setAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("wrong password.");
    }
  };

  if (!mounted) return null;

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-6">
        <div className="w-full max-w-xs">
          <p
            style={{
              fontFamily: "var(--font-triplex-2mm)",
              fontSize: "22px",
              color: isDark ? "rgba(255,255,255,0.80)" : "rgba(21,21,22,0.80)",
              marginBottom: "24px",
            }}
          >
            admin
          </p>
          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="waitlist-input rounded-xl border px-4 py-3 outline-none focus:border-[#d0ff54]"
              style={{
                fontFamily: "var(--font-triplex-2mm)",
                fontSize: "18px",
                backgroundColor: isDark ? "var(--surface-card)" : "var(--surface-panel)",
                color: isDark ? "rgba(255,255,255,0.88)" : "rgba(21,21,22,0.88)",
                borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(21,21,22,0.12)",
              }}
            />
            {passwordError && (
              <p style={{ fontFamily: "var(--font-triplex-1mm)", fontSize: "12px", color: "#ff6b6b", letterSpacing: "0.1em" }}>
                {passwordError}
              </p>
            )}
            <button
              type="submit"
              data-cursor-dark
              className="rounded-full py-3 text-[11px] font-semibold uppercase tracking-[0.35em] transition hover:translate-y-0.5"
              style={{ backgroundColor: "#d0ff54", color: "#000", fontFamily: "var(--font-triplex-1mm)" }}
            >
              enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "queue", label: "queue" },
    { key: "people", label: "people" },
    { key: "teams", label: "teams" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-surface text-primary transition-colors">
      <CustomCursor />

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between px-6 py-5 md:px-12" style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(21,21,22,0.06)"}` }}>
        <Link href="/">
          <LogoSmall className="h-6 w-auto" />
        </Link>
        <p
          style={{
            fontFamily: "var(--font-triplex-1mm)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: isDark ? "rgba(255,255,255,0.32)" : "rgba(21,21,22,0.32)",
          }}
        >
          admin
        </p>
        <button
          onClick={() => { sessionStorage.removeItem("admin_auth"); setAuthenticated(false); }}
          style={{ fontFamily: "var(--font-triplex-1mm)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.24)" : "rgba(21,21,22,0.24)", background: "none", border: "none", cursor: "pointer" }}
        >
          sign out
        </button>
      </header>

      {/* Tabs */}
      <div className="px-6 pt-4 md:px-12" style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(21,21,22,0.06)"}` }}>
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                fontFamily: "var(--font-triplex-1mm)",
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                padding: "10px 16px",
                borderRadius: "0",
                cursor: "pointer",
                background: "none",
                border: "none",
                borderBottom: tab === t.key ? "2px solid #d0ff54" : "2px solid transparent",
                color:
                  tab === t.key
                    ? "#d0ff54"
                    : isDark ? "rgba(255,255,255,0.40)" : "rgba(21,21,22,0.40)",
                transition: "color 0.15s",
                marginBottom: "-1px",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <main className="flex-1 px-6 py-6 md:px-12">
        {tab === "queue" && <QueueTab isDark={isDark} />}
        {tab === "people" && <PeopleTab isDark={isDark} />}
        {tab === "teams" && <TeamsTab isDark={isDark} />}
      </main>
    </div>
  );
}
