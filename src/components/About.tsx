import { ABOUT_IMAGE, ORCHID_IMAGE } from "../data";
import { Check } from "./Icons";
import Reveal from "./Reveal";
import { SectionHeading } from "./ui";

const FACTS = [
  "Authentic Thai techniques, on traditional tables",
  "Experienced, trained therapists",
  "Calm private treatment rooms",
  "A 3-minute walk from Fulham Broadway",
];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-ivory py-20 lg:py-28" aria-labelledby="about-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
        {/* images */}
        <Reveal className="relative lg:col-span-5">
          <div className="relative mx-auto max-w-sm lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -inset-3 -translate-x-4 translate-y-4 rounded-t-full border border-gold/40"
            />
            <img
              src={ABOUT_IMAGE}
              alt="Traditional Thai massage Fulham — therapist applying pressure along the leg on a treatment table"
              loading="lazy"
              width={880}
              height={1200}
              decoding="async"
              className="relative h-[26rem] w-full rounded-t-full border border-gold/30 object-cover sm:h-[30rem]"
            />
            <img
              src={ORCHID_IMAGE}
              alt="White orchid flowers — calm spa detail at Chantara Thai Massage Fulham"
              loading="lazy"
              width={700}
              height={500}
              decoding="async"
              className="absolute -bottom-8 -left-6 hidden h-36 w-44 border-4 border-ivory object-cover shadow-xl sm:block lg:-left-12"
            />
          </div>
        </Reveal>

        {/* copy */}
        <div className="lg:col-span-7 lg:pl-8">
          <Reveal>
            <SectionHeading
              eyebrow="About Chantara Thai Massage"
              title="Traditional Thai massage sanctuary in Fulham"
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink/75">
              Based in Fulham, London SW6, our serene treatment rooms provide a sanctuary for those
              seeking solace from the capital's urban hustle. At Chantara Thai Massage we specialise
              in authentic traditional Thai massage, alongside Swedish, deep tissue and oil therapies —
              delivered by experienced therapists skilled in injury recovery, pain management and deep relaxation.
            </p>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink/75">
              Conveniently located near Fulham Broadway underground station, we welcome clients from
              Parsons Green, Chelsea, Hammersmith and across west London. Expect unhurried treatments
              on traditional Thai tables in calm, private rooms — book online or call to reserve.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {FACTS.map((fact) => (
                <li
                  key={fact}
                  className="flex items-start gap-3 border border-ink/10 bg-cream/70 px-4 py-3.5 transition-colors duration-300 hover:border-gold/50"
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-forest text-ivory">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-ink/80">{fact}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-8 font-display text-2xl italic text-forest/80">
              “Come as you are. Leave lighter.”
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
