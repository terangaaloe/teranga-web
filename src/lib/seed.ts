/* ============================================================
   TERANGA ALOE — Back-office · Génération des données seedées
   ============================================================ */
import { PROTOCOLS, STORE_PRODUCTS } from "./data";
import { DAY, H, dKey, initials, now, pad2, rng } from "./helpers";
import type { AdminDb, AdminUser, Bilan, IntakeDay, Order, StoreProduct, TrackingData } from "./types";

const CITIES = [
  "Dakar — Sicap Liberté", "Dakar — Almadies", "Pikine", "Guédiawaye", "Thiès",
  "Mbour", "Rufisque", "Saint-Louis", "Dakar — Plateau", "Touba",
];
const FNAMES = ["Awa", "Fatou", "Moussa", "Aïssatou", "Cheikh", "Mariama", "Ibrahima", "Ndèye", "Ousmane", "Khady", "Modou", "Sokhna", "Abdoulaye", "Bineta"];
const LNAMES = ["Diop", "Ndiaye", "Fall", "Sow", "Ba", "Sarr", "Gueye", "Diallo", "Mbaye", "Faye", "Sy", "Cissé", "Kane", "Niang"];

export function seedUsers(): AdminUser[] {
  const protoIds = PROTOCOLS.map((p) => p.id);
  const out: AdminUser[] = [];
  for (let i = 0; i < 11; i++) {
    const r = rng(1000 + i * 37);
    r(); r(); r();
    const fn = FNAMES[(i * 5 + 3) % FNAMES.length];
    const ln = LNAMES[(i * 3 + 1) % LNAMES.length];
    const name = `${fn} ${ln}`;
    const isFbo = i % 4 === 1;
    const nProt = 1 + Math.floor(r() * 2);
    const protocols: string[] = [];
    for (let k = 0; k < nProt; k++) {
      const id = protoIds[Math.floor(r() * protoIds.length)];
      if (id && !protocols.includes(id)) protocols.push(id);
    }
    const joinedDaysAgo = 10 + Math.floor(r() * 320);
    const adherence = 55 + Math.floor(r() * 44);
    const lastActiveDaysAgo = Math.floor(r() * 9);
    out.push({
      id: "u" + (i + 1),
      name,
      initials: initials(name),
      phone: "+221 7" + (6 + Math.floor(r() * 3)) + " " + pad2(Math.floor(r() * 100)) + " " + pad2(Math.floor(r() * 100)) + " " + pad2(Math.floor(r() * 100)),
      profile: isFbo ? "fbo" : "client",
      city: CITIES[Math.floor(r() * CITIES.length)],
      joinedAt: now() - joinedDaysAgo * DAY,
      protocols,
      adherence,
      lastActive: now() - lastActiveDaysAgo * DAY,
      status: lastActiveDaysAgo > 6 ? "inactif" : "actif",
      seed: 1000 + i * 37,
    });
  }
  return out;
}

/* Historique des prises d'un user : 21 jours, détail par créneau */
export function userIntake(user: AdminUser): IntakeDay[] {
  const r = rng(user.seed + 5);
  const protos = (user.protocols || []).map((id) => PROTOCOLS.find((p) => p.id === id)).filter(Boolean);
  const days: IntakeDay[] = [];
  for (let i = 0; i < 21; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const slots: IntakeDay["slots"] = [];
    protos.forEach((p) =>
      (p!.schedule || []).forEach((s) => {
        const taken = r() < user.adherence / 100 + 0.05;
        slots.push({
          proto: p!.name.fr,
          protoId: p!.id,
          slot: s.label.fr,
          slotId: s.id,
          time: s.time,
          items: s.items.length,
          status: taken ? "taken" : r() < 0.5 ? "skipped" : "missed",
        });
      }),
    );
    const taken = slots.filter((s) => s.status === "taken").length;
    days.push({ date: dKey(d), iso: d, slots, taken, total: slots.length, rate: slots.length ? Math.round((taken / slots.length) * 100) : 0 });
  }
  return days;
}

