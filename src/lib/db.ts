/* ============================================================
   TERANGA ALOE — Connexion Neon Postgres
   Le driver serverless fonctionne en HTTP (route handlers Node).
   La chaîne de connexion vient de DATABASE_URL (.env.local).
   ============================================================ */
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL manquant — vérifiez .env.local");
}

export const sql = neon(process.env.DATABASE_URL);
