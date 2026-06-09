/* ============================================================
   TERANGA ALOE — Back-office · Helpers (dates, stages, slots)
   ============================================================ */
import type { OrderStage } from "./types";

export const H = 3600000;
export const DAY = 86400000;
export const now = () => Date.now();
export const pad2 = (n: number) => String(n).padStart(2, "0");
export const dKey = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/* RNG déterministe par graine */
export function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export const normPhone = (s: string) => (s || "").replace(/[^\d]/g, "");

export function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* Statuts de commande */
export const ORDER_STAGES: OrderStage[] = [
  { id: 0, label: "Nouvelle", short: "Nouvelle", icon: "receipt", color: "var(--sky-blue)" },
  { id: 1, label: "En préparation", short: "Préparation", icon: "package", color: "var(--aloe-gold)" },
  { id: 2, label: "Expédiée", short: "Expédiée", icon: "truck", color: "var(--earth-brown)" },
  { id: 3, label: "Livrée", short: "Livrée", icon: "check-circle", color: "var(--aloe-green)" },
];
export const stageMeta = (s: number) => ORDER_STAGES[s] || ORDER_STAGES[0];

/* Pastille horaire (icône moment de journée) */
export function slotMeta(id: string): { icon: string; label: string } {
  if (id.includes("matin")) return { icon: "sun", label: "Matin" };
  if (id.includes("midi")) return { icon: "sunset", label: "Midi" };
  if (id.includes("soir")) return { icon: "moon", label: "Soir" };
  if (id.includes("local")) return { icon: "droplet", label: "Soin local" };
  return { icon: "clock", label: "" };
}

/* Formatage dates fr-FR */
export const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
export const fmtDateTime = (ts: number) =>
  new Date(ts).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
export const relTime = (ts: number) => {
  const s = (Date.now() - ts) / 1000;
  if (s < 60) return "à l'instant";
  if (s < 3600) return Math.floor(s / 60) + " min";
  if (s < 86400) return Math.floor(s / 3600) + " h";
  const dd = Math.floor(s / 86400);
  return dd === 1 ? "hier" : dd + " j";
};
