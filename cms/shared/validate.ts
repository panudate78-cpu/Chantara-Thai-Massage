import { DAYS, type DayName } from "./site";
import { LIMITS } from "./limits";
import { CTA_DESTINATIONS } from "./types";
import type {
  BusinessDetails,
  CtaDestination,
  HomepageContent,
  OfferContent,
  SocialLinks,
  TreatmentContent,
  TreatmentPrice,
} from "./types";

export type FieldErrors = Record<string, string>;
export type ValidationResult<T> = { ok: true; value: T } | { ok: false; errors: FieldErrors };

type Raw = Record<string, unknown>;

const fail = <T>(errors: FieldErrors): ValidationResult<T> => ({ ok: false, errors });

const asRaw = (input: unknown): Raw =>
  input && typeof input === "object" && !Array.isArray(input) ? (input as Raw) : {};

/** Trim, remove control characters and collapse accidental whitespace. */
export function cleanText(input: unknown, { multiline = false, max = 500 } = {}): string {
  if (typeof input !== "string") return "";
  const stripped = input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  const normalised = multiline
    ? stripped.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n")
    : stripped.replace(/\s+/g, " ");
  return normalised.trim().slice(0, max + 1);
}

function tooLong(value: string, max: number): boolean {
  return value.length > max;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim()) && value.length <= LIMITS.email;
}

export function isValidPhone(value: string): boolean {
  const cleaned = value.replace(/[\s().-]/g, "");
  return /^(\+44|0044|0)\d{9,10}$/.test(cleaned) && value.length <= LIMITS.phone;
}

export function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function isValidHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname.includes("."));
  } catch {
    return false;
  }
}

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validateSocialLinks(input: unknown, errors: FieldErrors): SocialLinks {
  const raw = asRaw(input);
  const social: SocialLinks = {};
  (["instagram", "facebook", "google", "tiktok", "whatsapp"] as const).forEach((key) => {
    const value = cleanText(raw[key], { max: 400 });
    if (!value) return;
    if (!isValidHttpsUrl(value)) {
      errors[`social.${key}`] = "Enter a full web address starting with https://";
      return;
    }
    social[key] = value;
  });
  return social;
}

export function validateBusiness(input: unknown): ValidationResult<BusinessDetails> {
  const raw = asRaw(input);
  const errors: FieldErrors = {};

  const name = cleanText(raw.name, { max: LIMITS.businessName });
  if (!name) errors.name = "Add the business name.";
  else if (tooLong(name, LIMITS.businessName))
    errors.name = `Keep the business name under ${LIMITS.businessName} characters.`;

  const phone = cleanText(raw.phone, { max: LIMITS.phone });
  if (!phone) errors.phone = "Add a contact phone number.";
  else if (!isValidPhone(phone)) errors.phone = "Enter a UK phone number, e.g. 07387 769945.";

  const email = cleanText(raw.email, { max: LIMITS.email });
  if (!email) errors.email = "Add a contact email address.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";

  const addressLine1 = cleanText(raw.addressLine1, { max: LIMITS.addressLine });
  if (!addressLine1) errors.addressLine1 = "Add the first line of the address.";
  else if (tooLong(addressLine1, LIMITS.addressLine))
    errors.addressLine1 = `Keep this line under ${LIMITS.addressLine} characters.`;

  const addressLine2 = cleanText(raw.addressLine2, { max: LIMITS.addressLine });
  if (tooLong(addressLine2, LIMITS.addressLine))
    errors.addressLine2 = `Keep this line under ${LIMITS.addressLine} characters.`;

  const city = cleanText(raw.city, { max: LIMITS.city });
  if (!city) errors.city = "Add the town or city.";

  const postcode = cleanText(raw.postcode, { max: LIMITS.postcode });
  if (!postcode) errors.postcode = "Add the postcode.";

  const rawHours = Array.isArray(raw.hours) ? raw.hours : [];
  const hours = DAYS.map((day, index) => {
    const entry = asRaw(rawHours[index]);
    const closed = Boolean(entry.closed);
    const open = isValidTime(String(entry.open)) ? String(entry.open) : "10:00";
    const close = isValidTime(String(entry.close)) ? String(entry.close) : "20:00";
    if (!closed && open >= close) {
      errors[`hours.${index}`] = "Closing time must be after opening time.";
    }
    return { day: day as DayName, closed, open, close };
  });

  const social = validateSocialLinks(raw.social, errors);

  if (Object.keys(errors).length) return fail(errors);
  return {
    ok: true,
    value: {
      name,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      postcode,
      hours,
      social,
    },
  };
}

