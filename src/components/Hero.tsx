import { HERO_IMAGE, PHONE_DISPLAY, PHONE_TEL } from "../data";
import { ArrowRight, Clock, Star, SpinningSeal } from "./Icons";
import { BookButton } from "./ui";

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export default function Hero() {
  return (
    <section id="home" className="pattern-dots relative overflow-hidden bg-cream pt-[7.25rem]">
      {/* soft gold wash top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gold-pale/40 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-8 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pb-28 lg:pt-14">
        {/* copy */}
        <div className="relative z-10 lg:col-span-6">
          <p
            className="soft-in flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.34em] text-gold-deep"
            style={delay(150)}
          >
            <span className="h-px w-10 bg-gold/70" aria-hidden="true" />
            Fulham Broadway · London SW6
          </p>

          <h1 className="mt-6 font-display text-[2.9rem] font-medium leading-[1.04] text-forest-deep sm:text-6xl lg:text-[4.5rem]">
            <span className="mask-line">
              <span style={delay(200)}>Thai Massage</span>
            </span>
            <span className="mask-line">
              <span style={delay(330)}>in Fulham,</span>
            </span>
            <span className="mask-line">
              <span style={delay(460)} className="italic text-gold">
                London
              </span>
            </span>
          </h1>

          <p
            className="soft-in mt-6 max-w-md text-lg leading-relaxed text-ink/70"
            style={delay(600)}
          >
            Professional traditional Thai massage near Fulham Broadway — authentic relaxing and
            therapeutic treatments tailored to your needs, in a calm sanctuary a few steps from the station.
          </p>

          <div className="soft-in mt-9 flex flex-wrap items-center gap-5" style={delay(720)}>
            <BookButton label="Book an Appointment" size="lg" />
            <a
              href="#treatments"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-forest transition-colors hover:text-gold"
            >
              Treatments &amp; Prices
              <span className="grid h-9 w-9 place-items-center rounded-full border border-forest/25 transition-all duration-300 group-hover:border-gold group-hover:bg-gold/10">
                <ArrowRight className="h-3.5 w-3.5 rotate-90" />
              </span>
            </a>
          </div>

          {/* trust row */}
          <dl
            className="soft-in mt-12 grid max-w-lg grid-cols-3 divide-x divide-ink/10 border-t border-ink/10 pt-6"
            style={delay(840)}
          >
            <div className="pr-4">
              <dt className="sr-only">Google rating</dt>
              <dd>
                <span className="flex items-center gap-1.5 font-display text-2xl font-semibold text-forest-deep">
                  4.9
                  <Star className="h-4 w-4 text-gold" />
                </span>
                <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-clay">
                  60+ Google
                  <br />
                  reviews
                </span>
              </dd>
            </div>
            <div className="px-4">
              <dt className="sr-only">Opening days</dt>
              <dd>
                <span className="flex items-center gap-1.5 font-display text-2xl font-semibold text-forest-deep">
                  7<span className="text-gold"> days</span>
                </span>
                <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-clay">
                  Open weekly
                  <br />
                  10 – 20
                </span>
              </dd>
            </div>
            <div className="pl-4">
              <dt className="sr-only">Travel time to Fulham Broadway station</dt>
              <dd>
                <span className="flex items-center gap-1.5 font-display text-2xl font-semibold text-forest-deep">
                  3<span className="text-gold"> min</span>
                </span>
                <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-clay">
                  from Fulham
                  <br />
                  Broadway
                </span>
              </dd>
            </div>
          </dl>

          <a
  href={PHONE_TEL}
  className="soft-in mt-10 inline-flex items-center gap-4 text-xl font-bold text-forest transition-colors hover:text-gold"
  style={delay(920)}
>
  <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-forest/20">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        d="M5.5 4h3l1.7 4.2-2 1.6a12.5 12.5 0 0 0 6 6l1.6-2 4.2 1.7v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 6.2 2 2 0 0 1 5.5 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  </span>

  <span>
    Prefer to speak first? Call{" "}
    <span className="text-gold">{PHONE_DISPLAY}</span>
  </span>
</a>
        </div>

        {/* imagery */}
        <div className="relative lg:col-span-6" aria-hidden="false">
          <div className="relative mx-auto max-w-[26rem] lg:ml-auto lg:mr-6">
            {/* offset frame */}
            <div
              aria-hidden="true"
              className="absolute -inset-3 translate-x-4 translate-y-4 rounded-t-full border border-gold/50"
            />
            {/* arch */}
            <div className="soft-in relative overflow-hidden rounded-t-full border border-gold/30 bg-parchment shadow-[0_30px_60px_-30px_rgba(19,40,30,0.45)]" style={delay(250)}>
              <img
                src={HERO_IMAGE}
                alt="Traditional Thai massage in Fulham — therapist hands massaging a client lying face-down, no faces shown"
                className="kenburns h-[26rem] w-full object-cover sm:h-[30rem] lg:h-[34rem]"
                width={920}
                height={1300}
                fetchPriority="high"
                decoding="async"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-forest-deep/25 via-transparent to-transparent"
              />
            </div>

            {/* Open today chip */}
<div
  className="soft-in absolute -left-4 top-16 flex items-center gap-4 border-2 border-gold/40 bg-forest-deep/95 px-8 py-5 text-ivory shadow-xl backdrop-blur-sm sm:-left-12"
  style={delay(900)}
>
  <span
    className="pulse-dot h-4 w-4 rounded-full bg-gold-soft"
    aria-hidden="true"
  />
  <span className="text-lg font-bold uppercase leading-tight tracking-[0.2em]">
    Open today
    <span className="block font-display text-2xl normal-case tracking-normal text-gold-soft">
      10:00 — 20:00
    </span>
  </span>
</div>

            {/* rotating seal */}
            <div
              className="soft-in absolute -bottom-8 -right-4 h-28 w-28 text-forest sm:-right-10 sm:h-36 sm:w-36"
              style={delay(1000)}
            >
              <SpinningSeal className="h-full w-full" />
            </div>

            {/* small caption card */}
            <figcaption
              className="soft-in absolute -bottom-6 left-2 hidden border border-gold/30 bg-ivory px-5 py-4 shadow-md sm:block lg:-left-14"
              style={delay(1100)}
            >
              <span className="block font-display text-lg italic leading-snug text-forest-deep">
                “A calm corner of
                <br />
                Fulham.”
              </span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.28em] text-gold">
                Est. near the station
              </span>
            </figcaption>
          </div>
        </div>
      </div>

      {/* bottom hairline */}
      <div aria-hidden="true" className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-ink/15" />
          <Clock className="h-4 w-4 text-gold" />
          <span className="h-px flex-1 bg-ink/15" />
        </div>
      </div>
    </section>
  );
}
