import type { HintLevel, ProcessHint, ProcessRecipe } from "../../types/item";
import type { SlotColor } from "../../types/game-state";

function sameMultiset(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const counts = new Map<string, number>();
  for (const id of a) counts.set(id, (counts.get(id) ?? 0) + 1);
  for (const id of b) {
    const n = counts.get(id);
    if (!n) return false;
    if (n === 1) counts.delete(id);
    else counts.set(id, n - 1);
  }
  return counts.size === 0;
}

export function applyProcessAction(
  actionId: string,
  inputIds: string[],
  recipes: ProcessRecipe[],
): ProcessRecipe | null {
  for (const recipe of recipes) {
    if (recipe.action !== actionId) continue;
    if (sameMultiset(recipe.inputs, inputIds)) return recipe;
  }
  return null;
}

/** Green if the player unlocked that manufacturing step at some point. */
export function computeChamberFeedback(
  completedSteps: string[],
  correctStepIds: string[],
): SlotColor[] {
  const done = new Set(completedSteps);
  return correctStepIds.map((id) => (done.has(id) ? "green" : "gray"));
}

export function materialName(
  materials: { id: string; name: string }[],
  id: string,
): string {
  return materials.find((m) => m.id === id)?.name ?? id;
}

/**
 * Pick the best unused hint for the player's current discoveries.
 * Prefers contextual hints, then escalates by level.
 */
export function pickProcessHint(
  hints: ProcessHint[],
  inventory: string[],
  usedIds: string[],
  minLevel: HintLevel = 1,
): ProcessHint | null {
  const have = new Set(inventory);
  const used = new Set(usedIds);

  const matches = (h: ProcessHint) => {
    if (used.has(h.id) || h.level < minLevel) return false;
    if (h.whenHas && !h.whenHas.every((id) => have.has(id))) return false;
    if (h.whenMissing && !h.whenMissing.every((id) => !have.has(id)))
      return false;
    return true;
  };

  for (const level of [1, 2, 3] as HintLevel[]) {
    if (level < minLevel) continue;
    const contextual = hints.filter(
      (h) => h.level === level && matches(h) && (h.whenHas || h.whenMissing),
    );
    if (contextual.length) return contextual[0];
    const any = hints.find((h) => h.level === level && matches(h));
    if (any) return any;
  }
  return null;
}
