"use client";
/* ============================================================
   TERANGA ALOE — Back-office · Store central (admin)
   Données servies par la base Neon Postgres via /api/*.
   Auth par cookie de session (vérifiée côté serveur).
   ============================================================ */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { userIntake, userTracking } from "@/lib/seed";
import type { AdminUser, Bilan, IntakeDay, Order, Protocol, StoreProduct, TrackingData } from "@/lib/types";

export const ADMIN_FALLBACK = { id: "", name: "—", role: "Administrateur", phone: "", email: "", initials: "TA" };
type Account = typeof ADMIN_FALLBACK;

export type Detail =
  | { type: "order"; id: string }
  | { type: "user"; id: string }
  | { type: "product"; id: string }
  | { type: "protocol"; id: string; draft?: Protocol }
  | { type: "bilan"; id: string }
  | null;

export type Route = "dashboard" | "orders" | "users" | "products" | "protocols" | "bilans";

interface DataState {
  users: AdminUser[];
  products: StoreProduct[];
  protocols: Protocol[]; // lignes custom/override venant de la base
  orders: Order[];
  bilans: Bilan[];
}
const EMPTY_DATA: DataState = { users: [], products: [], protocols: [], orders: [], bilans: [] };

function computeKpis(orders: Order[], d: DataState) {
  return {
    nouvelles: orders.filter((o) => o.stage === 0).length,
    enCours: orders.filter((o) => o.stage > 0 && o.stage < 3).length,
    livrees: orders.filter((o) => o.stage === 3).length,
    ca: orders.reduce((s, o) => s + o.total, 0),
    users: d.users.length,
    actifs: d.users.filter((u) => u.status === "actif").length,
    bilansNouveaux: d.bilans.filter((b) => b.status === "nouveau").length,
    produits: d.products.length,
    ruptures: d.products.filter((p) => (p.stock ?? 0) <= 5).length,
  };
}

interface AdminContextValue {
  ADMIN_ACCOUNT: Account;
  authed: boolean;
  ready: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => void;
  orders: Order[];
  ordersByStage: Record<number, Order[]>;
  kpis: ReturnType<typeof computeKpis>;
  users: AdminUser[];
  products: StoreProduct[];
  protocols: Protocol[];
  bilans: Bilan[];
  intake: Record<string, IntakeDay[]>;
  tracking: Record<string, TrackingData>;
  getUser: (id: string) => AdminUser | null;
  getOrder: (ref: string) => Order | null;
  getProduct: (id: string) => StoreProduct | null;
  getProtocol: (id: string) => Protocol | null;
  route: Route;
  setRoute: (r: Route) => void;
  detail: Detail;
  setDetail: (d: Detail) => void;
  setOrderStage: (ref: string, stage: number) => void;
  saveUser: (u: Partial<AdminUser> & { name: string }) => Promise<AdminUser | null>;
  deleteUser: (id: string) => Promise<boolean>;
  saveProduct: (p: StoreProduct) => Promise<StoreProduct | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  saveProtocol: (p: Protocol) => Promise<Protocol | null>;
  deleteProtocol: (id: string) => Promise<boolean>;
  markBilan: (id: string, status: Bilan["status"]) => void;
  replyBilan: (id: string, reply: string) => void;
  resetData: () => void;
}

const AdminCtx = createContext<AdminContextValue | null>(null);
export const useAdmin = () => {
  const ctx = useContext(AdminCtx);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};

