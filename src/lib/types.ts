/* ============================================================
   TERANGA ALOE — Back-office · Types
   ============================================================ */

export interface Loc {
  fr: string;
  en: string;
  pt: string;
}

export interface ScheduleItem {
  p: string;
  dose: Loc;
  why: Loc;
}

export interface ScheduleSlot {
  id: string;
  label: Loc;
  time: string;
  items: ScheduleItem[];
}

export interface ProtocolPhase {
  id: string;
  name: Loc;
  range: string;
  focus: Loc;
}

export interface TrackingTarget {
  fr: string;
  en: string;
  pt: string;
  target: string;
}

export interface Protocol {
  id: string;
  name: Loc;
  icon: string;
  accent: string; // CSS var name e.g. "--aloe-green"
  tagline?: Loc;
  overview?: Loc;
  duration?: Loc;
  phases: ProtocolPhase[];
  schedule: ScheduleSlot[];
  tracking?: TrackingTarget[];
  warnings?: { fr: string; en: string; pt: string }[];
  custom?: boolean;
}

export interface StoreCategory {
  id: string;
  fr: string;
  en: string;
  pt: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  cat: string;
  price: number;
  size: Loc;
  rating: number;
  reviews: number;
  tag: string | null;
  blurb: Loc;
  best: boolean;
  /* back-office augmented fields */
  stock?: number;
  active?: boolean;
  /** Image personnalisée (data URL ou chemin) — prioritaire sur le packshot par défaut. */
  image?: string;
}

export type Profile = "client" | "fbo";

export interface AdminUser {
  id: string;
  name: string;
  initials: string;
  phone: string;
  profile: Profile;
  city: string;
  joinedAt: number;
  protocols: string[];
  adherence: number;
  lastActive: number;
  status: "actif" | "inactif";
  seed: number;
}

export interface OrderBuyer {
  name: string;
  phone: string;
  address: string;
  note?: string;
}

export interface Order {
  ref: string;
  userId: string;
  placedAt: number;
  items: Record<string, number>;
  total: number;
  buyer: OrderBuyer;
  pay: "cash" | "mm";
  stage: number;
  stamps: Record<number, number>;
  eta: number;
  fromApp?: boolean;
}

export interface Bilan {
  id: string;
  userId: string;
  protocolId: string;
  protocol: string;
  period: string;
  adherence: number;
  weightDelta: number;
  indicators: { stress: number; sommeil: number; energie: number };
  note: string;
  submittedAt: number;
  status: "nouveau" | "lu" | "repondu";
  reply: string;
}

export interface IntakeSlot {
  proto: string;
  protoId: string;
  slot: string;
  slotId: string;
  time: string;
  items: number;
  status: "taken" | "skipped" | "missed";
}

export interface IntakeDay {
  date: string;
  iso: Date;
  slots: IntakeSlot[];
  taken: number;
  total: number;
  rate: number;
}

export interface TrackingData {
  indicators: { date: string; stress: number; sommeil: number; energie: number }[];
  weights: { date: string; kg: number }[];
  measures: { taille: number; hanches: number; imc: number };
  photos: number;
  hydration: number;
}

export interface OrderStage {
  id: number;
  label: string;
  short: string;
  icon: string;
  color: string;
}

export interface AdminDb {
  users: AdminUser[];
  orders: Order[];
  products: StoreProduct[];
  customProtocols: Protocol[];
  protocolOverrides: Record<string, Partial<Protocol>>;
  bilans: Bilan[];
  intake: Record<string, IntakeDay[]>;
  tracking: Record<string, TrackingData>;
}
