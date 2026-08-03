import type { ItemId, Recipe } from "./types";

function sameMultiset(a: ItemId[], b: ItemId[]): boolean {
  if (a.length !== b.length) return false;
  const counts = new Map<ItemId, number>();
  for (const id of a) counts.set(id, (counts.get(id) ?? 0) + 1);
  for (const id of b) {
    const n = counts.get(id);
    if (!n) return false;
    if (n === 1) counts.delete(id);
    else counts.set(id, n - 1);
  }
  return counts.size === 0;
}

/** Apply an action to selected materials. Returns products or null. */
export function applyAction(
  actionId: string,
  inputIds: ItemId[],
  recipes: Recipe[],
): ItemId[] | null {
  for (const recipe of recipes) {
    if (recipe.action !== actionId) continue;
    if (sameMultiset(recipe.inputs, inputIds)) {
      return [...recipe.results];
    }
  }
  return null;
}
