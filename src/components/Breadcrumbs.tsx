const CRUMBS = [
  { name: "Home", href: "#home" },
  { name: "Treatments", href: "#treatments" },
  { name: "Gift Vouchers", href: "#gift-vouchers" },
  { name: "Location", href: "#location" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" },
];

/** Visible breadcrumb trail for users + crawlers (JSON-LD BreadcrumbList is in Seo.tsx). */
export default function Breadcrumbs() {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-ink/10 bg-ivory/80">
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-clay sm:px-6 lg:px-8">
        {CRUMBS.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-ink/25" aria-hidden="true">
                /
              </span>
            )}
            <a href={c.href} className="transition-colors hover:text-forest">
              {c.name}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
