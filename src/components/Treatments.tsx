import { COMBOS, DEFAULT_TREATMENT_IMAGE, type Combo, type PricePoint, type TreatmentContent } from "../data";
import { useContent } from "../content/ContentContext";
import Reveal from "./Reveal";
import { BookButton, SectionHeading } from "./ui";

function PriceRow({ point, dark = false }: { point: PricePoint; dark?: boolean }) {
  return (
    <li className="flex items-baseline text-sm">
      <span className={dark ? "font-semibold text-cream/85" : "font-semibold text-ink/75"}>
        {point.minutes} mins
      </span>
      <span className="price-leader" aria-hidden="true" />
      <span className={dark ? "font-display text-lg font-semibold text-gold-soft" : "font-display text-lg font-semibold text-forest"}>
        £{point.price}
      </span>
    </li>
  );
}

function TreatmentCard({ treatment, index }: { treatment: TreatmentContent; index: number }) {
  return (
    <Reveal delay={(index % 3) * 110} className="h-full">
      <article
        id={`treatment-${treatment.slug}`}
        className="group flex h-full flex-col border border-ink/10 bg-ivory transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_26px_50px_-28px_rgba(19,40,30,0.4)]"
      >
        <div className="relative overflow-hidden">
          <img
            src={treatment.imageUrl ?? DEFAULT_TREATMENT_IMAGE}
            alt={treatment.imageAlt ?? `${treatment.title} at Chantara Thai Massage, Fulham, London`}
            loading="lazy"
            width={940}
            height={650}
            decoding="async"
            className="h-44 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-deep/40 via-transparent to-transparent" />
          {treatment.tag && (
            <span className="absolute left-4 top-4 bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-forest-deep">
              {treatment.tag}
            </span>
          )}
          <span className="absolute bottom-3 right-4 font-display text-4xl font-semibold text-ivory/25">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-[1.65rem] font-semibold leading-tight text-forest-deep">
            {treatment.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">{treatment.description}</p>

          <ul className="mt-5 space-y-1.5 border-t border-dashed border-ink/20 pt-4">
            {treatment.prices.map((p) => (
              <PriceRow key={p.minutes} point={p} />
            ))}
          </ul>

          <BookButton label="Book Now" className="mt-5 w-full" />
        </div>
      </article>
    </Reveal>
  );
}

function ComboRow({ combo, index }: { combo: Combo; index: number }) {
  return (
    <Reveal delay={index * 90}>
      <div className="group border border-ivory/15 bg-forest p-6 transition-colors duration-300 hover:border-gold-soft/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-[1.45rem] font-semibold text-ivory">{combo.title}</h3>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-cream/70">{combo.description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-6">
            <ul className="w-36 space-y-1 text-cream sm:w-40">
              {combo.prices.map((p) => (
                <PriceRow key={p.minutes} point={p} dark />
              ))}
            </ul>
            <BookButton label="Book Now" size="sm" variant="gold" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Treatments() {
  const { treatments } = useContent();

  return (
    <section id="treatments" className="pattern-dots relative bg-cream py-20 lg:py-28" aria-labelledby="treatments-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Our Menu" title="Thai Massage Treatments & Prices in Fulham" />
            <p className="max-w-sm border-l-2 border-gold/60 pl-4 text-sm leading-relaxed text-ink/60">
              Authentic Thai massage, deep tissue, Swedish, hot stone and reflexology near Fulham
              Broadway. Book online via Picktime — a £10 deposit secures your slot and is deducted
              from your total. Prices in GBP.
            </p>
          </div>
        </Reveal>

        {/* main treatments */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {treatments.map((t, i) => (
            <TreatmentCard key={t.id} treatment={t} index={i} />
          ))}

        </div>

        {/* ladies' day promotion — centred full-width band */}
        <Reveal delay={220} className="mt-10">
          <article className="mx-auto flex max-w-3xl flex-col items-center border border-gold/50 bg-forest-deep px-8 py-12 text-center text-ivory sm:px-14">
            <span className="inline-block bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-forest-deep">
              Every Thursday
            </span>
            <h3 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Ladies' <span className="italic text-gold-soft">Day</span>
            </h3>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream/70 sm:text-base">
              A 60-minute massage of your choice for <strong className="text-gold-soft">£50</strong> —
              your weekly moment of calm. Excludes Hot Stone.
            </p>
            <p className="mt-5 font-display text-5xl font-semibold text-gold-soft">£50</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-cream/55">
              60 minutes · Thursdays
            </p>
            <BookButton label="Book Ladies' Day" variant="gold" className="mt-8" />
          </article>
        </Reveal>

        {/* combos & couples */}
        <Reveal className="mt-16">
          <h3 className="flex items-center gap-4 font-display text-3xl font-medium text-forest-deep">
            Combos & Couples
            <span className="h-px flex-1 bg-ink/15" aria-hidden="true" />
            <span className="hidden text-[11px] font-sans font-bold uppercase tracking-[0.28em] text-gold-deep sm:block">
              Better together
            </span>
          </h3>
        </Reveal>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {COMBOS.map((c, i) => (
            <ComboRow key={c.id} combo={c} index={i} />
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-10 text-center text-sm text-ink/55">
            Not sure which treatment suits you?{" "}
            <a href="#contact" className="font-bold text-forest underline decoration-gold underline-offset-4 transition-colors hover:text-gold">
              Call or email us
            </a>{" "}
            — we'll guide you to the right one.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
