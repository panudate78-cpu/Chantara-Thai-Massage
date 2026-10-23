import { useEffect, useState, type FormEvent } from "react";
import type { BusinessDetails, SocialLinks } from "../../../cms/shared/types";
import { WEBSITE_URL } from "../lib/links";
import { api, ApiRequestError } from "../lib/api";
import { orderedHours } from "../../lib/hours";
import {
  Button,
  Card,
  Field,
  FormActions,
  Notice,
  PageHeader,
  PageLoader,
  TextInput,
  useToast,
} from "../ui";
import { ClockIcon, ExternalIcon } from "../icons";

const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourbusiness" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourbusiness" },
  { key: "google", label: "Google reviews", placeholder: "https://g.page/yourbusiness" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourbusiness" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/447387769945" },
];

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-b border-[#eee6d5] px-5 py-4 sm:px-6">
      <h2 className="font-display text-xl font-semibold text-forest-deep">{title}</h2>
      <p className="mt-1 text-[13px] leading-relaxed text-ink/50">{description}</p>
    </div>
  );
}

export default function Business() {
  const [business, setBusiness] = useState<BusinessDetails | null>(null);
  const [snapshot, setSnapshot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api
      .business()
      .then(({ business: data }) => {
        setBusiness({ ...data, hours: orderedHours(data.hours) });
        setSnapshot(JSON.stringify(data));
      })
      .catch(() => toast.error("We couldn't load your business details."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!business) return <PageLoader label="Loading business details…" />;

  const update = <K extends keyof BusinessDetails>(key: K, value: BusinessDetails[K]) => {
    setBusiness((current) => (current ? { ...current, [key]: value } : current));
    setErrors((current) => {
      if (!current[key as string]) return current;
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  };

  const updateSocial = (key: keyof SocialLinks, value: string) => {
    setBusiness((current) =>
      current ? { ...current, social: { ...current.social, [key]: value } } : current
    );
    setErrors((current) => {
      const field = `social.${key}`;
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const updateHour = (index: number, patch: Partial<BusinessDetails["hours"][number]>) => {
    setBusiness((current) => {
      if (!current) return current;
      const hours = current.hours.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
      return { ...current, hours };
    });
    setErrors((current) => {
      const field = `hours.${index}`;
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const dirty = JSON.stringify(business) !== snapshot;

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const { business: saved } = await api.updateBusiness(business);
      setBusiness({ ...saved, hours: orderedHours(saved.hours) });
      setSnapshot(JSON.stringify(saved));
      toast.success("Business details updated — your website is live.");
      window.scrollTo({ top: 0, behavior: "smooth" });
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
        eyebrow="Your details"
        title="Business details"
        description="Your name, contact details and opening hours appear across the website — including the footer, contact section, directions and Google's business information."
        actions={
          <a
            href={`${WEBSITE_URL}/#location`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-forest/70 hover:text-forest"
          >
            See on website
            <ExternalIcon className="h-3.5 w-3.5" />
          </a>
        }
      />

      <div className="space-y-4">
        <Card>
          <SectionTitle
            title="Contact details"
            description="Shown in the header, footer and contact section. The phone number is click-to-call on mobile."
          />
          <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
            <Field
              label="Business name"
              htmlFor="business-name"
              required
              error={errors.name}
              hint="Used in the footer and in Google's structured data."
              className="sm:col-span-2"
            >
              <TextInput
                id="business-name"
                value={business.name}
                onChange={(event) => update("name", event.target.value)}
                invalid={Boolean(errors.name)}
                autoComplete="organization"
              />
            </Field>
            <Field label="Phone number" htmlFor="business-phone" required error={errors.phone} hint="UK format, e.g. 07387 769945.">
              <TextInput
                id="business-phone"
                type="tel"
                value={business.phone}
                onChange={(event) => update("phone", event.target.value)}
                invalid={Boolean(errors.phone)}
                autoComplete="tel"
              />
            </Field>
            <Field label="Email address" htmlFor="business-email" required error={errors.email} hint="Replies go straight to your inbox.">
              <TextInput
                id="business-email"
                type="email"
                value={business.email}
                onChange={(event) => update("email", event.target.value)}
                invalid={Boolean(errors.email)}
                autoComplete="email"
              />
            </Field>
          </div>
        </Card>

        <Card>
          <SectionTitle
            title="Address"
            description="Used for the map, directions links and local search results. Please keep it exactly as it appears on Google."
          />
          <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
            <Field label="Street address" htmlFor="address-line1" required error={errors.addressLine1} className="sm:col-span-2">
              <TextInput
                id="address-line1"
                value={business.addressLine1}
                onChange={(event) => update("addressLine1", event.target.value)}
                invalid={Boolean(errors.addressLine1)}
                autoComplete="address-line1"
                placeholder="39 Harwood Road"
              />
            </Field>
            <Field label="Area / neighbourhood" htmlFor="address-line2" error={errors.addressLine2} hint="e.g. Fulham">
              <TextInput
                id="address-line2"
                value={business.addressLine2}
                onChange={(event) => update("addressLine2", event.target.value)}
                invalid={Boolean(errors.addressLine2)}
                autoComplete="address-line2"
              />
            </Field>
            <Field label="Town / city" htmlFor="address-city" required error={errors.city}>
              <TextInput
                id="address-city"
                value={business.city}
                onChange={(event) => update("city", event.target.value)}
                invalid={Boolean(errors.city)}
                autoComplete="address-level2"
              />
            </Field>
            <Field label="Postcode" htmlFor="address-postcode" required error={errors.postcode} className="sm:max-w-[12rem]">
              <TextInput
                id="address-postcode"
                value={business.postcode}
                onChange={(event) => update("postcode", event.target.value)}
                invalid={Boolean(errors.postcode)}
                autoComplete="postal-code"
                className="uppercase"
              />
            </Field>
          </div>
        </Card>

        <Card>
          <SectionTitle
            title="Opening hours"
            description="Update these if your hours change for holidays or the season. They appear on the website and in Google's structured data."
          />
          <div className="px-5 py-3 sm:px-6">
            <div className="hidden grid-cols-[7rem_1fr_1fr_5.5rem] gap-3 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40 sm:grid">
              <span>Day</span>
              <span>Opens</span>
              <span>Closes</span>
              <span className="text-right">Status</span>
            </div>
            <ul className="divide-y divide-[#f0e9da]">
              {business.hours.map((hours, index) => (
                <li key={hours.day} className="py-3">
                  <div className="grid items-center gap-3 sm:grid-cols-[7rem_1fr_1fr_5.5rem]">
                    <span className="text-sm font-semibold text-forest-deep">{hours.day}</span>
                    <label className="flex items-center gap-2 sm:block">
                      <span className="w-14 text-[11px] font-bold uppercase tracking-[0.12em] text-ink/40 sm:hidden">
                        Opens
                      </span>
                      <TextInput
                        type="time"
                        aria-label={`${hours.day} opening time`}
                        value={hours.open}
                        disabled={hours.closed}
                        onChange={(event) => updateHour(index, { open: event.target.value })}
                        className="py-2"
                      />
                    </label>
                    <label className="flex items-center gap-2 sm:block">
                      <span className="w-14 text-[11px] font-bold uppercase tracking-[0.12em] text-ink/40 sm:hidden">
                        Closes
                      </span>
                      <TextInput
                        type="time"
                        aria-label={`${hours.day} closing time`}
                        value={hours.close}
                        disabled={hours.closed}
                        onChange={(event) => updateHour(index, { close: event.target.value })}
                        className="py-2"
                      />
                    </label>
                    <label className="flex items-center justify-end gap-2 text-[12px] font-semibold text-ink/60 sm:justify-end">
                      <input
                        type="checkbox"
                        checked={hours.closed}
                        onChange={(event) => updateHour(index, { closed: event.target.checked })}
                        className="h-4 w-4 rounded border-ink/25 accent-[#1e3a2c]"
                      />
                      Closed
                    </label>
                  </div>
                  {errors[`hours.${index}`] && (
                    <p className="mt-1 text-[13px] font-semibold text-red-700" role="alert">
                      {errors[`hours.${index}`]}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex items-start gap-2 border-t border-[#f0e9da] py-3 text-[12.5px] text-ink/50">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
              <p>Use the "Closed" box for days you don't open. Visitors see "Closed today" automatically.</p>
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle
            title="Social media"
            description="Add the links you'd like in the website footer. Leave a field empty to hide that icon."
          />
          <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
            {SOCIAL_FIELDS.map((field) => (
              <Field
                key={field.key}
                label={field.label}
                htmlFor={`social-${field.key}`}
                error={errors[`social.${field.key}`]}
                hint="Full link starting with https://"
              >
                <TextInput
                  id={`social-${field.key}`}
                  type="url"
                  inputMode="url"
                  value={business.social[field.key] ?? ""}
                  onChange={(event) => updateSocial(field.key, event.target.value)}
                  invalid={Boolean(errors[`social.${field.key}`])}
                  placeholder={field.placeholder}
                />
              </Field>
            ))}
          </div>
        </Card>

        <Notice>
          These details also feed the website's structured data, which helps Google show your phone
          number, address and opening hours in search results. The format is fixed and safe.
        </Notice>
      </div>

      <FormActions hint={dirty ? "You have unsaved changes." : "Everything is saved."}>
        <Button
          type="button"
          variant="secondary"
          disabled={!dirty || saving}
          onClick={() => {
            if (!snapshot) return;
            const parsed = JSON.parse(snapshot) as BusinessDetails;
            setBusiness({ ...parsed, hours: orderedHours(parsed.hours) });
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
