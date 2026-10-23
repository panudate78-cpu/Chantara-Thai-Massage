import type { DayName } from "./site";

export type OpeningHours = {
  day: DayName;
  closed: boolean;
  open: string;
  close: string;
};

export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  google?: string;
  tiktok?: string;
  whatsapp?: string;
};

export type BusinessDetails = {
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  hours: OpeningHours[];
  social: SocialLinks;
};

export const CTA_DESTINATIONS = [
  { value: "booking", label: "Online booking page (Picktime)" },
  { value: "treatments", label: "Treatments & prices (this page)" },
  { value: "gift-vouchers", label: "Gift vouchers (this page)" },
  { value: "contact", label: "Contact section (this page)" },
  { value: "phone", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp chat" },
  { value: "none", label: "No button" },
] as const;

export type CtaDestination = (typeof CTA_DESTINATIONS)[number]["value"];

export type CtaButton = {
  label: string;
  destination: CtaDestination;
};

export type HomepageContent = {
  heroEyebrow: string;
  /** Up to two lines, separated by a newline. */
  heroHeading: string;
  /** The italic gold word/phrase on its own line. */
  heroHeadingAccent: string;
  heroDescription: string;
  ctaPrimary: CtaButton;
  ctaSecondary: CtaButton;
};

export type TreatmentPrice = {
  id?: string;
  minutes: number;
  /** Pounds, whole numbers only. Stored as pence in the database. */
  price: number;
};

export type TreatmentContent = {
  id: string;
  slug: string;
  title: string;
  tag: string | null;
  description: string;
  prices: TreatmentPrice[];
  imageUrl: string | null;
  imageAlt: string | null;
  archived: boolean;
};

export type OfferContent = {
  id: string;
  title: string;
  description: string;
  badge: string | null;
  /** ISO date, YYYY-MM-DD */
  startsOn: string;
  /** ISO date, YYYY-MM-DD */
  endsOn: string;
  enabled: boolean;
};

export type GallerySource = {
  width: number;
  url: string;
  type: "image/webp" | "image/jpeg";
};

export type GalleryImage = {
  id: string;
  alt: string;
  caption: string | null;
  width: number;
  height: number;
  sources: GallerySource[];
  fallbackUrl: string | null;
};

export type SiteContent = {
  business: BusinessDetails;
  homepage: HomepageContent;
  treatments: TreatmentContent[];
  offers: OfferContent[];
  gallery: GalleryImage[];
  updatedAt: string;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "owner" | "editor";
};

export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  summary: string;
  createdAt: string;
};

export type DashboardStats = {
  treatments: number;
  archivedTreatments: number;
  activeOffers: number;
  photos: number;
  lastUpdated: string | null;
};
