import logoAsset from "../assets/logo.png";

type IconProps = { className?: string };

/** Stylised Thai lotus — the brand mark */
export function Lotus({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 48 36" fill="none" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M24 2c4 8 4 17 0 25-4-8-4-17 0-25Zm-9 6c6 4 9 11 9 19-8-2-13-9-9-19Zm18 0c4 10-1 17-9 19 0-8 3-15 9-19ZM5 18c8 2 14 6 19 9-9 2-17-1-19-9Zm38 0c-2 8-10 11-19 9 5-3 11-7 19-9Z"
      />
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M11 33q13 5 26 0"
      />
    </svg>
  );
}

export function Star({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.22 5.06 16.8 6 11.31 2 7.41l5.53-.8L10 1.6z" />
    </svg>
  );
}

export function StarRow({
  className = "",
  count = 5,
}: IconProps & { count?: number }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5" />
      ))}
    </span>
  );
}

export function ArrowRight({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M3 10h13M11.5 4.5L17 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Pin({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 21s-6.5-5.5-6.5-10.3A6.5 6.5 0 0 1 12 4a6.5 6.5 0 0 1 6.5 6.7C18.5 15.5 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="10.6" r="2.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Clock({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Phone({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5.5 4h3l1.7 4.2-2 1.6a12.5 12.5 0 0 0 6 6l1.6-2 4.2 1.7v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 6.2 2 2 0 0 1 5.5 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Mail({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Train({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5.5" y="3.5" width="13" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 11h13" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="14" r="1" fill="currentColor" />
      <circle cx="15" cy="14" r="1" fill="currentColor" />
      <path d="m8 20.5 1.5-3M16 20.5l-1.5-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Car({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 13.5 5.6 8a2 2 0 0 1 1.9-1.5h9a2 2 0 0 1 1.9 1.5L20 13.5M4 13.5h16v5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1h-9v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="15.8" r="0.9" fill="currentColor" />
      <circle cx="16" cy="15.8" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function Check({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="m4 10.5 4 4L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Plus({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Contactless({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5.5 6.5c4 3 4 8 0 11M10 4.8c5.5 3.8 5.5 10.6 0 14.4M14.5 3.2c7 4.4 7 13.2 0 17.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Gift({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="9.5" width="17" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9.5h17M12 9.5V20" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 9.5c-1-3.2-3-4.7-4.6-4.2-1.6.5-1.8 2.8 1 3.6.9.3 2.3.5 3.6.6Zm0 0c1-3.2 3-4.7 4.6-4.2 1.6.5 1.8 2.8-1 3.6-.9.3-2.3.5-3.6.6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Banknote({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="6.5" width="19" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 9.5v.01M18.5 14.5v.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function VisaMark({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 34 12" className={className} aria-hidden="true">
      <text x="0" y="10" fontFamily="Mulish, sans-serif" fontWeight="800" fontStyle="italic" fontSize="12" fill="currentColor" letterSpacing="0.5">
        VISA
      </text>
    </svg>
  );
}

export function MastercardMark({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 26 16" className={className} aria-hidden="true">
      <circle cx="9.5" cy="8" r="6.5" fill="#EB001B" />
      <circle cx="16.5" cy="8" r="6.5" fill="#F79E1B" fillOpacity="0.9" />
    </svg>
  );
}

export function AmexMark({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 40 22" className={className} aria-hidden="true">
      <rect width="40" height="22" rx="3" fill="#2E77BC" />
      <text x="20" y="14.5" textAnchor="middle" fontFamily="Mulish, sans-serif" fontWeight="800" fontSize="10" fill="#fff" letterSpacing="0.8">
        AMEX
      </text>
    </svg>
  );
}

/** Circular rotating badge */
export function SpinningSeal({ className = "" }: IconProps) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="spin-slow h-full w-full">
        <defs>
          <path id="seal-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text fontSize="10.5" letterSpacing="2.6" fill="currentColor" fontFamily="Mulish, sans-serif" fontWeight="700">
          <textPath href="#seal-circle">
            CHANTARA THAI MASSAGE · FULHAM · LONDON ·
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-5">
        <img
          src={logoAsset}
          alt=""
          className="h-full w-full rounded-full object-contain bg-white shadow-sm"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
