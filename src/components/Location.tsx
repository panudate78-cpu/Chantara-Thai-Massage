import { ADDRESS_LINES, HOURS, MAP_DIRECTIONS_URL, MAP_EMBED_SRC } from "../data";
import { Car, Clock, Pin, Train } from "./Icons";
import Reveal from "./Reveal";
import { SectionHeading } from "./ui";
import { cn } from "../utils/cn";

/** JS day: 0=Sunday … our list starts Monday */
const TODAY_INDEX = (new Date().getDay() + 6) % 7;

export default function Location() {
  return (
    <section id="location" className="pattern-dots bg-cream py-20 lg:py-28" aria-labelledby="location-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow="Find Us in Fulham SW6" title="Thai Massage near Fulham Broadway — Location & Hours" />
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/65">
            Visit Chantara Thai Massage at 39 Harwood Road, Fulham, London SW6 4QP — a short walk from
            Fulham Broadway station. Open seven days a week for traditional Thai massage and therapeutic treatments.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* map */}
          <Reveal className="h-full">
            <div className="relative h-full min-h-[24rem] overflow-hidden border border-ink/15 bg-parchment shadow-[0_26px_50px_-30px_rgba(19,40,30,0.4)]">
              <iframe
                title="Map — Chantara Thai Massage, 39 Harwood Road, Fulham, London SW6 4QP"
                src={MAP_EMBED_SRC}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
                <span className="pointer-events-auto -mt-4 border border-gold/40 bg-forest-deep px-5 py-3 shadow-lg">
                  <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-cream">
                    <Pin className="h-4 w-4 text-gold-soft" />
                    39 Harwood Road, Fulham
                  </span>
                </span>
              </div>
            </div>
          </Reveal>

          {/* details */}
          <div className="flex flex-col gap-6">
            <Reveal delay={100}>
              <div className="border border-ink/10 bg-ivory p-7">
                <h3 className="flex items-center gap-3 font-display text-2xl font-semibold text-forest-deep">
                  <Pin className="h-5 w-5 text-gold" />
                  Address & Directions
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink/75">
                  {ADDRESS_LINES.join(", ")}
                  <br />
                  <span className="text-ink/55">
                    Tucked off Harwood Road, moments from Fulham Broadway station.
                  </span>
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={MAP_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-forest px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ivory transition-colors duration-300 hover:bg-gold hover:text-forest-deep"
                  >
                    <Pin className="h-3.5 w-3.5" />
                    Get Directions
                  </a>
                  <a
                    href={MAP_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-ink/20 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/70 transition-colors duration-300 hover:border-gold hover:text-gold"
                  >
                    Open in Maps
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="border border-ink/10 bg-ivory p-6">
                  <h3 className="flex items-center gap-3 font-display text-xl font-semibold text-forest-deep">
                    <Train className="h-5 w-5 text-gold" />
                    Getting Here
                  </h3>
                  <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink/70">
                    <li className="flex gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                      Fulham Broadway station (District line) — a 3-minute walk
                    </li>
                    <li className="flex gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                      Frequent bus stops along Fulham Road
                    </li>
                  </ul>
                </div>

                <div className="border border-ink/10 bg-ivory p-6">
                  <h3 className="flex items-center gap-3 font-display text-xl font-semibold text-forest-deep">
                    <Car className="h-5 w-5 text-gold" />
                    Parking
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-ink/70">
                    Parking is available at Fulham Broadway Station MSCP, as well as paid on-street
                    parking locally.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <div className="border border-ink/10 bg-ivory p-7">
                <h3 className="flex items-center gap-3 font-display text-2xl font-semibold text-forest-deep">
                  <Clock className="h-5 w-5 text-gold" />
                  Opening Hours
                </h3>
                <ul className="mt-4 divide-y divide-dashed divide-ink/15 text-sm">
                  {HOURS.map((h, i) => {
                    const today = i === TODAY_INDEX;
                    return (
                      <li key={h.day} className="flex items-center gap-3 py-2">
                        <span className={cn("flex-1 font-semibold", today ? "text-forest-deep" : "text-ink/70")}>
                          {h.day}
                          {today && (
                            <span className="ml-3 bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                              Today
                            </span>
                          )}
                        </span>
                        <span className="price-leader" aria-hidden="true" />
                        <span className={cn("tabular-nums", today ? "font-bold text-forest-deep" : "text-ink/70")}>
                          {h.open} – {h.close}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 border-t border-ink/10 pt-4 text-xs font-semibold uppercase tracking-[0.2em] text-clay">
                  Open 7 days a week · last appointment before close
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
