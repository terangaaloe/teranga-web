"use client";
/* ============================================================
   BACK-OFFICE · Utilisateurs (liste + fiche + édition)
   ============================================================ */
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { fmtDate, slotMeta } from "@/lib/helpers";
import type { AdminUser } from "@/lib/types";
import { useAdmin } from "../store";
import { Icon } from "../icon";
import { Drawer, Modal } from "../overlays";
import {
  ABtn,
  ACard,
  Avatar,
  Badge,
  type Column,
  Dot,
  EmptyState,
  Field,
  Input,
  Meter,
  PageHead,
  SearchBox,
  Select,
  Spark,
  StatBox,
  Table,
  Tabs,
} from "../ui";

type EditUser = Partial<AdminUser> & { name: string; profile: AdminUser["profile"]; protocols: string[] };

export function UsersScreen() {
  const A = useAdmin();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [edit, setEdit] = useState<EditUser | null>(null);

  const rows = useMemo(
    () =>
      A.users.filter((u) => {
        if (filter === "client" && u.profile !== "client") return false;
        if (filter === "fbo" && u.profile !== "fbo") return false;
        if (filter === "inactif" && u.status !== "inactif") return false;
        if (q && !`${u.name} ${u.phone} ${u.city}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [A.users, q, filter],
  );

  const tabs = [
    { id: "all", label: "Tous", count: A.users.length },
    { id: "client", label: "Clients", count: A.users.filter((u) => u.profile === "client").length },
    { id: "fbo", label: "FBO", count: A.users.filter((u) => u.profile === "fbo").length },
    { id: "inactif", label: "Inactifs", count: A.users.filter((u) => u.status === "inactif").length },
  ];

  const columns: Column<AdminUser>[] = [
    {
      label: "Utilisateur",
      render: (u) => (
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Avatar name={u.name} initials={u.initials} profile={u.profile} size={36} />
          <div>
            <div style={{ fontWeight: 600, color: "var(--fg-strong)", fontSize: 14 }}>{u.name}</div>
            <div style={{ fontSize: 12, color: "var(--fg-subtle)" }}>{u.phone}</div>
          </div>
        </div>
      ),
    },
    { label: "Profil", render: (u) => (u.profile === "fbo" ? <Badge color="var(--rich-black)">FBO</Badge> : <Badge color="var(--earth-brown)">Client</Badge>) },
    { label: "Ville", render: (u) => <span style={{ color: "var(--fg-muted)", fontSize: 13 }}>{u.city}</span> },
    { label: "Protocoles", render: (u) => <span style={{ color: "var(--fg-muted)" }}>{(u.protocols || []).length}</span> },
    {
      label: "Adhérence",
      width: 150,
      render: (u) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 64 }}>
            <Meter value={u.adherence} color={u.adherence >= 75 ? "var(--aloe-green)" : u.adherence >= 55 ? "var(--aloe-gold)" : "var(--earth-brown)"} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" }}>{u.adherence}%</span>
        </div>
      ),
    },
    {
      label: "Statut",
      render: (u) => (
        <Badge color={u.status === "actif" ? "var(--aloe-green)" : "var(--ink-500)"}>
          <Dot color={u.status === "actif" ? "var(--aloe-green)" : "var(--ink-400)"} size={6} />
          {u.status === "actif" ? "Actif" : "Inactif"}
        </Badge>
      ),
    },
    { label: "", align: "right", width: 40, render: () => <Icon name="chevron-right" size={17} color="var(--ink-400)" /> },
  ];

  return (
    <div>
      <PageHead title="Utilisateurs" sub="Clients et distributeurs (FBO) de votre réseau">
        <ABtn kind="primary" icon="user-plus" onClick={() => setEdit({ name: "", phone: "", profile: "client", city: "", protocols: [] })}>
          Nouvel utilisateur
        </ABtn>
      </PageHead>
      <div style={{ marginBottom: 18 }}>
        <SearchBox value={q} onChange={setQ} placeholder="Nom, téléphone, ville…" style={{ width: 320, maxWidth: "100%" }} />
      </div>
      <Tabs tabs={tabs} value={filter} onChange={setFilter} />
      <Table onRow={(u) => A.setDetail({ type: "user", id: u.id })} columns={columns} rows={rows} empty="Aucun utilisateur" />
      <UserEditModal user={edit} onClose={() => setEdit(null)} />
    </div>
  );
}

export function UserEditModal({ user, onClose }: { user: EditUser | null; onClose: () => void }) {
  const A = useAdmin();
  const [f, setF] = useState<EditUser | null>(user);
  useEffect(() => setF(user), [user]);
  if (!f) return null;
  const isNew = !f.id;
  const set = <K extends keyof EditUser>(k: K, v: EditUser[K]) => setF((s) => (s ? { ...s, [k]: v } : s));
  const toggleProto = (id: string) =>
    setF((s) => (s ? { ...s, protocols: (s.protocols || []).includes(id) ? s.protocols.filter((x) => x !== id) : [...(s.protocols || []), id] } : s));
  const save = async () => {
    if (!f.name.trim()) {
      toast.error("Le nom est requis");
      return;
    }
    const saved = await A.saveUser(f);
    if (!saved) return;
    toast.success(isNew ? "Utilisateur créé" : "Utilisateur mis à jour");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Nouvel utilisateur" : "Modifier l'utilisateur"}
      width={560}
      footer={
        <>
          <ABtn kind="ghost" onClick={onClose}>
            Annuler
          </ABtn>
          <ABtn kind="primary" icon="save" onClick={save}>
            Enregistrer
          </ABtn>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Nom complet" required>
          <Input value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex. Awa Diop" />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Téléphone">
            <Input value={f.phone || ""} onChange={(e) => set("phone", e.target.value)} placeholder="+221 …" />
          </Field>
          <Field label="Profil">
            <Select value={f.profile} onChange={(e) => set("profile", e.target.value as AdminUser["profile"])}>
              <option value="client">Client</option>
              <option value="fbo">Distributeur (FBO)</option>
            </Select>
          </Field>
        </div>
        <Field label="Ville / quartier">
          <Input value={f.city || ""} onChange={(e) => set("city", e.target.value)} placeholder="Dakar — Sicap Liberté" />
        </Field>
        <Field label="Protocoles suivis">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {A.protocols.map((p) => {
              const on = (f.protocols || []).includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProto(p.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1.5px solid " + (on ? "var(--rich-black)" : "var(--border)"),
                    background: on ? "var(--gold-15)" : "var(--surface)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      border: "1.5px solid " + (on ? "var(--rich-black)" : "var(--border-strong)"),
                      background: on ? "var(--aloe-gold)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {on && <Icon name="check" size={12} stroke={3} color="var(--forever-black)" />}
                  </span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--fg-strong)" }}>{p.name.fr}</span>
                </button>
              );
            })}
          </div>
        </Field>
      </div>
    </Modal>
  );
}

/* ---------------------------------------------- FICHE UTILISATEUR */
export function UserDrawer() {
  const A = useAdmin();
  const [tab, setTab] = useState("profil");
  const [edit, setEdit] = useState<EditUser | null>(null);
  const isOpen = A.detail?.type === "user";
  const detailId = A.detail?.type === "user" ? A.detail.id : null;
  useEffect(() => {
    if (isOpen) setTab("profil");
  }, [isOpen, detailId]);
  const u = isOpen && detailId ? A.getUser(detailId) : null;
  const close = () => A.setDetail(null);
  if (!u) return <Drawer open={false} onClose={close} />;

  const intake = A.intake[u.id] || [];
  const tracking = A.tracking[u.id] || null;
  const myBilans = A.bilans.filter((b) => b.userId === u.id);
  const protos = (u.protocols || []).map((id) => A.getProtocol(id)).filter(Boolean);

  return (
    <Drawer
      open
      onClose={close}
      width={620}
      title={u.name}
      sub={(u.profile === "fbo" ? "Distributeur FBO" : "Client") + " · " + u.city}
      footer={
        <>
          <ABtn
            kind="danger"
            icon="trash-2"
            onClick={async () => {
              if (confirm("Supprimer cet utilisateur ?")) {
                const ok = await A.deleteUser(u.id);
                if (ok) {
                  toast("Utilisateur supprimé");
                  close();
                }
              }
            }}
          >
            Supprimer
          </ABtn>
          <ABtn kind="primary" icon="pencil" onClick={() => setEdit({ ...u })}>
            Modifier
          </ABtn>
        </>
      }
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <Avatar name={u.name} initials={u.initials} profile={u.profile} size={60} style={{ fontSize: 22 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 14, fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--fg-muted)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="phone" size={14} color="var(--ink-400)" />
              {u.phone}
            </span>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <Badge color={u.status === "actif" ? "var(--aloe-green)" : "var(--ink-500)"}>
              <Dot color={u.status === "actif" ? "var(--aloe-green)" : "var(--ink-400)"} size={6} />
              {u.status === "actif" ? "Actif" : "Inactif"}
            </Badge>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--fg-subtle)" }}>Inscrit le {fmtDate(u.joinedAt)}</span>
          </div>
        </div>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "profil", label: "Profil", icon: "user" },
          { id: "prises", label: "Prises", icon: "calendar-check" },
          { id: "suivi", label: "Suivi", icon: "activity" },
          { id: "bilans", label: "Bilans", icon: "clipboard-list", count: myBilans.length },
        ]}
      />

      {tab === "profil" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            <StatBox label="Adhérence" value={u.adherence + "%"} color="var(--aloe-gold)" />
            <StatBox label="Protocoles" value={protos.length} color="var(--sky-blue)" />
            <StatBox label="Bilans" value={myBilans.length} color="var(--aloe-green)" />
          </div>
          <div className="fl-eyebrow" style={{ marginTop: 4 }}>
            Protocoles suivis
          </div>
          {protos.length === 0 ? (
            <EmptyState icon="leaf" title="Aucun protocole" />
          ) : (
            protos.map((p) => (
              <ACard key={p!.id} pad={14} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    background: `color-mix(in srgb, var(${p!.accent}) 16%, white)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: `var(${p!.accent})`,
                  }}
                >
                  <Icon name={p!.icon} size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 14.5, color: "var(--fg-strong)" }}>{p!.name.fr}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--fg-subtle)" }}>{p!.duration ? p!.duration.fr : ""}</div>
                </div>
                <ABtn
                  kind="soft"
                  size="sm"
                  onClick={() => {
                    A.setRoute("protocols");
                    A.setDetail({ type: "protocol", id: p!.id });
                  }}
                >
                  Ouvrir
                </ABtn>
              </ACard>
            ))
          )}
        </div>
      )}

      {tab === "prises" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-muted)", marginBottom: 4 }}>
            Historique des 21 derniers jours · {intake.length ? Math.round(intake.reduce((s, d) => s + d.rate, 0) / intake.length) : 0}% en moyenne
          </div>
          {intake.length === 0 ? (
            <EmptyState icon="calendar" title="Aucune prise enregistrée" />
          ) : (
            intake.map((d) => (
              <ACard key={d.date} pad={14}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: d.slots.length ? 10 : 0 }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 13.5, color: "var(--fg-strong)", textTransform: "capitalize" }}>
                    {d.iso.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" })}
                  </div>
                  <Badge color={d.rate >= 75 ? "var(--aloe-green)" : d.rate >= 50 ? "var(--aloe-gold)" : "var(--earth-brown)"}>
                    {d.taken}/{d.total} · {d.rate}%
                  </Badge>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {d.slots.map((s, i) => {
                    const c = s.status === "taken" ? "var(--aloe-green)" : s.status === "skipped" ? "var(--earth-brown)" : "var(--ink-400)";
                    return (
                      <span
                        key={i}
                        title={s.proto + " — " + s.slot}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "4px 9px",
                          borderRadius: 999,
                          background: `color-mix(in srgb, ${c} 12%, white)`,
                          border: `1px solid color-mix(in srgb, ${c} 28%, white)`,
                          fontFamily: "var(--font-sans)",
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: `color-mix(in srgb, ${c} 75%, black)`,
                        }}
                      >
                        <Icon name={s.status === "taken" ? "check" : s.status === "skipped" ? "x" : "minus"} size={11} stroke={2.6} />
                        {slotMeta(s.slotId).label || s.time}
                      </span>
                    );
                  })}
                </div>
              </ACard>
            ))
          )}
        </div>
      )}

      {tab === "suivi" &&
        (tracking ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <ACard pad={18}>
              <div className="fl-eyebrow" style={{ marginBottom: 14 }}>
                Indicateurs ressentis · 21 jours
              </div>
              {(
                [
                  ["Stress", "stress", "var(--sky-blue)"],
                  ["Sommeil", "sommeil", "var(--aloe-green)"],
                  ["Énergie", "energie", "var(--aloe-gold)"],
                ] as const
              ).map(([lbl, key, c]) => {
                const series = tracking.indicators.map((x) => x[key]);
                return (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                    <div style={{ width: 78, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--fg-muted)" }}>{lbl}</div>
                    <div style={{ flex: 1 }}>
                      <Spark data={series} w={320} h={40} color={c} />
                    </div>
                    <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 16, color: c, width: 34, textAlign: "right" }}>{series[series.length - 1]}</div>
                  </div>
                );
              })}
            </ACard>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
              <ACard pad={18}>
                <div className="fl-eyebrow" style={{ marginBottom: 12 }}>
                  Poids · 8 semaines
                </div>
                <Spark data={tracking.weights.map((w) => w.kg)} w={300} h={64} color="var(--earth-brown)" />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: "var(--font-sans)", fontSize: 13 }}>
                  <span style={{ color: "var(--fg-subtle)" }}>{tracking.weights[0].kg} kg</span>
                  <span style={{ fontWeight: 700, color: "var(--aloe-green)" }}>{(tracking.weights[tracking.weights.length - 1].kg - tracking.weights[0].kg).toFixed(1)} kg</span>
                  <span style={{ color: "var(--fg-strong)", fontWeight: 700 }}>{tracking.weights[tracking.weights.length - 1].kg} kg</span>
                </div>
              </ACard>
              <ACard pad={18}>
                <div className="fl-eyebrow" style={{ marginBottom: 12 }}>
                  Mensurations
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {(
                    [
                      ["Tour de taille", tracking.measures.taille + " cm"],
                      ["Tour de hanches", tracking.measures.hanches + " cm"],
                      ["IMC", tracking.measures.imc],
                      ["Hydratation", tracking.hydration + " verres/j"],
                      ["Photos", tracking.photos],
                    ] as const
                  ).map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: 13.5 }}>
                      <span style={{ color: "var(--fg-muted)" }}>{l}</span>
                      <span style={{ fontWeight: 700, color: "var(--fg-strong)" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </ACard>
            </div>
          </div>
        ) : (
          <EmptyState icon="activity" title="Aucune donnée de suivi" />
        ))}

      {tab === "bilans" &&
        (myBilans.length === 0 ? (
          <EmptyState icon="clipboard-list" title="Aucun bilan envoyé" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {myBilans.map((b) => (
              <ACard key={b.id} pad={15} hover onClick={() => A.setDetail({ type: "bilan", id: b.id })}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 14, color: "var(--fg-strong)" }}>{b.protocol}</div>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--fg-subtle)" }}>{fmtDate(b.submittedAt)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <Meter value={b.adherence} color="var(--aloe-gold)" />
                  </div>
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 13, color: "var(--fg-strong)" }}>{b.adherence}%</span>
                </div>
              </ACard>
            ))}
          </div>
        ))}

      <UserEditModal user={edit} onClose={() => setEdit(null)} />
    </Drawer>
  );
}
