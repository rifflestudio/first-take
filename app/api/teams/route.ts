import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

// GET /api/teams — list all teams with member count
export async function GET() {
  const { data, error } = await getSupabaseAdmin()
    .from("teams")
    .select("*, members:users(id, display_name, role, instagram)")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ teams: data });
}

// POST /api/teams — create a new team
// Body: { name: string, color?: string }
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, color } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("teams")
    .insert({
      name: name.trim(),
      color: color || "#d0ff54",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ team: data }, { status: 201 });
}

// PUT /api/teams — update a team
// Body: { id, name?, color? }
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, name, color } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name.trim();
  if (color !== undefined) updates.color = color;

  const { data, error } = await getSupabaseAdmin()
    .from("teams")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ team: data });
}

// DELETE /api/teams?id=... — delete a team
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin().from("teams").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
