import { randomUUID } from "node:crypto";
import type { AdminContext } from "../context";
import { one } from "../db";
import { errorResponse, json, noContent } from "../http";
import { logAudit } from "../audit";
import { validateOffer } from "../../shared/validate";
import { loadOffers } from "../content";

async function findOffer(ctx: AdminContext, id: string) {
  return one<{ title: string; enabled: boolean }>(
    ctx.db,
    `select title, enabled from offers where id = $1 and site_id = $2`,
    [id, ctx.site.id]
  );
}

export async function listOffers(ctx: AdminContext): Promise<Response> {
  const offers = await loadOffers(ctx.db, ctx.site.id);
  return json({ offers });
}

export async function createOffer(ctx: AdminContext): Promise<Response> {
  const body = await ctx.request.json().catch(() => ({}));
  const parsed = validateOffer(body);
  if (!parsed.ok) return errorResponse(422, "Please check the highlighted fields.", parsed.errors);
  const input = parsed.value;
  const id = randomUUID();

  await ctx.db.transaction(async (tx) => {
    const next = await one<{ sort_order: number }>(
      tx,
      `select coalesce(max(sort_order), -1) + 1 as sort_order from offers where site_id = $1`,
      [ctx.site.id]
    );
    await tx.query(
      `insert into offers
         (id, site_id, title, description, badge, starts_on, ends_on, enabled, sort_order)
       values ($1,$2,$3,$4,$5,$6::date,$7::date,$8,$9)`,
      [
        id,
        ctx.site.id,
        input.title,
        input.description,
        input.badge,
        input.startsOn,
        input.endsOn,
        input.enabled,
        Number(next?.sort_order ?? 0),
      ]
    );
    await logAudit(tx, ctx.site.id, ctx.user.email, "created", "offer", id, input.title);
  });

  const offers = await loadOffers(ctx.db, ctx.site.id);
  return json({ offer: offers.find((offer) => offer.id === id) ?? null, offers }, { status: 201 });
}

export async function updateOffer(ctx: AdminContext, id: string): Promise<Response> {
  if (!(await findOffer(ctx, id))) return errorResponse(404, "That offer could not be found.");
  const body = await ctx.request.json().catch(() => ({}));
  const parsed = validateOffer(body);
  if (!parsed.ok) return errorResponse(422, "Please check the highlighted fields.", parsed.errors);
  const input = parsed.value;

  await ctx.db.transaction(async (tx) => {
    await tx.query(
      `update offers
          set title = $1, description = $2, badge = $3, starts_on = $4::date,
              ends_on = $5::date, enabled = $6, updated_at = now()
        where id = $7 and site_id = $8`,
      [
        input.title,
        input.description,
        input.badge,
        input.startsOn,
        input.endsOn,
        input.enabled,
        id,
        ctx.site.id,
      ]
    );
    await logAudit(tx, ctx.site.id, ctx.user.email, "updated", "offer", id, input.title);
  });

  const offers = await loadOffers(ctx.db, ctx.site.id);
  return json({ offer: offers.find((offer) => offer.id === id) ?? null, offers });
}

export async function toggleOffer(ctx: AdminContext, id: string): Promise<Response> {
  const existing = await findOffer(ctx, id);
  if (!existing) return errorResponse(404, "That offer could not be found.");
  const body = (await ctx.request.json().catch(() => ({}))) as { enabled?: unknown };
  // Send an explicit state from the UI; a body-less call flips the current one.
  const enabled = typeof body.enabled === "boolean" ? body.enabled : !existing.enabled;

  await ctx.db.transaction(async (tx) => {
    await tx.query(
      `update offers set enabled = $1, updated_at = now() where id = $2 and site_id = $3`,
      [enabled, id, ctx.site.id]
    );
    await logAudit(
      tx,
      ctx.site.id,
      ctx.user.email,
      enabled ? "enabled" : "disabled",
      "offer",
      id,
      existing.title
    );
  });

  const offers = await loadOffers(ctx.db, ctx.site.id);
  return json({ offers });
}

export async function deleteOffer(ctx: AdminContext, id: string): Promise<Response> {
  const existing = await findOffer(ctx, id);
  if (!existing) return errorResponse(404, "That offer could not be found.");

  await ctx.db.transaction(async (tx) => {
    await tx.query(`delete from offers where id = $1 and site_id = $2`, [id, ctx.site.id]);
    await logAudit(tx, ctx.site.id, ctx.user.email, "deleted", "offer", id, existing.title);
  });

  return noContent();
}
