import { randomUUID } from "node:crypto";
import { SITE_SLUG, SITE_URL } from "../shared/site";
import {
  DEFAULT_BUSINESS,
  DEFAULT_HOMEPAGE,
  DEFAULT_TREATMENTS,
} from "../shared/defaults";
import type { Db } from "./db";
import { one } from "./db";
import { hashPassword } from "./auth";

export type Site = { id: string; slug: string; siteUrl: string };

export type SeedAdmin = { email: string; password: string; name?: string };

/**
 * Creates the site record and initial content if it does not exist yet.
 * Safe to call on every cold start: every write is idempotent.
 */
type SiteRow = Site & { contentSeeded: boolean };

export async function seedSite(db: Db): Promise<Site> {
  let site = await one<SiteRow>(
    db,
    `select id, slug, site_url as "siteUrl", (content_seeded_at is not null) as "contentSeeded"
       from sites where slug = $1 limit 1`,
    [SITE_SLUG]
  );

  if (!site) {
    await db.query(
      `insert into sites (id, slug, site_url) values ($1, $2, $3)
       on conflict (slug) do nothing`,
      [randomUUID(), SITE_SLUG, SITE_URL]
    );
    // Another instance may have won the race — re-read to use the stored id.
    site = await one<SiteRow>(
      db,
      `select id, slug, site_url as "siteUrl", (content_seeded_at is not null) as "contentSeeded"
         from sites where slug = $1 limit 1`,
      [SITE_SLUG]
    );
  }
  if (!site) throw new Error("Could not create the site record.");
  if (site.contentSeeded) return site;

  const business = DEFAULT_BUSINESS;
  await db.query(
    `insert into business_details
       (site_id, name, phone, email, address_line1, address_line2, city, postcode, hours, social)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb)
     on conflict (site_id) do nothing`,
    [
      site.id,
      business.name,
      business.phone,
      business.email,
      business.addressLine1,
      business.addressLine2,
      business.city,
      business.postcode,
      JSON.stringify(business.hours),
      JSON.stringify(business.social),
    ]
  );

  const homepage = DEFAULT_HOMEPAGE;
  await db.query(
    `insert into homepage_content
       (site_id, hero_eyebrow, hero_heading, hero_heading_accent, hero_description,
        cta_primary_label, cta_primary_destination, cta_secondary_label, cta_secondary_destination)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     on conflict (site_id) do nothing`,
    [
      site.id,
      homepage.heroEyebrow,
      homepage.heroHeading,
      homepage.heroHeadingAccent,
      homepage.heroDescription,
      homepage.ctaPrimary.label,
      homepage.ctaPrimary.destination,
      homepage.ctaSecondary.label,
      homepage.ctaSecondary.destination,
    ]
  );

  for (const [index, treatment] of DEFAULT_TREATMENTS.entries()) {
    const inserted = await one<{ id: string }>(
      db,
      `insert into treatments
         (id, site_id, slug, title, tag, description, image_url, image_alt, sort_order)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       on conflict (site_id, slug) do nothing
       returning id`,
      [
        treatment.id,
        site.id,
        treatment.slug,
        treatment.title,
        treatment.tag,
        treatment.description,
        treatment.imageUrl,
        treatment.imageAlt,
        index,
      ]
    );
    if (!inserted) continue;
    for (const [priceIndex, price] of treatment.prices.entries()) {
      await db.query(
        `insert into treatment_prices (id, treatment_id, minutes, price_pence, sort_order)
         values ($1,$2,$3,$4,$5)`,
        [randomUUID(), inserted.id, price.minutes, Math.round(price.price * 100), priceIndex]
      );
    }
  }

  await db.query(
    `update sites set content_seeded_at = now() where id = $1 and content_seeded_at is null`,
    [site.id]
  );

  return site;
}

/** Cache one site lookup per running instance. */
let cachedSite: Site | null = null;

export async function getSite(db: Db): Promise<Site> {
  if (cachedSite) return cachedSite;
  cachedSite = await seedSite(db);
  return cachedSite;
}

export function resetSiteCache(): void {
  cachedSite = null;
}

/** Creates the first admin account. No-op if one already exists for the site. */
export async function ensureAdminUser(
  db: Db,
  siteId: string,
  admin: SeedAdmin
): Promise<{ created: boolean }> {
  const email = admin.email.trim().toLowerCase();
  if (!email || !admin.password) return { created: false };
  if (admin.password.length < 12) {
    throw new Error("CMS_ADMIN_PASSWORD must be at least 12 characters long.");
  }

  const existing = await one<{ id: string }>(
    db,
    `select id from admin_users where site_id = $1 limit 1`,
    [siteId]
  );
  if (existing) return { created: false };

  const passwordHash = await hashPassword(admin.password);
  const inserted = await one<{ id: string }>(
    db,
    `insert into admin_users (id, site_id, email, name, password_hash, role)
     values ($1,$2,$3,$4,$5,'owner')
     on conflict do nothing
     returning id`,
    [randomUUID(), siteId, email, admin.name?.trim() || "Business owner", passwordHash]
  );
  return { created: Boolean(inserted) };
}

let adminBootstrap: Promise<void> | null = null;

/**
 * Production bootstrap: creates the first owner account from environment
 * variables. Runs at most once per running function instance.
 */
export async function ensureAdminFromEnv(db: Db, siteId: string): Promise<void> {
  if (adminBootstrap) return adminBootstrap;
  adminBootstrap = (async () => {
    const email = process.env.CMS_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL;
    const password = process.env.CMS_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD;
    if (!email || !password) return;
    try {
      const { created } = await ensureAdminUser(db, siteId, {
        email,
        password,
        name: process.env.CMS_ADMIN_NAME,
      });
      if (created) console.log(`[cms] Created the first admin account for ${email}`);
    } catch (error) {
      adminBootstrap = null;
      console.error("[cms] Could not create the admin account", error);
    }
  })();
  return adminBootstrap;
}
