"use client";
/* ============================================================
   BACK-OFFICE · Bilans reçus
   ============================================================ */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fmtDate, relTime } from "@/lib/helpers";
import type { Bilan } from "@/lib/types";
import { useAdmin } from "../store";
import { Drawer } from "../overlays";
import { ABtn, ACard, Avatar, Badge, EmptyState, Field, Meter, PageHead, Tabs, Textarea } from "../ui";

export function BilansScreen() {
  const A = useAdmin();
  const [filter, setFilter] = useState("all");
  const rows = A.bilans.filter((b) => filter === "all" || b.status === filter);
  const tabs = [
    { id: "all", label: "Tous", count: A.bilans.length },
    { id: "nouveau", label: "Nouveaux", count: A.bilans.filter((b) => b.status === "nouveau").length },
    { id: "lu", label: "Lus", count: A.bilans.filter((b) => b.status === "lu").length },
    { id: "repondu", label: "Répondus", count: A.bilans.filter((b) => b.status === "repondu").length },
  ];
  const statusColor = (s: Bilan["status"]) => (s === "nouveau" ? "var(--sky-blue)" : s === "repondu" ? "var(--aloe-green)" : "var(--ink-500)");
  const statusLabel = (s: Bilan["status"]) => (s === "nouveau" ? "Nouveau" : s === "repondu" ? "Répondu" : "Lu");

  return (
    <div>
      <PageHead title="Bilans reçus" sub="Bilans de cure envoyés par vos utilisateurs" />
      <Tabs tabs={tabs} value={filter} onChange={setFilter} />
      {rows.length === 0 ? (
        <ACard>
          <EmptyState icon="clipboard-list" title="Aucun bilan" sub="Les bilans envoyés depuis l'app apparaîtront ici." />
        </ACard>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: 16 }}>
          {rows.map((b) => {
            const u = A.getUser(b.userId);
            return (
              <ACard
                key={b.id}
                hover
                pad={18}
                onClick={() => {
                  if (b.status === "nouveau") A.markBilan(b.id, "lu");
                  A.setDetail({ type: "bilan", id: b.id });
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 13 }}>
                  <Avatar name={u?.name} initials={u?.initials} profile={u?.profile} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 14.5, color: "var(--fg-strong)" }}>{u ? u.name : "—"}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--fg-subtle)" }}>
                      {relTime(b.submittedAt)} · {b.period}
                    </div>
                  </div>
                  <Badge color={statusColor(b.status)}>{statusLabel(b.status)}</Badge>
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--fg-muted)", marginBottom: 10 }}>{b.protocol}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--fg-subtle)", width: 70 }}>Adhérence</span>
                  <div style={{ flex: 1 }}>
                    <Meter value={b.adherence} color="var(--aloe-gold)" />
                  </div>
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 13, color: "var(--fg-strong)" }}>{b.adherence}%</span>
                </div>
                {b.note && (
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      color: "var(--fg-muted)",
                      fontStyle: "italic",
                      marginTop: 8,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    « {b.note} »
                  </div>
                )}
              </ACard>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function BilanDrawer() {
  const A = useAdmin();
  const isOpen = A.detail?.type === "bilan";
  const b = isOpen ? A.bilans.find((x) => x.id === A.detail!.id) || null : null;
  const [reply, setReply] = useState("");
  useEffect(() => {
    if (b) setReply(b.reply || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b?.id]);
  const close = () => A.setDetail(null);
  if (!b) return <Drawer open={false} onClose={close} />;
  const u = A.getUser(b.userId);
  const ind: [string, number, string][] = [
    ["Stress", b.indicators.stress, "var(--sky-blue)"],
    ["Sommeil", b.indicators.sommeil, "var(--aloe-green)"],
    ["Énergie", b.indicators.energie, "var(--aloe-gold)"],
  ];

  return (
    <Drawer
      open
      onClose={close}
      title="Bilan de cure"
      sub={(u ? u.name : "—") + " · " + fmtDate(b.submittedAt)}
      footer={
        <ABtn
          kind="primary"
          icon="mail"
          onClick={() => {
            A.replyBilan(b.id, reply || "Bien reçu, continuez ainsi !");
            toast.success("Réponse envoyée");
            close();
          }}
        >
          Envoyer la réponse
        </ABtn>
      }
    >
      <ACard pad={16} style={{ marginBottom: 14 }}>
        <div className="fl-eyebrow" style={{ marginBottom: 12 }}>
          {b.protocol} · {b.period}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-muted)", width: 90 }}>Adhérence</span>
          <div style={{ flex: 1 }}>
            <Meter value={b.adherence} color="var(--aloe-gold)" h={10} />
          </div>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 15, color: "var(--fg-strong)" }}>{b.adherence}%</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {ind.map(([lbl, v, c]) => (
            <div key={lbl} style={{ flex: 1, textAlign: "center", background: "var(--ink-050)", borderRadius: "var(--radius-md)", padding: "12px 6px" }}>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 22, color: c }}>{v}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--fg-subtle)" }}>{lbl} /10</div>
            </div>
          ))}
          <div style={{ flex: 1, textAlign: "center", background: "var(--ink-050)", borderRadius: "var(--radius-md)", padding: "12px 6px" }}>
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 22, color: "var(--earth-brown)" }}>{b.weightDelta}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--fg-subtle)" }}>Poids (kg)</div>
          </div>
        </div>
      </ACard>
      {b.note && (
        <ACard pad={16} style={{ marginBottom: 14 }}>
          <div className="fl-eyebrow" style={{ marginBottom: 8 }}>
            Message de l&apos;utilisateur
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 14.5, color: "var(--fg)", fontStyle: "italic", lineHeight: 1.55 }}>« {b.note} »</div>
        </ACard>
      )}
      <Field label="Votre réponse">
        <Textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Conseils, encouragements, ajustement du protocole…" style={{ minHeight: 110 }} />
      </Field>
    </Drawer>
  );
}
