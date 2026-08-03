import type { AlchemyRecipe } from "../../types/item";

/** Order-independent recipe match. Returns the result id or null. */
export function combine(recipe: AlchemyRecipe, a: string, b: string): string | null {
  if (a === b) return null;
  const pair = new Set([a, b]);
  for (const combo of recipe.combinations) {
    if (pair.has(combo.inputs[0]) && pair.has(combo.inputs[1])) {
      return combo.result;
    }
  }
  return null;
}

export function totalSteps(recipe: AlchemyRecipe): number {
  return recipe.combinations.length;
}
