/**
 * Static, code-owned content for the marketing site.
 *
 * Editable business content (details, treatments, offers, gallery, hero) now
 * lives in the CMS and is read through `useContent()`; links and design assets
 * stay here so they cannot be broken from the admin panel.
 */
export * from "../cms/shared/site";
export {
  DEFAULT_CONTENT,
  DEFAULT_TREATMENT_IMAGE,
  resolveCtaHref,
  telHref,
  addressLines,
  fullAddress,
  mapsEmbedUrl,
  mapsDirectionsUrl,
  phoneE164,
} from "../cms/shared/defaults";
export type {
  BusinessDetails,
  HomepageContent,
  TreatmentContent,
  OfferContent,
  GalleryImage,
  SiteContent,
  OpeningHours,
  TreatmentPrice,
} from "../cms/shared/types";

export type PricePoint = { minutes: number; price: number };

export type Combo = {
  id: string;
  title: string;
  description: string;
  prices: PricePoint[];
};

export const COMBOS: Combo[] = [
  {
    id: "couples-60",
    title: "Couples Massage",
    description:
      "Simultaneous treatments in separate private rooms — unwind side by side, each with individual, personalised attention.",
    prices: [
      { minutes: 60, price: 110 },
      { minutes: 90, price: 160 },
      { minutes: 120, price: 220 },
    ],
  },
  {
    id: "combo-1",
    title: "Combo 1 — Body + Head",
    description: "60-minute massage of your choice, finished with a 30-minute head massage.",
    prices: [{ minutes: 90, price: 89 }],
  },
  {
    id: "combo-2",
    title: "Combo 2 — Body + Feet",
    description: "60-minute massage of your choice, followed by a 30-minute foot massage.",
    prices: [{ minutes: 90, price: 89 }],
  },
  {
    id: "combo-3",
    title: "Combo 3 — Extended",
    description: "90-minute body massage of your choice plus a 30-minute head or foot massage.",
    prices: [{ minutes: 120, price: 109 }],
  },
];

export type Review = { name: string; text: string };

export const REVIEWS: Review[] = [
  {
    name: "Emy R",
    text: "I've had massages at many spas, but my experience here with Maria was on another level. Her treatment, customer service and excellent knowledge of muscles were outstanding. I truly felt like I was in a five-star hotel — a very clean, professional place. I'll definitely be back!",
  },
  {
    name: "Marika",
    text: "If you are looking for an authentic Thai massage experience — this is the place. My masseuse Sanny was very attentive and professional. The technique and level of pressure was just what I needed. Will come back 100% and want to make it part of my me-time routine.",
  },
  {
    name: "R Z",
    text: "The best massage!! I tried many, many places … but they are the best!! Therapists professional, skilled and fair price! Really recommend!",
  },
  {
    name: "ifrah musa",
    text: "Kara was amazing — the service was great, very relaxing and welcoming. Will be back soon. Thank you.",
  },
  {
    name: "Gabby",
    text: "Very lovely place, the ambiance was amazing and it was also very clean. I had a massage from Panit, she was amazing. They were very kind to fit us in as a couple last minute. Highly recommend!",
  },
  {
    name: "jo darek",
    text: "Amazing service — the massage I had was just perfect: reflexology and a full body massage. Highly recommend!",
  },
  {
    name: "Maria",
    text: "Maria gave an excellent massage — she's very strong. Wish I had booked 90 minutes to really go deeper on my neck and shoulders.",
  },
  {
    name: "Sandra",
    text: "Honestly one of the absolute best massages I've ever had! I booked a Deep Tissue but it was a wonderful mix of Deep Tissue and Thai — my whole body was taken care of thoroughly and thoughtfully. An hour felt like three. I left feeling so relaxed.",
  },
];

export type Term = { title: string; body: string };

export const TERMS: Term[] = [
  {
    title: "Professional Standards",
    body: "Chantara Thai Massage operates as a strictly professional service. Failure to follow this rule will result in your treatment being stopped and you will be asked to leave without refund. You may also be prohibited from future bookings and from entering the premises.",
  },
  {
    title: "Pregnancy Policy",
    body: "Pregnancy massages are available. Please call us to discuss your stage of pregnancy, any medical considerations and the most suitable treatment before booking, so we can look after you safely and comfortably.",
  },
  {
    title: "Refund Policy",
    body: "If for any reason you are not happy with your treatment, please inform the therapist within 15 minutes of your treatment starting so we can arrange an alternative therapist or a refund. Refunds will not be offered once the treatment has concluded.",
  },
  {
    title: "Offers & Availability",
    body: "All services are subject to availability. We reserve the right to withdraw any offer at any time without prior notice.",
  },
  {
    title: "Code of Conduct",
    body: "Clients must adhere to our code of conduct and behave respectfully towards staff and other customers at all times.",
  },
  {
    title: "Payment & Vouchers",
    body: "Payment is required at time of booking or upon completion. Gift vouchers can be purchased online and are non-refundable and cannot be exchanged for cash. Gift vouchers are only valid when booking directly with us by phone, WhatsApp or SMS — they cannot be redeemed against online Picktime bookings.",
  },
  {
    title: "Liability & Health",
    body: "We are not liable for lost or damaged personal belongings. All medical conditions or allergies must be disclosed prior to treatment.",
  },
];

export const BOOKING_STEPS = [
  {
    number: "01",
    title: "Book Online",
    body: "A £10 booking deposit is required for all online bookings and will be deducted from your total. Secure your slot in under a minute on Picktime.",
  },
  {
    number: "02",
    title: "Arrive 5 Minutes Early",
    body: "Please arrive 5 minutes before your appointment to fill in our massage intake form, so we know of any medical conditions, recent surgeries or injuries prior to treatment. If you are pregnant, please call us first to discuss the most suitable treatment.",
  },
  {
    number: "03",
    title: "Cancellation Terms",
    body: "Deposits are non-refundable if you cancel within 2 hours of your appointment or fail to show. Please manage your booking on Picktime if your plans change.",
  },
];
