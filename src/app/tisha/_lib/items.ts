import type { Item, ItemId } from "./types";

/** Shared registry for every reinventing-the-wheel puzzle */
export const items: Record<ItemId, Item> = {
  // — Casein plastic —
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

  // — Vulcanized rubber —
  latex: { id: "latex", name: "Latex", color: "#e8e4d8" },
  sulfur: { id: "sulfur", name: "Sulfur", color: "#e6c84a" },
  rubber: { id: "rubber", name: "Vulcanized rubber", color: "#2a241c" },
  "sticky-mix": { id: "sticky-mix", name: "Sticky mix", color: "#c4a574" },

  // — Paper —
  water: { id: "water", name: "Water", color: "#9bb8c9" },
  chips: { id: "chips", name: "Wood chips", color: "#b8956a" },
  pulp: { id: "pulp", name: "Pulp", color: "#d9d0c0" },
  stone: { id: "stone", name: "Stone press", color: "#8a8680" },
  paper: { id: "paper", name: "Paper", color: "#f4f0e6" },

  // — Glass —
  sand: { id: "sand", name: "Sand", color: "#e2d3a8" },
  ash: { id: "ash", name: "Ash", color: "#9a9590" },
  flux: { id: "flux", name: "Flux", color: "#b0a898" },
  glass: { id: "glass", name: "Glass", color: "#c5dce6" },

  // — Soap —
  fat: { id: "fat", name: "Animal fat", color: "#f0e6c8" },
  lye: { id: "lye", name: "Lye", color: "#d8dde0" },
  soap: { id: "soap", name: "Soap", color: "#e8f0e4" },

  // — Bronze —
  copper: { id: "copper", name: "Copper", color: "#b87333" },
  tin: { id: "tin", name: "Tin", color: "#c0c4c8" },
  "molten-copper": {
    id: "molten-copper",
    name: "Molten copper",
    color: "#e07030",
  },
  bronze: { id: "bronze", name: "Bronze", color: "#cd7f32" },

  // — Concrete —
  limestone: { id: "limestone", name: "Limestone", color: "#d8d2c4" },
  clay: { id: "clay", name: "Clay", color: "#a67c52" },
  lime: { id: "lime", name: "Quicklime", color: "#f2efe6" },
  cement: { id: "cement", name: "Cement", color: "#b0aaa0" },
  concrete: { id: "concrete", name: "Concrete", color: "#8a8680" },
};
