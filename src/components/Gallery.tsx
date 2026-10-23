import { useContent } from "../content/ContentContext";
import Reveal from "./Reveal";
import { SectionHeading } from "./ui";

/**
 * Only rendered once the owner uploads photos, so the launch design is
 * unchanged. Each image is served as WebP at 480/960/1600px with a JPEG
 * fallback, all generated automatically at upload time.
 */
export default function Gallery() {
  const { gallery } = useContent();
  if (!gallery.length) return null;

  return (
    <section
      id="gallery"
      className="relative bg-cream py-20 lg:py-24"
      aria-labelledby="gallery-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Inside Chantara" title="Our Treatment Rooms" />
            <p className="max-w-sm border-l-2 border-gold/60 pl-4 text-sm leading-relaxed text-ink/60">
              Calm, private rooms a few steps from Fulham Broadway — a quiet corner of SW6 to slow
              down and reset.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((photo, index) => (
            <Reveal key={photo.id} delay={(index % 3) * 90} className="h-full">
              <figure className="group relative h-full overflow-hidden border border-ink/10 bg-ivory">
                <picture>
                  {photo.sources.length > 0 && (
                    <source
                      type="image/webp"
                      srcSet={photo.sources.map((source) => `${source.url} ${source.width}w`).join(", ")}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  )}
                  <img
                    src={photo.fallbackUrl ?? photo.sources[0]?.url}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    width={photo.width}
                    height={photo.height}
                    className="h-64 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </picture>
                {photo.caption && (
                  <figcaption className="border-t border-ink/10 px-5 py-4 text-sm leading-relaxed text-ink/65">
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
