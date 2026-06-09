"use client";
/* ============================================================
   TERANGA ALOE — BACK-OFFICE · Primitives UI (desktop)
   Langage visuel Forever Living : blanc chaud, or, hairlines,
   ombres douces. Inline-styles pour fidélité au design.
   ============================================================ */
import {
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useState,
} from "react";
import { PRODUCT_IMAGES, PRODUCT_TINT, fmtCFA } from "@/lib/data";
import { stageMeta } from "@/lib/helpers";
import type { Profile } from "@/lib/types";
import { Icon } from "./icon";

export const money = (n: number) => fmtCFA(n);

/* ---- Carte ---- */
export function ACard({
  children,
  style = {},
  onClick,
  pad = 20,
  hover = false,
}: {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  pad?: number;
  hover?: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: h ? "var(--shadow-md)" : "var(--shadow-sm)",
        padding: pad,
        boxSizing: "border-box",
        transition: "box-shadow .18s var(--ease-out), transform .18s",
        transform: h && hover ? "translateY(-2px)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---- Bouton ---- */
type ABtnKind = "primary" | "dark" | "ghost" | "soft" | "danger";
export function ABtn({
  children,
  kind = "primary",
  icon,
  iconR,
  onClick,
  full,
  disabled,
  size = "md",
  style = {},
  type,
}: {
  children?: ReactNode;
  kind?: ABtnKind;
  icon?: string;
  iconR?: string;
  onClick?: () => void;
  full?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  style?: CSSProperties;
  type?: "button" | "submit";
}) {
  const sizes: Record<string, CSSProperties> = {
    sm: { padding: "8px 13px", fontSize: 13 },
    md: { padding: "11px 18px", fontSize: 14.5 },
    lg: { padding: "14px 22px", fontSize: 16 },
  };
  const kinds: Record<ABtnKind, CSSProperties> = {
    primary: { background: "var(--aloe-gold)", color: "var(--forever-black)", boxShadow: "var(--shadow-gold)" },
    dark: { background: "var(--rich-black)", color: "#fff" },
    ghost: { background: "transparent", color: "var(--fg-strong)", border: "1.5px solid var(--border-strong)" },
    soft: { background: "var(--ink-100)", color: "var(--fg-strong)" },
    danger: { background: "#fff", color: "#C0392B", border: "1.5px solid #E8C5C0" },
  };
  return (
    <button
      type={type || "button"}
      onClick={disabled ? undefined : onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        lineHeight: 1,
        ...sizes[size],
        borderRadius: "var(--radius-pill)",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        width: full ? "100%" : "auto",
        opacity: disabled ? 0.45 : 1,
        transition: "transform .12s var(--ease-out), filter .15s",
        boxSizing: "border-box",
        whiteSpace: "nowrap",
        ...kinds[kind],
        ...style,
      }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 15 : 17} />}
      {children}
      {iconR && <Icon name={iconR} size={size === "sm" ? 15 : 17} />}
    </button>
  );
}

export function IconBtn({
  icon,
  onClick,
  title,
  active,
  size = 18,
  style = {},
}: {
  icon: string;
  onClick?: () => void;
  title?: string;
  active?: boolean;
  size?: number;
  style?: CSSProperties;
}) {
  const [h, setH] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 38,
        height: 38,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-md)",
        border: "1px solid " + (active ? "var(--rich-black)" : "transparent"),
        background: active ? "var(--ink-100)" : h ? "var(--ink-050)" : "transparent",
        cursor: "pointer",
        color: "var(--fg-strong)",
        transition: "background .15s",
        ...style,
      }}
    >
      <Icon name={icon} size={size} stroke={1.9} />
    </button>
  );
}

