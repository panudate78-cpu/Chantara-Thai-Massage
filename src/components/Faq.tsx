import { useState } from "react";
import { BOOKING_URL, GIFT_CARD_URL, PHONE_DISPLAY, PHONE_TEL } from "../data";
import { cn } from "../utils/cn";
import { Plus } from "./Icons";
import Reveal from "./Reveal";
import { BookButton, SectionHeading } from "./ui";

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Where is Chantara Thai Massage in Fulham?",
    a: (
      <>
        We are at <strong>39 Harwood Road, Fulham, London SW6 4QP</strong> — a calm treatment space
        just a <strong>3-minute walk from Fulham Broadway</strong> station (District line). See our{" "}
        <a href="#location" className="font-bold text-forest underline decoration-gold underline-offset-4">
          location, map and parking details
        </a>
        .
      </>
    ),
  },
  {
    q: "What Thai massage treatments do you offer?",
    a: (
      <>
        Our menu includes <strong>Traditional Thai Massage</strong>, Deep Tissue, Swedish,
        Aromatherapy oil massage, Hot Stone, Back, Neck &amp; Shoulders, Foot Reflexology, Head
        Massage, Couples Massage and value combos. Full durations and prices are on our{" "}
        <a href="#treatments" className="font-bold text-forest underline decoration-gold underline-offset-4">
          Treatments &amp; Prices
        </a>{" "}
        section.
      </>
    ),
  },
  {
    q: "How do I book a massage near Fulham Broadway?",
    a: (
      <>
        Book online in under a minute on{" "}
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-forest underline decoration-gold underline-offset-4"
        >
          Picktime
        </a>
        , or call{" "}
        <a href={PHONE_TEL} className="font-bold text-forest underline decoration-gold underline-offset-4">
          {PHONE_DISPLAY}
        </a>
        . Online bookings require a £10 deposit, deducted from your total.
      </>
    ),
  },
  {
    q: "What are your opening hours?",
    a: (
      <>
        We are open <strong>7 days a week</strong>, Monday to Sunday, <strong>10:00 – 20:00</strong>.
        Last appointments are before closing — check availability when you book.
      </>
    ),
  },
  {
    q: "Do you offer pregnancy massage in Fulham?",
    a: (
      <>
        Yes — pregnancy massages are available. Please{" "}
        <a href={PHONE_TEL} className="font-bold text-forest underline decoration-gold underline-offset-4">
          call us first
        </a>{" "}
        to discuss your stage of pregnancy and the most suitable treatment before booking.
      </>
    ),
  },
  {
    q: "Is there parking for a massage in Fulham SW6?",
    a: (
      <>
        Parking is available at <strong>Fulham Broadway Station MSCP</strong>, plus paid on-street
        parking nearby. Many clients prefer the tube — we are only a few minutes from the station.
      </>
    ),
  },
  {
    q: "Can I buy a Thai massage gift voucher?",
    a: (
      <>
        Yes. Purchase{" "}
        <a
          href={GIFT_CARD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-forest underline decoration-gold underline-offset-4"
        >
          gift vouchers online
        </a>
        . They are only valid when booking directly by phone, WhatsApp or SMS — not via Picktime.
        See{" "}
        <a href="#gift-vouchers" className="font-bold text-forest underline decoration-gold underline-offset-4">
          Gift Vouchers
        </a>
        .
      </>
    ),
  },
  {
    q: "What is Ladies' Day?",
    a: (
      <>
        Every <strong>Thursday</strong> is Ladies' Day — a <strong>60-minute massage for £50</strong>{" "}
        (excluding Hot Stone). Book via{" "}
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-forest underline decoration-gold underline-offset-4"
        >
          Picktime
        </a>{" "}
        or see{" "}
        <a href="#treatments" className="font-bold text-forest underline decoration-gold underline-offset-4">
          treatments
        </a>
        .
      </>
    ),
  },
  {
    q: "What should I know before my first visit?",
    a: (
      <>
        Arrive <strong>5 minutes early</strong> for a short intake form. Tell us about medical
        conditions, injuries or recent surgery. Read our{" "}
        <a href="#booking-policy" className="font-bold text-forest underline decoration-gold underline-offset-4">
          booking policy
        </a>{" "}
        and{" "}
        <a href="#terms" className="font-bold text-forest underline decoration-gold underline-offset-4">
          terms of service
        </a>
        . We accept cash, Visa, Mastercard, Amex and contactless.
      </>
    ),
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="pattern-dots bg-cream py-20 lg:py-28" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <SectionHeading
                eyebrow="Common Questions"
                title="Thai Massage Fulham — FAQ"
              />
              <p id="faq-heading" className="mt-5 text-[15px] leading-relaxed text-ink/65">
                Answers about booking traditional Thai massage in Fulham, treatments, parking near
                Fulham Broadway, gift vouchers, pregnancy massage and our opening hours.
              </p>
            </div>
            <BookButton label="Book Online" variant="forest" className="shrink-0" />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <ul className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-start gap-4 py-5 text-left"
                    >
                      <span
                        className={cn(
                          "mt-1 font-display text-lg font-medium tabular-nums",
                          isOpen ? "text-gold" : "text-ink/35"
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "flex-1 font-display text-xl font-semibold leading-snug sm:text-[1.35rem]",
                          isOpen ? "text-forest-deep" : "text-ink/85 group-hover:text-forest-deep"
                        )}
                      >
                        {item.q}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-300",
                          isOpen
                            ? "rotate-45 border-gold bg-gold text-forest-deep"
                            : "border-ink/25 text-ink/60 group-hover:border-gold group-hover:text-gold"
                        )}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <div className={cn("acc-panel", isOpen && "open")}>
                    <div>
                      <div className="max-w-3xl pb-6 pl-12 pr-4 text-[15px] leading-relaxed text-ink/70">
                        {item.a}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-10 text-center text-sm text-ink/55">
            Still unsure?{" "}
            <a href="#contact" className="font-bold text-forest underline decoration-gold underline-offset-4">
              Contact us
            </a>{" "}
            or call{" "}
            <a href={PHONE_TEL} className="font-bold text-forest underline decoration-gold underline-offset-4">
              {PHONE_DISPLAY}
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
