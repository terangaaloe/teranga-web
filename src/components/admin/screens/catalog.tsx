"use client";
/* ============================================================
   BACK-OFFICE · Produits du store (création & gestion)
   ============================================================ */
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { STORE_CATS } from "@/lib/data";
import type { StoreProduct } from "@/lib/types";
import { useAdmin } from "../store";
import { Icon } from "../icon";
import { Modal } from "../overlays";
import {
  ABtn,
  Badge,
  type Column,
  Field,
  Input,
  PageHead,
  ProductAvatar,
  SearchBox,
  Select,
  Table,
  Textarea,
  Toggle,
  money,
} from "../ui";

export function CatalogScreen() {
  const A = useAdmin();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [edit, setEdit] = useState<StoreProduct | null>(null);

  const cats = STORE_CATS;
  const rows = useMemo(
    () =>
      A.products.filter((p) => {
        if (cat !== "all" && p.cat !== cat) return false;
        if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [A.products, q, cat],
  );

  const blank: StoreProduct = {
    id: "",
    name: "",
    cat: "aloe",
    price: 0,
    size: { fr: "", en: "", pt: "" },
    rating: 4.7,
    reviews: 0,
    stock: 20,
    blurb: { fr: "", en: "", pt: "" },
    best: false,
    active: true,
    tag: null,
  };

  const columns: Column<StoreProduct>[] = [
    {
      label: "Produit",
      render: (p) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ProductAvatar name={p.name} image={p.image} size={42} />
          <div>
            <div style={{ fontWeight: 600, color: "var(--fg-strong)", fontSize: 14 }}>
              {p.name}
              {p.best && (
                <Badge color="var(--aloe-gold)" style={{ marginLeft: 8 }}>
                  <Icon name="star" size={10} stroke={2.4} />
                  Best
                </Badge>
              )}
            </div>
            <div style={{ fontSize: 12, color: "var(--fg-subtle)" }}>{p.size && p.size.fr}</div>
          </div>
        </div>
      ),
    },
    {
      label: "Catégorie",
      render: (p) => {
        const c = cats.find((x) => x.id === p.cat);
        return <Badge color="var(--earth-brown)">{c ? c.fr : p.cat}</Badge>;
      },
    },
    { label: "Prix", align: "right", render: (p) => <span style={{ fontWeight: 700, color: "var(--fg-strong)" }}>{money(p.price)}</span> },
    {
      label: "Stock",
      align: "right",
      render: (p) => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, color: (p.stock ?? 0) <= 5 ? "#C0392B" : "var(--fg-strong)" }}>
          {(p.stock ?? 0) <= 5 && <Icon name="alert-triangle" size={13} color="#C0392B" />}
          {p.stock}
        </span>
      ),
    },
    {
      label: "Note",
      align: "right",
      render: (p) => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--fg-muted)" }}>
          <Icon name="star" size={13} color="var(--aloe-gold)" fill="var(--aloe-gold)" />
          {p.rating}
        </span>
      ),
    },
    { label: "État", render: (p) => (p.active === false ? <Badge color="var(--ink-500)">Masqué</Badge> : <Badge color="var(--aloe-green)">En ligne</Badge>) },
    { label: "", align: "right", width: 40, render: () => <Icon name="pencil" size={16} color="var(--ink-400)" /> },
  ];

  return (
    <div>
      <PageHead title="Produits du store" sub={A.products.length + " références · " + A.kpis.ruptures + " en stock faible"}>
        <ABtn kind="primary" icon="plus" onClick={() => setEdit(blank)}>
          Nouveau produit
        </ABtn>
      </PageHead>
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <SearchBox value={q} onChange={setQ} placeholder="Nom du produit…" style={{ width: 280 }} />
        <Select value={cat} onChange={(e) => setCat(e.target.value)} style={{ width: 200 }}>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fr}
            </option>
          ))}
        </Select>
      </div>
      <Table onRow={(p) => setEdit(p)} columns={columns} rows={rows} empty="Aucun produit" />
      <ProductEditModal product={edit} onClose={() => setEdit(null)} />
    </div>
  );
}

