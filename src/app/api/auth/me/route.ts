import { NextResponse } from "next/server";
import { getAdminPublic } from "@/lib/repo";
import { isAuthed } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ authed: false });
  const account = await getAdminPublic();
  return NextResponse.json({ authed: Boolean(account), account });
}
