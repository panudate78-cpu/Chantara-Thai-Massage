import { useState } from "react";
import { TERMS } from "../data";
import { cn } from "../utils/cn";
import { Lotus, Plus } from "./Icons";
import Reveal from "./Reveal";
import { SectionHeading } from "./ui";

export default function Terms() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section id="terms" className="bg-ivory py-20 lg:py-28" aria-labelledby="terms-heading">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* sticky intro */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <Reveal>
              <SectionHeading eyebrow="House Rules" title="Terms of Service & Refund Policy" />
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/70">
                Please take a moment to read through our policies. They keep things calm, fair and
                comfortable for our therapists and every client in the room.
              </p>
              <div className="mt-8 flex items-center gap-4" aria-hidden="true">
                <span className="h-px w-12 bg-gold/60" />
                <Lotus className="h-6 w-7 text-gold" />
                <span className="h-px w-12 bg-gold/60" />
              </div>
              <p className="mt-8 hidden font-display text-xl italic leading-relaxed text-forest/70 lg:block">
                “Respect the room, respect the practice,
                <br />
                and leave a little lighter than you arrived.”
              </p>
            </Reveal>
          </div>
        </div>

        {/* accordion */}
        <div className="lg:col-span-7">
          <Reveal delay={120}>
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {TERMS.map((term, i) => {
                const open = openIndex === i;
                return (
                  <li key={term.title}>
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenIndex(open ? -1 : i)}
                        aria-expanded={open}
                        className="group flex w-full items-center gap-4 py-5 text-left"
                      >
                        <span
                          className={cn(
                            "font-display text-lg font-medium tabular-nums transition-colors",
                            open ? "text-gold" : "text-ink/40"
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "flex-1 font-display text-[1.45rem] font-semibold leading-snug transition-colors sm:text-[1.6rem]",
                            open ? "text-forest-deep" : "text-ink/85 group-hover:text-forest-deep"
                          )}
                        >
                          {term.title}
                        </span>
                        <span
                          className={cn(
                            "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-400",
                            open
                              ? "rotate-45 border-gold bg-gold text-forest-deep"
                              : "border-ink/25 text-ink/60 group-hover:border-gold group-hover:text-gold"
                          )}
                        >
                          <Plus className="h-4 w-4" />
                        </span>
                      </button>
                    </h3>
                    <div className={cn("acc-panel", open && "open")}>
                      <div>
                        <p className="max-w-2xl pb-6 pl-12 pr-4 text-[15px] leading-relaxed text-ink/70">
                          {term.body}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 text-xs leading-relaxed text-ink/50">
              These terms apply to all in-person treatments booked through Chantara Thai Massage or
              via Picktime. Last updated 2026.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
