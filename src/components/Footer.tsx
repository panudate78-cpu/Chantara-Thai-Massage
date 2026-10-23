import {
  ADDRESS_LINES,
  BOOKING_URL,
  EMAIL,
  GIFT_CARD_URL,
  NAV_LINKS,
  PAYMENT_METHODS,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "../data";
import { AmexMark, Banknote, Contactless, MastercardMark, VisaMark } from "./Icons";
import Logo, { logoUrl } from "./Logo";

function PaymentBadge({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li
      className="flex items-center gap-2.5 border border-ivory/15 bg-ivory/[0.06] px-3.5 py-2.5 transition-colors duration-300 hover:border-gold-soft/50"
      title={label}
    >
      <span className="text-gold-soft">{children}</span>
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cream/80">{label}</span>
    </li>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest-deep text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* brand */}
          <div className="lg:col-span-4">
            <a href="#home" className="inline-flex">
              <Logo size="lg" withText tone="light" />
            </a>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/60">
              Authentic traditional Thai massage in Fulham, London SW6. Relaxing and therapeutic
              treatments near Fulham Broadway — Thai, deep tissue, Swedish, hot stone and reflexology.
            </p>
            <p className="mt-5 text-sm text-cream/50">{ADDRESS_LINES.join(", ")}</p>
          </div>

          {/* explore */}
          <nav className="lg:col-span-2" aria-label="Footer">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold-soft">Explore</h3>
            <ul className="mt-5 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-cream/70 transition-colors duration-300 hover:text-gold-soft"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-gold-soft underline decoration-gold-soft/40 underline-offset-4 transition-colors hover:text-ivory"
                >
                  Book Online (Picktime)
                </a>
              </li>
              <li>
                <a
                  href={GIFT_CARD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-gold-soft underline decoration-gold-soft/40 underline-offset-4 transition-colors hover:text-ivory"
                >
                  Buy Gift Vouchers
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-sm text-cream/70 transition-colors duration-300 hover:text-gold-soft"
                >
                  FAQ — Thai Massage Fulham
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-sm text-cream/70 transition-colors duration-300 hover:text-gold-soft"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </nav>

          {/* hours + contact */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold-soft">Opening Hours</h3>
            <p className="mt-5 font-display text-xl text-ivory">Monday – Sunday</p>
            <p className="text-sm text-cream/60">10:00 – 20:00 · open 7 days a week</p>
            <h3 className="mt-8 text-[11px] font-bold uppercase tracking-[0.3em] text-gold-soft">Contact</h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li>
                <a href={PHONE_TEL} className="text-cream/70 transition-colors hover:text-gold-soft">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="break-all text-cream/70 transition-colors hover:text-gold-soft">
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* payments */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold-soft">
              We Accept
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {PAYMENT_METHODS.map((method) => (
                <PaymentBadge key={method} label={method}>
                  {method === "Cash" && <Banknote className="h-4.5 w-4.5" />}
                  {method === "Visa" && <VisaMark className="h-3 w-8" />}
                  {method === "Mastercard" && <MastercardMark className="h-4 w-6" />}
                  {method === "Amex" && <AmexMark className="h-4 w-7" />}
                  {method === "Contactless" && <Contactless className="h-4.5 w-4.5" />}
                </PaymentBadge>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-cream/45">
              Payment is taken at booking or on completion.{" "}
              <a
                href={GIFT_CARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-gold-soft underline decoration-gold-soft/40 underline-offset-4 hover:text-ivory"
              >
                Gift vouchers
              </a>{" "}
              are non-refundable, cannot be exchanged for cash, and are only valid when booking
              directly by phone, WhatsApp or SMS.
            </p>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p className="text-xs text-cream/45">
            © {year} Chantara Thai Massage · {ADDRESS_LINES.join(", ")}
          </p>
          <p className="flex items-center gap-2 text-xs text-cream/45">
            <img src={logoUrl} alt="" className="h-5 w-5 rounded-full object-contain bg-white/90" aria-hidden="true" />
            Prices in GBP · Online booking via Picktime
          </p>
        </div>
      </div>
    </footer>
  );
}
