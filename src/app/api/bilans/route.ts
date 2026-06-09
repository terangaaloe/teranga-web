import { NextResponse } from "next/server";
import { updateBilan } from "@/lib/repo";
import { isAuthed } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body?.id) return NextResponse.json({ error: "id_required" }, { status: 400 });
  const bilan = await updateBilan(body.id, { status: body.status, reply: body.reply });
  if (!bilan) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ bilan });
}
