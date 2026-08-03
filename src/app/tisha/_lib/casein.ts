/**
 * @deprecated Import from `./puzzles`, `./items`, and `./actions` instead.
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
