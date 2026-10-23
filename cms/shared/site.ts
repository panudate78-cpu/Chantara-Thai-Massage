/**
 * Fixed site-wide configuration.
 *
 * These values are intentionally NOT editable in the admin panel: they are the
 * technical foundation of the site (canonical domain, booking engine, schema
 * markup targets) and are shared by the public site, the API and the SEO layer.
 */

export const SITE_URL = "https://www.chantarathaimassage.com";
export const SITE_SLUG = "chantara-thai-massage";
export const SITE_NAME = "Chantara Thai Massage";

export const BOOKING_URL = "https://www.picktime.com/Chantarathaimassage";
export const GIFT_CARD_URL = "https://giftcard.sumup.io/order/G766F08/chantara-thai-massage";
export const WHATSAPP_URL = "https://wa.me/447387769945";

export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=Chantara+Thai+Massage&stick=H4sIAAAAAAAA_-NgU1I1qDCxMDczSDO2TLE0NzRKtjC3MqgA8g2BgsmGiYmGKYkWqYtYRZ0zEvNKEosSFUIyEjMVfBOLixPTUwHQiKleQQAAAA&hl=en&mat=CYRhtp0bylPXElcBzAmVZlXGwcd2pfSKunfpr2dxotZAEm05rgdMdaSvBm1k_45Dr_bonD17HN_f79p76RDv883wUm7MQxYFV9704oOeM-fpVZxa24ic67lgV66daDF2m0k&authuser=0&ved=1t:350944#";

export const PHONE_DISPLAY = "07387 769945";
export const EMAIL = "info@chantarathaimassage.com";

/** Registered location — used for geo meta tags and LocalBusiness schema. */
export const GEO = { latitude: 51.4805, longitude: -0.195 };

export const HERO_IMAGE =
  "https://images.pexels.com/photos/6628586/pexels-photo-6628586.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1300&w=920";
export const ORCHID_IMAGE =
  "https://images.pexels.com/photos/12969383/pexels-photo-12969383.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700";
export const ABOUT_IMAGE =
  "https://images.pexels.com/photos/6188115/pexels-photo-6188115.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=880";

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

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type DayName = (typeof DAYS)[number];
