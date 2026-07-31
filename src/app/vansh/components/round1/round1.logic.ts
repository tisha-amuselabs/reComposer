import type { ElementGuessTarget } from "../../types/item";
import type { SlotColor } from "../../types/game-state";

export function computeRound1Feedback(
  assignments: (string | null)[],
  trueComposition: ElementGuessTarget[]
): SlotColor[] {
  return trueComposition.map((truth, i) => (assignments[i] === truth.symbol ? "green" : "gray"));
}
