/* ============================================================
   TERANGA ALOE — Initialisation / mise à niveau de la base Neon
   - Branche le back-office sur les tables canoniques (products,
     protocols, product_categories) créées par l'app cliente.
   - Ajoute les colonnes back-office manquantes (stock, image).
   - Crée les tables propres au back-office (admin_account, etc.).
   - Insère UNIQUEMENT le compte admin (aucune donnée de démo).
   - Supprime les tables redondantes créées par erreur (product, protocol).
   Lancement : npm run db:setup
   ============================================================ */
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL);

const ADMIN = {
  id: "admin-teranga",
  email: "terangaaloe@gmail.com",
  phone: "+221770000000",
  name: "Teranga Aloe",
  role: "Administrateur",
  password: "Téranga#2026",
};

async function main() {
  console.log("→ Nettoyage des tables redondantes (product, protocol)…");
  await sql`DROP TABLE IF EXISTS product`;
  await sql`DROP TABLE IF EXISTS protocol`;

  console.log("→ Tables canoniques (IF NOT EXISTS) — partagées avec l'app cliente…");
  await sql`CREATE TABLE IF NOT EXISTS product_categories (
    id text PRIMARY KEY, fr text, en text, pt text,
    sort int NOT NULL DEFAULT 0, updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS products (
    id text PRIMARY KEY, name text NOT NULL, cat text, price numeric NOT NULL DEFAULT 0,
    size jsonb NOT NULL DEFAULT '{}', rating numeric NOT NULL DEFAULT 4.5, reviews int NOT NULL DEFAULT 0,
    tag text, blurb jsonb NOT NULL DEFAULT '{}', best boolean NOT NULL DEFAULT false,
    sort int NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true,
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS protocols (
    id text PRIMARY KEY, data jsonb NOT NULL DEFAULT '{}',
    sort int NOT NULL DEFAULT 0, updated_at timestamptz NOT NULL DEFAULT now()
  )`;

  console.log("→ Colonnes back-office sur products (stock, image)…");
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS stock int NOT NULL DEFAULT 20`;
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS image text`;

  console.log("→ Tables propres au back-office (IF NOT EXISTS)…");
  await sql`CREATE TABLE IF NOT EXISTS admin_account (
    id text PRIMARY KEY, email text UNIQUE NOT NULL, phone text, name text, role text,
    password_hash text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS app_user (
    id text PRIMARY KEY, name text NOT NULL, phone text, profile text NOT NULL DEFAULT 'client',
    city text, joined_at timestamptz NOT NULL DEFAULT now(), adherence int NOT NULL DEFAULT 0,
    last_active timestamptz NOT NULL DEFAULT now(), status text NOT NULL DEFAULT 'actif',
    seed int, protocols jsonb NOT NULL DEFAULT '[]'
  )`;
  await sql`CREATE TABLE IF NOT EXISTS "order" (
    ref text PRIMARY KEY, user_id text, placed_at timestamptz, items jsonb NOT NULL DEFAULT '{}',
    total int NOT NULL DEFAULT 0, buyer jsonb NOT NULL DEFAULT '{}', pay text,
    stage int NOT NULL DEFAULT 0, stamps jsonb NOT NULL DEFAULT '{}', eta timestamptz
  )`;
  await sql`CREATE TABLE IF NOT EXISTS bilan (
    id text PRIMARY KEY, user_id text, protocol_id text, protocol text, period text,
    adherence int, weight_delta numeric, indicators jsonb NOT NULL DEFAULT '{}', note text,
    submitted_at timestamptz, status text NOT NULL DEFAULT 'nouveau', reply text
  )`;

  console.log("→ Compte admin (upsert)…");
  const hash = bcrypt.hashSync(ADMIN.password, 10);
  await sql`
    INSERT INTO admin_account (id, email, phone, name, role, password_hash)
    VALUES (${ADMIN.id}, ${ADMIN.email}, ${ADMIN.phone}, ${ADMIN.name}, ${ADMIN.role}, ${hash})
    ON CONFLICT (email) DO UPDATE
      SET password_hash = EXCLUDED.password_hash, phone = EXCLUDED.phone,
          name = EXCLUDED.name, role = EXCLUDED.role
  `;

  console.log("\n=== Contenu de la base ===");
  const counts = await sql`SELECT
    (SELECT count(*) FROM admin_account)::int AS admin,
    (SELECT count(*) FROM products)::int AS products,
    (SELECT count(*) FROM protocols)::int AS protocols,
    (SELECT count(*) FROM product_categories)::int AS categories,
    (SELECT count(*) FROM app_user)::int AS users,
    (SELECT count(*) FROM "order")::int AS orders,
    (SELECT count(*) FROM bilan)::int AS bilans`;
  console.log(counts[0]);
  console.log("\n✓ Base prête.");
}

main().catch((e) => {
  console.error("✗ Échec :", e);
  process.exit(1);
});
