"use client";
/* ============================================================
   BACK-OFFICE · Tableau de bord
   ============================================================ */
import { useMemo } from "react";
import { ORDER_STAGES, relTime } from "@/lib/helpers";
import { useAdmin } from "../store";
import { Icon } from "../icon";
import { ABtn, ACard, Avatar, Badge, Dot, EmptyState, Kpi, Meter, PageHead, Spark, StageBadge, money } from "../ui";

export function DashboardScreen() {
  const A = useAdmin();
  const k = A.kpis;
  const recent = A.orders.slice(0, 6);
  const newBilans = A.bilans.filter((b) => b.status === "nouveau").slice(0, 4);

  const caData = useMemo(() => {
    const days: number[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const total = A.orders.filter((o) => new Date(o.placedAt).toDateString() === d.toDateString()).reduce((s, o) => s + o.total, 0);
      days.push(total);
    }
    return days;
  }, [A.orders]);

  return (
    <div>
      <PageHead title="Tableau de bord" sub="Vue d'ensemble de votre activité Forever">
        <ABtn kind="ghost" icon="rotate-ccw" size="md" onClick={() => A.resetData()}>
          Actualiser
        </ABtn>
      </PageHead>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
        <Kpi icon="receipt" label="Nouvelles commandes" value={k.nouvelles} sub="à traiter" color="var(--sky-blue)" accent="var(--blue-15)" />
        <Kpi icon="truck" label="En cours de livraison" value={k.enCours} color="var(--earth-brown)" accent="var(--brown-15)" />
        <Kpi icon="users" label="Utilisateurs" value={k.users} sub={k.actifs + " actifs"} color="var(--aloe-green)" accent="var(--green-15)" />
        <Kpi icon="clipboard-list" label="Bilans à lire" value={k.bilansNouveaux} color="var(--rich-black)" accent="var(--gold-15)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
        <ACard pad={22}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <div className="fl-eyebrow">Chiffre d&apos;affaires · 14 jours</div>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 30, color: "var(--fg-strong)", letterSpacing: "-0.02em", marginTop: 4 }}>{money(k.ca)}</div>
            </div>
            <Badge color="var(--aloe-green)">
              <Icon name="trending-up" size={12} stroke={2.4} />
              {k.livrees} livrées
            </Badge>
          </div>
          <Spark data={caData.some((v) => v > 0) ? caData : [1, 1]} w={640} h={90} color="var(--aloe-gold)" />
        </ACard>

        <ACard pad={22}>
          <div className="fl-eyebrow" style={{ marginBottom: 16 }}>
            Commandes par statut
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {ORDER_STAGES.map((s) => {
              const list = A.ordersByStage[s.id] || [];
              const max = Math.max(1, ...ORDER_STAGES.map((x) => (A.ordersByStage[x.id] || []).length));
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 96, display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--fg-muted)" }}>
                    <Dot color={s.color} />
                    {s.short}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Meter value={list.length} max={max} color={s.color} />
                  </div>
                  <div style={{ width: 26, textAlign: "right", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 14, color: "var(--fg-strong)" }}>{list.length}</div>
                </div>
              );
            })}
          </div>
        </ACard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
        <ACard pad={0}>
          <div style={{ padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--divider)" }}>
            <div className="fl-h3" style={{ fontSize: 18 }}>
              Dernières commandes
            </div>
            <ABtn kind="soft" size="sm" iconR="arrow-right" onClick={() => A.setRoute("orders")}>
              Voir tout
            </ABtn>
          </div>
          <div>
            {recent.map((o, i) => (
              <div
                key={o.ref}
                onClick={() => A.setDetail({ type: "order", id: o.ref })}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 22px", borderBottom: i === recent.length - 1 ? "none" : "1px solid var(--divider)", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--ink-050)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Avatar name={o.buyer.name} profile="client" size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "var(--fg-strong)" }}>{o.buyer.name}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--fg-subtle)" }}>
                    {o.ref} · {relTime(o.placedAt)}
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 14, color: "var(--fg-strong)", whiteSpace: "nowrap" }}>{money(o.total)}</div>
                <StageBadge stage={o.stage} />
              </div>
            ))}
          </div>
        </ACard>

        <ACard pad={0}>
          <div style={{ padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--divider)" }}>
            <div className="fl-h3" style={{ fontSize: 18 }}>
              Bilans reçus
            </div>
            <ABtn kind="soft" size="sm" iconR="arrow-right" onClick={() => A.setRoute("bilans")}>
              Voir tout
            </ABtn>
          </div>
          {newBilans.length === 0 ? (
            <EmptyState icon="clipboard-list" title="Aucun nouveau bilan" />
          ) : (
            <div>
              {newBilans.map((b, i) => {
                const u = A.getUser(b.userId);
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      A.setRoute("bilans");
                      A.setDetail({ type: "bilan", id: b.id });
                    }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 22px", borderBottom: i === newBilans.length - 1 ? "none" : "1px solid var(--divider)", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--ink-050)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Avatar name={u?.name} initials={u?.initials} profile={u?.profile} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "var(--fg-strong)" }}>{u ? u.name : "—"}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--fg-subtle)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {b.protocol} · {b.adherence}%
                      </div>
                    </div>
                    <Dot color="var(--sky-blue)" />
                  </div>
                );
              })}
            </div>
          )}
        </ACard>
      </div>
    </div>
  );
}
