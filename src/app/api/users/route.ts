import { NextResponse } from "next/server";
import { deleteUser, upsertUser } from "@/lib/repo";
import { isAuthed } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body?.name?.trim()) return NextResponse.json({ error: "name_required" }, { status: 400 });
  const user = await upsertUser(body);
  return NextResponse.json({ user });
}

export async function DELETE(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id_required" }, { status: 400 });
  await deleteUser(id);
  return NextResponse.json({ ok: true });
}
