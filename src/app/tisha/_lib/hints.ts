import type { HintLevel, ItemId, ProcessHint } from "./types";

/**
 * Pick the best unused hint for the player's current discoveries.
 * Prefers contextual hints, then escalates by level.
 */
export function pickHint(
  hints: ProcessHint[],
  inventory: ItemId[],
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
