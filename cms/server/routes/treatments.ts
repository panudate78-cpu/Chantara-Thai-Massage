import { randomUUID } from "node:crypto";
import type { AdminContext } from "../context";
import { many, one } from "../db";
import { errorResponse, json, noContent } from "../http";
import { logAudit } from "../audit";
import { slugify } from "../slug";
import { validateTreatment } from "../../shared/validate";
import { DEFAULT_TREATMENT_IMAGE } from "../../shared/defaults";
import { loadTreatments } from "../content";

async function treatmentExists(ctx: AdminContext, id: string): Promise<boolean> {
  const row = await one(
    ctx.db,
    `select 1 from treatments where id = $1 and site_id = $2`,
    [id, ctx.site.id]
  );
  return Boolean(row);
}

async function duplicateTitle(
  ctx: AdminContext,
  title: string,
  excludeId: string
): Promise<boolean> {
  const row = await one(
    ctx.db,
    `select 1 from treatments
      where site_id = $1 and archived_at is null
        and lower(title) = lower($2) and id <> $3
      limit 1`,
    [ctx.site.id, title, excludeId]
  );
  return Boolean(row);
}

async function uniqueSlug(ctx: AdminContext, title: string): Promise<string> {
  const base = slugify(title);
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const existing = await one(
      ctx.db,
      `select 1 from treatments where site_id = $1 and slug = $2`,
      [ctx.site.id, candidate]
    );
    if (!existing) return candidate;
  }
  return `${base}-${randomUUID().slice(0, 6)}`;
}

export async function listTreatments(ctx: AdminContext): Promise<Response> {
  const treatments = await loadTreatments(ctx.db, ctx.site.id, { includeArchived: true });
  return json({ treatments });
}