/* ---- Badge / Pills ---- */
export function Badge({
  children,
  color = "var(--ink-500)",
  bg,
  style = {},
}: {
  children: ReactNode;
  color?: string;
  bg?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: 11.5,
        letterSpacing: ".02em",
        color,
        background: bg || `color-mix(in srgb, ${color} 13%, white)`,
        border: `1px solid color-mix(in srgb, ${color} 26%, white)`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function StageBadge({ stage, withIcon = true }: { stage: number; withIcon?: boolean }) {
  const m = stageMeta(stage);
  return (
    <Badge color={m.color}>
      {withIcon && <Icon name={m.icon} size={12} stroke={2.4} />}
      {m.label}
    </Badge>
  );
}

export function Dot({ color = "var(--aloe-green)", size = 8 }: { color?: string; size?: number }) {
  return <span style={{ width: size, height: size, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />;
}

/* ---- Avatar (initiales) ---- */
export function Avatar({
  name,
  initials,
  size = 40,
  profile,
  style = {},
}: {
  name?: string;
  initials?: string;
  size?: number;
  profile?: Profile;
  style?: CSSProperties;
}) {
  const ini =
    initials ||
    (name || "?")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  const fbo = profile === "fbo";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: fbo ? "var(--rich-black)" : "var(--gold-30)",
        color: fbo ? "var(--aloe-gold)" : "var(--rich-black)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: size * 0.38,
        border: "1px solid " + (fbo ? "var(--rich-black)" : "var(--gold-50)"),
        ...style,
      }}
    >
      {ini}
    </div>
  );
}

/* ---- Avatar produit ---- */
export function ProductAvatar({ name, size = 44, image }: { name: string; size?: number; image?: string }) {
  const img = image || PRODUCT_IMAGES[name];
  const key = Object.keys(PRODUCT_TINT).find((k) => name.includes(k));
  const tintVar = (key && PRODUCT_TINT[key]) || "--aloe-green";
  const tint = `var(${tintVar})`;
  const words = name.replace(/Forever\s+/i, "").replace(/[™®]/g, "").trim();
  const label = (words[0] || "F").toUpperCase();
  if (img) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          flexShrink: 0,
          background: "var(--ink-050)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={name} style={{ width: "82%", height: "82%", objectFit: "contain" }} />
      </div>
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        flexShrink: 0,
        background: `color-mix(in srgb, ${tint} 16%, white)`,
        border: `1.5px solid color-mix(in srgb, ${tint} 45%, white)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-serif)",
        fontSize: size * 0.42,
        fontWeight: 700,
        color: `color-mix(in srgb, ${tint} 75%, black)`,
      }}
    >
      {label}
    </div>
  );
}

/* ---- Champs de formulaire ---- */
export function Field({
  label,
  children,
  hint,
  required,
  style = {},
}: {
  label?: string;
  children: ReactNode;
  hint?: string;
  required?: boolean;
  style?: CSSProperties;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--fg-strong)" }}>
          {label}
          {required && <span style={{ color: "var(--aloe-gold)" }}> *</span>}
        </span>
      )}
      {children}
      {hint && <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg-subtle)" }}>{hint}</span>}
    </label>
  );
}

const fieldBase: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 14.5,
  color: "var(--fg-strong)",
  padding: "11px 13px",
  borderRadius: "var(--radius-md)",
  border: "1.5px solid var(--border)",
  background: "var(--surface)",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color .15s, box-shadow .15s",
};

const focusHandlers = {
  onFocus: (e: React.FocusEvent<HTMLElement>) => {
    e.target.style.borderColor = "var(--rich-black)";
    e.target.style.boxShadow = "0 0 0 3px var(--gold-30)";
  },
  onBlur: (e: React.FocusEvent<HTMLElement>) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.boxShadow = "none";
  },
};

export function Input({ style = {}, ...p }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} {...focusHandlers} style={{ ...fieldBase, ...style }} />;
}
export function Textarea({ style = {}, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...p} {...focusHandlers} style={{ ...fieldBase, resize: "vertical", minHeight: 80, lineHeight: 1.5, ...style }} />;
}
export function Select({ children, style = {}, ...p }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...p}
      {...focusHandlers}
      style={{
        ...fieldBase,
        appearance: "none",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235E5954' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 13px center",
        paddingRight: 34,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </select>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      style={{
        width: 46,
        height: 26,
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        padding: 3,
        background: on ? "var(--aloe-gold)" : "var(--ink-300)",
        display: "flex",
        justifyContent: on ? "flex-end" : "flex-start",
        transition: "background .2s",
      }}
    >
      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "var(--shadow-sm)", transition: "all .2s" }} />
    </button>
  );
}

/* ---- Recherche ---- */
export function SearchBox({
  value,
  onChange,
  placeholder = "Rechercher…",
  style = {},
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: CSSProperties;
}) {
  return (
    <div style={{ position: "relative", ...style }}>
      <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--fg-subtle)", pointerEvents: "none" }}>
        <Icon name="search" size={17} stroke={2} />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={(e) => (e.target.style.borderColor = "var(--rich-black)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        style={{ ...fieldBase, padding: "10px 13px 10px 40px" }}
      />
    </div>
  );
}

/* ---- En-tête de section ---- */
export function PageHead({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
      <div>
        <h1 className="fl-h1" style={{ fontSize: 32, margin: 0 }}>
          {title}
        </h1>
        {sub && <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--fg-muted)", margin: "6px 0 0" }}>{sub}</p>}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>{children}</div>
    </div>
  );
}

/* ---- KPI ---- */
export function Kpi({
  icon,
  label,
  value,
  sub,
  color = "var(--rich-black)",
  accent,
}: {
  icon: string;
  label: string;
  value: ReactNode;
  sub?: string;
  color?: string;
  accent?: string;
}) {
  return (
    <ACard pad={20} style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: accent || "var(--gold-15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
          }}
        >
          <Icon name={icon} size={21} stroke={2} />
        </div>
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 30, color: "var(--fg-strong)", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--fg-muted)", marginTop: 6 }}>{label}</div>
        {sub && <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--fg-subtle)", marginTop: 2 }}>{sub}</div>}
      </div>
    </ACard>
  );
}

/* ---- Tabs ---- */
export interface TabDef {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}
export function Tabs({ tabs, value, onChange }: { tabs: TabDef[]; value: string; onChange: (id: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 4, borderBottom: "1.5px solid var(--border)", marginBottom: 22, overflowX: "auto" }}>
      {tabs.map((t) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "11px 15px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontWeight: on ? 700 : 600,
              fontSize: 14,
              whiteSpace: "nowrap",
              color: on ? "var(--fg-strong)" : "var(--fg-muted)",
              borderBottom: "2.5px solid " + (on ? "var(--aloe-gold)" : "transparent"),
              marginBottom: -1.5,
            }}
          >
            {t.icon && <Icon name={t.icon} size={15} stroke={2} />}
            {t.label}
            {t.count != null && (
              <span style={{ fontSize: 11.5, fontWeight: 700, background: on ? "var(--gold-30)" : "var(--ink-100)", color: "var(--fg-strong)", borderRadius: 999, padding: "1px 7px" }}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ---- Table ---- */
export interface Column<T> {
  label: string;
  align?: "left" | "right" | "center";
  width?: number;
  render: (row: T) => ReactNode;
}
export function Table<T>({
  columns,
  rows,
  onRow,
  empty = "Aucune donnée",
}: {
  columns: Column<T>[];
  rows: T[];
  onRow?: (row: T) => void;
  empty?: string;
}) {
  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" }}>
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th
                key={i}
                style={{
                  textAlign: c.align || "left",
                  padding: "13px 16px",
                  fontSize: 11.5,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "var(--fg-subtle)",
                  fontWeight: 700,
                  borderBottom: "1.5px solid var(--border)",
                  whiteSpace: "nowrap",
                  width: c.width,
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: 40, textAlign: "center", color: "var(--fg-subtle)", fontSize: 14 }}>
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row, ri) => (
            <tr
              key={ri}
              onClick={onRow ? () => onRow(row) : undefined}
              style={{ cursor: onRow ? "pointer" : "default", transition: "background .12s" }}
              onMouseEnter={(e) => onRow && (e.currentTarget.style.background = "var(--ink-050)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {columns.map((c, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "13px 16px",
                    fontSize: 14,
                    color: "var(--fg)",
                    borderBottom: ri === rows.length - 1 ? "none" : "1px solid var(--divider)",
                    textAlign: c.align || "left",
                    verticalAlign: "middle",
                  }}
                >
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---- Sparkline ---- */
export function Spark({
  data,
  color = "var(--aloe-gold)",
  w = 120,
  h = 36,
  fill = true,
}: {
  data: number[];
  color?: string;
  w?: number;
  h?: number;
  fill?: boolean;
}) {
  if (!data || !data.length) return null;
  const min = Math.min(...data),
    max = Math.max(...data),
    range = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 4 - ((v - min) / range) * (h - 8)]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible", maxWidth: "100%" }}>
      {fill && <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={color} opacity="0.12" />}
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={color} />
    </svg>
  );
}

/* ---- Barre de progression ---- */
export function Meter({ value, max = 100, color = "var(--aloe-gold)", h = 8 }: { value: number; max?: number; color?: string; h?: number }) {
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <div style={{ background: "var(--ink-100)", borderRadius: 999, height: h, width: "100%", overflow: "hidden" }}>
      <div style={{ width: pct * 100 + "%", height: "100%", background: color, borderRadius: 999, transition: "width .5s var(--ease-out)" }} />
    </div>
  );
}

export function EmptyState({ icon = "inbox", title, sub }: { icon?: string; title: string; sub?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "56px 20px", color: "var(--fg-subtle)" }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--ink-100)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
          color: "var(--ink-400)",
        }}
      >
        <Icon name={icon} size={26} />
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 16, color: "var(--fg-muted)" }}>{title}</div>
      {sub && <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

export function StatBox({ label, value, color }: { label: string; value: ReactNode; color: string }) {
  return (
    <div style={{ background: "var(--ink-050)", borderRadius: "var(--radius-md)", padding: "14px 12px", textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 24, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg-subtle)", marginTop: 5 }}>{label}</div>
    </div>
  );
}

export function Eyebrow({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="fl-eyebrow" style={style}>
      {children}
    </div>
  );
}