export function validateHomepage(input: unknown): ValidationResult<HomepageContent> {
  const raw = asRaw(input);
  const errors: FieldErrors = {};

  const heroEyebrow = cleanText(raw.heroEyebrow, { max: LIMITS.heroEyebrow });
  if (tooLong(heroEyebrow, LIMITS.heroEyebrow))
    errors.heroEyebrow = `Keep this line under ${LIMITS.heroEyebrow} characters.`;

  const heroHeading = cleanText(raw.heroHeading, {
    multiline: true,
    max: LIMITS.heroHeadingLine * 2 + 1,
  })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
  const headingLines = heroHeading ? heroHeading.split("\n") : [];
  if (!heroHeading) errors.heroHeading = "Add a headline for the top of the homepage.";
  else if (headingLines.length > 2)
    errors.heroHeading = "Use at most two lines for the headline.";
  else if (headingLines.some((line) => tooLong(line, LIMITS.heroHeadingLine)))
    errors.heroHeading = `Keep each headline line under ${LIMITS.heroHeadingLine} characters.`;

  const heroHeadingAccent = cleanText(raw.heroHeadingAccent, {
    max: LIMITS.heroHeadingAccent,
  });
  if (!heroHeadingAccent) errors.heroHeadingAccent = "Add the highlighted word or phrase.";
  else if (tooLong(heroHeadingAccent, LIMITS.heroHeadingAccent))
    errors.heroHeadingAccent = `Keep the highlighted word under ${LIMITS.heroHeadingAccent} characters.`;

  const heroDescription = cleanText(raw.heroDescription, { max: LIMITS.heroDescription });
  if (!heroDescription) errors.heroDescription = "Add a short description for the hero.";
  else if (tooLong(heroDescription, LIMITS.heroDescription))
    errors.heroDescription = `Keep the description under ${LIMITS.heroDescription} characters.`;

  const destinations = new Set(CTA_DESTINATIONS.map((d) => d.value));
  const cta = (prefix: "ctaPrimary" | "ctaSecondary", input2: unknown, required: boolean) => {
    const value = asRaw(input2);
    const label = cleanText(value.label, { max: LIMITS.ctaLabel });
    const destinationRaw = cleanText(value.destination, { max: 30 });
    const destination = (destinations.has(destinationRaw as CtaDestination)
      ? destinationRaw
      : "none") as CtaDestination;
    if (required && !label) errors[`${prefix}.label`] = "Add a label for this button.";
    else if (tooLong(label, LIMITS.ctaLabel))
      errors[`${prefix}.label`] = `Keep the label under ${LIMITS.ctaLabel} characters.`;
    return { label, destination };
  };

  const ctaPrimary = cta("ctaPrimary", raw.ctaPrimary, true);
  const ctaSecondary = cta("ctaSecondary", raw.ctaSecondary, false);

  if (Object.keys(errors).length) return fail(errors);
  return {
    ok: true,
    value: {
      heroEyebrow,
      heroHeading,
      heroHeadingAccent,
      heroDescription,
      ctaPrimary,
      ctaSecondary,
    },
  };
}

export function validatePrices(input: unknown, errors: FieldErrors): TreatmentPrice[] {
  const raw = Array.isArray(input) ? input : [];
  if (!raw.length) {
    errors.prices = "Add at least one duration and price.";
    return [];
  }
  if (raw.length > LIMITS.treatmentPrices) {
    errors.prices = `Add no more than ${LIMITS.treatmentPrices} price options.`;
    return [];
  }
  const prices: TreatmentPrice[] = [];
  const seen = new Set<number>();
  raw.forEach((entry, index) => {
    const value = asRaw(entry);
    const minutes = Number(value.minutes);
    const price = Number(value.price);
    if (!Number.isInteger(minutes) || minutes < 5 || minutes > 480) {
      errors[`prices.${index}.minutes`] = "Enter a duration in minutes (5–480).";
    } else if (seen.has(minutes)) {
      errors[`prices.${index}.minutes`] = "Each duration can only appear once.";
    } else {
      seen.add(minutes);
    }
    if (!Number.isFinite(price) || price < 0 || price > 5000) {
      errors[`prices.${index}.price`] = "Enter a price in pounds (0–5000).";
    }
    if (!errors[`prices.${index}.minutes`] && !errors[`prices.${index}.price`]) {
      prices.push({ minutes, price: Math.round(price) });
    }
  });
  prices.sort((a, b) => a.minutes - b.minutes);
  return prices;
}

