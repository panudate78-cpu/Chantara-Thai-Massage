import { useEffect, useState, type FormEvent } from "react";
import type { OfferContent } from "../../../cms/shared/types";
import { LIMITS } from "../../../cms/shared/limits";
import { api, ApiRequestError } from "../lib/api";
import { formatDateLong, offerStatus, todayIso } from "../lib/format";
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
  Toggle,
  useToast,
} from "../ui";
import { PencilIcon, PlusIcon, SparkleIcon, TrashIcon } from "../icons";

function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function OfferForm({
  offer,
  onClose,
  onSaved,
}: {
  offer: OfferContent | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const today = todayIso();
  const [title, setTitle] = useState(offer?.title ?? "");
  const [badge, setBadge] = useState(offer?.badge ?? "");
  const [description, setDescription] = useState(offer?.description ?? "");
  const [startsOn, setStartsOn] = useState(offer?.startsOn ?? today);
  const [endsOn, setEndsOn] = useState(offer?.endsOn ?? addDays(today, 30));
  const [enabled, setEnabled] = useState(offer?.enabled ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload = {
        title,
        description,
        badge: badge.trim() || null,
        startsOn,
        endsOn,
        enabled,
      };
      if (offer) {
        await api.updateOffer(offer.id, payload);
        onSaved(`“${title.trim()}” has been updated.`);
      } else {
        await api.createOffer(payload);
        onSaved(
          enabled
            ? `“${title.trim()}” is scheduled and will appear on your website.`
            : `“${title.trim()}” has been saved as hidden.`
        );
      }
      onClose();
    } catch (caught) {
      if (caught instanceof ApiRequestError) {
        setErrors(caught.fields);
        toast.error(caught.message);
      } else {
        toast.error("We couldn't save this offer. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id="offer-form" onSubmit={submit} noValidate>
      <fieldset disabled={saving} className="min-w-0 space-y-4">
      <Field label="Offer title" htmlFor="offer-title" required error={errors.title}>
        <TextInput
          id="offer-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={LIMITS.offerTitle}
          invalid={Boolean(errors.title)}
          placeholder="e.g. Thursday Ladies' Day"
        />
      </Field>

      <Field
        label="Badge (optional)"
        htmlFor="offer-badge"
        error={errors.badge}
        hint="A short label such as “Most popular” or “New”."
      >
        <TextInput
          id="offer-badge"
          value={badge}
          onChange={(event) => setBadge(event.target.value)}
          maxLength={LIMITS.offerBadge}
          invalid={Boolean(errors.badge)}
        />
      </Field>

      <Field
        label="Description"
        htmlFor="offer-description"
        required
        error={errors.description}
        hint="What's included, the price and any conditions (e.g. excluding Hot Stone)."
      >
        <Textarea
          id="offer-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={LIMITS.offerDescription}
          invalid={Boolean(errors.description)}
          rows={3}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Starts" htmlFor="offer-start" required error={errors.startsOn}>
          <TextInput
            id="offer-start"
            type="date"
            value={startsOn}
            onChange={(event) => setStartsOn(event.target.value)}
            invalid={Boolean(errors.startsOn)}
          />
        </Field>
        <Field
          label="Ends"
          htmlFor="offer-end"
          required
          error={errors.endsOn}
          hint="The offer hides itself automatically after this date."
        >
          <TextInput
            id="offer-end"
            type="date"
            value={endsOn}
            min={startsOn}
            onChange={(event) => setEndsOn(event.target.value)}
            invalid={Boolean(errors.endsOn)}
          />
        </Field>
      </div>

      <div className="rounded-lg border border-[#e7dec9] bg-white px-4 py-3">
        <Toggle
          checked={enabled}
          onChange={setEnabled}
          label="Publish this offer"
          description="Turn off to keep it on file without showing it on the website."
        />
      </div>

      <p className="text-[12px] leading-relaxed text-ink/45">
        Offers appear on the homepage in the site's own style — no design work needed.
      </p>
      </fieldset>
    </form>
  );
}

export default function Offers() {
  const [offers, setOffers] = useState<OfferContent[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<OfferContent | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<OfferContent | null>(null);
  const [working, setWorking] = useState(false);
  const toast = useToast();

  const load = () =>
    api
      .offers()
      .then(({ offers: list }) => setOffers(list))
      .catch(() => toast.error("We couldn't load your offers."));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!offers) return <PageLoader label="Loading offers…" />;

  const toggle = async (offer: OfferContent, enabled: boolean) => {
    try {
      const { offers: updated } = await api.toggleOffer(offer.id, enabled);
      setOffers(updated);
      toast.success(enabled ? `“${offer.title}” is now visible.` : `“${offer.title}” is hidden.`);
    } catch {
      toast.error("That change couldn't be saved. Please try again.");
    }
  };

  const remove = async () => {
    if (!confirmDelete) return;
    setWorking(true);
    try {
      await api.deleteOffer(confirmDelete.id);
      setOffers((current) => (current ? current.filter((offer) => offer.id !== confirmDelete.id) : current));
      toast.success(`“${confirmDelete.title}” was deleted.`);
      setConfirmDelete(null);
    } catch {
      toast.error("We couldn't delete that offer. Please try again.");
    } finally {
      setWorking(false);
    }
  };

  const liveCount = offers.filter((offer) => offerStatus(offer).key === "live").length;

  return (
    <div>
      <PageHeader
        eyebrow="Promotions"
        title="Offers & promotions"
        description="Create an offer, choose when it runs, and switch it off at any time. Live offers appear on your website automatically."
        actions={
          <Button onClick={() => setCreating(true)}>
            <PlusIcon className="h-4 w-4" />
            Create offer
          </Button>
        }
      />

      {offers.length === 0 ? (
        <EmptyState
          icon={<SparkleIcon className="h-5 w-5" />}
          title="No offers yet"
          description="A seasonal offer or a quiet-day promotion is a simple way to bring people in. You can schedule it to start and finish automatically."
          action={<Button onClick={() => setCreating(true)}>Create your first offer</Button>}
        />
      ) : (
        <>
          <p className="mb-3 text-[13px] text-ink/50">
            {liveCount === 0
              ? "No offers are live on the website right now."
              : `${liveCount} offer${liveCount === 1 ? " is" : "s are"} live on the website.`}
          </p>
          <ul className="space-y-3">
            {offers.map((offer) => {
              const status = offerStatus(offer);
              return (
                <Card as="li" key={offer.id} className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-xl font-semibold leading-tight text-forest-deep">
                          {offer.title}
                        </h2>
                        <Badge tone={status.tone}>{status.label}</Badge>
                        {offer.badge && <Badge tone="neutral">{offer.badge}</Badge>}
                      </div>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/60">
                        {offer.description}
                      </p>
                      <p className="mt-2 text-[12px] text-ink/45">
                        {formatDateLong(offer.startsOn)} → {formatDateLong(offer.endsOn)}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => setEditing(offer)}>
                          <PencilIcon className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmDelete(offer)}
                          className="text-ink/50 hover:text-red-700"
                          aria-label={`Delete ${offer.title}`}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-1 w-40">
                        <Toggle
                          checked={offer.enabled}
                          onChange={(enabled) => toggle(offer, enabled)}
                          label={offer.enabled ? "Visible" : "Hidden"}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </ul>
        </>
      )}

      <Modal
        open={creating || Boolean(editing)}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={editing ? "Edit offer" : "Create an offer"}
        description="Set the dates now — it will start and finish on the website by itself."
        size="md"
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
            <Button type="submit" form="offer-form">
              {editing ? "Save changes" : "Create offer"}
            </Button>
          </>
        }
      >
        <OfferForm
          key={editing?.id ?? "new"}
          offer={editing}
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
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete this offer?"
        description={`“${confirmDelete?.title ?? ""}” will be removed from your website and from your saved offers. This cannot be undone.`}
        confirmLabel="Delete offer"
        tone="danger"
        loading={working}
        onConfirm={remove}
      />
    </div>
  );
}
