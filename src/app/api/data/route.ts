import { NextResponse } from "next/server";
import { getAllData } from "@/lib/repo";
import { isAuthed } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const data = await getAllData();
    return NextResponse.json(data);
  } catch (e) {
    console.error("GET /api/data", e);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
}
