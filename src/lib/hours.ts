import { DAYS } from "../../cms/shared/site";
import type { OpeningHours } from "../../cms/shared/types";

/** JS getDay(): 0 = Sunday. Our list starts on Monday. */
export function todayHours(hours: OpeningHours[]): OpeningHours | null {
  const index = (new Date().getDay() + 6) % 7;
  return hours[index] ?? null;
}

export function openDays(hours: OpeningHours[]): OpeningHours[] {
  return hours.filter((entry) => !entry.closed);
}

/** "10:00 – 20:00" across the week, or "Varied hours" when they differ. */
export function weeklyHoursLabel(hours: OpeningHours[]): string {
  const open = openDays(hours);
  if (!open.length) return "Closed";
  const opens = [...new Set(open.map((entry) => entry.open))];
  const closes = [...new Set(open.map((entry) => entry.close))];
  if (opens.length === 1 && closes.length === 1) {
    return `${opens[0]} – ${closes[0]}`;
  }
  return "See opening hours";
}

export function daysOpenLabel(hours: OpeningHours[]): string {
  const count = openDays(hours).length;
  if (count === 7) return "Open 7 days";
  if (count === 0) return "Closed";
  return `Open ${count} day${count === 1 ? "" : "s"}`;
}

export function isOpenToday(hours: OpeningHours[]): boolean {
  const today = todayHours(hours);
  return Boolean(today && !today.closed);
}

/** Sorted copy of the hours in the canonical Monday → Sunday order. */
export function orderedHours(hours: OpeningHours[]): OpeningHours[] {
  return DAYS.map((day) => {
    const match = hours.find((entry) => entry.day === day);
    return match ?? { day, closed: true, open: "10:00", close: "20:00" };
  });
}