export function ProductEditModal({ product, onClose }: { product: StoreProduct | null; onClose: () => void }) {
  const A = useAdmin();
  const [f, setF] = useState<StoreProduct | null>(product);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => setF(product), [product]);
  if (!f) return null;
  const isNew = !f.id || !A.products.some((p) => p.id === f.id);
  const cats = STORE_CATS.filter((c) => c.id !== "all");
  const set = <K extends keyof StoreProduct>(k: K, v: StoreProduct[K]) => setF((s) => (s ? { ...s, [k]: v } : s));
  const setL = (k: "size" | "blurb", v: string) => setF((s) => (s ? { ...s, [k]: { fr: v, en: v, pt: v } } : s));
  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permet de re-sélectionner le même fichier
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez choisir un fichier image");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image trop lourde (4 Mo maximum)");
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "Échec de l'envoi");
      set("image", data.url);
      toast.success("Image téléversée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de l'envoi de l'image");
    } finally {
      setUploading(false);
    }
  };
  const save = async () => {
    if (!f.name.trim()) {
      toast.error("Le nom est requis");
      return;
    }
    const id =
      f.id ||
      f.name
        .toLowerCase()
        .replace(/[™®]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 32);
    const saved = await A.saveProduct({ ...f, id, price: Number(f.price) || 0, stock: Number(f.stock) || 0, rating: Number(f.rating) || 4.5, reviews: Number(f.reviews) || 0 });
    if (!saved) return;
    toast.success(isNew ? "Produit créé" : "Produit mis à jour");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Nouveau produit" : "Modifier le produit"}
      width={600}
      footer={
        <>
          {!isNew && (
            <ABtn
              kind="danger"
              icon="trash-2"
              onClick={async () => {
                if (confirm("Supprimer ce produit ?")) {
                  const ok = await A.deleteProduct(f.id);
                  if (ok) {
                    toast("Produit supprimé");
                    onClose();
                  }
                }
              }}
              style={{ marginRight: "auto" }}
            >
              Supprimer
            </ABtn>
          )}
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
        <Field label="Nom du produit" required>
          <Input value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex. Forever Aloe Vera Gel™" />
        </Field>
        <Field label="Image du produit" hint="PNG, JPG ou WebP, 4 Mo max. Idéalement un packshot sur fond clair.">
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <ProductAvatar name={f.name || "Forever"} image={f.image} size={64} />
            <input ref={fileRef} type="file" accept="image/*" onChange={onPickImage} style={{ display: "none" }} disabled={uploading} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <ABtn kind="soft" size="sm" icon={uploading ? "rotate-ccw" : "camera"} disabled={uploading} onClick={() => fileRef.current?.click()}>
                {uploading ? "Envoi…" : f.image ? "Changer l'image" : "Ajouter une image"}
              </ABtn>
              {f.image && !uploading && (
                <ABtn kind="ghost" size="sm" icon="trash-2" onClick={() => set("image", "")}>
                  Retirer
                </ABtn>
              )}
            </div>
          </div>
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Catégorie">
            <Select value={f.cat} onChange={(e) => set("cat", e.target.value)}>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fr}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Contenance">
            <Input value={f.size ? f.size.fr : ""} onChange={(e) => setL("size", e.target.value)} placeholder="1 L · 60 cp · 30 sticks…" />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <Field label="Prix (FCFA)">
            <Input type="number" value={f.price} onChange={(e) => set("price", e.target.value as unknown as number)} />
          </Field>
          <Field label="Stock">
            <Input type="number" value={f.stock} onChange={(e) => set("stock", e.target.value as unknown as number)} />
          </Field>
          <Field label="Note (0–5)">
            <Input type="number" step="0.1" value={f.rating} onChange={(e) => set("rating", e.target.value as unknown as number)} />
          </Field>
        </div>
        <Field label="Description">
          <Textarea value={f.blurb ? f.blurb.fr : ""} onChange={(e) => setL("blurb", e.target.value)} placeholder="Bénéfice principal du produit…" />
        </Field>
        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <Toggle on={!!f.best} onChange={(v) => set("best", v)} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600, color: "var(--fg-strong)" }}>Mis en avant (Best)</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <Toggle on={f.active !== false} onChange={(v) => set("active", v)} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600, color: "var(--fg-strong)" }}>Visible dans la boutique</span>
          </label>
        </div>
      </div>
    </Modal>
  );
}
