import { GOOGLE_REVIEWS_URL, REVIEWS, type Review } from "../data";
import { Star, StarRow } from "./Icons";
import Reveal from "./Reveal";
import { SectionHeading } from "./ui";
import { cn } from "../utils/cn";

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="mx-3 flex w-[19rem] shrink-0 flex-col border border-ink/10 bg-ivory p-6 shadow-[0_16px_30px_-24px_rgba(19,40,30,0.4)] transition-colors duration-300 hover:border-gold/50 sm:w-[23rem]">
      <StarRow className="text-gold" />
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/75">
        “{review.text}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-dashed border-ink/15 pt-4">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-forest font-display text-lg font-semibold text-gold-soft">
          {review.name.charAt(0)}
        </span>
        <span>
          <span className="block text-sm font-bold text-forest-deep">{review.name}</span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-clay">
            Google review
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

function Row({ reviews, reverse = false }: { reviews: Review[]; reverse?: boolean }) {
  const run = (
    <div className={cn("marquee-track", reverse && "reverse")}>
      <div className="flex shrink-0">
        {reviews.map((r) => (
          <ReviewCard key={r.name + r.text.slice(0, 12)} review={r} />
        ))}
      </div>
      <div className="flex shrink-0" aria-hidden="true">
        {reviews.map((r) => (
          <ReviewCard key={r.name + "dup"} review={r} />
        ))}
      </div>
    </div>
  );
  return <div className="marquee-viewport overflow-hidden py-1.5">{run}</div>;
}

export default function Reviews() {
  const rowA = REVIEWS.slice(0, 4);
  const rowB = REVIEWS.slice(4, 8);

  return (
    <section
      className="relative overflow-hidden border-y border-gold/20 bg-cream py-20 lg:py-28"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <div>
              <SectionHeading eyebrow="Word of Mouth" title="Thai Massage Fulham Reviews" />
              <div className="mt-6 flex items-center gap-5">
                <span className="flex items-center gap-2 font-display text-6xl font-semibold text-forest-deep">
                  4.9
                  <Star className="h-8 w-8 text-gold" />
                </span>
                <span className="text-sm leading-snug text-ink/60">
                  <strong className="block text-forest-deep">4.9 average rating</strong>
                  across 60+ verified
                  <br />
                  Google reviews
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="flex flex-wrap gap-4">
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-forest bg-forest px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-ivory transition-all duration-300 hover:bg-gold hover:text-forest-deep"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 2 14.6 4.9 12 12h5.4l1.8-4.8L23 12l-4.2 4.8-1.8-4.8H12c0 3.5 1.7 6.6 4.4 8.6l-2 2.2A11.5 11.5 0 0 1 12 2Z"
                  />
                </svg>
                Read Our Google Reviews
              </a>
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-gold/60 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-forest transition-all duration-300 hover:border-gold hover:bg-gold/10"
              >
                <StarRow />
                Leave Us a Review
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={200} className="mt-12 space-y-0">
        <Row reviews={rowA} />
        <Row reviews={rowB} reverse />
      </Reveal>

      <p className="mt-10 text-center text-xs font-semibold uppercase tracking-[0.24em] text-clay">
        Every review above is from a real Google reviewer
      </p>
    </section>
  );
}
