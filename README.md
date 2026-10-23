# Chantara Thai Massage

Website for Chantara Thai Massage, 39 Harwood Road, Fulham, London SW6 4QP — plus a
private, mobile-friendly content manager so the owner can update the site without a
developer.

- **Website:** React 19 + Vite 7 + Tailwind CSS 4 (single page, static build)
- **CMS:** React admin app at `/admin`
- **Data:** Netlify Database (Postgres) + Netlify Blobs for photos
- **API:** one Netlify Function (`netlify/functions/api.mts`)

The CMS is a reusable Launchpad Studio package — see [CMS.md](./CMS.md) for the
owner guide and the developer notes on reusing it for other client sites.

## Project structure

```
.
├── index.html                     # Public single-page site + SEO meta
├── admin.html                     # Admin SPA shell (noindex)
├── netlify.toml                   # Build, routing, headers
├── netlify/
│   ├── database/migrations/       # Postgres schema (auto-applied)
│   └── functions/api.mts          # Public content + admin API + media
├── cms/
│   ├── shared/                    # Site constants, types, defaults, validation
│   └── server/                    # Database, auth, storage, routes
├── server/dev.ts                  # Local dev server (Vite + API + PGlite)
├── scripts/hash-password.ts       # Manual password reset helper
├── public/                        # logo, OG image, robots.txt, sitemap.xml
└── src/
    ├── components/                # Public site sections
    ├── content/ContentContext.tsx # Live content from /api/content
    └── admin/                     # Admin app (pages, UI, image pipeline)
```

## Local development

```bash
npm install
npm run dev
```

- Website: <http://localhost:5173/>
- Admin: <http://localhost:5173/admin>
- Login: `owner@chantara.co.uk` / `Chantara2026!` (development only)

The dev server writes a real Postgres-compatible database to `.data/pglite` and
photos to `.data/media`, both git-ignored. Delete `.data/` to start from the
original content. Optional environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `5173` | Dev server port |
| `CMS_DATA_DIR` | `.data` | Database and photo storage location |
| `CMS_ADMIN_EMAIL` | `owner@chantara.co.uk` | First admin account |
| `CMS_ADMIN_PASSWORD` | `Chantara2026!` | First admin password |

```bash
npm run typecheck   # TypeScript, no emit
npm run build       # Production build to dist/
npm run preview     # Preview the static build (API not included)
```

## Deploying to Netlify

1. Import this repository into Netlify (build command `npm run build`, publish
   directory `dist` — already set in `netlify.toml`).

2. **Database — nothing to install.** Netlify Database is a platform feature, not
   an extension: because `@netlify/database` is in `package.json`, Netlify
   provisions a Postgres database for the site automatically on deploy (it uses
   the `NETLIFY_DB_URL` variable that Netlify injects). To create or inspect it
   manually, open the project → **Data & Storage → Database**. Netlify Database
   requires a credit-based plan; if it is unavailable to you, use option B below.

   - **Option A — Netlify Database (default).** Migrations in
     `netlify/database/migrations` are applied automatically during each deploy.
   - **Option B — any Postgres.** Point `DATABASE_URL` at Neon, Supabase, RDS or
     a self-managed server. The CMS creates its own schema on first request
     (`ensureSchema`), so no CLI step is needed. Locally the same code path runs
     against PGlite.

3. **Photos** are stored in Netlify Blobs, which is built in — no extension, no
   keys, nothing to configure.

4. Set environment variables (Site configuration → Environment variables):

   ```
   CMS_ADMIN_EMAIL     = the owner's email address
   CMS_ADMIN_PASSWORD  = a long, unique password (12+ characters)
   CMS_ADMIN_NAME      = optional display name
   DATABASE_URL        = optional; only for Option B (external Postgres)
   ```

5. Deploy (or **Deploys → Trigger deploy → Deploy site** after adding the
   variables). Check `https://www.chantarathaimassage.com/api/health` — it returns
   `{"ok":true,"database":"connected"}` once the database is reachable. If it
   returns 503, the response body names the exact problem.

6. Sign in at `/admin` with the email and password above. The first request
   creates the site record, seeds the launch content once, and creates the owner
   account. The owner can then change the password under **My account**.

No build-time secrets are required and the public site keeps working even if the
API is briefly unavailable (it renders the same launch content as a fallback).

### Password reset

If the owner forgets their password, generate a new hash and update it in the
database:

```bash
npm run password:hash -- "a new long password"
```

Then paste the generated SQL into `netlify database connect` and sign in again.
Changing the password in the admin panel signs out every other device.

## SEO notes

The public HTML in `index.html` (title, description, canonical, Open Graph,
Twitter, structured data defaults) and `public/robots.txt` + `public/sitemap.xml`
are code-owned and cannot be edited from the admin panel. The admin panel is
`noindex, nofollow`, blocked in `robots.txt`, and marked `X-Robots-Tag: noindex`
on every response.

Editing rules that protect search performance:

- Page addresses, section anchors, slugs and schema remain fixed.
- Treatment slugs are generated once, linked to the treatment's `/#treatment-…`
  anchor, and never editable.
- Photo alt text is mandatory; uploads are automatically re-encoded to WebP
  (480/960/1600 px) with a JPEG fallback and served with immutable caching.
- Hero and business copy is limited to sensible lengths so layouts cannot break.

## Deployment history

This project previously had a `vercel.json`; hosting is now Netlify only. See
`SEO-REPORT.md` for the original search audit.
