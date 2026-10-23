import {
  BOOKING_URL,
  DAYS,
  EMAIL,
  GIFT_CARD_URL,
  GOOGLE_REVIEWS_URL,
  PHONE_DISPLAY,
  SITE_URL,
  WHATSAPP_URL,
} from "./site";
import type {
  BusinessDetails,
  CtaDestination,
  GalleryImage,
  HomepageContent,
  OfferContent,
  SiteContent,
  TreatmentContent,
} from "./types";

/**
 * The content the site launches with.
 *
 * These defaults are used for two things:
 *  1. the database seed (so the live site is unchanged after going live), and
 *  2. the first paint of the public site while live content is loading.
 *
 * Everything here is editable in the admin panel except the treatment image
 * URLs and alt text, which are protected design assets.
 */

const img = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=650&w=940`;

export const DEFAULT_BUSINESS: BusinessDetails = {
  name: "Chantara Thai Massage",
  phone: PHONE_DISPLAY,
  email: EMAIL,
  addressLine1: "39 Harwood Road",
  addressLine2: "Fulham",
  city: "London",
  postcode: "SW6 4QP",
  hours: DAYS.map((day) => ({ day, closed: false, open: "10:00", close: "20:00" })),
  social: {
    google: GOOGLE_REVIEWS_URL,
    whatsapp: WHATSAPP_URL,
  },
};

export const DEFAULT_HOMEPAGE: HomepageContent = {
  heroEyebrow: "Fulham Broadway · London SW6",
  heroHeading: "Thai Massage\nin Fulham,",
  heroHeadingAccent: "London",
  heroDescription:
    "Professional traditional Thai massage near Fulham Broadway — authentic relaxing and therapeutic treatments tailored to your needs, in a calm sanctuary a few steps from the station.",
  ctaPrimary: { label: "Book an Appointment", destination: "booking" },
  ctaSecondary: { label: "Treatments & Prices", destination: "treatments" },
};

export const DEFAULT_TREATMENTS: TreatmentContent[] = [
  {
    id: "thai-traditional",
    slug: "thai-traditional",
    title: "Traditional Thai Massage",
    tag: "Most Loved",
    description:
      "A refreshing full-body practice of rhythmic pressure, gentle stretches and joint mobilisations performed on a traditional Thai massage table. Relieves tension headaches, back pain, muscle soreness and joint stiffness.",
    prices: [
      { minutes: 60, price: 60 },
      { minutes: 90, price: 85 },
      { minutes: 120, price: 110 },
    ],
    imageUrl: img(34821383),
    imageAlt:
      "Traditional Thai massage Fulham — therapist performing stretching techniques on a treatment table",
    archived: false,
  },
  {
    id: "deep-tissue",
    slug: "deep-tissue",
    title: "Deep Tissue Massage",
    tag: null,
    description:
      "Sustained pressure with slow, firm strokes targeting the deeper layers of muscle and connective tissue. Ideal for sports-related strains, chronic knots and hard-won recovery.",
    prices: [
      { minutes: 60, price: 60 },
      { minutes: 90, price: 85 },
      { minutes: 120, price: 110 },
    ],
    imageUrl: img(37719539),
    imageAlt: "Deep tissue massage Fulham London — firm back massage for muscle tension relief",
    archived: false,
  },
  {
    id: "swedish",
    slug: "swedish",
    title: "Swedish Massage",
    tag: null,
    description:
      "Soft, long kneading strokes with light rhythmic movement across the topmost layers of muscle, combined with gentle joint movement. Both relaxing and energising — a classic all-rounder.",
    prices: [
      { minutes: 60, price: 60 },
      { minutes: 90, price: 85 },
      { minutes: 120, price: 110 },
    ],
    imageUrl: img(37719545),
    imageAlt: "Swedish massage near Fulham Broadway — calming back massage with long strokes",
    archived: false,
  },
  {
    id: "aromatherapy",
    slug: "aromatherapy",
    title: "Aromatherapy (Oil) Massage",
    tag: null,
    description:
      "A Swedish-style oil massage using carefully blended essential oils, absorbed through the skin and inhaled for calm. Deeply soothing and perfect for melting away stress.",
    prices: [
      { minutes: 60, price: 60 },
      { minutes: 90, price: 85 },
      { minutes: 120, price: 110 },
    ],
    imageUrl: img(6629607),
    imageAlt: "Aromatherapy oil massage Fulham — essential massage oil poured onto therapist hands",
    archived: false,
  },
  {
    id: "hot-stone",
    slug: "hot-stone",
    title: "Hot Stone Massage",
    tag: "Warm & Deep",
    description:
      "Gently warmed basalt stones allow your therapist to work deeper into areas of concern. Expect relief from muscle tension, improved circulation and a lowered sense of stress and anxiety.",
    prices: [
      { minutes: 60, price: 65 },
      { minutes: 90, price: 90 },
      { minutes: 120, price: 120 },
    ],
    imageUrl: img(6187645),
    imageAlt: "Hot stone massage Fulham SW6 — warmed basalt stones on the back for deep relaxation",
    archived: false,
  },
  {
    id: "back-neck-shoulders",
    slug: "back-neck-shoulders",
    title: "Back, Neck & Shoulders",
    tag: null,
    description:
      "A focused treatment that releases tension and spasms in the upper body, improves circulation and eases tension headaches and migraines. The perfect pick for desk-bound days.",
    prices: [
      { minutes: 30, price: 35 },
      { minutes: 60, price: 60 },
    ],
    imageUrl: img(5793694),
    imageAlt: "Back neck and shoulders massage Fulham — focused upper body tension relief",
    archived: false,
  },
  {
    id: "reflexology",
    slug: "reflexology",
    title: "Foot Reflexology",
    tag: null,
    description:
      "A classic foot massage that works wonders for circulation and stress relief, improves sleep and speeds recovery — ideal if you stand or walk a lot through your day.",
    prices: [
      { minutes: 30, price: 35 },
      { minutes: 60, price: 60 },
    ],
    imageUrl: img(6188032),
    imageAlt:
      "Foot reflexology Fulham London — soothing foot massage for circulation and stress relief",
    archived: false,
  },
  {
    id: "head-massage",
    slug: "head-massage",
    title: "Head Massage",
    tag: null,
    description:
      "Release the stress that has accumulated in the tissues, muscles and joints of the head, face, neck and shoulders.",
    prices: [{ minutes: 30, price: 35 }],
    imageUrl: img(5793705),
    imageAlt: "Head massage Fulham — gentle scalp neck and shoulder tension release",
    archived: false,
  },
];

export const DEFAULT_OFFERS: OfferContent[] = [];

/**
 * Design asset used for newly created treatments so cards keep their layout.
 * Treatment imagery is intentionally not editable by the business owner.
 */
export const DEFAULT_TREATMENT_IMAGE = img(34821383);
export const DEFAULT_GALLERY: GalleryImage[] = [];

export const DEFAULT_CONTENT: SiteContent = {
  business: DEFAULT_BUSINESS,
  homepage: DEFAULT_HOMEPAGE,
  treatments: DEFAULT_TREATMENTS,
  offers: DEFAULT_OFFERS,
  gallery: DEFAULT_GALLERY,
  updatedAt: new Date(0).toISOString(),
};

/** Where each CTA destination points. Keeps links safe and SEO-friendly. */
export function resolveCtaHref(destination: CtaDestination, business: BusinessDetails): string {
  switch (destination) {
    case "booking":
      return BOOKING_URL;
    case "treatments":
      return "#treatments";
    case "gift-vouchers":
      return "#gift-vouchers";
    case "contact":
      return "#contact";
    case "phone":
      return telHref(business.phone);
    case "whatsapp":
      return WHATSAPP_URL;
    default:
      return "";
  }
}

/** "07387 769945" → "tel:+447387769945" */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.startsWith("0")) return `tel:+44${digits.slice(1)}`;
  if (digits.startsWith("44")) return `tel:+${digits}`;
  return `tel:${digits}`;
}

export function addressLines(business: BusinessDetails): string[] {
  const line2 = [business.addressLine2, business.city].filter(Boolean).join(", ");
  return [business.addressLine1, line2, business.postcode].filter(Boolean);
}

export function fullAddress(business: BusinessDetails): string {
  return addressLines(business).join(", ");
}

export function mapsEmbedUrl(business: BusinessDetails): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(fullAddress(business))}&output=embed`;
}

export function mapsDirectionsUrl(business: BusinessDetails): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress(business))}`;
}

/** Booking URL is fixed to the booking engine, never taken from user input. */
export const RESERVED_BOOKING_URL = BOOKING_URL;
export const RESERVED_GIFT_CARD_URL = GIFT_CARD_URL;
export const RESERVED_SITE_URL = SITE_URL;

/** UK display number → E.164 for structured data ("07387 769945" → "+447387769945"). */
export function phoneE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("44")) return `+${digits}`;
  if (digits.startsWith("0")) return `+44${digits.slice(1)}`;
  return `+${digits}`;
}
