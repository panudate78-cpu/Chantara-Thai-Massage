import type { OfferContent, TreatmentPrice } from "../../../cms/shared/types";

export function formatDateLong(value: string): string {
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function formatDateShort(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function relativeTime(iso: string): string {
  const date = new Date(iso);
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (Number.isNaN(seconds)) return "";
  if (seconds < 60) return "Just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function priceSummary(prices: TreatmentPrice[]): string {
  if (!prices.length) return "No prices yet";
  if (prices.length === 1) return `${prices[0].minutes} min · £${prices[0].price}`;
  return prices.map((price) => `${price.minutes} min £${price.price}`).join("  ·  ");
}

export function priceRange(prices: TreatmentPrice[]): string {
  if (!prices.length) return "—";
  const amounts = prices.map((price) => price.price);
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  return min === max ? `£${min}` : `£${min}–£${max}`;
}

export type OfferStatus = {
  key: "live" | "scheduled" | "ended" | "disabled";
  label: string;
  tone: "green" | "blue" | "neutral" | "red";
};

export function offerStatus(offer: OfferContent, today = todayIso()): OfferStatus {
  if (!offer.enabled) return { key: "disabled", label: "Hidden", tone: "neutral" };
  if (offer.startsOn > today) return { key: "scheduled", label: "Scheduled", tone: "blue" };
  if (offer.endsOn < today) return { key: "ended", label: "Ended", tone: "red" };
  return { key: "live", label: "Live now", tone: "green" };
}

export function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
