import { useContent } from "../content/ContentContext";
import { BookButton, SectionHeading } from "./ui";
import Reveal from "./Reveal";
import { Sparkle } from "./Icons";

function formatDate(value: string): string {
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * Only rendered when the business owner has at least one live, enabled offer,
 * so the site looks exactly as before until an offer is published.
 */
export default function Offers() {
  const { offers } = useContent();
  if (!offers.length) return null;

  return (
    <section
      id="offers"
      className="relative border-t border-gold/20 bg-cream py-16 lg:py-20"
      aria-labelledby="offers-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Limited Time" title="Offers & Promotions" />
            <p className="max-w-sm border-l-2 border-gold/60 pl-4 text-sm leading-relaxed text-ink/60">
              A little extra calm for less. Mention the offer when you call, or book online and
              we'll apply it to your visit.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {offers.map((offer, index) => (
            <Reveal key={offer.id} delay={index * 90} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden border border-gold/40 bg-forest-deep p-8 text-ivory shadow-[0_26px_50px_-32px_rgba(19,40,30,0.55)] sm:p-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />
                {offer.badge && (
                  <span className="inline-flex w-fit items-center gap-2 bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-forest-deep">
                    <Sparkle className="h-3 w-3" />
                    {offer.badge}
                  </span>
                )}
                <h3 className="mt-5 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                  {offer.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-cream/70 sm:text-[15px]">
                  {offer.description}
                </p>
                <div className="mt-7 flex flex-col gap-4 border-t border-ivory/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cream/55">
                    Available until {formatDate(offer.endsOn)}
                  </p>
                  <BookButton label="Book this offer" size="sm" variant="gold" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
