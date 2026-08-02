export type ItemId =
  | "milk"
  | "lemon"
  | "tree"
  | "fire"
  | "axe"
  | "curd"
  | "wood"
  | "heat"
  | "plastic"
  | "warm-milk";

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
