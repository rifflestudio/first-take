import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

// GET /api/queue — fetch full queue ordered by position
export async function GET() {
  const { data, error } = await getSupabaseAdmin()
    .from("queue")
    .select("*, user:users(id, display_name, role, instagram, team_id)")
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ queue: data });
}

// POST /api/queue — join the queue
// Body: { display_name: string, user_id?: string }
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { display_name, user_id } = body;

  if (!display_name?.trim()) {
    return NextResponse.json({ error: "display_name is required" }, { status: 400 });
  }

  // Find the next position number (max active/waiting position + 1)
  const { data: maxRow } = await getSupabaseAdmin()
    .from("queue")
    .select("position")
    .in("status", ["waiting", "active"])
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = maxRow ? maxRow.position + 1 : 1;

  // Check if there's already an active entry — if not, this one becomes active immediately
  const { data: activeEntry } = await getSupabaseAdmin()
    .from("queue")
    .select("id")
    .eq("status", "active")
    .maybeSingle();

  const status = activeEntry ? "waiting" : "active";
  const started_at = status === "active" ? new Date().toISOString() : null;

  const { data, error } = await getSupabaseAdmin()
    .from("queue")
    .insert({
      display_name: display_name.trim(),
      user_id: user_id ?? null,
      position: nextPosition,
      status,
      started_at,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data }, { status: 201 });
}

// PATCH /api/queue — admin actions
// Body:
//   { action: 'no-show', id: string }  — mark active as no-show, advance next
//   { action: 'done', id: string }     — mark active as done, advance next
//   { action: 'start', id: string }    — manually start a waiting entry
//   { action: 'advance' }              — advance to next waiting entry
//   { action: 'clear' }                — clear all waiting entries
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { action, id } = body;

  if (action === "no-show" || action === "done") {
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Mark the current entry as no_show or done
    const newStatus = action === "no-show" ? "no_show" : "done";
    const { error: updateError } = await getSupabaseAdmin()
      .from("queue")
      .update({ status: newStatus, ended_at: new Date().toISOString() })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Advance the next waiting entry to active
    const { data: nextEntry } = await getSupabaseAdmin()
      .from("queue")
      .select("id")
      .eq("status", "waiting")
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextEntry) {
      await getSupabaseAdmin()
        .from("queue")
        .update({ status: "active", started_at: new Date().toISOString() })
        .eq("id", nextEntry.id);
    }

    return NextResponse.json({ success: true });
  }

  if (action === "start") {
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin()
      .from("queue")
      .update({ status: "active", started_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  if (action === "advance") {
    // Mark any active as done
    const { data: activeEntry } = await getSupabaseAdmin()
      .from("queue")
      .select("id")
      .eq("status", "active")
      .maybeSingle();

    if (activeEntry) {
      await getSupabaseAdmin()
        .from("queue")
        .update({ status: "done", ended_at: new Date().toISOString() })
        .eq("id", activeEntry.id);
    }

    // Advance next waiting
    const { data: nextEntry } = await getSupabaseAdmin()
      .from("queue")
      .select("id")
      .eq("status", "waiting")
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextEntry) {
      await getSupabaseAdmin()
        .from("queue")
        .update({ status: "active", started_at: new Date().toISOString() })
        .eq("id", nextEntry.id);
    }

    return NextResponse.json({ success: true });
  }

  if (action === "clear") {
    const { error } = await getSupabaseAdmin()
      .from("queue")
      .update({ status: "no_show", ended_at: new Date().toISOString() })
      .eq("status", "waiting");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// DELETE /api/queue?id=... — remove a specific queue entry
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin().from("queue").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
