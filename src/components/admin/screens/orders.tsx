"use client";
/* ============================================================
   BACK-OFFICE · Commandes (liste + drawer)
   ============================================================ */
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { STORE_PRODUCTS } from "@/lib/data";
import { ORDER_STAGES, fmtDateTime, relTime, stageMeta } from "@/lib/helpers";
import type { Order } from "@/lib/types";
import { useAdmin } from "../store";
import { Icon } from "../icon";
import { Drawer } from "../overlays";
import { ABtn, ACard, Avatar, Badge, type Column, ProductAvatar, SearchBox, StageBadge, Table, Tabs, PageHead, money } from "../ui";

export function OrdersScreen() {
  const A = useAdmin();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const rows = useMemo(
    () =>
      A.orders.filter((o) => {
        if (filter !== "all" && String(o.stage) !== filter) return false;
        if (q && !`${o.ref} ${o.buyer.name} ${o.buyer.phone}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [A.orders, q, filter],
  );

  const tabs = [{ id: "all", label: "Toutes", count: A.orders.length }, ...ORDER_STAGES.map((s) => ({ id: String(s.id), label: s.short, count: (A.ordersByStage[s.id] || []).length }))];

  const columns: Column<Order>[] = [
    {
      label: "Réf.",
      render: (o) => (
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, color: "var(--fg-strong)" }}>
          {o.ref}
          {o.fromApp && (
            <Badge color="var(--aloe-gold)" style={{ marginLeft: 8 }}>
              App
            </Badge>
          )}
        </span>
      ),
    },
    {
      label: "Client",
      render: (o) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={o.buyer.name} size={32} profile="client" />
          <div>
            <div style={{ fontWeight: 600, color: "var(--fg-strong)", fontSize: 13.5 }}>{o.buyer.name}</div>
            <div style={{ fontSize: 12, color: "var(--fg-subtle)" }}>{o.buyer.phone || "—"}</div>
          </div>
        </div>
      ),
    },
    { label: "Articles", render: (o) => <span style={{ color: "var(--fg-muted)" }}>{Object.values(o.items).reduce((a, b) => a + b, 0)} art.</span> },
    { label: "Date", render: (o) => <span style={{ color: "var(--fg-muted)", fontSize: 13 }}>{relTime(o.placedAt)}</span> },
    { label: "Total", align: "right", render: (o) => <span style={{ fontWeight: 700, color: "var(--fg-strong)" }}>{money(o.total)}</span> },
    { label: "Statut", render: (o) => <StageBadge stage={o.stage} /> },
    { label: "", align: "right", width: 40, render: () => <Icon name="chevron-right" size={17} color="var(--ink-400)" /> },
  ];

  return (
    <div>
      <PageHead title="Commandes" sub="Réception et suivi des commandes clients" />
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <SearchBox value={q} onChange={setQ} placeholder="Réf, nom, téléphone…" style={{ width: 320, maxWidth: "100%" }} />
      </div>
      <Tabs tabs={tabs} value={filter} onChange={setFilter} />
      <Table onRow={(o) => A.setDetail({ type: "order", id: o.ref })} columns={columns} rows={rows} empty="Aucune commande pour ce filtre" />
    </div>
  );
}

export function OrderDrawer() {
  const A = useAdmin();
  const detail = A.detail;
  const o = detail?.type === "order" ? A.getOrder(detail.id) : null;
  const close = () => A.setDetail(null);
  if (!o) return <Drawer open={false} onClose={close} />;

  const lines = Object.entries(o.items)
    .map(([id, q]) => ({ p: A.getProduct(id) || STORE_PRODUCTS.find((x) => x.id === id), q }))
    .filter((x) => x.p) as { p: NonNullable<ReturnType<typeof A.getProduct>>; q: number }[];
  const next = o.stage < 3 ? stageMeta(o.stage + 1) : null;

  return (
    <Drawer
      open
      onClose={close}
      title={"Commande " + o.ref}
      sub={fmtDateTime(o.placedAt)}
      footer={
        <>
          {o.stage > 0 && (
            <ABtn
              kind="ghost"
              icon="chevron-left"
              onClick={() => {
                A.setOrderStage(o.ref, o.stage - 1);
                toast("Statut reculé");
              }}
            >
              Reculer
            </ABtn>
          )}
          {next ? (
            <ABtn
              kind="primary"
              icon={next.icon}
              onClick={() => {
                A.setOrderStage(o.ref, o.stage + 1);
                toast.success("Commande : " + next.label);
              }}
            >
              Passer à «&nbsp;{next.label}&nbsp;»
            </ABtn>
          ) : (
            <Badge color="var(--aloe-green)">
              <Icon name="check-circle" size={13} stroke={2.4} />
              Commande livrée
            </Badge>
          )}
        </>
      }
    >
      {/* Timeline statut */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24 }}>
        {ORDER_STAGES.map((s, i) => {
          const done = o.stage >= s.id;
          return (
            <div key={s.id} style={{ flex: 1, textAlign: "center", position: "relative" }}>
              {i < ORDER_STAGES.length - 1 && (
                <div style={{ position: "absolute", top: 17, left: "50%", width: "100%", height: 2.5, background: o.stage > s.id ? s.color : "var(--ink-200)" }} />
              )}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 1,
                  background: done ? s.color : "var(--surface)",
                  border: "2px solid " + (done ? s.color : "var(--ink-200)"),
                  color: done ? "#fff" : "var(--ink-400)",
                }}
              >
                <Icon name={s.icon} size={17} stroke={2.2} />
              </div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: done ? 700 : 600, color: done ? "var(--fg-strong)" : "var(--fg-subtle)", marginTop: 7 }}>{s.short}</div>
              {o.stamps && o.stamps[s.id] && <div style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, color: "var(--fg-subtle)" }}>{fmtDateTime(o.stamps[s.id])}</div>}
            </div>
          );
        })}
      </div>

      {/* Client */}
      <ACard pad={16} style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Avatar name={o.buyer.name} size={44} profile="client" />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 15.5, color: "var(--fg-strong)" }}>{o.buyer.name}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-muted)" }}>{o.buyer.phone || "—"}</div>
          </div>
          {o.userId && o.userId !== "moi" && (
            <ABtn
              kind="soft"
              size="sm"
              onClick={() => {
                A.setRoute("users");
                A.setDetail({ type: "user", id: o.userId });
              }}
            >
              Voir la fiche
            </ABtn>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-muted)" }}>
          <Icon name="map-pin" size={15} color="var(--ink-400)" />
          {o.buyer.address || "—"}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-muted)" }}>
          <Icon name={o.pay === "mm" ? "smartphone" : "banknote"} size={15} color="var(--ink-400)" />
          {o.pay === "mm" ? "Mobile Money (payé)" : "Espèces à la livraison"}
        </div>
      </ACard>

      {/* Lignes */}
      <div className="fl-eyebrow" style={{ marginBottom: 10 }}>
        Articles
      </div>
      <ACard pad={0} style={{ marginBottom: 14 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i === lines.length - 1 ? "none" : "1px solid var(--divider)" }}>
            <ProductAvatar name={l.p.name} image={l.p.image} size={40} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "var(--fg-strong)" }}>{l.p.name}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--fg-subtle)" }}>
                {money(l.p.price)} × {l.q}
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 14, color: "var(--fg-strong)" }}>{money(l.p.price * l.q)}</div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", borderTop: "1.5px solid var(--border)", background: "var(--ink-050)" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 15, color: "var(--fg-strong)" }}>Total</span>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 18, color: "var(--fg-strong)" }}>{money(o.total)}</span>
        </div>
      </ACard>
    </Drawer>
  );
}
