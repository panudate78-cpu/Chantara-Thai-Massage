# Chantara Thai Massage — SEO Optimisation Report

**Date:** 2026-03-22  
**Site:** https://www.chantarathaimassage.com  
**Stack:** Vite + React SPA (single-page application)  
**Scope:** Full technical, on-page, local, structured data, image, internal linking & E-E-A-T improvements

---

## 1. Technical SEO

| Item | Status | Details |
|------|--------|---------|
| Unique title tag | ✅ | `Thai Massage Fulham \| Chantara Thai Massage London SW6` (~55 chars) |
| Meta description | ✅ | ~155 chars, primary keywords + CTA |
| Canonical URL | ✅ | `https://www.chantarathaimassage.com/` |
| robots.txt | ✅ | `public/robots.txt` — Allow all + AI crawlers; Sitemap declared |
| XML sitemap | ✅ | `public/sitemap.xml` — home + key section anchors + image |
| Open Graph | ✅ | og:title, description, image (1200×630), locale en_GB, type website |
| Twitter/X cards | ✅ | summary_large_image + image alt |
| Favicon / PWA | ✅ | logo.png, apple-touch-icon, site.webmanifest, theme-color |
| hreflang / lang | ✅ | `html lang="en-GB"` |
| Geo meta | ✅ | geo.region GB-LND, placename Fulham, lat/long |
| noscript fallback | ✅ | Crawlable H1/nav/content if JS disabled |
| Skip link | ✅ | Skip to main content |

> **Note:** This is a single-page app. “Pages” are in-page sections (`#treatments`, `#location`, etc.). Title/description are primary for the root URL; section anchors are listed in the sitemap for discoverability.

---

## 2. Structured Data (JSON-LD `@graph`)

Injected via `src/components/Seo.tsx` on mount:

- **Organization**
- **LocalBusiness** + **MassageTherapy** + **HealthAndBeautyBusiness**
  - Full address, geo, telephone, email, priceRange
  - Opening hours (7 days)
  - areaServed: Fulham, SW6, Parsons Green, Chelsea, Hammersmith, London
  - aggregateRating 4.9 / 60 reviews
  - Individual Review nodes
  - Offer/Service for every treatment
  - ReserveAction → Picktime
- **WebSite** + SearchAction
- **WebPage**
- **BreadcrumbList**
- **FAQPage** (8 Q&As)

