import { NextResponse } from "next/server";
import { setOrderStage } from "@/lib/repo";
import { isAuthed } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body?.ref || typeof body.stage !== "number") return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const order = await setOrderStage(body.ref, body.stage);
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ order });
}
