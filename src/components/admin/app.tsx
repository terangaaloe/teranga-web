"use client";
/* ============================================================
   TERANGA ALOE — BACK-OFFICE · Racine
   ============================================================ */
import { AdminProvider, useAdmin } from "./store";
import { LoginScreen } from "./login";
import { Shell } from "./shell";

function AdminApp() {
  const A = useAdmin();
  if (!A.ready) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-tinted)" }}>
        <div style={{ fontFamily: "var(--font-sans)", color: "var(--fg-subtle)", fontSize: 14 }}>Chargement…</div>
      </div>
    );
  }
  return A.authed ? <Shell /> : <LoginScreen />;
}

export function AdminRoot() {
  return (
    <AdminProvider>
      <AdminApp />
    </AdminProvider>
  );
}
