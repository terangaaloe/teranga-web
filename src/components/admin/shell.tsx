"use client";
/* ============================================================
   TERANGA ALOE — BACK-OFFICE · Shell (navigation, router)
   ============================================================ */
import { type Route, useAdmin } from "./store";
import { Icon } from "./icon";
import { ABtn, Avatar, IconBtn } from "./ui";
import { DashboardScreen } from "./screens/dashboard";
import { OrdersScreen, OrderDrawer } from "./screens/orders";
import { UsersScreen, UserDrawer } from "./screens/users";
import { CatalogScreen } from "./screens/catalog";
import { ProtocolsScreen, ProtocolDrawer } from "./screens/protocols";
import { BilansScreen, BilanDrawer } from "./screens/bilans";

const NAV: { id: Route; label: string; icon: string; badge?: (a: ReturnType<typeof useAdmin>) => number }[] = [
  { id: "dashboard", label: "Tableau de bord", icon: "layout-dashboard" },
  { id: "orders", label: "Commandes", icon: "receipt", badge: (a) => a.kpis.nouvelles },
  { id: "users", label: "Utilisateurs", icon: "users" },
  { id: "products", label: "Produits", icon: "shopping-bag" },
  { id: "protocols", label: "Protocoles", icon: "leaf" },
  { id: "bilans", label: "Bilans", icon: "clipboard-list", badge: (a) => a.kpis.bilansNouveaux },
];

function Sidebar() {
  const A = useAdmin();
  return (
    <aside
      style={{
        width: 248,
        flexShrink: 0,
        background: "var(--rich-black)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ padding: "22px 22px 18px", display: "flex", alignItems: "center", gap: 11, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--aloe-gold)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="leaf" size={21} color="var(--forever-black)" />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 15.5, letterSpacing: "-0.01em", lineHeight: 1 }}>Teranga Aloe</div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 3 }}>Back-office</div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 3 }}>
        {NAV.map((n) => {
          const on = A.route === n.id;
          const badge = n.badge ? n.badge(A) : 0;
          return (
            <button
              key={n.id}
              onClick={() => {
                A.setRoute(n.id);
                A.setDetail(null);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 13px",
                borderRadius: "var(--radius-md)",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                background: on ? "var(--aloe-gold)" : "transparent",
                color: on ? "var(--forever-black)" : "rgba(255,255,255,0.78)",
                fontFamily: "var(--font-sans)",
                fontWeight: on ? 700 : 600,
                fontSize: 14,
                transition: "background .15s, color .15s",
              }}
              onMouseEnter={(e) => {
                if (!on) e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={(e) => {
                if (!on) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon name={n.icon} size={19} stroke={2} />
              <span style={{ flex: 1 }}>{n.label}</span>
              {badge > 0 && (
                <span
                  style={{
                    background: on ? "var(--forever-black)" : "var(--aloe-gold)",
                    color: on ? "var(--aloe-gold)" : "var(--forever-black)",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 700,
                    fontSize: 11.5,
                    borderRadius: 999,
                    padding: "1px 8px",
                    minWidth: 20,
                    textAlign: "center",
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 10px" }}>
          <Avatar name={A.ADMIN_ACCOUNT.name} initials={A.ADMIN_ACCOUNT.initials} profile="fbo" size={38} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 13.5 }}>{A.ADMIN_ACCOUNT.name}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}>{A.ADMIN_ACCOUNT.role}</div>
          </div>
          <IconBtn icon="log-out" onClick={A.logout} title="Déconnexion" style={{ color: "rgba(255,255,255,0.7)" }} />
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  const A = useAdmin();
  const cur = NAV.find((n) => n.id === A.route);
  return (
    <header
      style={{
        height: 64,
        flexShrink: 0,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg-subtle)" }}>
        <Icon name="leaf" size={16} color="var(--ink-400)" />
        <span>Teranga Aloe</span>
        <Icon name="chevron-right" size={14} color="var(--ink-300)" />
        <span style={{ color: "var(--fg-strong)", fontWeight: 600 }}>{cur ? cur.label : ""}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <ABtn kind="ghost" size="sm" icon="smartphone">
          App cliente
        </ABtn>
        <div style={{ position: "relative" }}>
          <IconBtn icon="bell" title="Notifications" />
          {A.kpis.nouvelles + A.kpis.bilansNouveaux > 0 && (
            <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "var(--aloe-gold)", border: "1.5px solid var(--surface)" }} />
          )}
        </div>
      </div>
    </header>
  );
}

function Router() {
  const A = useAdmin();
  return (
    <>
      {A.route === "dashboard" && <DashboardScreen />}
      {A.route === "orders" && <OrdersScreen />}
      {A.route === "users" && <UsersScreen />}
      {A.route === "products" && <CatalogScreen />}
      {A.route === "protocols" && <ProtocolsScreen />}
      {A.route === "bilans" && <BilansScreen />}
    </>
  );
}

export function Shell() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-tinted)" }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <main style={{ flex: 1, padding: "28px 32px", maxWidth: 1280, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
          <Router />
        </main>
      </div>
      {/* Drawers globaux */}
      <OrderDrawer />
      <UserDrawer />
      <ProtocolDrawer />
      <BilanDrawer />
    </div>
  );
}
