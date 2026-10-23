import { SITE_URL } from "../../../cms/shared/site";
import { Badge, Card, Notice, PageHeader } from "../ui";
import { CheckIcon, ExternalIcon, LockIcon } from "../icons";

const PROTECTED = [
  {
    title: "Page addresses (URLs)",
    description:
      "Your homepage and treatment anchors can't be renamed, so existing links and Google results keep working.",
  },
  {
    title: "Page titles & meta descriptions",
    description:
      "The search-result wording is written and maintained by Launchpad Studio to protect your rankings.",
  },
  {
    title: "Canonical tags",
    description:
      "Search engines are always told the one correct address for each page. This can't be edited or duplicated.",
  },
  {
    title: "Structured data (schema)",
    description:
      "The LocalBusiness, MassageTherapy and FAQ markup is generated automatically from your details and prices.",
  },
  {
    title: "Sitemap & robots.txt",
    description:
      "The sitemap is generated from the fixed page structure, so it can't fall out of date or point to missing pages.",
  },
  {
    title: "Image alt text & sizes",
    description:
      "Every gallery photo requires alt text and is automatically saved in phone, tablet and desktop sizes.",
  },
];

const SAFE = [
  "Business name, phone, email and address",
  "Opening hours",
  "Social media links",
  "Homepage headline and introduction",
  "Call-to-action button labels and safe destinations",
  "Treatment names, descriptions, durations and prices",
  "Offers, dates and visibility",
  "Gallery photos, alt text and order",
];

export default function SeoProtection() {
  return (
    <div>
      <PageHeader
        eyebrow="Search protection"
        title="Your SEO is protected"
        description="A content manager should make your website easier to run — never easier to break in Google. These foundations are locked by design and looked after by Launchpad Studio."
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Badge tone="green">
          <LockIcon className="h-3 w-3" /> Locked & monitored
        </Badge>
        <Badge tone="neutral">Technical SEO untouched</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="border-b border-[#eee6d5] px-5 py-4 sm:px-6">
            <h2 className="font-display text-xl font-semibold text-forest-deep">What you can't change</h2>
            <p className="mt-1 text-[13px] text-ink/50">
              Deliberately locked to protect your visibility in search results.
            </p>
          </div>
          <ul className="divide-y divide-[#f0e9da]">
            {PROTECTED.map((item) => (
              <li key={item.title} className="flex gap-3 px-5 py-4 sm:px-6">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                  <LockIcon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-deep">{item.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-ink/55">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold text-forest-deep">
              What you can edit safely
            </h2>
            <ul className="mt-3 space-y-2">
              {SAFE.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13px] leading-relaxed text-ink/65">
                  <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold text-forest-deep">Useful links</h2>
            <ul className="mt-3 space-y-2.5 text-[13px]">
              {[
                { label: "View your live website", href: SITE_URL },
                { label: "Sitemap (search engines)", href: `${SITE_URL}/sitemap.xml` },
                { label: "robots.txt", href: `${SITE_URL}/robots.txt` },
                {
                  label: "Test your structured data",
                  href: "https://search.google.com/test/rich-results",
                },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-forest hover:text-gold-deep"
                  >
                    {link.label}
                    <ExternalIcon className="h-3.5 w-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="mt-5">
        <Notice tone="success">
          <strong className="font-semibold">Every edit is checked automatically.</strong> Changes
          are validated before they go live, images are optimised on upload, and the sitemap,
          canonical tags and schema markup are generated from fixed templates.
        </Notice>
      </div>

      <div className="mt-4 rounded-xl border border-[#e7dec9] bg-[#fbf8f0] px-5 py-4">
        <p className="text-sm font-semibold text-forest-deep">Need something technical changed?</p>
        <p className="mt-1 text-[13px] leading-relaxed text-ink/55">
          Launchpad Studio can safely update page titles, descriptions or structured data for you,
          with a check that your rankings stay intact.
        </p>
        <a
          href="https://launchpadstudio.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-forest underline decoration-gold/60 underline-offset-4 hover:text-gold-deep"
        >
          Contact Launchpad Studio
          <ExternalIcon className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
