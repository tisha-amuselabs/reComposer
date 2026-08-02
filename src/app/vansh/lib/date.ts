import type { ItemOfDay } from "../types/item";
import { ITEMS } from "../data/items";

// Local midnight of "puzzle #1" — matches the app's launch day.
const EPOCH = new Date(2026, 6, 30);

export function getLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getPuzzleNumber(date: Date): number {
  const start = new Date(EPOCH.getFullYear(), EPOCH.getMonth(), EPOCH.getDate()).getTime();
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return Math.floor((target - start) / 86_400_000) + 1;
}

export function itemForDate(date: Date): ItemOfDay {
  const n = getPuzzleNumber(date);
  const idx = ((n - 1) % ITEMS.length + ITEMS.length) % ITEMS.length;
  return ITEMS[idx];
}
