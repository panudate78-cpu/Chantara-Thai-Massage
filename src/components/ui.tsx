import { BOOKING_URL } from "../data";
import { cn } from "../utils/cn";
import { ArrowRight, Lotus } from "./Icons";

type BookButtonProps = {
  label?: string;
  href?: string;
  variant?: "forest" | "gold" | "ivory" | "outline";
  size?: "md" | "lg" | "sm";
  className?: string;
  withArrow?: boolean;
};

/** Every booking CTA on the site points straight at Picktime. */
export function BookButton({
  label = "Book Now",
  href = BOOKING_URL,
  variant = "forest",
  size = "md",
  className,
  withArrow = true,
}: BookButtonProps) {
  const external = /^https?:/i.test(href);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group inline-flex items-center justify-center gap-2.5 rounded-[3px] font-sans font-bold uppercase tracking-[0.14em] transition-all duration-300",
        size === "lg" && "px-8 py-4 text-[13px]",
        size === "md" && "px-6 py-3.5 text-xs",
        size === "sm" && "px-4 py-2.5 text-[11px]",
        variant === "forest" &&
          "bg-forest text-ivory shadow-[0_10px_24px_-12px_rgba(19,40,30,0.55)] hover:bg-gold hover:text-forest-deep hover:shadow-[0_14px_28px_-12px_rgba(169,133,68,0.6)]",
        variant === "gold" &&
          "bg-gold text-forest-deep hover:bg-gold-soft shadow-[0_10px_24px_-12px_rgba(169,133,68,0.55)]",
        variant === "ivory" &&
          "bg-ivory text-forest hover:bg-gold-pale",
        variant === "outline" &&
          "border border-ivory/40 text-ivory hover:border-gold-soft hover:text-gold-soft",
        "active:translate-y-px",
        className
      )}
    >
      <Lotus className="h-4 w-4 shrink-0 opacity-90 transition-transform duration-500 group-hover:rotate-[8deg]" />
      <span>{label}</span>
      {withArrow && (
        <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </a>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  className,
  tone = "dark",
  center = false,
}: {
  eyebrow: string;
  title: string;
  className?: string;
  tone?: "dark" | "light";
  center?: boolean;
}) {
  return (
    <div className={cn(center && "text-center", className)}>
      <p
        className={cn(
          "flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em]",
          center && "justify-center",
          tone === "dark" ? "text-gold-deep" : "text-gold-soft"
        )}
      >
        <span className={cn("h-px w-8", tone === "dark" ? "bg-gold/60" : "bg-gold-soft/50")} aria-hidden="true" />
        {eyebrow}
        {center && <span className={cn("h-px w-8", tone === "dark" ? "bg-gold/60" : "bg-gold-soft/50")} aria-hidden="true" />}
      </p>
      <h2
        className={cn(
          "mt-4 font-display text-4xl font-medium leading-[1.08] sm:text-5xl",
          tone === "dark" ? "text-forest-deep" : "text-ivory"
        )}
      >
        {title}
      </h2>
    </div>
  );
}
