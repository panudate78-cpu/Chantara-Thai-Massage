import { randomUUID } from "node:crypto";
import type { AdminContext } from "../context";
import { many, one } from "../db";
import { errorResponse, json, noContent } from "../http";
import { logAudit } from "../audit";
import { loadGalleryRaw, mapGalleryRow } from "../content";
import { validateGalleryMeta } from "../../shared/validate";
import { LIMITS } from "../../shared/limits";

const VARIANTS: Record<string, { type: "image/webp" | "image/jpeg"; maxWidth: number }> = {
  webp480: { type: "image/webp", maxWidth: 480 },
  webp960: { type: "image/webp", maxWidth: 960 },
  webp1600: { type: "image/webp", maxWidth: 1600 },
  jpeg960: { type: "image/jpeg", maxWidth: 960 },
};

type UploadVariant = { name?: unknown; width?: unknown; data?: unknown };

function sniffImageType(bytes: Uint8Array): "image/webp" | "image/jpeg" | "image/png" | null {
  if (bytes.length > 12) {
    const riff = String.fromCharCode(...bytes.subarray(0, 4));
    const webp = String.fromCharCode(...bytes.subarray(8, 12));
    if (riff === "RIFF" && webp === "WEBP") return "image/webp";
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  return null;
}

function decodeVariant(raw: UploadVariant): {
  name: string;
  type: "image/webp" | "image/jpeg";
  width: number;
  bytes: Uint8Array;
} | { error: string } {
  const name = typeof raw.name === "string" ? raw.name : "";
  const config = VARIANTS[name];
  if (!config) return { error: "Unknown image size." };

  const width = Number(raw.width);
  if (!Number.isInteger(width) || width < 40 || width > config.maxWidth) {
    return { error: "One of the image sizes is invalid." };
  }
  if (typeof raw.data !== "string" || raw.data.length < 100) {
    return { error: "One of the images was empty. Please try again." };
  }
  if (raw.data.length > 3_500_000) return { error: "One of the images is too large." };

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(Buffer.from(raw.data, "base64"));
  } catch {
    return { error: "One of the images could not be read." };
  }
  if (bytes.byteLength < 500 || bytes.byteLength > LIMITS.photoMaxBytes) {
    return { error: "One of the images is too large." };
  }

  const sniffed = sniffImageType(bytes);
  if (!sniffed || sniffed !== config.type) {
    return { error: "Photos must be JPEG, PNG or WebP images." };
  }
  return { name, type: config.type, width, bytes };
}

export async function listGallery(ctx: AdminContext): Promise<Response> {
  const rows = await loadGalleryRaw(ctx.db, ctx.site.id);
  const photos = rows.map((row) => ({
    ...mapGalleryRow(row),
    variants: row.variants,
    createdAt: null,
  }));
  return json({ photos });
}

export async function uploadPhoto(ctx: AdminContext): Promise<Response> {
  const body = (await ctx.request.json().catch(() => null)) as
    | { alt?: unknown; caption?: unknown; width?: unknown; height?: unknown; variants?: unknown }
    | null;
  if (!body) return errorResponse(400, "The upload could not be read.");

  const meta = validateGalleryMeta({ alt: body.alt, caption: body.caption });
  if (!meta.ok) return errorResponse(422, "Please check the highlighted fields.", meta.errors);

  const width = Number(body.width);
  const height = Number(body.height);
  if (!Number.isInteger(width) || width < 40 || width > 6000) {
    return errorResponse(422, "This photo could not be read. Please try a different file.");
  }
  if (!Number.isInteger(height) || height < 40 || height > 6000) {
    return errorResponse(422, "This photo could not be read. Please try a different file.");
  }

  const rawVariants = Array.isArray(body.variants) ? body.variants : [];
  if (!rawVariants.length) return errorResponse(422, "No image data was received.");
  if (rawVariants.length > 4) return errorResponse(422, "Too many image sizes.");

  const decoded: { name: string; type: "image/webp" | "image/jpeg"; width: number; bytes: Uint8Array }[] = [];
  let total = 0;
  for (const raw of rawVariants) {
    const variant = decodeVariant((raw ?? {}) as UploadVariant);
    if ("error" in variant) return errorResponse(422, variant.error);
    if (decoded.some((item) => item.name === variant.name)) {
      return errorResponse(422, "Duplicate image sizes were received.");
    }
    total += variant.bytes.byteLength;
    decoded.push(variant);
  }
  if (total > 8_000_000) return errorResponse(413, "That upload is too large.");
  if (!decoded.some((variant) => variant.type === "image/webp")) {
    return errorResponse(422, "The optimised WebP images were missing. Please try again.");
  }

  const id = randomUUID();
  const storedKeys: string[] = [];
  const variants: Record<string, { key: string; width: number; type: string; bytes: number }> = {};

  try {
    for (const variant of decoded) {
      const extension = variant.type === "image/webp" ? "webp" : "jpg";
      const key = `${ctx.site.slug}/${id}/${variant.name}.${extension}`;
      await ctx.storage.put(key, variant.bytes, variant.type);
      storedKeys.push(key);
      variants[variant.name] = {
        key,
        width: variant.width,
        type: variant.type,
        bytes: variant.bytes.byteLength,
      };
    }

    const next = await one<{ sort_order: number }>(
      ctx.db,
      `select coalesce(max(sort_order), -1) + 1 as sort_order from gallery_photos where site_id = $1`,
      [ctx.site.id]
    );

    await ctx.db.transaction(async (tx) => {
      await tx.query(
        `insert into gallery_photos
           (id, site_id, alt, caption, width, height, variants, sort_order)
         values ($1,$2,$3,$4,$5,$6,$7::jsonb,$8)`,
        [
          id,
          ctx.site.id,
          meta.value.alt,
          meta.value.caption,
          width,
          height,
          JSON.stringify(variants),
          Number(next?.sort_order ?? 0),
        ]
      );
      await logAudit(tx, ctx.site.id, ctx.user.email, "uploaded", "photo", id, meta.value.alt);
    });
  } catch (error) {
    await Promise.allSettled(storedKeys.map((key) => ctx.storage.delete(key)));
    console.error("Photo upload failed", error);
    return errorResponse(500, "The photo could not be saved. Please try again.");
  }

  const rows = await loadGalleryRaw(ctx.db, ctx.site.id);
  const photos = rows.map((row) => ({ ...mapGalleryRow(row), variants: row.variants }));
  return json({ photo: photos.find((photo) => photo.id === id) ?? null, photos }, { status: 201 });
}