export async function createTreatment(ctx: AdminContext): Promise<Response> {
  const body = await ctx.request.json().catch(() => ({}));
  const parsed = validateTreatment(body);
  if (!parsed.ok) return errorResponse(422, "Please check the highlighted fields.", parsed.errors);
  const input = parsed.value;

  if (await duplicateTitle(ctx, input.title, "")) {
    return errorResponse(422, "Please check the highlighted fields.", {
      title: "Another live treatment already uses this name.",
    });
  }

  const id = randomUUID();
  const slug = await uniqueSlug(ctx, input.title);
  const imageAlt = `${input.title} treatment at Chantara Thai Massage in Fulham, London`;

  await ctx.db.transaction(async (tx) => {
    const next = await one<{ sort_order: number }>(
      tx,
      `select coalesce(max(sort_order), -1) + 1 as sort_order from treatments where site_id = $1`,
      [ctx.site.id]
    );
    await tx.query(
      `insert into treatments
         (id, site_id, slug, title, tag, description, image_url, image_alt, sort_order)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        id,
        ctx.site.id,
        slug,
        input.title,
        input.tag,
        input.description,
        DEFAULT_TREATMENT_IMAGE,
        imageAlt,
        Number(next?.sort_order ?? 0),
      ]
    );
    for (const [index, price] of input.prices.entries()) {
      await tx.query(
        `insert into treatment_prices (id, treatment_id, minutes, price_pence, sort_order)
         values ($1,$2,$3,$4,$5)`,
        [randomUUID(), id, price.minutes, Math.round(price.price * 100), index]
      );
    }
    await logAudit(tx, ctx.site.id, ctx.user.email, "created", "treatment", id, input.title);
  });

  const treatments = await loadTreatments(ctx.db, ctx.site.id, { includeArchived: true });
  const treatment = treatments.find((item) => item.id === id) ?? null;
  return json({ treatment, treatments }, { status: 201 });
}

export async function updateTreatment(ctx: AdminContext, id: string): Promise<Response> {
  if (!(await treatmentExists(ctx, id))) {
    return errorResponse(404, "That treatment could not be found.");
  }
  const body = await ctx.request.json().catch(() => ({}));
  const parsed = validateTreatment(body);
  if (!parsed.ok) return errorResponse(422, "Please check the highlighted fields.", parsed.errors);
  const input = parsed.value;

  if (await duplicateTitle(ctx, input.title, id)) {
    return errorResponse(422, "Please check the highlighted fields.", {
      title: "Another live treatment already uses this name.",
    });
  }

  await ctx.db.transaction(async (tx) => {
    await tx.query(
      `update treatments
          set title = $1, tag = $2, description = $3, updated_at = now()
        where id = $4 and site_id = $5`,
      [input.title, input.tag, input.description, id, ctx.site.id]
    );
    await tx.query(`delete from treatment_prices where treatment_id = $1`, [id]);
    for (const [index, price] of input.prices.entries()) {
      await tx.query(
        `insert into treatment_prices (id, treatment_id, minutes, price_pence, sort_order)
         values ($1,$2,$3,$4,$5)`,
        [randomUUID(), id, price.minutes, Math.round(price.price * 100), index]
      );
    }
    await logAudit(tx, ctx.site.id, ctx.user.email, "updated", "treatment", id, input.title);
  });

  const treatments = await loadTreatments(ctx.db, ctx.site.id, { includeArchived: true });
  return json({ treatment: treatments.find((item) => item.id === id) ?? null, treatments });
}

export async function archiveTreatment(ctx: AdminContext, id: string): Promise<Response> {
  if (!(await treatmentExists(ctx, id))) {
    return errorResponse(404, "That treatment could not be found.");
  }
  const body = (await ctx.request.json().catch(() => ({}))) as { archived?: unknown };
  const archived = body.archived !== false;

  await ctx.db.transaction(async (tx) => {
    await tx.query(
      `update treatments set archived_at = $1, updated_at = now()
        where id = $2 and site_id = $3`,
      [archived ? new Date().toISOString() : null, id, ctx.site.id]
    );
    const row = await one<{ title: string }>(
      tx,
      `select title from treatments where id = $1`,
      [id]
    );
    await logAudit(
      tx,
      ctx.site.id,
      ctx.user.email,
      archived ? "archived" : "restored",
      "treatment",
      id,
      row?.title ?? ""
    );
  });

  const treatments = await loadTreatments(ctx.db, ctx.site.id, { includeArchived: true });
  return json({ treatments });
}

export async function deleteTreatment(ctx: AdminContext, id: string): Promise<Response> {
  const row = await one<{ title: string; archived_at: string | null }>(
    ctx.db,
    `select title, archived_at from treatments where id = $1 and site_id = $2`,
    [id, ctx.site.id]
  );
  if (!row) return errorResponse(404, "That treatment could not be found.");
  if (!row.archived_at) {
    return errorResponse(409, "Archive this treatment before removing it permanently.");
  }

  await ctx.db.transaction(async (tx) => {
    await tx.query(`delete from treatments where id = $1 and site_id = $2`, [id, ctx.site.id]);
    await logAudit(
      tx,
      ctx.site.id,
      ctx.user.email,
      "deleted",
      "treatment",
      id,
      row.title
    );
  });

  return noContent();
}

export async function reorderTreatments(ctx: AdminContext): Promise<Response> {
  const body = (await ctx.request.json().catch(() => ({}))) as { ids?: unknown };
  const ids = Array.isArray(body.ids) ? body.ids.filter((value): value is string => typeof value === "string") : [];
  if (ids.length > 200) return errorResponse(400, "Too many items.");

  const existing = await many<{ id: string }>(
    ctx.db,
    `select id from treatments where site_id = $1`,
    [ctx.site.id]
  );
  const known = new Set(existing.map((row) => row.id));
  if (ids.some((id) => !known.has(id))) {
    return errorResponse(400, "The treatment list is out of date. Refresh and try again.");
  }

  await ctx.db.transaction(async (tx) => {
    for (const [index, id] of ids.entries()) {
      await tx.query(
        `update treatments set sort_order = $1, updated_at = now()
          where id = $2 and site_id = $3`,
        [index, id, ctx.site.id]
      );
    }
    await logAudit(tx, ctx.site.id, ctx.user.email, "reordered", "treatment", null, "Treatment order");
  });

  const treatments = await loadTreatments(ctx.db, ctx.site.id, { includeArchived: true });
  return json({ treatments });
}
