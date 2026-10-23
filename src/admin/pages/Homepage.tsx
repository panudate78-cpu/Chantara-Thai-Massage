import { useEffect, useState, type FormEvent } from "react";
import type { CtaDestination, HomepageContent } from "../../../cms/shared/types";
import { CTA_DESTINATIONS } from "../../../cms/shared/types";
import { LIMITS } from "../../../cms/shared/limits";
import { api, ApiRequestError } from "../lib/api";
import { WEBSITE_URL } from "../lib/links";
import {
  Button,
  Card,
  Field,
  FormActions,
  Notice,
  PageHeader,
  PageLoader,
  Select,
  TextInput,
  Textarea,
  useToast,
} from "../ui";
import { ExternalIcon } from "../icons";

function Counter({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span className={over ? "text-[11px] font-semibold text-red-700" : "text-[11px] text-ink/35"}>
      {value.length}/{max}
    </span>
  );
}

function DestinationField({
  id,
  label,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: CtaDestination;
  onChange: (value: CtaDestination) => void;
  error?: string;
}) {
  return (
    <Field label={label} htmlFor={id} error={error} hint="Links are generated for you — no broken URLs.">
      <Select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as CtaDestination)}
        invalid={Boolean(error)}
      >
        {CTA_DESTINATIONS.map((destination) => (
          <option key={destination.value} value={destination.value}>
            {destination.label}
          </option>
        ))}
      </Select>
    </Field>
  );
}

