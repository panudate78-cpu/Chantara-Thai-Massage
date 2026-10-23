import type { Db } from "./db";
import { many, one } from "./db";
import type {
  BusinessDetails,
  GalleryImage,
  GallerySource,
  HomepageContent,
  OfferContent,
  SiteContent,
  TreatmentContent,
} from "../shared/types";

type VariantMeta = { key: string; width: number; type: string; bytes?: number };

function parseJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

/** Today's date in London, as YYYY-MM-DD. */
export function londonToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function loadBusiness(db: Db, siteId: string): Promise<BusinessDetails> {
  const row = await one<{
    name: string;
    phone: string;
    email: string;
    address_line1: string;
    address_line2: string;
    city: string;
    postcode: string;
    hours: unknown;
    social: unknown;
  }>(
    db,
    `select name, phone, email, address_line1, address_line2, city, postcode, hours, social
       from business_details where site_id = $1`,
    [siteId]
  );
  if (!row) throw new Error("Business details are missing.");

  return {
    name: row.name,
    phone: row.phone,
    email: row.email,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2,
    city: row.city,
    postcode: row.postcode,
    hours: parseJson(row.hours, []),
    social: parseJson(row.social, {}),
  };
}

export async function loadHomepage(db: Db, siteId: string): Promise<HomepageContent> {
  const row = await one<{
    hero_eyebrow: string;
    hero_heading: string;
    hero_heading_accent: string;
    hero_description: string;
    cta_primary_label: string;
    cta_primary_destination: string;
    cta_secondary_label: string;
    cta_secondary_destination: string;
  }>(
    db,
    `select hero_eyebrow, hero_heading, hero_heading_accent, hero_description,
            cta_primary_label, cta_primary_destination,
            cta_secondary_label, cta_secondary_destination
       from homepage_content where site_id = $1`,
    [siteId]
  );
  if (!row) throw new Error("Homepage content is missing.");

  return {
    heroEyebrow: row.hero_eyebrow,
    heroHeading: row.hero_heading,
    heroHeadingAccent: row.hero_heading_accent,
    heroDescription: row.hero_description,
    ctaPrimary: {
      label: row.cta_primary_label,
      destination: row.cta_primary_destination as HomepageContent["ctaPrimary"]["destination"],
    },
    ctaSecondary: {
      label: row.cta_secondary_label,
      destination: row.cta_secondary_destination as HomepageContent["ctaSecondary"]["destination"],
    },
  };
}

export async function loadTreatments(
  db: Db,
  siteId: string,
  { includeArchived = false }: { includeArchived?: boolean } = {}
): Promise<TreatmentContent[]> {
  const rows = await many<{
    id: string;
    slug: string;
    title: string;
    tag: string | null;
    description: string;
    image_url: string | null;
    image_alt: string | null;
    archived_at: string | null;
  }>(
    db,
    `select id, slug, title, tag, description, image_url, image_alt, archived_at
       from treatments
      where site_id = $1 ${includeArchived ? "" : "and archived_at is null"}
      order by archived_at nulls first, sort_order asc, created_at asc`,
    [siteId]
  );

  if (!rows.length) return [];

  const priceRows = await many<{
    treatment_id: string;
    minutes: number;
    price_pence: number;
  }>(
    db,
    `select p.treatment_id, p.minutes, p.price_pence
       from treatment_prices p
       join treatments t on t.id = p.treatment_id
      where t.site_id = $1
      order by p.minutes asc`,
    [siteId]
  );

  const byTreatment = new Map<string, { minutes: number; price: number }[]>();
  for (const price of priceRows) {
    const list = byTreatment.get(price.treatment_id) ?? [];
    list.push({ minutes: price.minutes, price: Math.round(price.price_pence / 100) });
    byTreatment.set(price.treatment_id, list);
  }

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    tag: row.tag,
    description: row.description,
    prices: byTreatment.get(row.id) ?? [],
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
    archived: Boolean(row.archived_at),
  }));
}

export type OfferRow = OfferContent & { sortOrder: number; createdAt: string };

export async function loadOffers(
  db: Db,
  siteId: string,
  { onlyLive = false }: { onlyLive?: boolean } = {}
): Promise<OfferContent[]> {
  const params: unknown[] = [siteId];
  let filter = "";
  if (onlyLive) {
    params.push(londonToday());
    filter = `and enabled = true and starts_on <= $2::date and ends_on >= $2::date`;
  }
  const rows = await many<{
    id: string;
    title: string;
    description: string;
    badge: string | null;
    starts_on: string;
    ends_on: string;
    enabled: boolean;
  }>(
    db,
    `select id, title, description, badge,
            to_char(starts_on, 'YYYY-MM-DD') as starts_on,
            to_char(ends_on, 'YYYY-MM-DD') as ends_on,
            enabled
       from offers
      where site_id = $1 ${filter}
      order by starts_on asc, sort_order asc`,
    params
  );

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    badge: row.badge,
    startsOn: row.starts_on,
    endsOn: row.ends_on,
    enabled: row.enabled,
  }));
}

