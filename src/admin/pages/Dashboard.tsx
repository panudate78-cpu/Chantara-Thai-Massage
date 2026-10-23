import { useEffect, useState } from "react";
import { api, type Overview } from "../lib/api";
import { greeting, relativeTime } from "../lib/format";
import { Link } from "../lib/router";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  PageLoader,
  useToast,
} from "../ui";
import {
  ChevronRightIcon,
  ImageIcon,
  ListIcon,
  LockIcon,
  SparkleIcon,
  StoreIcon,
  TextIcon,
} from "../icons";

const QUICK_ACTIONS = [
  {
    to: "/admin/business",
    title: "Business details",
    description: "Phone, email, address and opening hours",
    Icon: StoreIcon,
  },
  {
    to: "/admin/homepage",
    title: "Homepage",
    description: "The first words visitors read",
    Icon: TextIcon,
  },
  {
    to: "/admin/treatments",
    title: "Treatments & prices",
    description: "Add, edit or archive your menu",
    Icon: ListIcon,
  },
  {
    to: "/admin/offers",
    title: "Offers",
    description: "Publish a promotion with dates",
    Icon: SparkleIcon,
  },
  {
    to: "/admin/gallery",
    title: "Photos",
    description: "Upload and arrange gallery images",
    Icon: ImageIcon,
  },
];

const ACTION_LABELS: Record<string, string> = {
  created: "added",
  updated: "updated",
  archived: "archived",
  restored: "restored",
  deleted: "removed",
  uploaded: "added",
  enabled: "published",
  disabled: "hid",
  reordered: "reordered",
};

export default function Dashboard() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    setFailed(false);
    api
      .overview()
      .then(setData)
      .catch(() => {
        setFailed(true);
        toast.error("We couldn't load your dashboard. Please refresh the page.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <PageLoader label="Loading your dashboard…" />;
  if (failed || !data) {
    return (
      <EmptyState
        title="We couldn't load your dashboard"
        description="This is usually temporary. Refresh the page or try again in a moment."
        action={<Button onClick={load}>Try again</Button>}
      />
    );
  }

  const firstName = data.user.name.split(" ")[0] || "there";
  const audit = data.audit;

  return (
    <div>
      <PageHeader
        eyebrow="Welcome back"
        title={`${greeting()}, ${firstName}.`}
        description="Everything on this page updates your live website straight away. Take your time — nothing here needs a developer."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">Live treatments</p>
          <p className="mt-2 font-display text-4xl font-semibold text-forest-deep">{data.stats.treatments}</p>
          <p className="mt-1 text-[13px] text-ink/50">
            {data.stats.archivedTreatments > 0
              ? `${data.stats.archivedTreatments} archived`
              : "All visible on your website"}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">Active offers</p>
          <p className="mt-2 font-display text-4xl font-semibold text-forest-deep">{data.stats.activeOffers}</p>
          <p className="mt-1 text-[13px] text-ink/50">
            {data.stats.activeOffers > 0 ? "Showing on the homepage" : "No promotions running"}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">Gallery photos</p>
          <p className="mt-2 font-display text-4xl font-semibold text-forest-deep">{data.stats.photos}</p>
          <p className="mt-1 text-[13px] text-ink/50">
            {data.stats.photos > 0 ? "Sized for every screen" : "Add your first photo"}
          </p>
        </Card>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ink/45">
          What would you like to update?
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {QUICK_ACTIONS.map(({ to, title, description, Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-4 rounded-xl border border-[#e7dec9] bg-white px-5 py-4 transition-colors hover:border-gold/60"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream text-forest">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-forest-deep">{title}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-ink/50">{description}</span>
              </span>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-gold-deep" />
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-forest-deep">Recent changes</h2>
            {data.stats.lastUpdated && (
              <span className="text-[11px] uppercase tracking-[0.12em] text-ink/40">
                Last edit {relativeTime(data.stats.lastUpdated)}
              </span>
            )}
          </div>

          {audit.length === 0 ? (
            <p className="mt-4 text-sm leading-relaxed text-ink/50">
              Your changes will appear here, so you can always see what was updated and when.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[#eee6d5]">
              {audit.slice(0, 6).map((entry) => (
                <li key={entry.id} className="flex items-start justify-between gap-3 py-3 first:pt-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-forest-deep">{entry.summary}</p>
                    <p className="mt-0.5 text-[12.5px] text-ink/45">
                      {ACTION_LABELS[entry.action] ?? entry.action} by {entry.actor}
                    </p>
                  </div>
                  <span className="shrink-0 text-[12px] text-ink/40">{relativeTime(entry.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="flex flex-col p-5 lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-700">
              <LockIcon className="h-4 w-4" />
            </span>
            <h2 className="font-display text-xl font-semibold text-forest-deep">Protected for you</h2>
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink/60">
            Page addresses, search titles, canonical tags, sitemap and structured data are locked.
            You can edit the content — not the SEO foundations.
          </p>
          <ul className="mt-4 space-y-2 text-[13px] text-ink/60">
            {["Page URLs stay the same", "Schema markup untouched", "Images get alt text", "Sitemap stays accurate"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  {item}
                </li>
              )
            )}
          </ul>
          <Link
            to="/admin/seo"
            className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-forest hover:text-gold-deep"
          >
            See what's protected
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </Link>
        </Card>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-[#e7dec9] bg-[#fbf8f0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-forest-deep">Need a hand?</p>
          <p className="mt-0.5 text-[13px] text-ink/55">
            Launchpad Studio looks after the technical side of your website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone="gold">Support included</Badge>
          <a
            href="https://launchpadstudio.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-bold text-forest underline decoration-gold/50 underline-offset-4 hover:text-gold-deep"
          >
            Contact Launchpad
          </a>
        </div>
      </div>
    </div>
  );
}