export default function Homepage() {
  const [homepage, setHomepage] = useState<HomepageContent | null>(null);
  const [snapshot, setSnapshot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api
      .homepage()
      .then(({ homepage: data }) => {
        setHomepage(data);
        setSnapshot(JSON.stringify(data));
      })
      .catch(() => toast.error("We couldn't load your homepage content."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!homepage) return <PageLoader label="Loading homepage content…" />;

  const update = <K extends keyof HomepageContent>(key: K, value: HomepageContent[K]) => {
    setHomepage((current) => (current ? { ...current, [key]: value } : current));
  };

  const updateCta = (
    key: "ctaPrimary" | "ctaSecondary",
    patch: Partial<HomepageContent["ctaPrimary"]>
  ) => {
    setHomepage((current) =>
      current ? { ...current, [key]: { ...current[key], ...patch } } : current
    );
    setErrors((current) => {
      const field = `${key}.label`;
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const dirty = JSON.stringify(homepage) !== snapshot;
  const lines = homepage.heroHeading.split("\n").filter(Boolean).slice(0, 2);
  const mentionsLocation = /fulham|thai|london|sw6/i.test(
    `${homepage.heroHeading} ${homepage.heroDescription}`
  );

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const { homepage: saved } = await api.updateHomepage(homepage);
      setHomepage(saved);
      setSnapshot(JSON.stringify(saved));
      toast.success("Homepage updated — your website is live.");
    } catch (caught) {
      if (caught instanceof ApiRequestError) {
        setErrors(caught.fields);
        toast.error(caught.message);
      } else {
        toast.error("We couldn't save your changes. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} noValidate>
      <PageHeader
        eyebrow="First impressions"
        title="Homepage content"
        description="The headline, introduction and buttons at the very top of your website. Keep the words warm and specific — that's what helps people choose you."
        actions={
          <a
            href={WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-forest/70 hover:text-forest"
          >
            View homepage
            <ExternalIcon className="h-3.5 w-3.5" />
          </a>
        }
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <Card>
            <div className="border-b border-[#eee6d5] px-5 py-4 sm:px-6">
              <h2 className="font-display text-xl font-semibold text-forest-deep">Hero section</h2>
              <p className="mt-1 text-[13px] text-ink/50">
                The large text visitors see first. Two headline lines maximum.
              </p>
            </div>
            <div className="space-y-4 px-5 py-5 sm:px-6">
              <Field
                label="Small line above the headline"
                htmlFor="hero-eyebrow"
                error={errors.heroEyebrow}
                hint="Your location or a short welcome, e.g. “Fulham Broadway · London SW6”."
              >
                <div className="relative">
                  <TextInput
                    id="hero-eyebrow"
                    value={homepage.heroEyebrow}
                    maxLength={LIMITS.heroEyebrow}
                    onChange={(event) => update("heroEyebrow", event.target.value)}
                    invalid={Boolean(errors.heroEyebrow)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Counter value={homepage.heroEyebrow} max={LIMITS.heroEyebrow} />
                  </span>
                </div>
              </Field>

              <Field
                label="Main headline"
                htmlFor="hero-heading"
                required
                error={errors.heroHeading}
                hint="Press Enter to start a second line. Keep it short and clear."
              >
                <Textarea
                  id="hero-heading"
                  rows={2}
                  value={homepage.heroHeading}
                  onChange={(event) => update("heroHeading", event.target.value)}
                  invalid={Boolean(errors.heroHeading)}
                  className="min-h-[84px] font-display text-xl"
                />
              </Field>

              <Field
                label="Highlighted words"
                htmlFor="hero-accent"
                required
                error={errors.heroHeadingAccent}
                hint="Shown in gold italics on its own line, e.g. “London”."
              >
                <div className="relative">
                  <TextInput
                    id="hero-accent"
                    value={homepage.heroHeadingAccent}
                    maxLength={LIMITS.heroHeadingAccent}
                    onChange={(event) => update("heroHeadingAccent", event.target.value)}
                    invalid={Boolean(errors.heroHeadingAccent)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Counter value={homepage.heroHeadingAccent} max={LIMITS.heroHeadingAccent} />
                  </span>
                </div>
              </Field>

              <Field
                label="Introduction"
                htmlFor="hero-description"
                required
                error={errors.heroDescription}
                hint="One or two friendly sentences about what you offer and where you are."
              >
                <div className="relative">
                  <Textarea
                    id="hero-description"
                    rows={4}
                    value={homepage.heroDescription}
                    onChange={(event) => update("heroDescription", event.target.value)}
                    invalid={Boolean(errors.heroDescription)}
                  />
                  <span className="absolute bottom-2.5 right-3">
                    <Counter value={homepage.heroDescription} max={LIMITS.heroDescription} />
                  </span>
                </div>
              </Field>
            </div>
          </Card>

          <Card>
            <div className="border-b border-[#eee6d5] px-5 py-4 sm:px-6">
              <h2 className="font-display text-xl font-semibold text-forest-deep">Call-to-action buttons</h2>
              <p className="mt-1 text-[13px] text-ink/50">
                The two buttons under the introduction. The first is the main action.
              </p>
            </div>
            <div className="space-y-5 px-5 py-5 sm:px-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Main button text" htmlFor="cta-primary-label" error={errors["ctaPrimary.label"]}>
                  <TextInput
                    id="cta-primary-label"
                    value={homepage.ctaPrimary.label}
                    maxLength={LIMITS.ctaLabel}
                    onChange={(event) => updateCta("ctaPrimary", { label: event.target.value })}
                    invalid={Boolean(errors["ctaPrimary.label"])}
                  />
                </Field>
                <DestinationField
                  id="cta-primary-destination"
                  label="Main button goes to"
                  value={homepage.ctaPrimary.destination}
                  onChange={(destination) => updateCta("ctaPrimary", { destination })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Second button text"
                  htmlFor="cta-secondary-label"
                  error={errors["ctaSecondary.label"]}
                  hint="Leave empty to hide the second button."
                >
                  <TextInput
                    id="cta-secondary-label"
                    value={homepage.ctaSecondary.label}
                    maxLength={LIMITS.ctaLabel}
                    onChange={(event) => updateCta("ctaSecondary", { label: event.target.value })}
                    invalid={Boolean(errors["ctaSecondary.label"])}
                  />
                </Field>
                <DestinationField
                  id="cta-secondary-destination"
                  label="Second button goes to"
                  value={homepage.ctaSecondary.destination}
                  onChange={(destination) => updateCta("ctaSecondary", { destination })}
                />
              </div>
            </div>
          </Card>

          {!mentionsLocation && (
            <Notice tone="warning">
              <strong className="font-semibold">A small SEO tip:</strong> your headline no longer
              mentions Fulham, Thai massage or London. Keeping a location word helps local customers
              find you in Google.
            </Notice>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-8">
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#eee6d5] px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/40">
                  Live preview
                </p>
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  On your website
                </span>
              </div>
              <div className="pattern-dots bg-cream px-5 py-7">
                <p className="flex items-center gap-2 text-[8.5px] font-bold uppercase tracking-[0.26em] text-gold-deep">
                  <span className="h-px w-5 bg-gold/70" aria-hidden="true" />
                  {homepage.heroEyebrow || " "}
                </p>
                <p className="mt-4 font-display text-[2rem] font-medium leading-[1.05] text-forest-deep">
                  {lines.map((line, index) => (
                    <span key={`${line}-${index}`} className="block">
                      {line}
                    </span>
                  ))}
                  {homepage.heroHeadingAccent && (
                    <span className="block italic text-gold">{homepage.heroHeadingAccent}</span>
                  )}
                </p>
                <p className="mt-4 text-[12.5px] leading-relaxed text-ink/65">
                  {homepage.heroDescription || "Your introduction will appear here."}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {homepage.ctaPrimary.label && homepage.ctaPrimary.destination !== "none" && (
                    <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-forest px-4 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-ivory">
                      {homepage.ctaPrimary.label}
                    </span>
                  )}
                  {homepage.ctaSecondary.label && homepage.ctaSecondary.destination !== "none" && (
                    <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-forest underline decoration-gold/60 underline-offset-4">
                      {homepage.ctaSecondary.label}
                    </span>
                  )}
                </div>
              </div>
            </Card>
            <p className="mt-3 px-1 text-[12px] leading-relaxed text-ink/45">
              This is a close preview. The real page also shows your treatment menu and photos.
            </p>
          </div>
        </div>
      </div>

      <FormActions hint={dirty ? "You have unsaved changes." : "Everything is saved."}>
        <Button
          type="button"
          variant="secondary"
          disabled={!dirty || saving}
          onClick={() => {
            if (!snapshot) return;
            setHomepage(JSON.parse(snapshot) as HomepageContent);
            setErrors({});
          }}
        >
          Discard
        </Button>
        <Button type="submit" loading={saving} disabled={!dirty}>
          Save changes
        </Button>
      </FormActions>
    </form>
  );
}
