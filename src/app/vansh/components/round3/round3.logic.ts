import type { TemperatureBand } from "../../types/game-state";

const KM_GAMEPLAY_CEILING = 10_000;
const YEAR_GAMEPLAY_CEILING = 200;
export const YEAR_GUESS_MIN = 0;
export const YEAR_GUESS_MAX = 2026;

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function temperatureBand(ratio: number): TemperatureBand {
  if (ratio <= 0.05) return "green";
  if (ratio <= 0.15) return "yellowgreen";
  if (ratio <= 0.35) return "yellow";
  if (ratio <= 0.65) return "orange";
  return "red";
}

export function yearRatio(yearDiff: number): number {
  return clamp01(yearDiff / YEAR_GAMEPLAY_CEILING);
}

export function kmRatio(kmDiff: number): number {
  return clamp01(kmDiff / KM_GAMEPLAY_CEILING);
}

export const TEMPERATURE_BAND_COLORS: Record<TemperatureBand, string> = {
  green: "bg-green-500",
  yellowgreen: "bg-lime-500",
  yellow: "bg-yellow-400",
  orange: "bg-orange-500",
  red: "bg-red-500",
};

export const TEMPERATURE_BAND_EMOJI: Record<TemperatureBand, string> = {
  green: "🟩",
  yellowgreen: "🟩",
  yellow: "🟨",
  orange: "🟧",
  red: "🟥",
};
