/**
 * @deprecated Import from `./puzzles` and `./items` instead.
 * Kept so older imports of the first puzzle still resolve.
 */
import { items } from "./items";
import { puzzles } from "./puzzles";

const first = puzzles[0];

export { items };
export const recipes = first.recipes;
export const startIds = first.startIds;
export const targetId = first.targetId;
export const targetLabel = first.targetLabel;
export const eraPlace = first.eraPlace;
export const scenario = first.scenario;
export const history = first.history;
