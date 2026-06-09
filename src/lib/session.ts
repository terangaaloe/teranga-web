/* ============================================================
   TERANGA ALOE — Session (cookie httpOnly)
   ============================================================ */
import { cookies } from "next/headers";

export const SESSION_COOKIE = "ta_session";

export async function isAuthed(): Promise<boolean> {
  const c = await cookies();
  return Boolean(c.get(SESSION_COOKIE)?.value);
}
