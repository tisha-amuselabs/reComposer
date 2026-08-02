import type { Item, ItemId, Recipe } from "./types";

export const items: Record<ItemId, Item> = {
  milk: { id: "milk", name: "Milk", color: "#f5f0e6" },
  lemon: { id: "lemon", name: "Lemon", color: "#e8d48b" },
  tree: { id: "tree", name: "Tree", color: "#6b8f71" },
  fire: { id: "fire", name: "Fire", color: "#c45c3e" },
  axe: { id: "axe", name: "Chop", color: "#8a7355" },
  curd: { id: "curd", name: "Curdled milk", color: "#efe6d0" },
  wood: { id: "wood", name: "Wood", color: "#a67c52" },
  heat: { id: "heat", name: "Heat", color: "#d4a574" },
  plastic: {
    id: "plastic",
    name: "Casein plastic",
    color: "#c9b8a0",
    src: "/tisha/casein.png",
  },
  "warm-milk": { id: "warm-milk", name: "Warm milk", color: "#f0e4c8" },
};

export const recipes: Recipe[] = [
  { inputs: ["milk", "lemon"], result: "curd" },
  { inputs: ["tree", "axe"], result: "wood" },
  { inputs: ["wood", "fire"], result: "heat" },
  { inputs: ["curd", "heat"], result: "plastic" },
  { inputs: ["milk", "fire"], result: "warm-milk" },
];

export const startIds: ItemId[] = ["milk", "lemon", "tree", "fire", "axe"];

export const targetId: ItemId = "plastic";

export const targetLabel = "Plastic";

export const eraPlace = "1897 Munich, Germany";

export const scenario =
  "Munich, 1897. In a quiet laboratory, chemists chase a new material—plastic wrought not from exotic resins, but from the commonplace: milk, lemon, wood, and flame. The workbench is yours.";

export const history =
  "Later, this milk-based plastic—known as Galalith—was carved into buttons as an affordable stand-in for ivory.";