export async function updatePhoto(ctx: AdminContext, id: string): Promise<Response> {
  const existing = await one<{ alt: string }>(
    ctx.db,
    `select alt from gallery_photos where id = $1 and site_id = $2`,
    [id, ctx.site.id]
  );
  if (!existing) return errorResponse(404, "That photo could not be found.");

  const body = await ctx.request.json().catch(() => ({}));
  const meta = validateGalleryMeta(body);
  if (!meta.ok) return errorResponse(422, "Please check the highlighted fields.", meta.errors);

  await ctx.db.transaction(async (tx) => {
    await tx.query(
      `update gallery_photos set alt = $1, caption = $2, updated_at = now()
        where id = $3 and site_id = $4`,
      [meta.value.alt, meta.value.caption, id, ctx.site.id]
    );
    await logAudit(tx, ctx.site.id, ctx.user.email, "updated", "photo", id, meta.value.alt);
  });

  const rows = await loadGalleryRaw(ctx.db, ctx.site.id);
  const photos = rows.map((row) => ({ ...mapGalleryRow(row), variants: row.variants }));
  return json({ photo: photos.find((photo) => photo.id === id) ?? null, photos });
}

export async function reorderGallery(ctx: AdminContext): Promise<Response> {
  const body = (await ctx.request.json().catch(() => ({}))) as { ids?: unknown };
  const ids = Array.isArray(body.ids)
    ? body.ids.filter((value): value is string => typeof value === "string")
    : [];

  const existing = await many<{ id: string }>(
    ctx.db,
    `select id from gallery_photos where site_id = $1`,
    [ctx.site.id]
  );
  const known = new Set(existing.map((row) => row.id));
  if (ids.length !== known.size || new Set(ids).size !== ids.length || ids.some((id) => !known.has(id))) {
    return errorResponse(409, "The photo list changed. Refresh the page and try again.");
  }

  await ctx.db.transaction(async (tx) => {
    for (const [index, id] of ids.entries()) {
      await tx.query(
        `update gallery_photos set sort_order = $1, updated_at = now()
          where id = $2 and site_id = $3`,
        [index, id, ctx.site.id]
      );
    }
    await logAudit(tx, ctx.site.id, ctx.user.email, "reordered", "photo", null, "Gallery order");
  });

  const rows = await loadGalleryRaw(ctx.db, ctx.site.id);
  const photos = rows.map((row) => ({ ...mapGalleryRow(row), variants: row.variants }));
  return json({ photos });
}

export async function deletePhoto(ctx: AdminContext, id: string): Promise<Response> {
  const row = await one<{ alt: string; variants: Record<string, { key?: string }> }>(
    ctx.db,
    `select alt, variants from gallery_photos where id = $1 and site_id = $2`,
    [id, ctx.site.id]
  );
  if (!row) return errorResponse(404, "That photo could not be found.");

  await ctx.db.transaction(async (tx) => {
    await tx.query(`delete from gallery_photos where id = $1 and site_id = $2`, [id, ctx.site.id]);
    await logAudit(tx, ctx.site.id, ctx.user.email, "deleted", "photo", id, row.alt);
  });

  const variants = row.variants && typeof row.variants === "object" ? row.variants : {};
  await Promise.allSettled(
    Object.values(variants)
      .map((variant) => variant?.key)
      .filter((key): key is string => typeof key === "string")
      .map((key) => ctx.storage.delete(key))
  );

  return noContent();
}
