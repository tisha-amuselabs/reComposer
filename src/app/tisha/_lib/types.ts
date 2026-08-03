export type ItemId = string;
export type ActionId = string;

export type Item = {
  id: ItemId;
  name: string;
  /** Accent color for the placeholder tile */
  color: string;
  /** Optional image path; defaults to `/tisha/{id}.png` */
  src?: string;
};

export type ActionKind = "transform" | "combine" | "breakdown";

export type Action = {
  id: ActionId;
  name: string;
  kind: ActionKind;
  /** How many canvas materials must be selected */
  arity: 1 | 2;
  /** Short lab-bench blurb */
  blurb: string;
};

/**
 * Action applied to one or two materials.
 * `inputs` length must match the action’s arity (order-independent).
 */
export type Recipe = {
  action: ActionId;
  inputs: ItemId[];
  /** One product for transform/combine; two+ for breakdown */
  results: ItemId[];
};

export type HintLevel = 1 | 2 | 3;

export type ProcessHint = {
  id: string;
  level: HintLevel;
  /** Prefer when player has all of these */
  whenHas?: ItemId[];
  /** Prefer when player still lacks all of these */
  whenMissing?: ItemId[];
  text: string;
};

/** One lab puzzle: materials + operations, not item+item alchemy */
export type Puzzle = {
  id: string;
  targetId: ItemId;
  targetLabel: string;
  eraPlace: string;
  scenario: string;
  history: string;
  /** Starting materials (never tools/actions) */
  startIds: ItemId[];
  /** Actions available on the right-hand bench */
  actionIds: ActionId[];
  recipes: Recipe[];
  hints: ProcessHint[];
};
