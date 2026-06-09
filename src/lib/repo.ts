/* ============================================================
   TERANGA ALOE — Couche d'accès aux données (Neon Postgres)
   Convertit les lignes SQL ⇆ types client, et expose les
   opérations de lecture/écriture utilisées par les route handlers.
   ============================================================ */
import bcrypt from "bcryptjs";
import { sql } from "./db";
import { initials, normPhone } from "./helpers";
import type { AdminUser, Bilan, Order, Protocol, StoreProduct } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
const ms = (v: any): number => (v ? new Date(v).getTime() : Date.now());
const j = <T>(v: any, fallback: T): T => {
  if (v == null) return fallback;
  if (typeof v === "string") {
    try {
      return JSON.parse(v) as T;
    } catch {
      return fallback;
    }
  }
  return v as T;
};

/* ---------------- mapping lignes → types client ---------------- */
function rowToUser(r: any): AdminUser {
  return {
    id: r.id,
    name: r.name,
    initials: initials(r.name || "?"),
    phone: r.phone || "",
    profile: r.profile === "fbo" ? "fbo" : "client",
    city: r.city || "",
    joinedAt: ms(r.joined_at),
    protocols: j<string[]>(r.protocols, []),
    adherence: Number(r.adherence) || 0,
    lastActive: ms(r.last_active),
    status: r.status === "inactif" ? "inactif" : "actif",
    seed: Number(r.seed) || 0,
  };
}

function rowToProduct(r: any): StoreProduct {
  return {
    id: r.id,
    name: r.name,
    cat: r.cat || "aloe",
    price: Number(r.price) || 0,
    size: j(r.size, { fr: "", en: "", pt: "" }),
    rating: Number(r.rating) || 0,
    reviews: Number(r.reviews) || 0,
    tag: r.tag || null,
    blurb: j(r.blurb, { fr: "", en: "", pt: "" }),
    best: Boolean(r.best),
    stock: Number(r.stock) || 0,
    active: r.active !== false,
    image: r.image || undefined,
  };
}

// La table canonique `protocols` stocke l'objet complet dans `data` (jsonb).
function rowToProtocol(r: any): Protocol {
  const d = j<Record<string, any>>(r.data, {});
  return {
    id: r.id ?? d.id,
    name: d.name ?? { fr: "", en: "", pt: "" },
    icon: d.icon ?? "leaf",
    accent: d.accent ?? "--aloe-green",
    tagline: d.tagline,
    overview: d.overview,
    duration: d.duration,
    phases: d.phases ?? [],
    schedule: d.schedule ?? [],
    tracking: d.tracking,
    warnings: d.warnings,
    custom: d.custom ?? false,
  };
}

function rowToOrder(r: any): Order {
  const stampsRaw = j<Record<string, any>>(r.stamps, {});
  const stamps: Record<number, number> = {};
  for (const [k, v] of Object.entries(stampsRaw)) stamps[Number(k)] = Number(v);
  return {
    ref: r.ref,
    userId: r.user_id || "",
    placedAt: ms(r.placed_at),
    items: j(r.items, {} as Record<string, number>),
    total: Number(r.total) || 0,
    buyer: j(r.buyer, { name: "", phone: "", address: "" }),
    pay: r.pay === "mm" ? "mm" : "cash",
    stage: Number(r.stage) || 0,
    stamps,
    eta: ms(r.eta),
  };
}

function rowToBilan(r: any): Bilan {
  return {
    id: r.id,
    userId: r.user_id || "",
    protocolId: r.protocol_id || "",
    protocol: r.protocol || "—",
    period: r.period || "",
    adherence: Number(r.adherence) || 0,
    weightDelta: Number(r.weight_delta) || 0,
    indicators: j(r.indicators, { stress: 0, sommeil: 0, energie: 0 }),
    note: r.note || "",
    submittedAt: ms(r.submitted_at),
    status: r.status === "lu" ? "lu" : r.status === "repondu" ? "repondu" : "nouveau",
    reply: r.reply || "",
  };
}

/* ---------------- lecture globale ---------------- */
export async function getAllData() {
  const [users, products, protocols, orders, bilans] = await Promise.all([
    sql`SELECT * FROM app_user ORDER BY joined_at DESC`,
    sql`SELECT * FROM products ORDER BY sort ASC`,
    sql`SELECT id, data, sort FROM protocols ORDER BY sort ASC`,
    sql`SELECT * FROM "order" ORDER BY placed_at DESC`,
    sql`SELECT * FROM bilan ORDER BY submitted_at DESC`,
  ]);
  return {
    users: (users as any[]).map(rowToUser),
    products: (products as any[]).map(rowToProduct),
    protocols: (protocols as any[]).map(rowToProtocol),
    orders: (orders as any[]).map(rowToOrder),
    bilans: (bilans as any[]).map(rowToBilan),
  };
}

/* ---------------- auth ---------------- */
export interface AdminPublic {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  initials: string;
}

function toAdminPublic(r: any): AdminPublic {
  return {
    id: r.id,
    name: r.name || "Administrateur",
    role: r.role || "Administrateur",
    phone: r.phone || "",
    email: r.email || "",
    initials: initials(r.name || "Teranga Aloe"),
  };
}

export async function verifyAdmin(identifier: string, password: string): Promise<AdminPublic | null> {
  const id = (identifier || "").trim();
  if (!id || !password) return null;
  const np = normPhone(id);
  const rows = (await sql`
    SELECT * FROM admin_account
    WHERE lower(email) = lower(${id})
       OR (${np} <> '' AND regexp_replace(coalesce(phone,''), '[^0-9]', '', 'g') = ${np})
    LIMIT 1
  `) as any[];
  const row = rows[0];
  if (!row) return null;
  const ok = await bcrypt.compare(password, row.password_hash);
  return ok ? toAdminPublic(row) : null;
}

