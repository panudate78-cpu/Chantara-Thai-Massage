# Content manager

A private admin area at **`/admin`** for Chantara Thai Massage. It is designed for
a non-technical owner and can be reused for other Launchpad Studio client sites.

## For the business owner

Sign in at `https://www.chantarathaimassage.com/admin` with your email address and
password. Everything you change is live on the website as soon as you press
**Save** (refresh the public page if you still see the old version).

### What you can update

| Area | What you can change |
| --- | --- |
| **Business details** | Name, phone, email, address, opening hours, social links |
| **Homepage** | Hero heading, supporting description, both call-to-action buttons |
| **Treatments** | Add a treatment, edit name/description/durations/prices, archive, reorder, delete |
| **Offers** | Create an offer, choose start and end dates, show or hide it |
| **Photos** | Upload photos, write alt text, reorder, edit captions, delete |
| **My account** | Change your password, download a copy of your content |

### What is protected (and why)

These are managed by Launchpad Studio so your Google ranking and page structure
cannot be damaged by accident:

- Website addresses (URLs), section anchors and treatment page links
- Structured data (schema), canonical tags, sitemap and robots.txt
- Page titles and meta descriptions
- Photo sizes and formats (automatic), plus the requirement for alt text
- The overall design, colours, fonts and layout

If you need a new page, a new section or a change to any of the above, contact
Launchpad Studio.

### Tips

- **Alt text** describes a photo for people using screen readers and for Google.
  Write what is in the picture, e.g. “Treatment room with two massage beds”.
- **Archive** hides a treatment but keeps its history. Use **Delete** only when you
  are sure — it cannot be undone.
- **Offers** only appear on the website between their start and end dates. Use the
  toggle to hide one early.
- The admin panel works on a phone. All screens are one column on small displays.

## For developers — reusing the CMS

The CMS is intentionally client-agnostic:

```
cms/shared/site.ts        Fixed constants: URL, booking link, phone, nav, brand
cms/shared/defaults.ts    Launch content + content types
cms/shared/validate.ts    Server + client validation (shared)
cms/shared/limits.ts      Character/price limits
cms/server/db.ts          Tiny Db interface: Postgres adapter + transactions
cms/server/auth.ts        scrypt passwords, hashed session tokens, lock-out
cms/server/storage.ts     Media storage interface + Netlify Blobs adapter
cms/server/seed.ts        Idempotent first-run seeding + admin bootstrap
cms/server/content.ts     Reads and assembles the public content payload
cms/server/handler.ts     Router shared by Netlify and the local dev server
cms/server/routes/*       Auth, admin content, treatments, offers, gallery, media
netlify/functions/api.mts Netlify entry point
server/dev.ts             Local single-port dev server (PGlite + Vite)
```

### To launch for a new client

1. Copy `cms/`, `netlify/`, `server/dev.ts`, `admin.html`, `src/admin/` and the
   `ContentContext` provider.
2. Edit `cms/shared/site.ts` (name, URL, phone, booking link, navigation) and
   `cms/shared/defaults.ts` (launch copy, treatments, opening hours, social links).
3. Replace the brand colours in `src/index.css` (`@theme` tokens) and the logo.
4. Add client-specific sections to the public site; keep the images, headings and
   rich-text rules that `seo` protection depends on.
5. Set `CMS_ADMIN_EMAIL` / `CMS_ADMIN_PASSWORD` in Netlify and deploy.
6. The database migration (`001_init.sql`) works unchanged for every client; it is
   scoped by `site_id`, so one database can host several sites if needed.

The only hard dependency on Netlify is `netlify/functions/api.mts` and the two
adapters (`cms/server/db.ts` Postgres adapter, `cms/server/storage.ts` Blobs
adapter). Any Postgres + object store can be substituted behind the same
interfaces.

### Where the data lives

| Layer | Production | Local development |
| --- | --- | --- |
| Database | **Postgres** — Netlify Database (Neon-powered, provisioned by Netlify) or any Postgres via `DATABASE_URL` | PGlite (real Postgres compiled to WASM) in `.data/pglite` |
| Photos | **Netlify Blobs**, store `media` | Files in `.data/media` |

There is no SQLite, no JSON files and no hardcoded content: every editable field
is a row in Postgres.

**Provisioning.** Netlify Database is a platform primitive, not an extension —
there is nothing to install from the Extensions marketplace. Because
`@netlify/database` is a dependency, Netlify creates the database during the
deploy and injects `NETLIFY_DB_URL`. You can also create it by hand under
**Data & Storage → Database** in the project. It requires a credit-based plan.

**Migrations.** `netlify/database/migrations/*.sql` follow Netlify's
`<number>_<slug>.sql` convention and are applied automatically during production
deploys and deploy previews. As a safety net, `cms/server/migrate.ts` checks for
the `sites` table on cold start and applies the same statements (generated into
`cms/server/schema.generated.ts` by `npm run schema:build`) when they are missing.
That is what makes an external `DATABASE_URL` work with no extra command.