/* Données de suivi : indicateurs, poids, mensurations, photos */
export function userTracking(user: AdminUser): TrackingData {
  const r = rng(user.seed + 9);
  const indicators: TrackingData["indicators"] = [];
  const base = 4 + r() * 3;
  for (let i = 20; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    indicators.push({
      date: dKey(d),
      stress: Math.max(1, Math.min(10, Math.round((base - i * 0.06 + Math.sin(i) * 1.1) * 10) / 10)),
      sommeil: Math.max(2, Math.min(10, Math.round((5 + i * 0.04 + Math.cos(i) * 1.0) * 10) / 10)),
      energie: Math.max(2, Math.min(10, Math.round((5 + (20 - i) * 0.05 + Math.sin(i / 2)) * 10) / 10)),
    });
  }
  const weights: TrackingData["weights"] = [];
  let w = 64 + r() * 26;
  for (let i = 8; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    w -= r() * 0.7;
    weights.push({ date: dKey(d), kg: Math.round(w * 10) / 10 });
  }
  return {
    indicators,
    weights,
    measures: { taille: Math.round(70 + r() * 30), hanches: Math.round(92 + r() * 22), imc: Math.round((21 + r() * 8) * 10) / 10 },
    photos: Math.floor(r() * 5),
    hydration: 4 + Math.floor(r() * 5),
  };
}

export function seedOrdersFor(users: AdminUser[]): Order[] {
  const prodIds = STORE_PRODUCTS.map((p) => p.id);
  const orders: Order[] = [];
  let n = 0;
  users.forEach((u) => {
    const r = rng(u.seed + 21);
    const cnt = 1 + Math.floor(r() * 3);
    for (let k = 0; k < cnt; k++) {
      const items: Record<string, number> = {};
      const nItems = 1 + Math.floor(r() * 3);
      for (let j = 0; j < nItems; j++) {
        const id = prodIds[Math.floor(r() * prodIds.length)];
        items[id] = (items[id] || 0) + 1 + Math.floor(r() * 2);
      }
      const total = Object.entries(items).reduce((s, [id, q]) => {
        const p = STORE_PRODUCTS.find((x) => x.id === id);
        return s + (p ? p.price * q : 0);
      }, 0);
      const placedDaysAgo = Math.floor(r() * 18);
      const stage = placedDaysAgo > 6 ? 3 : Math.floor(r() * 4);
      const placedAt = now() - placedDaysAgo * DAY - Math.floor(r() * 12) * H;
      const stamps: Record<number, number> = { 0: placedAt };
      for (let st = 1; st <= stage; st++) stamps[st] = placedAt + st * (6 + Math.floor(r() * 10)) * H;
      orders.push({
        ref: "TA-" + placedAt.toString(36).toUpperCase().slice(-5) + n++,
        userId: u.id,
        placedAt,
        items,
        total,
        buyer: { name: u.name, phone: u.phone, address: u.city, note: "" },
        pay: r() < 0.5 ? "cash" : "mm",
        stage,
        stamps,
        eta: stage < 3 ? placedAt + 2 * DAY : stamps[stage],
      });
    }
  });
  return orders.sort((a, b) => b.placedAt - a.placedAt);
}

export function seedBilans(users: AdminUser[]): Bilan[] {
  const out: Bilan[] = [];
  users.forEach((u) => {
    const r = rng(u.seed + 33);
    if (r() < 0.55) {
      const proto = PROTOCOLS.find((p) => p.id === u.protocols[0]);
      const submittedAt = now() - Math.floor(r() * 12) * DAY;
      out.push({
        id: "b-" + u.id,
        userId: u.id,
        protocolId: u.protocols[0],
        protocol: proto ? proto.name.fr : "—",
        period: "14 derniers jours",
        adherence: u.adherence,
        weightDelta: -(Math.round(r() * 30) / 10),
        indicators: {
          stress: Math.round((3 + r() * 3) * 10) / 10,
          sommeil: Math.round((6 + r() * 3) * 10) / 10,
          energie: Math.round((6 + r() * 3) * 10) / 10,
        },
        note: [
          "Je me sens plus énergique le matin.",
          "Sommeil nettement amélioré, merci pour le suivi.",
          "Quelques oublis le midi au travail.",
          "Très satisfaite, je continue la cure.",
          "",
        ][Math.floor(r() * 5)],
        submittedAt,
        status: r() < 0.5 ? "nouveau" : r() < 0.6 ? "lu" : "repondu",
        reply: "",
      });
    }
  });
  return out.sort((a, b) => b.submittedAt - a.submittedAt);
}

export function buildSeed(): AdminDb {
  const users = seedUsers();
  const products: StoreProduct[] = STORE_PRODUCTS.map((p) => ({
    ...p,
    stock: 8 + Math.floor(rng(p.id.length * 13 + p.price)() * 60),
    active: true,
  }));
  return {
    users,
    orders: seedOrdersFor(users),
    products,
    customProtocols: [],
    protocolOverrides: {},
    bilans: seedBilans(users),
    intake: Object.fromEntries(users.map((u) => [u.id, userIntake(u)])),
    tracking: Object.fromEntries(users.map((u) => [u.id, userTracking(u)])),
  };
}
