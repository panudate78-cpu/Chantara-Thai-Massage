import { useEffect } from "react";
import {
  BOOKING_URL,
  GIFT_CARD_URL,
  GOOGLE_REVIEWS_URL,
  REVIEWS,
  SITE_URL,
  addressLines,
  phoneE164,
} from "../data";
import { useContent } from "../content/ContentContext";
import { daysOpenLabel, weeklyHoursLabel } from "../lib/hours";
import type { SiteContent } from "../data";

/**
 * Structured data is generated in code from the editable content.
 *
 * The business owner can change names, prices and opening hours, but cannot
 * change the schema types, the canonical URL, the page slug or the sitemap —
 * that is what keeps the rich results (and search rankings) intact.
 */
export default function Seo() {
  const content = useContent();

  useEffect(() => {
    const existing = document.getElementById("chantara-jsonld");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = "chantara-jsonld";
    script.type = "application/ld+json";
    script.text = JSON.stringify(buildGraph(content));
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [content]);

  return null;
}

function buildGraph(content: SiteContent) {
  const { business, treatments } = content;
  const telephone = phoneE164(business.phone);
  const lines = addressLines(business);
  const sameAs = Array.from(
    new Set(
      [GOOGLE_REVIEWS_URL, BOOKING_URL, GIFT_CARD_URL, ...Object.values(business.social)].filter(
        (value): value is string => Boolean(value)
      )
    )
  );

  const openingHoursSpecification = business.hours
    .filter((hours) => !hours.closed)
    .map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.day,
      opens: hours.open,
      closes: hours.close,
    }));

  const localBusiness = {
    "@type": ["MassageTherapy", "HealthAndBeautyBusiness", "LocalBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: business.name,
    alternateName: [`${business.name} Fulham`, `${business.name} London`],
    description:
      "Professional traditional Thai massage in Fulham, London. Authentic Thai, deep tissue, Swedish, aromatherapy, hot stone, foot reflexology and head massage near Fulham Broadway station. Open 7 days a week.",
    url: SITE_URL,
    image: [`${SITE_URL}/logo.png`, `${SITE_URL}/og-image.jpg`],
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    telephone,
    email: business.email,
    priceRange: "££",
    currenciesAccepted: "GBP",
    paymentAccepted: "Cash, Credit Card, Debit Card, Visa, Mastercard, American Express, Contactless",
    address: {
      "@type": "PostalAddress",
      streetAddress: lines[0] ?? business.addressLine1,
      addressLocality: business.addressLine2 || business.city,
      addressRegion: business.city,
      postalCode: business.postcode,
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.4805,
      longitude: -0.195,
    },
    hasMap: `https://www.google.com/maps?q=${encodeURIComponent(lines.join(", "))}`,
    openingHoursSpecification,
    areaServed: [
      { "@type": "City", name: "Fulham" },
      { "@type": "City", name: "London" },
      { "@type": "AdministrativeArea", name: "SW6" },
      { "@type": "Place", name: "Fulham Broadway" },
      { "@type": "Place", name: "Parsons Green" },
      { "@type": "Place", name: "Chelsea" },
      { "@type": "Place", name: "Hammersmith" },
    ],
    sameAs,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "60",
      reviewCount: "60",
    },
    review: REVIEWS.slice(0, 5).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.name },
      reviewBody: review.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
    })),
    makesOffer: treatments.map((treatment) => ({
      "@type": "Offer",
      name: treatment.title,
      description: treatment.description,
      url: `${SITE_URL}/#treatments`,
      availability: "https://schema.org/InStock",
      priceCurrency: "GBP",
      price: String(treatment.prices[0]?.price ?? 0),
      priceValidUntil: "2027-12-31",
      itemOffered: {
        "@type": "Service",
        name: treatment.title,
        description: treatment.description,
        provider: { "@id": `${SITE_URL}/#business` },
        areaServed: "Fulham, London",
        serviceType: "Massage therapy",
      },
    })),
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: BOOKING_URL,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "Reservation",
        name: "Massage appointment",
      },
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: business.name,
    description: "Traditional Thai massage in Fulham, London SW6 near Fulham Broadway.",
    publisher: { "@id": `${SITE_URL}/#business` },
    inLanguage: "en-GB",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/#treatments`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organization = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: business.name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone,
      contactType: "customer service",
      areaServed: "GB",
      availableLanguage: ["English", "Thai"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: lines[0] ?? business.addressLine1,
      addressLocality: business.addressLine2 || business.city,
      addressRegion: business.city,
      postalCode: business.postcode,
      addressCountry: "GB",
    },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: "Thai Massage Fulham | Chantara Thai Massage London SW6",
    description:
      "Professional traditional Thai massage in Fulham, London. Deep tissue, Swedish, hot stone and reflexology near Fulham Broadway. Open 7 days.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#business` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-image.jpg`,
    },
    inLanguage: "en-GB",
    breadcrumb: { "@id": `${SITE_URL}/#breadcrumb` },
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Treatments & Prices",
        item: `${SITE_URL}/#treatments`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Gift Vouchers",
        item: `${SITE_URL}/#gift-vouchers`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Location & Hours",
        item: `${SITE_URL}/#location`,
      },
      { "@type": "ListItem", position: 5, name: "Contact", item: `${SITE_URL}/#contact` },
      { "@type": "ListItem", position: 6, name: "FAQ", item: `${SITE_URL}/#faq` },
    ],
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faqpage`,
    mainEntity: [
      {
        "@type": "Question",
        name: "Where is Chantara Thai Massage located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `${business.name} is at ${lines.join(", ")}. We are a 3-minute walk from Fulham Broadway underground station on the District line.`,
        },
      },
      {
        "@type": "Question",
        name: "What are your opening hours?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `${daysOpenLabel(business.hours)}. ${weeklyHoursLabel(business.hours)}.`,
        },
      },
      {
        "@type": "Question",
        name: "How do I book a Thai massage in Fulham?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `You can book online via Picktime at ${BOOKING_URL}, or call us on ${business.phone}. A £10 deposit is required for online bookings and is deducted from your total.`,
        },
      },
      {
        "@type": "Question",
        name: "What types of massage do you offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `We offer ${treatments
            .map((treatment) => treatment.title)
            .join(", ")}, Couples Massage and combo packages.`,
        },
      },
      {
        "@type": "Question",
        name: "Do you offer pregnancy massage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, pregnancy massages are available. Please call ${business.phone} first to discuss your stage of pregnancy and the most suitable treatment before booking.`,
        },
      },
      {
        "@type": "Question",
        name: "Is there parking near Chantara Thai Massage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Parking is available at Fulham Broadway Station MSCP, as well as paid on-street parking locally.",
        },
      },
      {
        "@type": "Question",
        name: "Can I buy a gift voucher for a massage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Gift vouchers can be purchased online and are only valid when booking directly by phone, WhatsApp or SMS — not via Picktime online bookings.",
        },
      },
      {
        "@type": "Question",
        name: "What is Ladies' Day at Chantara?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every Thursday is Ladies' Day — a 60-minute massage of your choice for £50 (excluding Hot Stone).",
        },
      },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, localBusiness, website, webPage, breadcrumb, faqPage],
  };
}

