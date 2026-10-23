import { GIFT_CARD_URL, telHref } from "../data";
import { useContent } from "../content/ContentContext";
import { ArrowRight, Gift, Phone } from "./Icons";
import Reveal from "./Reveal";
import { SectionHeading } from "./ui";

export default function GiftVouchers() {
  const { business } = useContent();

  return (
    <section
      id="gift-vouchers"
      className="pattern-dots relative overflow-hidden bg-ivory py-20 lg:py-24"
      aria-labelledby="gift-vouchers-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="A Thoughtful Gift" title="Thai Massage Gift Vouchers Fulham" />
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/70">
              Give someone the gift of calm — a Chantara Thai Massage voucher for authentic Thai
              massage in Fulham is perfect for birthdays, thank-yous, or a well-earned treat.
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/55">
              Gift vouchers are only valid when booking directly with us by phone, WhatsApp or SMS —
              they cannot be redeemed against online Picktime bookings.
            </p>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7">
            <div className="border border-gold/40 bg-forest-deep p-8 text-ivory shadow-[0_26px_50px_-28px_rgba(19,40,30,0.45)] sm:p-10">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-gold-soft/40 bg-forest text-gold-soft">
                    <Gift className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-gold-soft">
                      Purchase online
                    </p>
                    <h3 className="mt-2 font-display text-3xl font-semibold leading-tight text-ivory">
                      Give the gift of relaxation
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/65">
                      Buy securely online, then redeem by calling or messaging us to book the
                      appointment.
                    </p>
                  </div>
                </div>

                <a
                  href={GIFT_CARD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex shrink-0 items-center justify-center gap-2.5 bg-gold px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-forest-deep transition-colors duration-300 hover:bg-gold-soft"
                >
                  Buy a Voucher
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-ivory/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-cream/55">
                  After purchasing, book your treatment directly with us — not via Picktime.
                </p>
                <a
                  href={telHref(business.phone)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-gold-soft transition-colors hover:text-ivory"
                >
                  <Phone className="h-4 w-4" />
                  Call {business.phone} to redeem
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
