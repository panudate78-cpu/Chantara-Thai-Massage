import logoUrl from "../assets/logo.png";
import { cn } from "../utils/cn";

type LogoProps = {
  className?: string;
  /** Outer container size classes, e.g. "h-12 w-12" */
  size?: "sm" | "md" | "lg" | "xl";
  /** Show the text mark next to the image (header style) */
  withText?: boolean;
  /** Invert text colours for dark headers */
  tone?: "dark" | "light";
};

const sizeMap = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14",
  xl: "h-20 w-20",
};

export { logoUrl };

export default function Logo({
  className,
  size = "md",
  withText = true,
  tone = "light",
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <img
        src={logoUrl}
        alt="Chantara Thai Massage"
        className={cn(
          "shrink-0 rounded-full bg-white object-contain shadow-[0_0_0_1px_rgba(169,133,68,0.25)]",
          sizeMap[size]
        )}
        width={80}
        height={80}
        decoding="async"
      />
      {withText && (
        <span className="leading-none">
          <span
            className={cn(
              "block font-display text-[1.55rem] font-semibold tracking-wide",
              tone === "light" ? "text-ivory" : "text-forest-deep"
            )}
          >
            Chantara
          </span>
          <span
            className={cn(
              "mt-1 block text-[9.5px] font-bold uppercase tracking-[0.42em]",
              tone === "light" ? "text-gold-soft" : "text-gold-deep"
            )}
          >
            Thai Massage
          </span>
        </span>
      )}
    </span>
  );
}
