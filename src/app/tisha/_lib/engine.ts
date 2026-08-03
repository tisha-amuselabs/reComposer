import type { ItemId, Recipe } from "./types";

/** Order-independent recipe match. Returns the result id or null. */
export function combine(
  a: ItemId,
  b: ItemId,
  recipes: Recipe[],
): ItemId | null {
  if (a === b) return null;

  const pair = new Set([a, b]);
  for (const recipe of recipes) {
    if (pair.has(recipe.inputs[0]) && pair.has(recipe.inputs[1])) {
      return recipe.result;
    }
  }
  return null;
}
