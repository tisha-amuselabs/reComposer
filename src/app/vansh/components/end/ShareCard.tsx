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

const SLOT_EMOJI: Record<SlotColor, string> = { green: "🟩", yellow: "🟨", gray: "⬜" };

function buildShareText(item: ItemOfDay, state: DailyGameState): string {
  const round1Line = Array.from({ length: item.composition.length }, (_, i) => {
    const color = state.round1.feedback?.[i];
    return color ? SLOT_EMOJI[color] : "⬜";
  }).join("");

  const alchemyTotal = state.alchemy.totalRequired ?? 0;
  const alchemyCorrect = state.alchemy.correctCount ?? 0;
  const alchemyLine = Array.from({ length: alchemyTotal }, (_, i) =>
    i < alchemyCorrect ? "🟩" : "⬜"
  ).join("");

  const yearBand =
    state.round3.yearDiff !== null
      ? temperatureBand(yearRatio(state.round3.yearDiff))
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
    `Round 2: ${alchemyLine}`,
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
    <div className="materia-panel flex flex-col gap-4 rounded-xl p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
      <div>
        <p className="materia-label mb-3">Session export</p>
        <pre className="whitespace-pre-wrap font-mono text-xs leading-5 text-[#c4c6cd]">{text}</pre>
      </div>
      <Button className="shrink-0" onClick={handleCopy}>
        {copied ? "Report copied" : "Export report"}
      </Button>
    </div>
  );
}
