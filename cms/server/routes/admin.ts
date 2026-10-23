import type { AdminContext } from "../context";
import { many } from "../db";
import { errorResponse, json } from "../http";
import { logAudit } from "../audit";
import {
  loadBusiness,
  loadGallery,
  loadHomepage,
  loadOffers,
  loadStats,
  loadTreatments,
} from "../content";
import { validateBusiness, validateHomepage } from "../../shared/validate";

export async function overview(ctx: AdminContext): Promise<Response> {
  const [stats, audit] = await Promise.all([
    loadStats(ctx.db, ctx.site.id),
    many<{
      id: string;
      actor: string;
      action: string;
      entity: string;
      summary: string;
      created_at: string;
    }>(
      ctx.db,
      `select id, actor, action, entity, summary, created_at
         from audit_log where site_id = $1 order by created_at desc limit 8`,
      [ctx.site.id]
    ),
  ]);

  const business = await loadBusiness(ctx.db, ctx.site.id);

  return json({
    stats,
    business,
    siteUrl: ctx.site.siteUrl,
    user: ctx.user,
    audit: audit.map((entry) => ({
      id: entry.id,
      actor: entry.actor,
      action: entry.action,
      entity: entry.entity,
      summary: entry.summary,
      createdAt: new Date(entry.created_at).toISOString(),
    })),
  });
}

export async function getBusiness(ctx: AdminContext): Promise<Response> {
  return json({ business: await loadBusiness(ctx.db, ctx.site.id) });
}

export async function updateBusiness(ctx: AdminContext): Promise<Response> {
  const body = await ctx.request.json().catch(() => ({}));
  const parsed = validateBusiness(body);
  if (!parsed.ok) return errorResponse(422, "Please check the highlighted fields.", parsed.errors);
  const value = parsed.value;

  await ctx.db.transaction(async (tx) => {
    await tx.query(
      `update business_details
          set name = $1, phone = $2, email = $3,
              address_line1 = $4, address_line2 = $5, city = $6, postcode = $7,
              hours = $8::jsonb, social = $9::jsonb, updated_at = now(), updated_by = $10
        where site_id = $11`,
      [
        value.name,
        value.phone,
        value.email,
        value.addressLine1,
        value.addressLine2,
        value.city,
        value.postcode,
        JSON.stringify(value.hours),
        JSON.stringify(value.social),
        ctx.user.id,
        ctx.site.id,
      ]
    );
    await logAudit(
      tx,
      ctx.site.id,
      ctx.user.email,
      "updated",
      "business",
      ctx.site.id,
      "Business details"
    );
  });

  return json({ business: await loadBusiness(ctx.db, ctx.site.id) });
}

export async function getHomepage(ctx: AdminContext): Promise<Response> {
  return json({ homepage: await loadHomepage(ctx.db, ctx.site.id) });
}

export async function updateHomepage(ctx: AdminContext): Promise<Response> {
  const body = await ctx.request.json().catch(() => ({}));
  const parsed = validateHomepage(body);
  if (!parsed.ok) return errorResponse(422, "Please check the highlighted fields.", parsed.errors);
  const value = parsed.value;

  await ctx.db.transaction(async (tx) => {
    await tx.query(
      `update homepage_content
          set hero_eyebrow = $1, hero_heading = $2, hero_heading_accent = $3,
              hero_description = $4, cta_primary_label = $5, cta_primary_destination = $6,
              cta_secondary_label = $7, cta_secondary_destination = $8,
              updated_at = now(), updated_by = $9
        where site_id = $10`,
      [
        value.heroEyebrow,
        value.heroHeading,
        value.heroHeadingAccent,
        value.heroDescription,
        value.ctaPrimary.label,
        value.ctaPrimary.destination,
        value.ctaSecondary.label,
        value.ctaSecondary.destination,
        ctx.user.id,
        ctx.site.id,
      ]
    );
    await logAudit(
      tx,
      ctx.site.id,
      ctx.user.email,
      "updated",
      "homepage",
      ctx.site.id,
      "Homepage hero"
    );
  });

  return json({ homepage: await loadHomepage(ctx.db, ctx.site.id) });
}

export async function exportContent(ctx: AdminContext): Promise<Response> {
  const [business, homepage, treatments, offers, gallery] = await Promise.all([
    loadBusiness(ctx.db, ctx.site.id),
    loadHomepage(ctx.db, ctx.site.id),
    loadTreatments(ctx.db, ctx.site.id, { includeArchived: true }),
    loadOffers(ctx.db, ctx.site.id),
    loadGallery(ctx.db, ctx.site.id),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    site: { slug: ctx.site.slug, url: ctx.site.siteUrl },
    business,
    homepage,
    treatments,
    offers,
    gallery,
  };

  return json(payload, {
    headers: {
      "Content-Disposition": `attachment; filename="${ctx.site.slug}-content-${new Date()
        .toISOString()
        .slice(0, 10)}.json"`,
    },
  });
}