Validate with [Google Rich Results Test](https://search.google.com/test/rich-results) after deploy.

---

## 3. Content SEO

- **Single H1:** “Thai Massage in Fulham, London” (hero)
- **H2 hierarchy:** section titles (About, Treatments, Gift Vouchers, Booking Policy, Terms, Reviews, FAQ, Location, Contact)
- **H3:** treatment names, FAQ questions, policy items
- **Local keywords** woven into hero, about, treatments intro, location, FAQ, footer
- **New FAQ section** (`#faq`) with 9 keyword-rich Q&As + internal links
- **Breadcrumb trail** under header for UX + crawl paths
- **Noscript** content for non-JS crawlers

### Target keyword focus
Primary: Thai massage Fulham, traditional Thai massage London, massage Fulham Broadway  
Secondary: deep tissue Fulham, Swedish massage SW6, hot stone Fulham, reflexology London, pregnancy massage Fulham

---

## 4. Image SEO

- Descriptive, keyword-aware **alt text** on hero, about, treatment cards, logo
- Explicit **width/height** on key images (CLS)
- **lazy loading** + `decoding="async"` on below-fold images
- Hero uses `fetchPriority="high"` for LCP
- OG image: `public/og-image.jpg`
- Logo: `public/logo.png` + favicon/manifest

---

## 5. Internal Linking

- Header nav: Home, Treatments, Gift Vouchers, Booking Policy, FAQ, Location, Contact
- Breadcrumbs to all major sections
- FAQ answers link to treatments, location, gift vouchers, booking policy, terms, contact
- Contact → Gift Vouchers
- Footer: explore links + FAQ + Terms + booking + vouchers
- Hero CTA → Treatments
- All sections reachable in ≤ 2 clicks from home

---

## 6. Performance SEO

- Vite production build + minify
- Fonts: `display=swap`, preconnect to Google Fonts & Pexels
- dns-prefetch: Picktime, Google
- Single-file-friendly assets where applicable
- Image dimensions to reduce CLS
- Hero LCP image prioritised
- Lazy-load non-critical images
- `theme-color` for mobile UI

**Post-deploy:** run PageSpeed Insights / Lighthouse on the live URL and address any host-level caching (Netlify’s CDN handles most of this).

---

## 7. Local SEO

- Full NAP consistency: 39 Harwood Road, Fulham, London SW6 4QP · 07387 769945 · info@chantarathaimassage.com
- LocalBusiness schema with geo + opening hours
- Location copy: Fulham Broadway, District line, parking MSCP
- areaServed entities in schema
- Google Reviews link + aggregateRating
- Map embed + Get Directions

**Action for you:** Claim/optimise Google Business Profile with the same NAP, categories (Thai massage / Massage therapist), hours, photos, and website URL.

---

## 8. E-E-A-T

- About section: expertise, service types, local presence
- Real Google reviews + 4.9 rating trust strip
- Clear policies (booking, refunds, pregnancy, professional standards)
- Visible contact (phone, email, address, map)
- Payment methods transparency
- Gift voucher terms

---

## 9. Framework note (Vite, not Next.js)

This project is **Vite + React**, not Next.js. Equivalents applied:

| Next.js request | Vite implementation |
|-----------------|---------------------|
| Metadata API | Root `index.html` meta + canonical + OG/Twitter |
| Dynamic sitemap | Static `public/sitemap.xml` |
| robots.txt | Static `public/robots.txt` |
| JSON-LD components | `Seo.tsx` injects `@graph` |
| Static generation | SPA shell + crawlable noscript + schema |

---

## 10. Files added / updated

**Added**
- `public/robots.txt`
- `public/sitemap.xml`
- `public/site.webmanifest`
- `public/og-image.jpg`
- `src/components/Seo.tsx`
- `src/components/Faq.tsx`
- `src/components/Breadcrumbs.tsx`
- `SEO-REPORT.md` (this file)

**Updated**
- `index.html` — full head SEO package
- `src/App.tsx` — Seo, Breadcrumbs, Faq
- `src/data.ts` — SITE_URL, NAV FAQ link, treatment alts
- Hero / About / Treatments / Location / Footer — copy, headings, image attrs

---

## 11. Remaining opportunities

1. **Google Business Profile** — ensure identical NAP, website, hours, services.
2. **Google Search Console** — submit sitemap `https://www.chantarathaimassage.com/sitemap.xml`.
3. **Bing Webmaster Tools** — same sitemap.
4. **Custom domain DNS** — confirm apex + www canonical (prefer one host; 301 the other).
5. **Unique blog / guides** (optional) — e.g. “Benefits of Thai massage”, “Deep tissue vs Thai” for long-tail content.
6. **Self-hosted images** — replace Pexels hotlinks with optimised WebP in `/public` for full LCP control.
7. **Review schema volume** — add more real reviews over time as they accumulate.
8. **Multi-page routes** (optional future) — `/treatments`, `/location` as real routes if you outgrow the SPA for deeper ranking pages.
9. **Analytics** — GA4 + conversion events on Book / Call / Voucher clicks.
10. **After the first Netlify deploy** — replace any placeholder domain in Search Console and re-test Rich Results.

---

## 12. Deploy checklist

```bash
npm install
npm run build
# push to GitHub → Netlify auto-deploy
```

After live:
1. Rich Results Test on homepage  
2. Submit sitemap in GSC  
3. Mobile-friendly test  
4. PageSpeed Insights (mobile + desktop)  
5. Confirm og-image and logo load at absolute URLs  

---

*Optimised for 2026 practices: helpful local content, entity-rich schema, AI crawler access, Core Web Vitals hygiene, and clear E-E-A-T signals.*
