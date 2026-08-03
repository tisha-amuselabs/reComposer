import type { ItemOfDay } from "../../vansh/types/item";

export type HintRound = "round1" | "round2" | "round3";

export interface Round1HintContext {
  assignments: (string | null)[];
}

export interface Round2HintContext {
  inventory: string[];
}

export interface Round3HintContext {
  year: number | null;
  lat: number | null;
  lng: number | null;
}

export type HintContext = Round1HintContext | Round2HintContext | Round3HintContext;

const PREAMBLE = `You are a playful hint-giver inside a daily trivia game called "Item of the Day". A player is trying to figure out facts about a real manufactured item. Reply with exactly ONE short hint — at most two sentences, no lists, no preamble like "Hint:" — that nudges the player closer to the correct answer WITHOUT ever stating it directly. Never state exact element symbols/percentages, exact ingredient or action names from the true recipe, or the exact year/country/city in this round's true answer. Speak in categories, properties, eras, or broad regions instead. Keep the tone warm, curious, and encouraging — never condescending.`;

export function buildHintPrompt(item: ItemOfDay, round: HintRound, context: HintContext): string {
  if (round === "round1") {
    const ctx = context as Round1HintContext;
    const trueList = item.composition.map((c) => `${c.symbol} at ${c.approxPercent}%`).join(", ");
    const guessed = item.composition
      .map(
        (c, i) =>
          `slot ${i + 1} (${c.approxPercent}% by mass) is currently ${ctx.assignments?.[i] ?? "empty"}`
      )
      .join("; ");
    return `${PREAMBLE}

Item: ${item.name}. Round: guess which element belongs in each of ${item.composition.length} mass-ranked slots.
True answer, never state directly: ${trueList}.
Player's current slots: ${guessed}.
Pick ONE slot they have wrong or empty and hint at that element's category (metal/nonmetal/etc.), a common everyday use, or a well-known property — never its name, symbol, or exact percentage.`;
  }

  if (round === "round2") {
    const ctx = context as Round2HintContext;
    const recipe = item.alchemy;
    const chain = recipe.combinations
      .map(
        (c, i) =>
          `${i + 1}. ${recipe.nodes[c.inputs[0]]?.label} + ${recipe.nodes[c.inputs[1]]?.label} -> ${recipe.nodes[c.result]?.label}`
      )
      .join("; ");
    const discovered =
      (ctx.inventory ?? []).map((id) => recipe.nodes[id]?.label ?? id).join(", ") || "nothing yet";
    return `${PREAMBLE}

Item: ${item.name}. Round: combine two materials/actions at a time on a workspace to synthesize the item, Little-Alchemy style.
True combination chain, never state directly: ${chain}.
Player's inventory so far: ${discovered}.
Describe, in general terms, what KIND of items interact for the player's next useful combination (e.g. "one of your liquids and a mechanical action") — never name the two specific items or the result.`;
  }

  const ctx = context as Round3HintContext;
  return `${PREAMBLE}

Item: ${item.name}. Round: guess the year and place it was first made/invented.
True answer, never state directly: ${item.origin.yearLabel}, ${item.origin.locationName}.
Player's current guess: year ${ctx.year ?? "not set"}, location ${
    ctx.lat != null && ctx.lng != null ? `around ${ctx.lat.toFixed(1)}, ${ctx.lng.toFixed(1)}` : "not set"
  }.
Hint at the era (e.g. "earlier than you'd think" or "this was a 20th-century breakthrough") or the broad region/continent — never the exact year, country, or city.`;
}