**Diagnosing a connection problem.** `GET /api/health` returns either
`{"ok":true,"database":"connected"}` or a 503 with a `hint` explaining what to
fix. The public website keeps serving its launch content during an outage.

### Data model

| Table | Purpose |
| --- | --- |
| `sites` | One row per client site; `content_seeded_at` prevents re-seeding deleted content |
| `admin_users` | Email, scrypt hash, role, failed-attempt lock-out |
| `admin_sessions` | SHA-256 token hashes, expiry, sliding 12-hour sessions |
| `business_details` | Contact fields, JSON opening hours and social links |
| `homepage_content` | Hero copy and two CTA labels/destinations |
| `treatments` / `treatment_prices` | Treatments and their duration/price rows |
| `offers` | Title, description, date window, enabled flag |
| `gallery_photos` | Alt text, caption, dimensions, JSON variants (keys, widths, types) |
| `audit_log` | Who changed what, shown on the dashboard |

Prices are stored in pence as integers; the admin UI works in pounds.

### API

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/content` | Public content payload (ETag, CDN cache 30 s) |
| `GET` | `/media/:photoId/:variant` | Immutable optimised image |
| `POST` | `/api/admin/login` | Sign in (rate limited, lock-out after 5 failures) |
| `POST` | `/api/admin/logout` | Sign out |
| `GET` | `/api/admin/session` | Current user + site |
| `GET` | `/api/admin/overview` | Dashboard stats and recent activity |
| `GET`/`PUT` | `/api/admin/business` | Business details |
| `GET`/`PUT` | `/api/admin/homepage` | Hero and CTAs |
| `GET`/`POST` | `/api/admin/treatments` | List/create |
| `PUT`/`DELETE` | `/api/admin/treatments/:id` | Update/delete (must archive first) |
| `POST` | `/api/admin/treatments/:id/archive` | Archive or restore |
| `POST` | `/api/admin/treatments/reorder` | Reorder |
| `GET`/`POST` | `/api/admin/offers` | List/create |
| `PUT`/`DELETE` | `/api/admin/offers/:id` | Update/delete |
| `POST` | `/api/admin/offers/:id/toggle` | Show/hide |
| `GET`/`POST` | `/api/admin/gallery` | List/upload (base64 variants) |
| `PUT`/`DELETE` | `/api/admin/gallery/:id` | Alt text/caption or delete |
| `POST` | `/api/admin/gallery/reorder` | Reorder |
| `POST` | `/api/admin/account/password` | Change password |
| `GET` | `/api/admin/export` | Download a JSON backup |

### Deployment checklist (fresh Netlify account)

1. Deploy the repository (build `npm run build`, publish `dist`).
2. Database: ensure the site has one — **Data & Storage → Database**. If the
   project is on a plan without Netlify Database, create a Postgres database at
   Neon/Supabase and add its connection string as `DATABASE_URL`.
3. Photos: nothing to do (Netlify Blobs is built in).
4. Add `CMS_ADMIN_EMAIL`, `CMS_ADMIN_PASSWORD` (12+ characters) and optionally
   `CMS_ADMIN_NAME`, then trigger a new deploy.
5. Open `https://<site>/api/health` — expect `"database":"connected"`.
6. Sign in at `https://<site>/admin` with those credentials, then change the
   password under **My account**.

### Security

- Passwords: scrypt with per-user salt; never logged or returned.
- Sessions: 32-byte random token, stored only as SHA-256, `HttpOnly; SameSite=Lax;
  Secure` cookie, 12-hour sliding expiry.
- Lock-out: five failed attempts per account for 15 minutes, plus per-instance IP
  throttling.
- CSRF: every mutation must carry `x-cms-request: 1` and, when present, a matching
  `Origin`. The session cookie is `SameSite=Lax`, so cross-site form posts fail.
- Admin responses are `Cache-Control: no-store`; the admin HTML is `noindex` and
  `X-Frame-Options: DENY`.
- Uploads: type-sniffed (WebP/JPEG magic bytes), max 8 MB per photo, base64
  variants only, alt text required (min 5 characters).

### Image pipeline

The browser generates the derivatives during upload (`src/admin/lib/images.ts`):
WebP at 480/960/1600 px plus a JPEG 960 fallback, drawn on a canvas (EXIF/GPS is
therefore stripped). The server validates magic bytes and dimensions, then writes
`{siteSlug}/{photoId}/webp960.webp` etc. to Netlify Blobs. The public gallery uses
`<picture>` with `srcset`, width/height attributes and lazy loading.

No image processing on the server means no native dependencies and no cold-start
penalty.

## Testing locally without a browser

The admin flow can be exercised with `curl` (see the commands below). In the
sandbox there are no Chromium binaries, so visual checks are done by mounting the
React components in jsdom, or by opening the preview.

```bash
curl -s -c /tmp/cookies.txt -H 'content-type: application/json' \
  -H 'x-cms-request: 1' \
  -d '{"email":"owner@chantara.co.uk","password":"Chantara2026!"}' \
  http://localhost:5173/api/admin/login

curl -s -b /tmp/cookies.txt http://localhost:5173/api/content | head
```
