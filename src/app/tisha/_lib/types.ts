export type ItemId = string;

export type Item = {
  id: ItemId;
  name: string;
  /** Accent color for the placeholder tile */
  color: string;
  /** Optional image path; defaults to `/tisha/{id}.png` */
  src?: string;
};

export type Recipe = {
  inputs: [ItemId, ItemId];
  result: ItemId;
};

/** One Little Alchemy–style invention puzzle */
export type Puzzle = {
  id: string;
  targetId: ItemId;
  /** Short name shown in “Can you create …?” */
  targetLabel: string;
  /** e.g. "1897 Munich, Germany" */
  eraPlace: string;
  scenario: string;
  history: string;
  startIds: ItemId[];
  recipes: Recipe[];
};