export type TreatmentInput = Pick<
  TreatmentContent,
  "title" | "tag" | "description" | "prices"
>;

export function validateTreatment(input: unknown): ValidationResult<TreatmentInput> {
  const raw = asRaw(input);
  const errors: FieldErrors = {};

  const title = cleanText(raw.title, { max: LIMITS.treatmentTitle });
  if (!title) errors.title = "Add the treatment name.";
  else if (tooLong(title, LIMITS.treatmentTitle))
    errors.title = `Keep the name under ${LIMITS.treatmentTitle} characters.`;

  const description = cleanText(raw.description, {
    multiline: true,
    max: LIMITS.treatmentDescription,
  });
  if (!description) errors.description = "Add a short description of the treatment.";
  else if (tooLong(description, LIMITS.treatmentDescription))
    errors.description = `Keep the description under ${LIMITS.treatmentDescription} characters.`;

  const tag = cleanText(raw.tag, { max: LIMITS.treatmentTag });
  if (tooLong(tag, LIMITS.treatmentTag))
    errors.tag = `Keep the badge under ${LIMITS.treatmentTag} characters.`;

  const prices = validatePrices(raw.prices, errors);

  if (Object.keys(errors).length) return fail(errors);
  return {
    ok: true,
    value: { title, tag: tag || null, description, prices },
  };
}

export type OfferInput = Omit<OfferContent, "id">;

export function validateOffer(input: unknown): ValidationResult<OfferInput> {
  const raw = asRaw(input);
  const errors: FieldErrors = {};

  const title = cleanText(raw.title, { max: LIMITS.offerTitle });
  if (!title) errors.title = "Add a title for the offer.";
  else if (tooLong(title, LIMITS.offerTitle))
    errors.title = `Keep the title under ${LIMITS.offerTitle} characters.`;

  const description = cleanText(raw.description, { max: LIMITS.offerDescription });
  if (!description) errors.description = "Describe the offer in a sentence or two.";
  else if (tooLong(description, LIMITS.offerDescription))
    errors.description = `Keep the description under ${LIMITS.offerDescription} characters.`;

  const badge = cleanText(raw.badge, { max: LIMITS.offerBadge });
  if (tooLong(badge, LIMITS.offerBadge))
    errors.badge = `Keep the badge under ${LIMITS.offerBadge} characters.`;

  const startsOn = cleanText(raw.startsOn, { max: 10 });
  const endsOn = cleanText(raw.endsOn, { max: 10 });
  if (!isValidDate(startsOn)) errors.startsOn = "Choose a start date.";
  if (!isValidDate(endsOn)) errors.endsOn = "Choose an end date.";
  if (isValidDate(startsOn) && isValidDate(endsOn) && endsOn < startsOn)
    errors.endsOn = "The end date must be on or after the start date.";

  if (Object.keys(errors).length) return fail(errors);
  return {
    ok: true,
    value: {
      title,
      description,
      badge: badge || null,
      startsOn,
      endsOn,
      enabled: raw.enabled !== false,
    },
  };
}

export function validateGalleryMeta(
  input: unknown
): ValidationResult<{ alt: string; caption: string | null }> {
  const raw = asRaw(input);
  const errors: FieldErrors = {};
  const alt = cleanText(raw.alt, { max: LIMITS.galleryAlt });
  if (!alt) errors.alt = "Alt text is required — it helps Google and screen readers.";
  else if (alt.length < LIMITS.galleryAltMin)
    errors.alt = `Describe the photo in at least ${LIMITS.galleryAltMin} characters.`;
  else if (tooLong(alt, LIMITS.galleryAlt))
    errors.alt = `Keep alt text under ${LIMITS.galleryAlt} characters.`;

  const caption = cleanText(raw.caption, { max: LIMITS.galleryCaption });
  if (tooLong(caption, LIMITS.galleryCaption))
    errors.caption = `Keep the caption under ${LIMITS.galleryCaption} characters.`;

  if (Object.keys(errors).length) return fail(errors);
  return { ok: true, value: { alt, caption: caption || null } };
}

export function validatePassword(password: unknown): string | null {
  if (typeof password !== "string") return "Enter a password.";
  if (password.length < LIMITS.passwordMin)
    return `Use at least ${LIMITS.passwordMin} characters.`;
  if (password.length > 200) return "That password is too long.";
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
    return "Include at least one letter and one number.";
  return null;
}

/** Used by the admin UI to show friendly remaining characters. */
export function countLabel(value: string, max: number): string {
  return `${value.length}/${max}`;
}
