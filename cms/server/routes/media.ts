import type { PublicContext } from "../context";
import { isUuid } from "../context";
import { one } from "../db";

type Variant = { key?: string; type?: string; width?: number };

export async function serveMedia(
  ctx: PublicContext,
  photoId: string,
  variantName: string
): Promise<Response> {
  if (!isUuid(photoId) || !/^[a-z0-9]{3,20}$/.test(variantName)) {
    return new Response("Not found", { status: 404 });
  }

  const row = await one<{ variants: Record<string, Variant> }>(
    ctx.db,
    `select variants from gallery_photos where id = $1 and site_id = $2`,
    [photoId, ctx.site.id]
  );
  const variant = row?.variants?.[variantName];
  if (!variant?.key) return new Response("Not found", { status: 404 });

  const object = await ctx.storage.get(variant.key);
  if (!object) return new Response("Not found", { status: 404 });

  const contentType =
    object.contentType && object.contentType !== "application/octet-stream"
      ? object.contentType
      : variant.type || "application/octet-stream";

  return new Response(object.data.buffer as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(object.data.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
