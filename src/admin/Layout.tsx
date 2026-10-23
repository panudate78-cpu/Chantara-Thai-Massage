import { useEffect, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Link, usePathname } from "./lib/router";
import {
  ArchiveIcon,
  ExternalIcon,
  HomeIcon,
  ImageIcon,
  ListIcon,
  LockIcon,
  LogOutIcon,
  MenuIcon,
  CloseIcon,
  SparkleIcon,
  StoreIcon,
  TextIcon,
  UserIcon,
} from "./icons";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: HomeIcon, exact: true },
  { to: "/admin/business", label: "Business details", icon: StoreIcon },
  { to: "/admin/homepage", label: "Homepage", icon: TextIcon },
  { to: "/admin/treatments", label: "Treatments", icon: ListIcon },
  { to: "/admin/offers", label: "Offers", icon: SparkleIcon },
  { to: "/admin/gallery", label: "Photos", icon: ImageIcon },
  { to: "/admin/seo", label: "SEO protection", icon: LockIcon },
  { to: "/admin/account", label: "My account", icon: UserIcon },
];

function Brand({ businessName }: { businessName: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 bg-forest text-gold-soft">
        <span className="font-display text-lg font-semibold">C</span>
      </span>
      <div className="min-w-0">
        <p className="truncate font-display text-[1.15rem] font-semibold leading-tight text-ivory">
          {businessName}
        </p>
        <p className="mt-0.5 text-[9.5px] font-bold uppercase tracking-[0.24em] text-gold-soft/80">
          Content manager
        </p>
      </div>
    </div>
  );
}

function SidebarContent({
  businessName,
  siteUrl,
  email,
  pathname,
  onSignOut,
  onNavigate,
}: {
  businessName: string;
  siteUrl: string;
  email: string;
  pathname: string;
  onSignOut: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-forest-deep">
      <div className="px-5 pb-5 pt-6">
        <Brand businessName={businessName} />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Admin sections">
        <ul className="space-y-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold transition-colors",
                    active
                      ? "bg-ivory/[0.09] text-ivory shadow-[inset_2px_0_0_0_var(--color-gold)]"
                      : "text-cream/65 hover:bg-ivory/[0.05] hover:text-ivory"
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-ivory/10 px-4 py-4">
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-lg border border-ivory/12 px-3 py-2 text-[12.5px] font-semibold text-cream/75 transition-colors hover:border-gold-soft/40 hover:text-ivory"
        >
          View live website
          <ExternalIcon className="h-3.5 w-3.5" />
        </a>

        <div className="mt-4 flex items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ivory/10 text-xs font-bold text-gold-soft">
            {email.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold text-cream/85">{email}</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-cream/35">Signed in</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            title="Sign out"
            aria-label="Sign out"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-cream/50 transition-colors hover:bg-ivory/10 hover:text-ivory"
          >
            <LogOutIcon className="h-[18px] w-[18px]" />
          </button>
        </div>

        <p className="mt-4 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-cream/30">
          <ArchiveIcon className="h-3.5 w-3.5" />
          Launchpad Studio CMS
        </p>
      </div>
    </div>
  );
}

export default function AdminLayout({
  businessName,
  siteUrl,
  userEmail,
  onSignOut,
  children,
}: {
  businessName: string;
  siteUrl: string;
  userEmail: string;
  onSignOut: () => void;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-[#f6f2e9] font-sans text-ink">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SidebarContent
          businessName={businessName}
          siteUrl={siteUrl}
          email={userEmail}
          pathname={pathname}
          onSignOut={onSignOut}
        />
      </aside>

      {/* mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-[#e2d8c3] bg-[#f6f2e9]/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-lg border border-[#ded4bf] bg-white text-forest"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <div className="min-w-0 text-center">
          <p className="truncate font-display text-lg font-semibold leading-tight text-forest-deep">
            {businessName}
          </p>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold-deep">
            Content manager
          </p>
        </div>
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View live website"
          className="grid h-10 w-10 place-items-center rounded-lg border border-[#ded4bf] bg-white text-forest"
        >
          <ExternalIcon className="h-[18px] w-[18px]" />
        </a>
      </header>

      {/* mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-forest-deep/50 backdrop-blur-[2px]"
          />
          <div className="absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] shadow-2xl">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-cream"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
            <SidebarContent
              businessName={businessName}
              siteUrl={siteUrl}
              email={userEmail}
              pathname={pathname}
              onSignOut={onSignOut}
              onNavigate={() => setMenuOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}
