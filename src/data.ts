export const SITE_URL = "https://www.chantarathaimassage.com";
export const BOOKING_URL = "https://www.picktime.com/Chantarathaimassage";

export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=Chantara+Thai+Massage&stick=H4sIAAAAAAAA_-NgU1I1qDCxMDczSDO2TLE0NzRKtjC3MqgA8g2BgsmGiYmGKYkWqYtYRZ0zEvNKEosSFUIyEjMVfBOLixPTUwHQiKleQQAAAA&hl=en&mat=CYRhtp0bylPXElcBzAmVZlXGwcd2pfSKunfpr2dxotZAEm05rgdMdaSvBm1k_45Dr_bonD17HN_f79p76RDv883wUm7MQxYFV9704oOeM-fpVZxa24ic67lgV66daDF2m0k&authuser=0&ved=1t:350944#";

export const PHONE_DISPLAY = "07387 769945";
export const PHONE_TEL = "tel:+447387769945";
export const EMAIL = "info@chantarathaimassage.com";
export const WHATSAPP_URL = "https://wa.me/447387769945";
export const GIFT_CARD_URL = "https://giftcard.sumup.io/order/G766F08/chantara-thai-massage";

export const ADDRESS_LINES = ["39 Harwood Road", "Fulham, London", "SW6 4QP"];
export const MAP_EMBED_SRC =
  "https://www.google.com/maps?q=39%20Harwood%20Road%2C%20Fulham%2C%20London%20SW6%204QP&output=embed";
export const MAP_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=39+Harwood+Road+Fulham+London+SW6+4QP";

export const HOURS: { day: string; open: string; close: string }[] = [
  { day: "Monday", open: "10:00", close: "20:00" },
  { day: "Tuesday", open: "10:00", close: "20:00" },
  { day: "Wednesday", open: "10:00", close: "20:00" },
  { day: "Thursday", open: "10:00", close: "20:00" },
  { day: "Friday", open: "10:00", close: "20:00" },
  { day: "Saturday", open: "10:00", close: "20:00" },
  { day: "Sunday", open: "10:00", close: "20:00" },
];

export type PricePoint = { minutes: number; price: number };

export type Treatment = {
  id: string;
  title: string;
  tag?: string;
  description: string;
  prices: PricePoint[];
  image: string;
  alt: string;
};

const img = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=650&w=940`;

export const TREATMENTS: Treatment[] = [
  {
    id: "thai-traditional",
    title: "Traditional Thai Massage",
    tag: "Most Loved",
    description:
      "A refreshing full-body practice of rhythmic pressure, gentle stretches and joint mobilisations performed on a traditional Thai massage table. Relieves tension headaches, back pain, muscle soreness and joint stiffness.",
    prices: [
      { minutes: 60, price: 60 },
      { minutes: 90, price: 85 },
      { minutes: 120, price: 110 },
    ],
    image: img(34821383),
    alt: "Traditional Thai massage Fulham — therapist performing stretching techniques on a treatment table",
  },
  {
    id: "deep-tissue",
    title: "Deep Tissue Massage",
    description:
      "Sustained pressure with slow, firm strokes targeting the deeper layers of muscle and connective tissue. Ideal for sports-related strains, chronic knots and hard-won recovery.",
    prices: [
      { minutes: 60, price: 60 },
      { minutes: 90, price: 85 },
      { minutes: 120, price: 110 },
    ],
    image: img(37719539),
    alt: "Deep tissue massage Fulham London — firm back massage for muscle tension relief",
  },
  {
    id: "swedish",
    title: "Swedish Massage",
    description:
      "Soft, long kneading strokes with light rhythmic movement across the topmost layers of muscle, combined with gentle joint movement. Both relaxing and energising — a classic all-rounder.",
    prices: [
      { minutes: 60, price: 60 },
      { minutes: 90, price: 85 },
      { minutes: 120, price: 110 },
    ],
    image: img(37719545),
    alt: "Swedish massage near Fulham Broadway — calming back massage with long strokes",
  },
  {
    id: "aromatherapy",
    title: "Aromatherapy (Oil) Massage",
    description:
      "A Swedish-style oil massage using carefully blended essential oils, absorbed through the skin and inhaled for calm. Deeply soothing and perfect for melting away stress.",
    prices: [
      { minutes: 60, price: 60 },
      { minutes: 90, price: 85 },
      { minutes: 120, price: 110 },
    ],
    image: img(6629607),
    alt: "Aromatherapy oil massage Fulham — essential massage oil poured onto therapist hands",
  },
  {
    id: "hot-stone",
    title: "Hot Stone Massage",
    tag: "Warm & Deep",
    description:
      "Gently warmed basalt stones allow your therapist to work deeper into areas of concern. Expect relief from muscle tension, improved circulation and a lowered sense of stress and anxiety.",
    prices: [
      { minutes: 60, price: 65 },
      { minutes: 90, price: 90 },
      { minutes: 120, price: 120 },
    ],
    image: img(6187645),
    alt: "Hot stone massage Fulham SW6 — warmed basalt stones on the back for deep relaxation",
  },
  {
    id: "back-neck-shoulders",
    title: "Back, Neck & Shoulders",
    description:
      "A focused treatment that releases tension and spasms in the upper body, improves circulation and eases tension headaches and migraines. The perfect pick for desk-bound days.",
    prices: [
      { minutes: 30, price: 35 },
      { minutes: 60, price: 60 },
    ],
    image: img(5793694),
    alt: "Back neck and shoulders massage Fulham — focused upper body tension relief",
  },
  {
    id: "reflexology",
    title: "Foot Reflexology",
    description:
      "A classic foot massage that works wonders for circulation and stress relief, improves sleep and speeds recovery — ideal if you stand or walk a lot through your day.",
    prices: [
      { minutes: 30, price: 35 },
      { minutes: 60, price: 60 },
    ],
    image: img(6188032),
    alt: "Foot reflexology Fulham London — soothing foot massage for circulation and stress relief",
  },
  {
    id: "head-massage",
    title: "Head Massage",
    description:
      "Release the stress that has accumulated in the tissues, muscles and joints of the head, face, neck and shoulders.",
    prices: [{ minutes: 30, price: 35 }],
    image: img(5793705),
    alt: "Head massage Fulham — gentle scalp neck and shoulder tension release",
  },
];

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

export const HERO_IMAGE =
  "https://images.pexels.com/photos/6628586/pexels-photo-6628586.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1300&w=920";
export const ORCHID_IMAGE =
  "https://images.pexels.com/photos/12969383/pexels-photo-12969383.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700";
export const ABOUT_IMAGE =
  "https://images.pexels.com/photos/6188115/pexels-photo-6188115.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=880";

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

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Treatments & Prices", href: "#treatments" },
  { label: "Gift Vouchers", href: "#gift-vouchers" },
  { label: "Booking Policy", href: "#booking-policy" },
  { label: "FAQ", href: "#faq" },
  { label: "Location & Hours", href: "#location" },
  { label: "Contact", href: "#contact" },
];

export const PAYMENT_METHODS = ["Cash", "Visa", "Mastercard", "Amex", "Contactless"];
