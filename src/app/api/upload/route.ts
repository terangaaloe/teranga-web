/* ============================================================
   TERANGA ALOE — Upload d'image produit
   POST multipart/form-data { file }  ->  { url }
   - Production (Vercel) : envoie vers Vercel Blob si
     BLOB_READ_WRITE_TOKEN est défini.
   - Local / self-host : écrit dans public/uploads/ et renvoie
     un chemin /uploads/<nom>.
   Seule l'URL est renvoyée puis stockée sur le produit.
   ============================================================ */
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024; // 4 Mo
const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
  }
  const ext = EXT_BY_MIME[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Format d'image non supporté" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image trop lourde (4 Mo maximum)" }, { status: 413 });
  }

  const filename = `${randomUUID()}.${ext}`;

  // --- Production : Vercel Blob ---
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(`products/${filename}`, file, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
      });
      return NextResponse.json({ url: blob.url });
    } catch (err) {
      console.error("Blob upload failed", err);
      return NextResponse.json({ error: "Échec de l'envoi vers le stockage" }, { status: 502 });
    }
  }

  // --- Local / self-host : système de fichiers ---
  try {
    const dir = join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(join(dir, filename), bytes);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("Local upload failed", err);
    return NextResponse.json({ error: "Échec de l'enregistrement du fichier" }, { status: 500 });
  }
}
