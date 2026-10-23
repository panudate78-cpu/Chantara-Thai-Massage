import { useEffect, useState } from "react";
import { NAV_LINKS, PHONE_DISPLAY, PHONE_TEL } from "../data";
import { cn } from "../utils/cn";
import { ArrowRight } from "./Icons";
import Logo from "./Logo";
import { BookButton } from "./ui";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* announcement strip */}
      <div className="relative z-10 bg-gold text-forest-deep">
        <a
          href="https://www.picktime.com/Chantarathaimassage"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-center text-[11px] font-bold uppercase tracking-[0.18em] transition-colors hover:bg-gold-soft sm:text-xs"
        >
          <span className="hidden sm:inline">Thursdays are Ladies' Day —</span>
          <span>
            60-minute massage £50 <span className="hidden md:inline">(excl. Hot Stone)</span>
          </span>
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      {/* main bar */}
      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "border-ivory/10 bg-forest-deep/95 shadow-[0_14px_40px_-18px_rgba(0,0,0,0.6)] backdrop-blur-md"
            : "border-transparent bg-forest"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* brand */}
          <a href="#home" className="group" aria-label="Chantara Thai Massage — home">
            <Logo size="md" withText tone="light" />
          </a>

          {/* desktop nav */}
          <nav className="hidden items-center gap-4 2xl:gap-6 xl:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative py-1 text-[12px] font-semibold tracking-wide text-ivory/85 transition-colors hover:text-ivory 2xl:text-[13px]"
              >
                {link.label}
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-soft transition-all duration-300 group-hover:w-full"
                  aria-hidden="true"
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={PHONE_TEL}
              className="hidden items-center gap-2 text-sm font-bold text-ivory/85 transition-colors hover:text-gold-soft lg:flex"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full border border-ivory/20">
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                  <path
                    d="M5.5 4h3l1.7 4.2-2 1.6a12.5 12.5 0 0 0 6 6l1.6-2 4.2 1.7v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 6.2 2 2 0 0 1 5.5 4Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {PHONE_DISPLAY}
            </a>
            <BookButton label="Book Online" size="md" variant="gold" withArrow={false} className="hidden sm:inline-flex" />

            {/* mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20 text-ivory xl:hidden"
            >
              <span className="relative block h-3.5 w-5" aria-hidden="true">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-[1.5px] w-full bg-current transition-all duration-300",
                    open && "top-1/2 -translate-y-1/2 rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current transition-all duration-200",
                    open && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-all duration-300",
                    open && "bottom-1/2 translate-y-1/2 -rotate-45"
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        {/* mobile panel */}
        <div
          className={cn(
            "grid overflow-hidden border-ivory/10 bg-forest-deep transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] xl:hidden",
            open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <nav className="flex flex-col px-4 py-4 sm:px-6" aria-label="Mobile">
              {NAV_LINKS.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-ivory/10 py-3.5 font-display text-xl text-ivory/90 transition-colors last:border-0 hover:text-gold-soft"
                >
                  {link.label}
                  <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-gold-soft/60">
                    0{i + 1}
                  </span>
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                <BookButton label="Book Online" size="md" variant="gold" className="w-full" />
                <a
                  href={PHONE_TEL}
                  className="text-center text-sm font-bold text-ivory/80 underline decoration-gold-soft/60 underline-offset-4"
                >
                  or call {PHONE_DISPLAY}
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
