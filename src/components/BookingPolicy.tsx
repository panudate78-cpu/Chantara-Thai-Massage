import { BOOKING_STEPS } from "../data";
import Reveal from "./Reveal";
import { BookButton, SectionHeading } from "./ui";

export default function BookingPolicy() {
  return (
    <section
      id="booking-policy"
      className="pattern-dots-light relative overflow-hidden bg-forest-deep py-20 lg:py-28"
      aria-labelledby="booking-policy-heading"
    >
      {/* faint oversized lotus */}
      <svg
        viewBox="0 0 48 36"
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-10 h-72 w-96 text-ivory/[0.04]"
        fill="currentColor"
      >
        <path d="M24 2c4 8 4 17 0 25-4-8-4-17 0-25Zm-9 6c6 4 9 11 9 19-8-2-13-9-9-19Zm18 0c4 10-1 17-9 19 0-8 3-15 9-19ZM5 18c8 2 14 6 19 9-9 2-17-1-19-9Zm38 0c-2 8-10 11-19 9 5-3 11-7 19-9Z" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <SectionHeading eyebrow="Before Your Visit" title="Booking Policy & Arrival Guidelines" tone="light" />
              <p className="mt-5 text-[15px] leading-relaxed text-cream/70">
                A few simple things keep every treatment calm, unhurried and hygienic. Please read
                them before you book — it makes everything smoother for everyone.
              </p>
            </div>
            <BookButton label="Book Your Treatment" size="lg" variant="gold" className="shrink-0" />
          </div>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden border border-ivory/15 bg-ivory/15 md:grid-cols-3">
          {BOOKING_STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 130} className="h-full">
              <div className="group flex h-full flex-col bg-forest-deep p-8 transition-colors duration-500 hover:bg-forest">
                <span className="font-display text-6xl font-medium text-gold-soft/40 transition-colors duration-500 group-hover:text-gold-soft">
                  {step.number}
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold text-ivory">{step.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-cream/65">{step.body}</p>
                <span className="mt-6 block h-px w-10 bg-gold-soft/50 transition-all duration-500 group-hover:w-20 group-hover:bg-gold-soft" aria-hidden="true" />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-8 text-center text-sm text-cream/55">
            Booking on Picktime takes under a minute — choose your treatment, day and time, and we'll
            confirm by email.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
