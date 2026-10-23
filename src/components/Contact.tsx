import { telHref } from "../data";
import { useContent } from "../content/ContentContext";
import { daysOpenLabel, weeklyHoursLabel } from "../lib/hours";
import { Mail, Phone } from "./Icons";
import Reveal from "./Reveal";
import { BookButton, SectionHeading } from "./ui";

export default function Contact() {
  const { business } = useContent();

  return (
    <section
      id="contact"
      className="pattern-dots-light relative overflow-hidden bg-forest py-20 lg:py-24"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <Reveal>
          <div>
            <SectionHeading eyebrow="Get in Touch" title="Contact Thai Massage Fulham" tone="light" />
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/70">
              Questions about traditional Thai massage in Fulham, availability or treatments? Call or
              write — we'll point you in the right direction. For the quickest booking near Fulham
              Broadway, reserve online and pick your own time.
            </p>
            <p className="mt-3 max-w-md text-sm text-cream/55">
              Looking for gift vouchers?{" "}
              <a href="#gift-vouchers" className="font-bold text-gold-soft underline decoration-gold-soft/40 underline-offset-4 hover:text-ivory">
                See Gift Vouchers
              </a>
            </p>
            <BookButton label="Book Online" size="lg" variant="gold" className="mt-8" />
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          <Reveal delay={120} className="h-full">
            <a
              href={telHref(business.phone)}
              className="group flex h-full flex-col border border-ivory/15 bg-forest-deep/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold-soft/60"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full border border-gold-soft/40 text-gold-soft transition-colors duration-300 group-hover:bg-gold-soft group-hover:text-forest-deep">
                <Phone className="h-5 w-5" />
              </span>
              <span className="mt-6 text-[11px] font-bold uppercase tracking-[0.26em] text-cream/55">
                Call us
              </span>
              <span className="mt-2 font-display text-3xl font-semibold tracking-wide text-ivory">
                {business.phone}
              </span>
              <span className="mt-auto pt-4 text-xs text-cream/50">
                {daysOpenLabel(business.hours)} · {weeklyHoursLabel(business.hours)}
              </span>
            </a>
          </Reveal>
          <Reveal delay={220} className="h-full">
            <a
              href={`mailto:${business.email}`}
              className="group flex h-full flex-col border border-ivory/15 bg-forest-deep/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold-soft/60"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full border border-gold-soft/40 text-gold-soft transition-colors duration-300 group-hover:bg-gold-soft group-hover:text-forest-deep">
                <Mail className="h-5 w-5" />
              </span>
              <span className="mt-6 text-[11px] font-bold uppercase tracking-[0.26em] text-cream/55">
                Email us
              </span>
              <span className="mt-2 whitespace-nowrap font-display text-base font-semibold tracking-normal text-ivory sm:text-lg">
                {business.email}
              </span>
              <span className="mt-auto pt-4 text-xs text-cream/50">
                We reply within one working day
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
