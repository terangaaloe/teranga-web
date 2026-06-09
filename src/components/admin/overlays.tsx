"use client";
/* ============================================================
   TERANGA ALOE — Back-office · Drawer & Modal
   Construits sur shadcn/ui Sheet & Dialog, habillés Forever.
   ============================================================ */
import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IconBtn } from "./ui";

/* ---- Drawer (panneau latéral droit) ---- */
export function Drawer({
  open,
  onClose,
  title,
  sub,
  width = 560,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  sub?: ReactNode;
  width?: number;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        aria-describedby={undefined}
        className="p-0 gap-0 border-0 sm:max-w-none"
        style={{ width, maxWidth: "94vw", background: "var(--bg-tinted)", boxShadow: "var(--shadow-lg)" }}
      >
        <SheetTitle className="sr-only">{typeof title === "string" ? title : "Détail"}</SheetTitle>
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <h2 className="fl-h3" style={{ margin: 0, fontSize: 21 }}>
              {title}
            </h2>
            {sub && <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--fg-muted)", marginTop: 4 }}>{sub}</div>}
          </div>
          <IconBtn icon="x" onClick={onClose} title="Fermer" />
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>{children}</div>
        {footer && (
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid var(--border)",
              background: "var(--surface)",
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ---- Modal (centré) ---- */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 520,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="p-0 gap-0 sm:max-w-none ring-0"
        style={{
          width,
          maxWidth: "94vw",
          maxHeight: "88vh",
          overflowY: "auto",
          background: "var(--surface)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <DialogTitle asChild>
            <h2 className="fl-h3" style={{ margin: 0, fontSize: 20 }}>
              {title}
            </h2>
          </DialogTitle>
          <IconBtn icon="x" onClick={onClose} />
        </div>
        <div style={{ padding: "16px 24px 24px" }}>{children}</div>
        {footer && <div style={{ padding: "0 24px 22px", display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}
