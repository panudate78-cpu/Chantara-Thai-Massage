/**
 * AUTO-GENERATED — do not edit.
 * Source: netlify/database/migrations/*.sql
 * Regenerate with: node scripts/build-schema.mjs
 */
export const SCHEMA_MIGRATIONS = [
  "001_init.sql",
  "002_seed_marker.sql"
] as const;

export const SCHEMA_STATEMENTS: readonly string[] = [
  "create table if not exists sites (\n  id uuid primary key,\n  slug text not null unique,\n  site_url text not null,\n  created_at timestamptz not null default now()\n)",
  "create table if not exists admin_users (\n  id uuid primary key,\n  site_id uuid not null references sites(id) on delete cascade,\n  email text not null,\n  name text not null,\n  password_hash text not null,\n  role text not null default 'owner',\n  failed_attempts integer not null default 0,\n  locked_until timestamptz,\n  last_login_at timestamptz,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n)",
  "create unique index if not exists admin_users_site_email_key\n  on admin_users (site_id, lower(email))",
  "create table if not exists admin_sessions (\n  id uuid primary key,\n  user_id uuid not null references admin_users(id) on delete cascade,\n  site_id uuid not null references sites(id) on delete cascade,\n  token_hash text not null unique,\n  expires_at timestamptz not null,\n  created_at timestamptz not null default now(),\n  last_seen_at timestamptz not null default now()\n)",
  "create index if not exists admin_sessions_expires_idx\n  on admin_sessions (expires_at)",
  "create table if not exists business_details (\n  site_id uuid primary key references sites(id) on delete cascade,\n  name text not null,\n  phone text not null,\n  email text not null,\n  address_line1 text not null,\n  address_line2 text not null default '',\n  city text not null,\n  postcode text not null,\n  hours jsonb not null default '[]'::jsonb,\n  social jsonb not null default '{}'::jsonb,\n  updated_at timestamptz not null default now(),\n  updated_by uuid null\n)",
  "create table if not exists homepage_content (\n  site_id uuid primary key references sites(id) on delete cascade,\n  hero_eyebrow text not null default '',\n  hero_heading text not null,\n  hero_heading_accent text not null,\n  hero_description text not null,\n  cta_primary_label text not null,\n  cta_primary_destination text not null default 'booking',\n  cta_secondary_label text not null default '',\n  cta_secondary_destination text not null default 'treatments',\n  updated_at timestamptz not null default now(),\n  updated_by uuid null\n)",
  "create table if not exists treatments (\n  id text primary key,\n  site_id uuid not null references sites(id) on delete cascade,\n  slug text not null,\n  title text not null,\n  tag text null,\n  description text not null,\n  image_url text null,\n  image_alt text null,\n  sort_order integer not null default 0,\n  archived_at timestamptz null,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n)",
  "create unique index if not exists treatments_site_slug_key\n  on treatments (site_id, slug)",
  "create index if not exists treatments_site_sort_idx\n  on treatments (site_id, sort_order)",
  "create table if not exists treatment_prices (\n  id uuid primary key,\n  treatment_id text not null references treatments(id) on delete cascade,\n  minutes integer not null check (minutes > 0),\n  price_pence integer not null check (price_pence >= 0),\n  sort_order integer not null default 0\n)",
  "create index if not exists treatment_prices_treatment_idx\n  on treatment_prices (treatment_id, minutes)",
  "create table if not exists offers (\n  id uuid primary key,\n  site_id uuid not null references sites(id) on delete cascade,\n  title text not null,\n  description text not null,\n  badge text null,\n  starts_on date not null,\n  ends_on date not null,\n  enabled boolean not null default true,\n  sort_order integer not null default 0,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n)",
  "create index if not exists offers_site_dates_idx\n  on offers (site_id, enabled, starts_on, ends_on)",
  "create table if not exists gallery_photos (\n  id uuid primary key,\n  site_id uuid not null references sites(id) on delete cascade,\n  alt text not null,\n  caption text null,\n  width integer not null,\n  height integer not null,\n  variants jsonb not null default '{}'::jsonb,\n  sort_order integer not null default 0,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n)",
  "create index if not exists gallery_photos_site_sort_idx\n  on gallery_photos (site_id, sort_order)",
  "create table if not exists audit_log (\n  id uuid primary key,\n  site_id uuid not null references sites(id) on delete cascade,\n  actor text not null,\n  action text not null,\n  entity text not null,\n  entity_id text null,\n  summary text not null,\n  created_at timestamptz not null default now()\n)",
  "create index if not exists audit_log_site_created_idx\n  on audit_log (site_id, created_at desc)",
  "alter table sites\n  add column if not exists content_seeded_at timestamptz"
];
