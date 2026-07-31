"use client";

import { useState } from "react";
import type { ItemOfDay } from "../../types/item";
import type { DailyGameState, SlotColor } from "../../types/game-state";
import {
  TEMPERATURE_BAND_EMOJI,
  kmRatio,
  temperatureBand,
  yearRatio,
} from "../round3/round3.logic";
import { Button } from "../Button";

const SLOT_EMOJI: Record<SlotColor, string> = { green: "🟩", gray: "⬜" };

function buildShareText(item: ItemOfDay, state: DailyGameState): string {
  const round1Line = Array.from({ length: item.composition.length }, (_, i) => {
    const color = state.round1.feedback?.[i];
    return color ? SLOT_EMOJI[color] : "⬜";
  }).join("");

  const round2Line = (state.round2.feedback ?? []).map((c) => SLOT_EMOJI[c]).join("");

  const yearBand =
    state.round3.yearDiff !== null
      ? temperatureBand(yearRatio(state.round3.yearDiff, item.origin.minYear, item.origin.maxYear))
      : null;
  const kmBand = state.round3.kmDiff !== null ? temperatureBand(kmRatio(state.round3.kmDiff)) : null;
  const round3Line = [yearBand, kmBand]
    .filter((b): b is NonNullable<typeof b> => b !== null)
    .map((b) => TEMPERATURE_BAND_EMOJI[b])
    .join("");

  return [
    `Item of the Day — ${item.name}`,
    state.dateKey,
    "",
    `Round 1: ${round1Line}`,
    `Round 2: ${round2Line}`,
    `Round 3: ${round3Line}`,
  ].join("\n");
}

export function ShareCard({ item, state }: { item: ItemOfDay; state: DailyGameState }) {
  const [copied, setCopied] = useState(false);
  const text = buildShareText(item, state);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied — button just won't flip to "Copied!".
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border-2 border-zinc-200 p-4 dark:border-zinc-800">
      <pre className="whitespace-pre-wrap font-sans text-sm">{text}</pre>
      <Button onClick={handleCopy}>{copied ? "Copied!" : "Copy result"}</Button>
    </div>
  );
}
