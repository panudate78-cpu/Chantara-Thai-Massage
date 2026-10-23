import { useEffect, useState, type FormEvent } from "react";
import type { TreatmentContent } from "../../../cms/shared/types";
import { LIMITS } from "../../../cms/shared/limits";
import { api, ApiRequestError } from "../lib/api";
import { priceSummary } from "../lib/format";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  Modal,
  PageHeader,
  PageLoader,
  TextInput,
  Textarea,
  useToast,
} from "../ui";
import {
  ArchiveIcon,
  CheckIcon,
  LockIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "../icons";

type PriceDraft = { minutes: string; price: string };

function toDrafts(treatment: TreatmentContent | null): PriceDraft[] {
  if (!treatment?.prices.length) return [{ minutes: "60", price: "60" }];
  return treatment.prices.map((price) => ({
    minutes: String(price.minutes),
    price: String(price.price),
  }));
}

function TreatmentForm({
  treatment,
  onClose,
  onSaved,
}: {
  treatment: TreatmentContent | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [title, setTitle] = useState(treatment?.title ?? "");
  const [tag, setTag] = useState(treatment?.tag ?? "");
  const [description, setDescription] = useState(treatment?.description ?? "");
  const [prices, setPrices] = useState<PriceDraft[]>(toDrafts(treatment));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const setPrice = (index: number, patch: Partial<PriceDraft>) => {
    setPrices((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
    setErrors((current) => {
      const next = { ...current };
      delete next[`prices.${index}.minutes`];
      delete next[`prices.${index}.price`];
      delete next.prices;
      return next;
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    const payload = {
      title,
      tag: tag.trim() || null,
      description,
      prices: prices.map((row) => ({
        minutes: Number(row.minutes),
        price: Number(row.price),
      })),
    };

    try {
      if (treatment) {
        await api.updateTreatment(treatment.id, payload);
        onSaved(`“${title.trim()}” has been updated.`);
      } else {
        await api.createTreatment(payload);
        onSaved(`“${title.trim()}” is now on your website.`);
      }
      onClose();
    } catch (caught) {
      if (caught instanceof ApiRequestError) {
        setErrors(caught.fields);
        toast.error(caught.message);
      } else {
        toast.error("We couldn't save this treatment. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id="treatment-form" onSubmit={submit} noValidate>
      <fieldset disabled={saving} className="min-w-0 space-y-4">
        {treatment ? (
          <div className="flex items-start gap-2 rounded-lg border border-[#e7dec9] bg-white px-3.5 py-2.5 text-[12.5px] text-ink/55">
            <LockIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
            <p>
              Website link: <span className="font-semibold text-forest">/#treatment-{treatment.slug}</span>.
              This is locked to protect your search rankings.
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-lg border border-[#e7dec9] bg-white px-3.5 py-2.5 text-[12.5px] text-ink/55">
            <LockIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
            <p>A safe website link will be created automatically from the name.</p>
          </div>
        )}

        <Field label="Treatment name" htmlFor="treatment-title" required error={errors.title}>
          <TextInput
            id="treatment-title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setErrors((current) => ({ ...current, title: "" }));
            }}
            maxLength={LIMITS.treatmentTitle}
            invalid={Boolean(errors.title)}
            placeholder="e.g. Traditional Thai Massage"
          />
        </Field>

        <Field
          label="Small badge (optional)"
          htmlFor="treatment-tag"
          error={errors.tag}
          hint="A short label such as “Most Loved”. Leave empty for none."
        >
          <TextInput
            id="treatment-tag"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            maxLength={LIMITS.treatmentTag}
            invalid={Boolean(errors.tag)}
          />
        </Field>

        <Field
          label="Description"
          htmlFor="treatment-description"
          required
          error={errors.description}
          hint="Explain what the treatment involves and who it helps."
        >
          <Textarea
            id="treatment-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={LIMITS.treatmentDescription}
            invalid={Boolean(errors.description)}
            rows={5}
          />
        </Field>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-forest-deep">
              Durations & prices <span className="text-gold-deep">*</span>
            </p>
            <span className="text-[12px] text-ink/40">Up to {LIMITS.treatmentPrices}</span>
          </div>
          <div className="space-y-2.5">
            {prices.map((row, index) => (
              <div key={index} className="rounded-lg border border-[#e7dec9] bg-white p-3">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="w-24">
                    <label
                      htmlFor={`price-minutes-${index}`}
                      className="mb-1 block text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink/45"
                    >
                      Minutes
                    </label>
                    <TextInput
                      id={`price-minutes-${index}`}
                      type="number"
                      inputMode="numeric"
                      min={5}
                      max={480}
                      step={5}
                      value={row.minutes}
                      onChange={(event) => setPrice(index, { minutes: event.target.value })}
                      invalid={Boolean(errors[`prices.${index}.minutes`])}
                      className="py-2"
                    />
                  </div>
                  <div className="w-28">
                    <label
                      htmlFor={`price-amount-${index}`}
                      className="mb-1 block text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink/45"
                    >
                      Price (£)
                    </label>
                    <TextInput
                      id={`price-amount-${index}`}
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={1}
                      value={row.price}
                      onChange={(event) => setPrice(index, { price: event.target.value })}
                      invalid={Boolean(errors[`prices.${index}.price`])}
                      className="py-2"
                    />
                  </div>
                  {prices.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPrices((current) => current.filter((_, i) => i !== index))}
                      className="mb-0.5 text-ink/45 hover:text-red-700"
                      aria-label={`Remove ${row.minutes} minute price`}
                    >
                      <TrashIcon className="h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
                {errors[`prices.${index}.minutes`] && (
                  <p className="mt-1.5 text-[12.5px] font-semibold text-red-700">
                    {errors[`prices.${index}.minutes`]}
                  </p>
                )}
                {errors[`prices.${index}.price`] && (
                  <p className="mt-1.5 text-[12.5px] font-semibold text-red-700">
                    {errors[`prices.${index}.price`]}
                  </p>
                )}
              </div>
            ))}
          </div>
          {errors.prices && (
            <p className="mt-2 text-[13px] font-semibold text-red-700">{errors.prices}</p>
          )}
          {prices.length < LIMITS.treatmentPrices && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => setPrices((current) => [...current, { minutes: "", price: "" }])}
            >
              <PlusIcon className="h-4 w-4" />
              Add another duration
            </Button>
          )}
        </div>

        <p className="text-[12px] leading-relaxed text-ink/45">
          Treatment photos and alt text are part of the website design and are looked after by
          Launchpad Studio.
        </p>
      </fieldset>
    </form>
  );
}

export default function Treatments() {
  const [treatments, setTreatments] = useState<TreatmentContent[] | null>(null);
  const [editing, setEditing] = useState<TreatmentContent | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirm, setConfirm] = useState<{
    action: "archive" | "restore" | "delete";
    treatment: TreatmentContent;
  } | null>(null);
  const [working, setWorking] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const toast = useToast();

  const load = () =>
    api
      .treatments()
      .then(({ treatments: list }) => setTreatments(list))
      .catch(() => toast.error("We couldn't load your treatments."));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!treatments) return <PageLoader label="Loading treatments…" />;

  const live = treatments.filter((treatment) => !treatment.archived);
  const archived = treatments.filter((treatment) => treatment.archived);

  const runConfirmed = async () => {
    if (!confirm) return;
    setWorking(true);
    try {
      if (confirm.action === "delete") {
        await api.deleteTreatment(confirm.treatment.id);
        setTreatments((current) =>
          current ? current.filter((item) => item.id !== confirm.treatment.id) : current
        );
        toast.success(`“${confirm.treatment.title}” was removed permanently.`);
      } else {
        const { treatments: updated } = await api.archiveTreatment(
          confirm.treatment.id,
          confirm.action === "archive"
        );
        setTreatments(updated);
        toast.success(
          confirm.action === "archive"
            ? `“${confirm.treatment.title}” is now hidden from your website.`
            : `“${confirm.treatment.title}” is back on your website.`
        );
      }
      setConfirm(null);
    } catch {
      toast.error("That change couldn't be saved. Please try again.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Your menu"
        title="Treatments & prices"
        description="Add new treatments, adjust durations and prices, or archive something you no longer offer. Archived treatments stay saved but disappear from the website."
        actions={
          <Button onClick={() => setCreating(true)}>
            <PlusIcon className="h-4 w-4" />
            Add treatment
          </Button>
        }
      />

      {live.length === 0 ? (
        <EmptyState
          icon={<CheckIcon className="h-5 w-5" />}
          title="No treatments on the website yet"
          description="Add your first treatment to show it on the website straight away."
          action={<Button onClick={() => setCreating(true)}>Add treatment</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {live.map((treatment) => (
            <Card as="li" key={treatment.id} className="overflow-hidden">
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                <img
                  src={treatment.imageUrl ?? ""}
                  alt=""
                  className="h-16 w-20 shrink-0 rounded-lg bg-cream object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-semibold leading-tight text-forest-deep">
                      {treatment.title}
                    </h2>
                    {treatment.tag && <Badge tone="gold">{treatment.tag}</Badge>}
                  </div>
                  <p className="mt-1 truncate text-[13px] text-ink/55">{priceSummary(treatment.prices)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setEditing(treatment)}>
                    <PencilIcon className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirm({ action: "archive", treatment })}
                  >
                    <ArchiveIcon className="h-4 w-4" />
                    Archive
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </ul>
      )}

      {archived.length > 0 && (
        <section className="mt-8">
          <button
            type="button"
            onClick={() => setShowArchived((value) => !value)}
            aria-expanded={showArchived}
            className="flex w-full items-center justify-between rounded-lg border border-[#e7dec9] bg-[#fbf8f0] px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold text-forest-deep">
              Archived treatments ({archived.length})
            </span>
            <span className="text-[12px] text-ink/45">{showArchived ? "Hide" : "Show"}</span>
          </button>

          {showArchived && (
            <ul className="mt-3 space-y-2">
              {archived.map((treatment) => (
                <li
                  key={treatment.id}
                  className="flex flex-col gap-3 rounded-xl border border-[#e7dec9] bg-white/70 px-4 py-3 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink/60">{treatment.title}</p>
                    <p className="text-[12px] text-ink/40">
                      Hidden from the website · {priceSummary(treatment.prices)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setConfirm({ action: "restore", treatment })}
                    >
                      Restore
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setConfirm({ action: "delete", treatment })}
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[12px] leading-relaxed text-ink/40">
            Deleting is permanent. Archive a treatment instead if it might come back.
          </p>
        </section>
      )}

      <Modal
        open={creating || Boolean(editing)}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={editing ? "Edit treatment" : "Add a treatment"}
        description={
          editing
            ? "Update the name, description or prices. Changes appear on the website immediately."
            : "It will appear in your treatment menu as soon as you save."
        }
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="treatment-form">
              {editing ? "Save changes" : "Add treatment"}
            </Button>
          </>
        }
      >
        <TreatmentForm
          key={editing?.id ?? "new"}
          treatment={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={(message) => {
            toast.success(message);
            load();
          }}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        title={
          confirm?.action === "delete"
            ? "Delete this treatment?"
            : confirm?.action === "archive"
              ? "Archive this treatment?"
              : "Restore this treatment?"
        }
        description={
          confirm?.action === "delete"
            ? `“${confirm.treatment.title}” will be removed permanently. This cannot be undone.`
            : confirm?.action === "archive"
              ? `“${confirm.treatment.title}” will disappear from your website. You can restore it at any time.`
              : `“${confirm?.treatment.title}” will be visible on your website again.`
        }
        confirmLabel={
          confirm?.action === "delete"
            ? "Delete permanently"
            : confirm?.action === "archive"
              ? "Archive treatment"
              : "Restore treatment"
        }
        tone={confirm?.action === "delete" ? "danger" : "default"}
        loading={working}
        onConfirm={runConfirmed}
      />
    </div>
  );
}