export async function getAdminPublic(): Promise<AdminPublic | null> {
  const rows = (await sql`SELECT * FROM admin_account ORDER BY created_at ASC LIMIT 1`) as any[];
  return rows[0] ? toAdminPublic(rows[0]) : null;
}

/* ---------------- écritures ---------------- */
export async function upsertUser(u: Partial<AdminUser> & { name: string }): Promise<AdminUser> {
  const id = u.id || "u" + Date.now().toString(36);
  const seed = u.seed ?? Math.floor(Math.random() * 9000);
  const protocols = JSON.stringify(u.protocols || []);
  await sql`
    INSERT INTO app_user (id, name, phone, profile, city, adherence, status, seed, protocols)
    VALUES (${id}, ${u.name}, ${u.phone || ""}, ${u.profile || "client"}, ${u.city || ""},
            ${u.adherence || 0}, ${u.status || "actif"}, ${seed}, ${protocols}::jsonb)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name, phone = EXCLUDED.phone, profile = EXCLUDED.profile,
      city = EXCLUDED.city, protocols = EXCLUDED.protocols
  `;
  const rows = (await sql`SELECT * FROM app_user WHERE id = ${id}`) as any[];
  return rowToUser(rows[0]);
}

export async function deleteUser(id: string): Promise<void> {
  await sql`DELETE FROM app_user WHERE id = ${id}`;
}

export async function upsertProduct(p: StoreProduct): Promise<StoreProduct> {
  const id =
    p.id ||
    p.name.toLowerCase().replace(/[™®]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 32) ||
    "p-" + Date.now().toString(36);
  const size = JSON.stringify(p.size || { fr: "", en: "", pt: "" });
  const blurb = JSON.stringify(p.blurb || { fr: "", en: "", pt: "" });
  await sql`
    INSERT INTO products (id, name, cat, price, size, rating, reviews, tag, blurb, best, active, stock, image, sort, updated_at)
    VALUES (${id}, ${p.name}, ${p.cat}, ${Number(p.price) || 0}, ${size}::jsonb,
            ${Number(p.rating) || 4.5}, ${Number(p.reviews) || 0}, ${p.tag || null}, ${blurb}::jsonb,
            ${!!p.best}, ${p.active !== false}, ${Number(p.stock) || 0}, ${p.image || null},
            COALESCE((SELECT sort FROM products WHERE id = ${id}), (SELECT COALESCE(MAX(sort), 0) + 1 FROM products)), now())
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name, cat = EXCLUDED.cat, price = EXCLUDED.price, size = EXCLUDED.size,
      rating = EXCLUDED.rating, reviews = EXCLUDED.reviews, tag = EXCLUDED.tag, blurb = EXCLUDED.blurb,
      best = EXCLUDED.best, active = EXCLUDED.active, stock = EXCLUDED.stock, image = EXCLUDED.image,
      updated_at = now()
  `;
  const rows = (await sql`SELECT * FROM products WHERE id = ${id}`) as any[];
  return rowToProduct(rows[0]);
}

export async function deleteProduct(id: string): Promise<void> {
  await sql`DELETE FROM products WHERE id = ${id}`;
}

function slugify(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[™®]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

export async function upsertProtocol(p: Protocol): Promise<Protocol> {
  let id = p.id;
  if (!id) {
    const base = slugify(p.name?.fr || "") || "protocole";
    const exists = (await sql`SELECT 1 FROM protocols WHERE id = ${base} LIMIT 1`) as any[];
    id = exists.length ? `${base}-${Date.now().toString(36).slice(-4)}` : base;
  }
  const data = JSON.stringify({ ...p, id, custom: p.custom ?? true });
  await sql`
    INSERT INTO protocols (id, data, sort, updated_at)
    VALUES (${id}, ${data}::jsonb,
            COALESCE((SELECT sort FROM protocols WHERE id = ${id}), (SELECT COALESCE(MAX(sort), 0) + 1 FROM protocols)), now())
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
  `;
  const rows = (await sql`SELECT id, data, sort FROM protocols WHERE id = ${id}`) as any[];
  return rowToProtocol(rows[0]);
}

export async function deleteProtocol(id: string): Promise<void> {
  await sql`DELETE FROM protocols WHERE id = ${id}`;
}

export async function setOrderStage(ref: string, stage: number): Promise<Order | null> {
  const rows = (await sql`SELECT * FROM "order" WHERE ref = ${ref}`) as any[];
  if (!rows[0]) return null;
  const o = rowToOrder(rows[0]);
  const stamps = { ...o.stamps, [stage]: Date.now() };
  const eta = stage === 3 ? Date.now() : o.eta;
  await sql`
    UPDATE "order"
    SET stage = ${stage}, stamps = ${JSON.stringify(stamps)}::jsonb, eta = ${new Date(eta).toISOString()}
    WHERE ref = ${ref}
  `;
  const updated = (await sql`SELECT * FROM "order" WHERE ref = ${ref}`) as any[];
  return rowToOrder(updated[0]);
}

export async function updateBilan(id: string, patch: { status?: Bilan["status"]; reply?: string }): Promise<Bilan | null> {
  if (patch.reply !== undefined) {
    await sql`UPDATE bilan SET reply = ${patch.reply}, status = 'repondu' WHERE id = ${id}`;
  } else if (patch.status !== undefined) {
    await sql`UPDATE bilan SET status = ${patch.status} WHERE id = ${id}`;
  }
  const rows = (await sql`SELECT * FROM bilan WHERE id = ${id}`) as any[];
  return rows[0] ? rowToBilan(rows[0]) : null;
}
