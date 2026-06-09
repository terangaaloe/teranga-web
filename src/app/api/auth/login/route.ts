import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/repo";
import { SESSION_COOKIE } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { identifier?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const account = await verifyAdmin(body.identifier || "", body.password || "");
  if (!account) return NextResponse.json({ ok: false }, { status: 401 });

  const res = NextResponse.json({ ok: true, account });
  res.cookies.set(SESSION_COOKIE, account.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
