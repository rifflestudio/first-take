import { createClient } from "@supabase/supabase-js";

// Types derived from the schema
export type UserRole = "rapper" | "producer" | "dj" | "singer" | "artist" | "other";
export type QueueStatus = "waiting" | "active" | "done" | "no_show";

export interface Team {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface User {
  id: string;
  display_name: string;
  instagram: string | null;
  role: UserRole;
  team_id: string | null;
  created_at: string;
  team?: Team;
}

export interface QueueEntry {
  id: string;
  display_name: string;
  user_id: string | null;
  position: number;
  status: QueueStatus;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  user?: User;
}

// Lazy singleton — only created client-side at runtime
let _client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  _client = createClient(url, key);
  return _client;
}

// Keep named export for backwards-compat in queue page realtime sub
export { getSupabaseClient as supabase };
