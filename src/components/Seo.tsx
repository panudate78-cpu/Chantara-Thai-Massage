import { useEffect } from "react";
import {
  ADDRESS_LINES,
  BOOKING_URL,
  EMAIL,
  GIFT_CARD_URL,
  GOOGLE_REVIEWS_URL,
  HOURS,
  REVIEWS,
  SITE_URL,
  TREATMENTS,
} from "../data";

/** Inject JSON-LD structured data into <head> once on mount. */
export default function Seo() {
  useEffect(() => {
    const existing = document.getElementById("chantara-jsonld");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = "chantara-jsonld";
    script.type = "application/ld+json";
    script.text = JSON.stringify(buildGraph());
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}

function buildGraph() {
  const telephone = "+44-7387-769945";
  const streetAddress = "39 Harwood Road";
  const addressLocality = "Fulham";
  const addressRegion = "London";
  const postalCode = "SW6 4QP";
  const addressCountry = "GB";

  const openingHoursSpecification = HOURS.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.day,
    opens: h.open,
    closes: h.close,
  }));

  const localBusiness = {
    "@type": ["MassageTherapy", "HealthAndBeautyBusiness", "LocalBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: "Chantara Thai Massage",
    alternateName: ["Chantara Thai Massage Fulham", "Chantara Thai Massage London"],
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
    email: EMAIL,
    priceRange: "££",
    currenciesAccepted: "GBP",
    paymentAccepted: "Cash, Credit Card, Debit Card, Visa, Mastercard, American Express, Contactless",
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode,
      addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.4805,
      longitude: -0.195,
    },
    hasMap: "https://www.google.com/maps?q=39+Harwood+Road+Fulham+London+SW6+4QP",
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
    sameAs: [GOOGLE_REVIEWS_URL, BOOKING_URL, GIFT_CARD_URL],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "60",
      reviewCount: "60",
    },
    review: REVIEWS.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewBody: r.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
    })),
    makesOffer: TREATMENTS.map((t) => ({
      "@type": "Offer",
      name: t.title,
      description: t.description,
      url: `${SITE_URL}/#treatments`,
      availability: "https://schema.org/InStock",
      priceCurrency: "GBP",
      price: String(t.prices[0]?.price ?? 0),
      priceValidUntil: "2027-12-31",
      itemOffered: {
        "@type": "Service",
        name: t.title,
        description: t.description,
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
    name: "Chantara Thai Massage",
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
    name: "Chantara Thai Massage",
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
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode,
      addressCountry,
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
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
      {
        "@type": "ListItem",
        position: 5,
        name: "Contact",
        item: `${SITE_URL}/#contact`,
      },
      {
        "@type": "ListItem",
        position: 6,
        name: "FAQ",
        item: `${SITE_URL}/#faq`,
      },
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
          text: `Chantara Thai Massage is at ${ADDRESS_LINES.join(", ")}. We are a 3-minute walk from Fulham Broadway underground station on the District line.`,
        },
      },
      {
        "@type": "Question",
        name: "What are your opening hours?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We are open 7 days a week, Monday to Sunday, from 10:00 to 20:00.",
        },
      },
      {
        "@type": "Question",
        name: "How do I book a Thai massage in Fulham?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `You can book online via Picktime at ${BOOKING_URL}, or call us on 07387 769945. A £10 deposit is required for online bookings and is deducted from your total.`,
        },
      },
      {
        "@type": "Question",
        name: "What types of massage do you offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer Traditional Thai Massage, Deep Tissue, Swedish, Aromatherapy (Oil), Hot Stone, Back Neck & Shoulders, Foot Reflexology, Head Massage, Couples Massage and combo packages.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer pregnancy massage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, pregnancy massages are available. Please call us first to discuss your stage of pregnancy and the most suitable treatment before booking.",
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
          text: `Yes. Gift vouchers can be purchased online and are only valid when booking directly by phone, WhatsApp or SMS — not via Picktime online bookings.`,
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
