import type { ElementGuessTarget } from "../../types/item";
import type { SlotColor } from "../../types/game-state";

export const ROUND1_EXACT_POINTS = 2;
export const ROUND1_PARTIAL_POINTS = 1;

export function computeRound1Feedback(
  assignments: (string | null)[],
  trueComposition: ElementGuessTarget[]
): SlotColor[] {
  const feedback: SlotColor[] = trueComposition.map((truth, index) =>
    assignments[index] === truth.symbol ? "green" : "gray"
  );
  const remainingSymbols = new Set(
    trueComposition
      .filter((_truth, index) => feedback[index] !== "green")
      .map((truth) => truth.symbol)
  );

  assignments.forEach((guess, index) => {
    if (feedback[index] === "green" || !guess || !remainingSymbols.has(guess)) return;
    feedback[index] = "yellow";
    remainingSymbols.delete(guess);
  });

  return feedback;
}

export function round1Score(feedback: SlotColor[] | null) {
  const exact = feedback?.filter((value) => value === "green").length ?? 0;
  const partial = feedback?.filter((value) => value === "yellow").length ?? 0;
  return {
    exact,
    partial,
    points: exact * ROUND1_EXACT_POINTS + partial * ROUND1_PARTIAL_POINTS,
  };
}