async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || "Erreur serveur");
  return data;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [account, setAccount] = useState<Account>(ADMIN_FALLBACK);
  const [data, setData] = useState<DataState>(EMPTY_DATA);
  const [route, setRoute] = useState<Route>("dashboard");
  const [detail, setDetail] = useState<Detail>(null);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (!res.ok) return;
      const d = (await res.json()) as DataState;
      setData({ ...EMPTY_DATA, ...d });
    } catch {
      /* réseau indisponible */
    }
  }, []);

  // Hydratation : statut de session + données
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const j = (await res.json()) as { authed: boolean; account?: Account };
        if (j.authed) {
          setAuthed(true);
          if (j.account) setAccount({ ...ADMIN_FALLBACK, ...j.account });
          await loadData();
        }
      } catch {
        /* ignore */
      } finally {
        setReady(true);
      }
    })();
  }, [loadData]);

  const orders = useMemo(() => [...data.orders].sort((a, b) => b.placedAt - a.placedAt), [data.orders]);

  // Les protocoles proviennent directement de la table canonique `protocols`.
  const protocols = data.protocols;

  const intake = useMemo(() => Object.fromEntries(data.users.map((u) => [u.id, userIntake(u)])), [data.users]);
  const tracking = useMemo(() => Object.fromEntries(data.users.map((u) => [u.id, userTracking(u)])), [data.users]);

  const ordersByStage = useMemo(() => {
    const m: Record<number, Order[]> = { 0: [], 1: [], 2: [], 3: [] };
    orders.forEach((o) => (m[o.stage] = m[o.stage] || []).push(o));
    return m;
  }, [orders]);

  const kpis = useMemo(() => computeKpis(orders, data), [orders, data]);

  const login = useCallback(
    async (identifier: string, password: string) => {
      try {
        const j = (await postJSON("/api/auth/login", { identifier, password })) as { ok: boolean; account?: Account };
        if (!j.ok) return false;
        setAuthed(true);
        if (j.account) setAccount({ ...ADMIN_FALLBACK, ...j.account });
        await loadData();
        return true;
      } catch {
        return false;
      }
    },
    [loadData],
  );

  const logout = useCallback(() => {
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setAuthed(false);
    setAccount(ADMIN_FALLBACK);
    setData(EMPTY_DATA);
    setRoute("dashboard");
    setDetail(null);
  }, []);

  const getUser = useCallback((id: string) => data.users.find((u) => u.id === id) || null, [data.users]);
  const getOrder = useCallback((ref: string) => orders.find((o) => o.ref === ref) || null, [orders]);
  const getProduct = useCallback((id: string) => data.products.find((p) => p.id === id) || null, [data.products]);
  const getProtocol = useCallback((id: string) => protocols.find((p) => p.id === id) || null, [protocols]);

  /* ---- mutations (API → état local) ---- */
  const setOrderStage = useCallback((ref: string, stage: number) => {
    postJSON("/api/orders", { ref, stage })
      .then((j) => {
        const order = (j as { order: Order }).order;
        setData((d) => ({ ...d, orders: d.orders.map((o) => (o.ref === ref ? order : o)) }));
      })
      .catch((e) => toast.error(e.message));
  }, []);

  const saveUser = useCallback(async (u: Partial<AdminUser> & { name: string }) => {
    try {
      const j = await postJSON("/api/users", u);
      const user = (j as { user: AdminUser }).user;
      setData((d) => ({ ...d, users: d.users.some((x) => x.id === user.id) ? d.users.map((x) => (x.id === user.id ? user : x)) : [user, ...d.users] }));
      return user;
    } catch (e) {
      toast.error((e as Error).message);
      return null;
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Suppression impossible");
      setData((d) => ({ ...d, users: d.users.filter((u) => u.id !== id) }));
      return true;
    } catch (e) {
      toast.error((e as Error).message);
      return false;
    }
  }, []);

  const saveProduct = useCallback(async (p: StoreProduct) => {
    try {
      const j = await postJSON("/api/products", p);
      const product = (j as { product: StoreProduct }).product;
      setData((d) => ({ ...d, products: d.products.some((x) => x.id === product.id) ? d.products.map((x) => (x.id === product.id ? product : x)) : [product, ...d.products] }));
      return product;
    } catch (e) {
      toast.error((e as Error).message);
      return null;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Suppression impossible");
      setData((d) => ({ ...d, products: d.products.filter((p) => p.id !== id) }));
      return true;
    } catch (e) {
      toast.error((e as Error).message);
      return false;
    }
  }, []);

  const saveProtocol = useCallback(async (p: Protocol) => {
    try {
      const j = await postJSON("/api/protocols", p);
      const protocol = (j as { protocol: Protocol }).protocol;
      setData((d) => ({ ...d, protocols: d.protocols.some((x) => x.id === protocol.id) ? d.protocols.map((x) => (x.id === protocol.id ? protocol : x)) : [...d.protocols, protocol] }));
      return protocol;
    } catch (e) {
      toast.error((e as Error).message);
      return null;
    }
  }, []);

  const deleteProtocol = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/protocols?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Suppression impossible");
      setData((d) => ({ ...d, protocols: d.protocols.filter((p) => p.id !== id) }));
      return true;
    } catch (e) {
      toast.error((e as Error).message);
      return false;
    }
  }, []);

  const markBilan = useCallback((id: string, status: Bilan["status"]) => {
    setData((d) => ({ ...d, bilans: d.bilans.map((b) => (b.id === id ? { ...b, status } : b)) }));
    postJSON("/api/bilans", { id, status }).catch((e) => toast.error(e.message));
  }, []);

  const replyBilan = useCallback((id: string, reply: string) => {
    postJSON("/api/bilans", { id, reply })
      .then((j) => {
        const bilan = (j as { bilan: Bilan }).bilan;
        setData((d) => ({ ...d, bilans: d.bilans.map((b) => (b.id === id ? bilan : b)) }));
      })
      .catch((e) => toast.error(e.message));
  }, []);

  const resetData = useCallback(() => {
    loadData().then(() => toast("Données actualisées depuis la base"));
  }, [loadData]);

  const value: AdminContextValue = {
    ADMIN_ACCOUNT: account,
    authed,
    ready,
    login,
    logout,
    orders,
    ordersByStage,
    kpis,
    users: data.users,
    products: data.products,
    protocols,
    bilans: data.bilans,
    intake,
    tracking,
    getUser,
    getOrder,
    getProduct,
    getProtocol,
    route,
    setRoute,
    detail,
    setDetail,
    setOrderStage,
    saveUser,
    deleteUser,
    saveProduct,
    deleteProduct,
    saveProtocol,
    deleteProtocol,
    markBilan,
    replyBilan,
    resetData,
  };

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}
