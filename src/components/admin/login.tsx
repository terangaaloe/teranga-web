"use client";
/* ============================================================
   TERANGA ALOE — BACK-OFFICE · Login
   ============================================================ */
import { useState } from "react";
import { useAdmin } from "./store";
import { Icon } from "./icon";
import { ABtn, Field, Input } from "./ui";

export function LoginScreen() {
  const A = useAdmin();
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const ok = await A.login(identifier, pin);
    setBusy(false);
    if (!ok) {
      setErr(true);
      setTimeout(() => setErr(false), 2000);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "var(--font-sans)" }}>
      {/* Volet marque */}
      <div
        style={{
          flex: "1 1 0",
          background: "var(--rich-black)",
          color: "#fff",
          padding: "56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,198,0,0.16), transparent 70%)", top: -120, right: -120 }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-eagle-dark.png" alt="Forever" style={{ width: 132, filter: "invert(1)", position: "relative" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: "var(--font-script)", fontSize: 30, color: "var(--aloe-gold)", lineHeight: 1, marginBottom: 8 }}>Teranga</div>
          <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 46, letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0 }}>
            Espace
            <br />
            Distributeur
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.66)", maxWidth: 380, marginTop: 18, lineHeight: 1.55 }}>
            Gérez vos commandes, vos protocoles de cure, vos produits et le suivi de vos clients Forever Living.
          </p>
        </div>
        <div style={{ position: "relative", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Entrepreneur indépendant · partenaire de Forever Living Products</div>
      </div>

      {/* Formulaire */}
      <div style={{ flex: "0 0 480px", maxWidth: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, background: "var(--bg-tinted)" }}>
        <form onSubmit={submit} style={{ width: "100%", maxWidth: 340 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--aloe-gold)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
            <Icon name="lock" size={24} color="var(--forever-black)" />
          </div>
          <h2 className="fl-h2" style={{ fontSize: 27, margin: "0 0 6px" }}>
            Connexion
          </h2>
          <p style={{ fontSize: 14.5, color: "var(--fg-muted)", margin: "0 0 26px" }}>Identifiez-vous avec votre numéro et votre mot de passe.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="E-mail ou téléphone">
              <Input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="terangaaloe@gmail.com" autoFocus />
            </Field>
            <Field label="Mot de passe">
              <Input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••••••" />
            </Field>
          </div>
          {err && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#C0392B", fontSize: 13, fontWeight: 600, marginTop: 14 }}>
              <Icon name="alert-triangle" size={15} color="#C0392B" />
              Identifiant ou mot de passe incorrect.
            </div>
          )}
          <ABtn kind="primary" size="lg" full iconR="arrow-right" type="submit" disabled={busy} style={{ marginTop: 24 }}>
            {busy ? "Connexion…" : "Se connecter"}
          </ABtn>
          <div
            style={{
              marginTop: 22,
              padding: 13,
              background: "var(--gold-15)",
              border: "1px solid var(--gold-50)",
              borderRadius: "var(--radius-md)",
              fontSize: 12.5,
              color: "var(--fg-muted)",
              lineHeight: 1.6,
            }}
          >
            <b style={{ color: "var(--fg-strong)" }}>Accès administrateur</b> — connectez-vous avec l&apos;e-mail{" "}
            <b style={{ color: "var(--fg-strong)" }}>terangaaloe@gmail.com</b> et le mot de passe défini lors de la configuration.
          </div>
        </form>
      </div>
    </div>
  );
}
