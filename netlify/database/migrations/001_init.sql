-- Launchpad CMS — initial schema
-- One row in `sites` per client website. Every content table is scoped by
-- site_id so the same codebase can serve future Launchpad Studio sites.

create table if not exists sites (
  id uuid primary key,
  slug text not null unique,
  site_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists admin_users (
  id uuid primary key,
  site_id uuid not null references sites(id) on delete cascade,
  email text not null,
  name text not null,
  password_hash text not null,
  role text not null default 'owner',
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists admin_users_site_email_key
  on admin_users (site_id, lower(email));

create table if not exists admin_sessions (
  id uuid primary key,
  user_id uuid not null references admin_users(id) on delete cascade,
  site_id uuid not null references sites(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists admin_sessions_expires_idx
  on admin_sessions (expires_at);

create table if not exists business_details (
  site_id uuid primary key references sites(id) on delete cascade,
  name text not null,
  phone text not null,
  email text not null,
  address_line1 text not null,
  address_line2 text not null default '',
  city text not null,
  postcode text not null,
  hours jsonb not null default '[]'::jsonb,
  social jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid null
);

create table if not exists homepage_content (
  site_id uuid primary key references sites(id) on delete cascade,
  hero_eyebrow text not null default '',
  hero_heading text not null,
  hero_heading_accent text not null,
  hero_description text not null,
  cta_primary_label text not null,
  cta_primary_destination text not null default 'booking',
  cta_secondary_label text not null default '',
  cta_secondary_destination text not null default 'treatments',
  updated_at timestamptz not null default now(),
  updated_by uuid null
);

create table if not exists treatments (
  id text primary key,
  site_id uuid not null references sites(id) on delete cascade,
  -- Slugs are generated once when a treatment is created and are never
  -- editable from the admin panel (page-anchor SEO protection).
  slug text not null,
  title text not null,
  tag text null,
  description text not null,
  image_url text null,
  image_alt text null,
  sort_order integer not null default 0,
  archived_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists treatments_site_slug_key
  on treatments (site_id, slug);

create index if not exists treatments_site_sort_idx
  on treatments (site_id, sort_order);

create table if not exists treatment_prices (
  id uuid primary key,
  treatment_id text not null references treatments(id) on delete cascade,
  minutes integer not null check (minutes > 0),
  price_pence integer not null check (price_pence >= 0),
  sort_order integer not null default 0
);

create index if not exists treatment_prices_treatment_idx
  on treatment_prices (treatment_id, minutes);

create table if not exists offers (
  id uuid primary key,
  site_id uuid not null references sites(id) on delete cascade,
  title text not null,
  description text not null,
  badge text null,
  starts_on date not null,
  ends_on date not null,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists offers_site_dates_idx
  on offers (site_id, enabled, starts_on, ends_on);

create table if not exists gallery_photos (
  id uuid primary key,
  site_id uuid not null references sites(id) on delete cascade,
  alt text not null,
  caption text null,
  width integer not null,
  height integer not null,
  -- { "webp480": { "key": "...", "width": 480, "type": "image/webp", "bytes": 1234 } }
  variants jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_photos_site_sort_idx
  on gallery_photos (site_id, sort_order);

create table if not exists audit_log (
  id uuid primary key,
  site_id uuid not null references sites(id) on delete cascade,
  actor text not null,
  action text not null,
  entity text not null,
  entity_id text null,
  summary text not null,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_site_created_idx
  on audit_log (site_id, created_at desc);
