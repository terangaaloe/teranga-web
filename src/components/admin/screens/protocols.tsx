"use client";
/* ============================================================
   BACK-OFFICE · Protocoles (création & gestion)
   Métadonnées + phases + planning des prises
   ============================================================ */
import { type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { STORE_PRODUCTS } from "@/lib/data";
import { slotMeta } from "@/lib/helpers";
import type { Loc, Protocol } from "@/lib/types";
import { useAdmin } from "../store";
import { Icon } from "../icon";
import { Drawer } from "../overlays";
import { ABtn, ACard, Badge, EmptyState, Field, Input, IconBtn, PageHead, ProductAvatar, SearchBox, Select } from "../ui";

const PROTO_ICONS = ["leaf", "droplets", "wind", "shield", "flower-2", "heart-pulse", "waves", "activity", "flame", "zap", "pill", "sun"];
const PROTO_ACCENTS: [string, string][] = [
  ["--aloe-green", "Vert"],
  ["--aloe-gold", "Or"],
  ["--sky-blue", "Bleu"],
  ["--earth-brown", "Brun"],
];
const L = (v: string): Loc => ({ fr: v, en: v, pt: v });

export function ProtocolsScreen() {
  const A = useAdmin();
  const [q, setQ] = useState("");
  const blank: Protocol = { id: "", name: L(""), icon: "leaf", accent: "--aloe-green", tagline: L(""), duration: L(""), phases: [], schedule: [], custom: true };
  const rows = A.protocols.filter((p) => !q || p.name.fr.toLowerCase().includes(q.toLowerCase()));

  const productCount = (p: Protocol) => {
    const s = new Set<string>();
    (p.schedule || []).forEach((sl) => (sl.items || []).forEach((it) => s.add(it.p)));
    return s.size;
  };

  return (
    <div>
      <PageHead title="Protocoles" sub={A.protocols.length + " protocoles de cure Forever"}>
        <ABtn kind="primary" icon="plus" onClick={() => A.setDetail({ type: "protocol", id: "__new__", draft: blank })}>
          Nouveau protocole
        </ABtn>
      </PageHead>
      <div style={{ marginBottom: 18 }}>
        <SearchBox value={q} onChange={setQ} placeholder="Nom du protocole…" style={{ width: 320 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {rows.map((p) => (
          <ACard key={p.id} hover pad={20} onClick={() => A.setDetail({ type: "protocol", id: p.id })}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 13,
                  background: `color-mix(in srgb, var(${p.accent}) 16%, white)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: `var(${p.accent})`,
                }}
              >
                <Icon name={p.icon} size={24} />
              </div>
              {p.custom ? <Badge color="var(--aloe-gold)">Perso</Badge> : <Badge color="var(--ink-500)">Forever</Badge>}
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 17, color: "var(--fg-strong)", marginBottom: 5 }}>{p.name.fr}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.45, minHeight: 36 }}>{p.tagline ? p.tagline.fr : ""}</div>
            <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--divider)" }}>
              <Meta icon="layout-dashboard" v={(p.phases || []).length} l="phases" />
              <Meta icon="clock" v={(p.schedule || []).length} l="créneaux" />
              <Meta icon="pill" v={productCount(p)} l="produits" />
            </div>
          </ACard>
        ))}
      </div>
    </div>
  );
}

function Meta({ icon, v, l }: { icon: string; v: number; l: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--fg-subtle)" }}>
      <Icon name={icon} size={14} color="var(--ink-400)" />
      <b style={{ color: "var(--fg-strong)", fontWeight: 700 }}>{v}</b> {l}
    </div>
  );
}

function SectionRow({ title, onAdd }: { title: string; onAdd?: (() => void) | null }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
      <div className="fl-eyebrow">{title}</div>
      {onAdd && (
        <ABtn kind="soft" size="sm" icon="plus" onClick={onAdd}>
          Ajouter
        </ABtn>
      )}
    </div>
  );
}

export function ProtocolDrawer() {
  const A = useAdmin();
  const detail = A.detail;
  const isOpen = detail?.type === "protocol";
  const isNew = detail?.type === "protocol" && detail.id === "__new__";
  const detailId = detail?.type === "protocol" ? detail.id : null;
  const base = detail?.type === "protocol" ? (isNew ? detail.draft! : A.getProtocol(detail.id)) : null;
  const [f, setF] = useState<Protocol | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (base) {
      setF(JSON.parse(JSON.stringify(base)));
      setEditing(isNew);
    } else {
      setF(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, detailId]);

  const close = () => A.setDetail(null);
  if (!f) return <Drawer open={false} onClose={close} />;

  const isBase = !f.custom;
  const set = <K extends keyof Protocol>(k: K, v: Protocol[K]) => setF((s) => (s ? { ...s, [k]: v } : s));
  const setL = (k: "name" | "tagline" | "duration", v: string) => setF((s) => (s ? { ...s, [k]: L(v) } : s));
  const productNames = STORE_PRODUCTS.map((p) => p.name);

  const save = async () => {
    if (!f.name.fr.trim()) {
      toast.error("Le nom est requis");
      return;
    }
    const saved = await A.saveProtocol(f);
    if (!saved) return;
    toast.success(isNew ? "Protocole créé" : "Protocole enregistré");
    setEditing(false);
    // On rouvre le panneau sur l'id réellement attribué par la base.
    A.setDetail({ type: "protocol", id: saved.id });
  };

  /* ---- phases ---- */
  const addPhase = () => set("phases", [...(f.phases || []), { id: "ph" + Date.now(), name: L("Nouvelle phase"), range: "", focus: L("") }]);
  const setPhase = (i: number, k: "name" | "range" | "focus", v: string) =>
    set("phases", f.phases.map((p, j) => (j === i ? { ...p, [k]: k === "range" ? v : L(v) } : p)));
  const delPhase = (i: number) => set("phases", f.phases.filter((_, j) => j !== i));

  /* ---- planning ---- */
  const addSlot = () => set("schedule", [...(f.schedule || []), { id: "sl" + Date.now(), label: L("Nouveau créneau"), time: "08:00", items: [] }]);
  const setSlot = (i: number, k: "label" | "time", v: string) =>
    set("schedule", f.schedule.map((s, j) => (j === i ? { ...s, [k]: k === "label" ? L(v) : v } : s)));
  const delSlot = (i: number) => set("schedule", f.schedule.filter((_, j) => j !== i));
  const addItem = (si: number) =>
    set("schedule", f.schedule.map((s, j) => (j === si ? { ...s, items: [...s.items, { p: "", dose: L(""), why: L("") }] } : s)));
  const setItem = (si: number, ii: number, k: "p" | "dose" | "why", v: string) =>
    set("schedule", f.schedule.map((s, j) => (j === si ? { ...s, items: s.items.map((it, kk) => (kk === ii ? { ...it, [k]: k === "p" ? v : L(v) } : it)) } : s)));
  const delItem = (si: number, ii: number) =>
    set("schedule", f.schedule.map((s, j) => (j === si ? { ...s, items: s.items.filter((_, kk) => kk !== ii) } : s)));

  let footer: ReactNode;
  if (editing) {
    footer = (
      <>
        <ABtn kind="ghost" onClick={() => (isNew ? close() : setEditing(false))}>
          Annuler
        </ABtn>
        <ABtn kind="primary" icon="save" onClick={save}>
          Enregistrer
        </ABtn>
      </>
    );
  } else {
    footer = (
      <>
        {!isBase && (
          <ABtn
            kind="danger"
            icon="trash-2"
            onClick={async () => {
              if (confirm("Supprimer ce protocole ?")) {
                const ok = await A.deleteProtocol(f.id);
                if (ok) {
                  toast("Protocole supprimé");
                  close();
                }
              }
            }}
            style={{ marginRight: "auto" }}
          >
            Supprimer
          </ABtn>
        )}
        <ABtn kind="primary" icon="pencil" onClick={() => setEditing(true)}>
          Modifier
        </ABtn>
      </>
    );
  }

  return (
    <Drawer
      open
      onClose={close}
      width={680}
      title={isNew ? "Nouveau protocole" : f.name.fr}
      sub={isNew ? "Créez une cure personnalisée" : (f.phases || []).length + " phases · " + (f.schedule || []).length + " créneaux"}
      footer={footer}
    >
      {/* En-tête / métadonnées */}
      <ACard pad={18} style={{ marginBottom: 18 }}>
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  flexShrink: 0,
                  background: `color-mix(in srgb, var(${f.accent}) 16%, white)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: `var(${f.accent})`,
                }}
              >
                <Icon name={f.icon} size={28} />
              </div>
              <Field label="Nom du protocole" required style={{ flex: 1 }}>
                <Input value={f.name.fr} onChange={(e) => setL("name", e.target.value)} placeholder="Ex. Diabète — Type 1 & 2" />
              </Field>
            </div>
            <Field label="Accroche">
              <Input value={f.tagline ? f.tagline.fr : ""} onChange={(e) => setL("tagline", e.target.value)} placeholder="Bénéfice résumé en une ligne" />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Durée">
                <Input value={f.duration ? f.duration.fr : ""} onChange={(e) => setL("duration", e.target.value)} placeholder="6 mois + maintien" />
              </Field>
              <Field label="Couleur">
                <Select value={f.accent} onChange={(e) => set("accent", e.target.value)}>
                  {PROTO_ACCENTS.map(([v, n]) => (
                    <option key={v} value={v}>
                      {n}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Icône">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {PROTO_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => set("icon", ic)}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 11,
                      border: "1.5px solid " + (f.icon === ic ? "var(--rich-black)" : "var(--border)"),
                      background: f.icon === ic ? "var(--gold-15)" : "var(--surface)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--fg-strong)",
                    }}
                  >
                    <Icon name={ic} size={20} />
                  </button>
                ))}
              </div>
            </Field>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                flexShrink: 0,
                background: `color-mix(in srgb, var(${f.accent}) 16%, white)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: `var(${f.accent})`,
              }}
            >
              <Icon name={f.icon} size={28} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 19, color: "var(--fg-strong)" }}>{f.name.fr}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--fg-muted)", marginTop: 3 }}>{f.tagline ? f.tagline.fr : ""}</div>
              {f.duration && f.duration.fr && (
                <Badge color={`var(${f.accent})`} style={{ marginTop: 9 }}>
                  <Icon name="clock" size={11} stroke={2.4} />
                  {f.duration.fr}
                </Badge>
              )}
            </div>
          </div>
        )}
      </ACard>

      {/* Phases */}
      <SectionRow title="Phases" onAdd={editing ? addPhase : null} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {(f.phases || []).length === 0 && !editing && <EmptyState icon="layout-dashboard" title="Aucune phase" />}
        {(f.phases || []).map((p, i) => (
          <ACard key={p.id || i} pad={14}>
            {editing ? (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Input value={p.name.fr} onChange={(e) => setPhase(i, "name", e.target.value)} placeholder="Nom de la phase" style={{ flex: 2 }} />
                    <Input value={p.range} onChange={(e) => setPhase(i, "range", e.target.value)} placeholder="M1–M3" style={{ flex: 1 }} />
                  </div>
                  <Input value={p.focus.fr} onChange={(e) => setPhase(i, "focus", e.target.value)} placeholder="Objectif / produits clés" />
                </div>
                <IconBtn icon="trash-2" onClick={() => delPhase(i)} title="Supprimer" />
              </div>
            ) : (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `var(${f.accent})`,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 700,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 14.5, color: "var(--fg-strong)" }}>{p.name.fr}</span>
                    {p.range && <Badge color="var(--ink-500)">{p.range}</Badge>}
                  </div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-muted)", marginTop: 3 }}>{p.focus.fr}</div>
                </div>
              </div>
            )}
          </ACard>
        ))}
      </div>

      {/* Planning */}
      <SectionRow title="Planning des prises" onAdd={editing ? addSlot : null} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(f.schedule || []).length === 0 && !editing && <EmptyState icon="clock" title="Aucun créneau" />}
        {(f.schedule || []).map((s, si) => (
          <ACard key={s.id || si} pad={15}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Icon name={slotMeta(s.id).icon} size={18} color={`var(${f.accent})`} />
              {editing ? (
                <>
                  <Input value={s.label.fr} onChange={(e) => setSlot(si, "label", e.target.value)} placeholder="Créneau" style={{ flex: 1 }} />
                  <Input value={s.time} onChange={(e) => setSlot(si, "time", e.target.value)} placeholder="08:00" style={{ width: 90 }} />
                  <IconBtn icon="trash-2" onClick={() => delSlot(si)} />
                </>
              ) : (
                <>
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 14.5, color: "var(--fg-strong)", flex: 1 }}>{s.label.fr}</span>
                  <Badge color="var(--ink-600)">
                    <Icon name="clock" size={11} stroke={2.4} />
                    {s.time}
                  </Badge>
                </>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: editing ? 0 : 28 }}>
              {(s.items || []).map((it, ii) =>
                editing ? (
                  <div key={ii} style={{ display: "flex", gap: 8, alignItems: "center", background: "var(--ink-050)", borderRadius: "var(--radius-md)", padding: 8 }}>
                    <Input list="prodnames" value={it.p} onChange={(e) => setItem(si, ii, "p", e.target.value)} placeholder="Produit" style={{ flex: 2 }} />
                    <Input value={it.dose.fr} onChange={(e) => setItem(si, ii, "dose", e.target.value)} placeholder="Dose" style={{ flex: 1 }} />
                    <Input value={it.why.fr} onChange={(e) => setItem(si, ii, "why", e.target.value)} placeholder="Bénéfice" style={{ flex: 2 }} />
                    <IconBtn icon="x" onClick={() => delItem(si, ii)} size={16} />
                  </div>
                ) : (
                  <div key={ii} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <ProductAvatar name={it.p || "Forever"} size={34} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13.5, color: "var(--fg-strong)" }}>
                        {it.p} <span style={{ color: "var(--fg-subtle)", fontWeight: 500 }}>· {it.dose.fr}</span>
                      </div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg-subtle)" }}>{it.why.fr}</div>
                    </div>
                  </div>
                ),
              )}
              {editing && (
                <button
                  type="button"
                  onClick={() => addItem(si)}
                  style={{
                    alignSelf: "flex-start",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    border: "1.5px dashed var(--border-strong)",
                    background: "transparent",
                    borderRadius: "var(--radius-pill)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "var(--fg-muted)",
                  }}
                >
                  <Icon name="plus" size={13} stroke={2.4} />
                  Ajouter un produit
                </button>
              )}
            </div>
          </ACard>
        ))}
      </div>
      <datalist id="prodnames">
        {productNames.map((n, i) => (
          <option key={i} value={n} />
        ))}
      </datalist>
    </Drawer>
  );
}