type GalleryRow = {
  id: string;
  alt: string;
  caption: string | null;
  width: number;
  height: number;
  variants: unknown;
  sort_order: number;
};

function gallerySources(id: string, variants: unknown): {
  sources: GallerySource[];
  fallbackUrl: string | null;
} {
  const parsed = parseJson<Record<string, VariantMeta>>(variants, {});
  const sources: GallerySource[] = Object.entries(parsed)
    .filter(([name]) => name.startsWith("webp"))
    .map(([name, meta]) => ({
      width: meta.width,
      url: `/media/${id}/${name}`,
      type: "image/webp" as const,
    }))
    .sort((a, b) => a.width - b.width);

  const jpegName = Object.keys(parsed).find((name) => name.startsWith("jpeg"));
  return {
    sources,
    fallbackUrl: jpegName ? `/media/${id}/${jpegName}` : sources[0]?.url ?? null,
  };
}

export function mapGalleryRow(row: GalleryRow): GalleryImage {
  const { sources, fallbackUrl } = gallerySources(row.id, row.variants);
  return {
    id: row.id,
    alt: row.alt,
    caption: row.caption,
    width: row.width,
    height: row.height,
    sources,
    fallbackUrl,
  };
}

export async function loadGallery(db: Db, siteId: string): Promise<GalleryImage[]> {
  const rows = await many<GalleryRow>(
    db,
    `select id, alt, caption, width, height, variants, sort_order
       from gallery_photos where site_id = $1 order by sort_order asc, created_at asc`,
    [siteId]
  );
  return rows.map(mapGalleryRow);
}

export async function loadGalleryRaw(
  db: Db,
  siteId: string
): Promise<(GalleryRow & { sortOrder: number })[]> {
  const rows = await many<GalleryRow>(
    db,
    `select id, alt, caption, width, height, variants, sort_order
       from gallery_photos where site_id = $1 order by sort_order asc, created_at asc`,
    [siteId]
  );
  return rows.map((row) => ({ ...row, sortOrder: Number(row.sort_order) }));
}

export async function loadPublicContent(db: Db, siteId: string): Promise<SiteContent> {
  const [business, homepage, treatments, offers, gallery] = await Promise.all([
    loadBusiness(db, siteId),
    loadHomepage(db, siteId),
    loadTreatments(db, siteId),
    loadOffers(db, siteId, { onlyLive: true }),
    loadGallery(db, siteId),
  ]);

  const timestamps = await one<{ updated_at: string | null }>(
    db,
    `select greatest(
        coalesce((select updated_at from business_details where site_id = $1), to_timestamp(0)),
        coalesce((select updated_at from homepage_content where site_id = $1), to_timestamp(0)),
        coalesce((select max(updated_at) from treatments where site_id = $1), to_timestamp(0)),
        coalesce((select max(updated_at) from offers where site_id = $1), to_timestamp(0)),
        coalesce((select max(updated_at) from gallery_photos where site_id = $1), to_timestamp(0))
      ) as updated_at`,
    [siteId]
  );

  return {
    business,
    homepage,
    treatments,
    offers,
    gallery,
    updatedAt: timestamps?.updated_at
      ? new Date(timestamps.updated_at).toISOString()
      : new Date(0).toISOString(),
  };
}

export async function loadStats(db: Db, siteId: string) {
  const row = await one<{
    treatments: string | number;
    archived: string | number;
    offers: string | number;
    photos: string | number;
    last_updated: string | null;
  }>(
    db,
    `select
       (select count(*) from treatments where site_id = $1 and archived_at is null) as treatments,
       (select count(*) from treatments where site_id = $1 and archived_at is not null) as archived,
       (select count(*) from offers where site_id = $1 and enabled = true
          and starts_on <= $2::date and ends_on >= $2::date) as offers,
       (select count(*) from gallery_photos where site_id = $1) as photos,
       (select greatest(
          coalesce((select updated_at from business_details where site_id = $1), to_timestamp(0)),
          coalesce((select updated_at from homepage_content where site_id = $1), to_timestamp(0)),
          coalesce((select max(updated_at) from treatments where site_id = $1), to_timestamp(0)),
          coalesce((select max(updated_at) from offers where site_id = $1), to_timestamp(0)),
          coalesce((select max(updated_at) from gallery_photos where site_id = $1), to_timestamp(0))
        )) as last_updated`,
    [siteId, londonToday()]
  );

  return {
    treatments: Number(row?.treatments ?? 0),
    archivedTreatments: Number(row?.archived ?? 0),
    activeOffers: Number(row?.offers ?? 0),
    photos: Number(row?.photos ?? 0),
    lastUpdated: row?.last_updated ? new Date(row.last_updated).toISOString() : null,
  };
}
