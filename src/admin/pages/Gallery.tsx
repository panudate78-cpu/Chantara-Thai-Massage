import { useEffect, useRef, useState, type FormEvent } from "react";
import { LIMITS } from "../../../cms/shared/limits";
import { api, ApiRequestError, type GalleryRecord } from "../lib/api";
import { ImagePrepareError, prepareImage, type PreparedImage } from "../lib/images";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  Modal,
  PageHeader,
  PageLoader,
  TextInput,
  useToast,
} from "../ui";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ImageIcon,
  PencilIcon,
  TrashIcon,
  UploadIcon,
} from "../icons";

type PendingUpload = {
  prepared: PreparedImage;
  fileName: string;
  alt: string;
  caption: string;
  error?: string;
};

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryRecord[] | null>(null);
  const [upload, setUpload] = useState<PendingUpload | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<GalleryRecord | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<GalleryRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const load = () =>
    api
      .gallery()
      .then(({ photos: list }) => setPhotos(list))
      .catch(() => toast.error("We couldn't load your photos."));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const previewUrl = upload?.prepared.previewUrl ?? null;

  useEffect(() => {
    if (!previewUrl) return;
    // Only revoke when the chosen file changes (not on every keystroke).
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  if (!photos) return <PageLoader label="Loading photos…" />;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setPreparing(true);
    try {
      const prepared = await prepareImage(file);
      setUpload({ prepared, fileName: file.name, alt: "", caption: "" });
    } catch (caught) {
      toast.error(
        caught instanceof ImagePrepareError
          ? caught.message
          : "That photo couldn't be prepared. Please try another file."
      );
    } finally {
      setPreparing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const closeUpload = () => {
    if (upload?.prepared.previewUrl) URL.revokeObjectURL(upload.prepared.previewUrl);
    setUpload(null);
  };

  const submitUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!upload) return;
    if (upload.alt.trim().length < LIMITS.galleryAltMin) {
      setUpload({
        ...upload,
        error: `Describe the photo in at least ${LIMITS.galleryAltMin} characters — this is read aloud by screen readers and used by Google.`,
      });
      return;
    }

    const approximateBytes = upload.prepared.variants.reduce(
      (total, variant) => total + Math.round(variant.data.length * 0.75),
      0
    );
    if (approximateBytes > 4_500_000) {
      setUpload({ ...upload, error: "That photo is too large once optimised. Please choose a smaller file." });
      return;
    }

    setUploading(true);
    try {
      const { photos: updated } = await api.uploadPhoto({
        alt: upload.alt.trim(),
        caption: upload.caption.trim() || null,
        width: upload.prepared.width,
        height: upload.prepared.height,
        variants: upload.prepared.variants,
      });
      setPhotos(updated);
      toast.success("Photo added and optimised for the website.");
      closeUpload();
    } catch (caught) {
      setUpload({
        ...upload,
        error:
          caught instanceof ApiRequestError
            ? caught.message
            : "The upload didn't complete. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    if (!photos || reordering) return;
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;
    const next = [...photos];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setPhotos(next);
    setReordering(true);
    try {
      const { photos: saved } = await api.reorderGallery(next.map((photo) => photo.id));
      setPhotos(saved);
    } catch {
      toast.error("The new order couldn't be saved. Please try again.");
      load();
    } finally {
      setReordering(false);
    }
  };

  const openEdit = (photo: GalleryRecord) => {
    setEditing(photo);
    setEditAlt(photo.alt);
    setEditCaption(photo.caption ?? "");
    setEditError(null);
  };

  const saveEdit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    if (editAlt.trim().length < LIMITS.galleryAltMin) {
      setEditError(`Describe the photo in at least ${LIMITS.galleryAltMin} characters.`);
      return;
    }
    setSavingEdit(true);
    try {
      const { photos: updated } = await api.updatePhoto(editing.id, {
        alt: editAlt.trim(),
        caption: editCaption.trim() || null,
      });
      setPhotos(updated);
      setEditing(null);
      toast.success("Photo description updated.");
    } catch (caught) {
      setEditError(
        caught instanceof ApiRequestError ? caught.message : "We couldn't save that change."
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const remove = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await api.deletePhoto(confirmDelete.id);
      setPhotos((current) => current?.filter((photo) => photo.id !== confirmDelete.id) ?? current);
      toast.success("Photo removed from the gallery.");
      setConfirmDelete(null);
    } catch {
      toast.error("We couldn't remove that photo. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Your space"
        title="Gallery photos"
        description="Upload photos of your treatment rooms. Each one is automatically resized for phones, tablets and large screens — and alt text is required so everyone can access your site."
        actions={
          <Button onClick={() => fileInputRef.current?.click()} loading={preparing}>
            <UploadIcon className="h-4 w-4" />
            Upload photo
          </Button>
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => handleFile(event.target.files?.[0])}
        aria-label="Choose a photo to upload"
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFile(event.dataTransfer.files?.[0]);
        }}
        className={
          dragging
            ? "rounded-xl border-2 border-dashed border-gold bg-gold/[0.06] px-6 py-8 text-center transition-colors"
            : "rounded-xl border-2 border-dashed border-[#ded4bf] bg-white/50 px-6 py-8 text-center transition-colors"
        }
      >
        <div className="mx-auto max-w-md">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-cream text-forest">
            <UploadIcon className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-forest-deep">
            Drag a photo here, or{" "}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-forest underline decoration-gold/60 underline-offset-4 hover:text-gold-deep"
            >
              choose a file
            </button>
          </p>
          <p className="mt-1.5 text-[12.5px] text-ink/50">
            JPEG, PNG or WebP · up to 12 MB · we create the optimised sizes for you
          </p>
        </div>
      </div>

      <div className="mt-8">
        {photos.length === 0 ? (
          <EmptyState
            icon={<ImageIcon className="h-5 w-5" />}
            title="Your gallery is empty"
            description="Add a few photos of the treatment rooms to show visitors what to expect. The gallery section appears on your website once the first photo is added."
          />
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/45">
                {photos.length} photo{photos.length === 1 ? "" : "s"} · drag order with the arrows
              </h2>
              {reordering && <span className="text-[12px] text-ink/40">Saving order…</span>}
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo, index) => {
                const src = photo.fallbackUrl ?? photo.sources[0]?.url;
                return (
                  <Card as="li" key={photo.id} className="overflow-hidden">
                    {src && (
                      <img
                        src={src}
                        alt={photo.alt}
                        className="h-44 w-full bg-cream object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">
                        Alt text
                      </p>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink/70">{photo.alt}</p>
                      {photo.caption && (
                        <p className="mt-1.5 line-clamp-1 text-[12px] italic text-ink/45">
                          {photo.caption}
                        </p>
                      )}
                      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#f0e9da] pt-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Move photo earlier"
                            onClick={() => move(index, -1)}
                            disabled={index === 0 || reordering}
                            className="px-2"
                          >
                            <ArrowUpIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Move photo later"
                            onClick={() => move(index, 1)}
                            disabled={index === photos.length - 1 || reordering}
                            className="px-2"
                          >
                            <ArrowDownIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(photo)}>
                            <PencilIcon className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDelete(photo)}
                            aria-label="Delete photo"
                            className="px-2 text-ink/45 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </ul>
          </>
        )}
      </div>

      <Modal
        open={Boolean(upload)}
        onClose={closeUpload}
        title="Add this photo?"
        description="Write a short description first — it's required for accessibility and image SEO."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={closeUpload} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" form="photo-upload-form" loading={uploading}>
              Add to gallery
            </Button>
          </>
        }
      >
        {upload && (
          <form id="photo-upload-form" onSubmit={submitUpload} className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <img
                src={upload.prepared.previewUrl}
                alt=""
                className="h-40 w-full rounded-lg bg-cream object-cover sm:h-32 sm:w-44"
              />
              <div className="min-w-0 flex-1 text-[12.5px] leading-relaxed text-ink/55">
                <p className="truncate font-semibold text-forest-deep">{upload.fileName}</p>
                <p className="mt-1">
                  {upload.prepared.width} × {upload.prepared.height}px
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Optimised sizes ready (480 / 960 / 1600px)
                </p>
              </div>
            </div>

            <Field
              label="Alt text"
              htmlFor="photo-alt"
              required
              error={upload.error}
              hint="Describe what's in the photo, e.g. “Calm treatment room with a massage table and soft lighting”."
            >
              <TextInput
                id="photo-alt"
                value={upload.alt}
                maxLength={LIMITS.galleryAlt}
                onChange={(event) => setUpload({ ...upload, alt: event.target.value, error: undefined })}
                invalid={Boolean(upload.error)}
                autoFocus
              />
            </Field>

            <Field
              label="Caption (optional)"
              htmlFor="photo-caption"
              hint="A short line shown under the photo on the website."
            >
              <TextInput
                id="photo-caption"
                value={upload.caption}
                maxLength={LIMITS.galleryCaption}
                onChange={(event) => setUpload({ ...upload, caption: event.target.value })}
              />
            </Field>
          </form>
        )}
      </Modal>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit photo details"
        description="Alt text is read aloud by screen readers and helps Google understand the image."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)} disabled={savingEdit}>
              Cancel
            </Button>
            <Button type="submit" form="photo-edit-form" loading={savingEdit}>
              Save changes
            </Button>
          </>
        }
      >
        {editing && (
          <form id="photo-edit-form" onSubmit={saveEdit} className="space-y-4">
            {(() => {
              const src = editing.fallbackUrl ?? editing.sources[0]?.url;
              return src ? (
                <img
                  src={src}
                  alt=""
                  className="h-40 w-full rounded-lg bg-cream object-cover"
                />
              ) : null;
            })()}
            <Field label="Alt text" htmlFor="edit-alt" required error={editError ?? undefined}>
              <TextInput
                id="edit-alt"
                value={editAlt}
                maxLength={LIMITS.galleryAlt}
                onChange={(event) => {
                  setEditAlt(event.target.value);
                  setEditError(null);
                }}
                invalid={Boolean(editError)}
              />
            </Field>
            <Field label="Caption (optional)" htmlFor="edit-caption">
              <TextInput
                id="edit-caption"
                value={editCaption}
                maxLength={LIMITS.galleryCaption}
                onChange={(event) => setEditCaption(event.target.value)}
              />
            </Field>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete this photo?"
        description="It will be removed from the gallery and its image files deleted. This cannot be undone."
        confirmLabel="Delete photo"
        tone="danger"
        loading={deleting}
        onConfirm={remove}
      />
    </div>
  );
}
