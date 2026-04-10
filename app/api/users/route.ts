import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

// GET /api/users — list all users with team info
export async function GET() {
  const { data, error } = await getSupabaseAdmin()
    .from("users")
    .select("*, team:teams(id, name, color)")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}

// POST /api/users — create a new user / attendee
// Body: { display_name, instagram?, role, team_id? }
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { display_name, instagram, role, team_id } = body;

  if (!display_name?.trim()) {
    return NextResponse.json({ error: "display_name is required" }, { status: 400 });
  }

  const validRoles = ["rapper", "producer", "dj", "singer", "artist", "other"];
  const userRole = validRoles.includes(role) ? role : "other";

  const { data, error } = await getSupabaseAdmin()
    .from("users")
    .insert({
      display_name: display_name.trim(),
      instagram: instagram?.trim() || null,
      role: userRole,
      team_id: team_id || null,
    })
    .select("*, team:teams(id, name, color)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data }, { status: 201 });
}

// PUT /api/users — update a user
// Body: { id, display_name?, instagram?, role?, team_id? }
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, display_name, instagram, role, team_id } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (display_name !== undefined) updates.display_name = display_name.trim();
  if (instagram !== undefined) updates.instagram = instagram?.trim() || null;
  if (role !== undefined) updates.role = role;
  if (team_id !== undefined) updates.team_id = team_id || null;

  const { data, error } = await getSupabaseAdmin()
    .from("users")
    .update(updates)
    .eq("id", id)
    .select("*, team:teams(id, name, color)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data });
}

// DELETE /api/users?id=... — delete a user
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin().from("users").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
