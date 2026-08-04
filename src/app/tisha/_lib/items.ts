import type { Item, ItemId } from "./types";

/** Shared registry for every reinventing-the-wheel puzzle (materials only) */
export const items: Record<ItemId, Item> = {
  // — Casein plastic —
  milk: { id: "milk", name: "Milk", color: "#f5f0e6" },
  lemon: { id: "lemon", name: "Lemon", color: "#e8d48b" },
  tree: { id: "tree", name: "Tree", color: "#6b8f71" },
  curd: { id: "curd", name: "Curdled milk", color: "#efe6d0" },
  wood: { id: "wood", name: "Wood", color: "#a67c52" },
  fire: { id: "fire", name: "Fire", color: "#e07030" },
  heat: { id: "heat", name: "Heat", color: "#d4a574" },
  plastic: {
    id: "plastic",
    name: "Bioplastic",
    color: "#c9b8a0",
    src: "/tisha/casein.png",
  },
  "warm-milk": { id: "warm-milk", name: "Warm milk", color: "#f0e4c8" },
  whey: { id: "whey", name: "Whey", color: "#f7f2e4" },
  solids: { id: "solids", name: "Milk solids", color: "#e8dcc4" },
  protein: {
    id: "protein",
    name: "Coagulated protein",
    color: "#efe4c8",
  },
  "dried-protein": {
    id: "dried-protein",
    name: "Dried protein",
    color: "#e2d2b0",
  },
  "burnt-milk": { id: "burnt-milk", name: "Burnt milk", color: "#5c4033" },
  "soggy-wood": { id: "soggy-wood", name: "Soggy wood", color: "#8a7355" },
  "citrus-chips": {
    id: "citrus-chips",
    name: "Citrus chips",
    color: "#d4c07a",
  },
  "curd-toast": { id: "curd-toast", name: "Curd toast", color: "#d9b896" },
  "lemon-ash": { id: "lemon-ash", name: "Lemon ash", color: "#c4b896" },
  smoke: { id: "smoke", name: "Kitchen smoke", color: "#9a9590" },
  regret: { id: "regret", name: "Mild regret", color: "#b0a898" },
  charcoal: { id: "charcoal", name: "Charcoal lump", color: "#3a3530" },
  "forest-milk": {
    id: "forest-milk",
    name: "Forest milk",
    color: "#c8d4b8",
  },
  "cheese-candle": {
    id: "cheese-candle",
    name: "Cheese candle",
    color: "#e8c878",
  },
  "sour-sawdust": {
    id: "sour-sawdust",
    name: "Sour sawdust",
    color: "#c4b070",
  },
  "scorched-protein": {
    id: "scorched-protein",
    name: "Scorched protein",
    color: "#8a6a4a",
  },
  "whey-tea": { id: "whey-tea", name: "Whey tea", color: "#d8c89a" },
  "sticky-mess": {
    id: "sticky-mess",
    name: "Sticky mess",
    color: "#c9a882",
  },
  "milkshake-splinter": {
    id: "milkshake-splinter",
    name: "Splinter shake",
    color: "#ddd0b8",
  },
  "double-curdle": {
    id: "double-curdle",
    name: "Over-curdled sludge",
    color: "#d8c8a0",
  },
  "ash-milk": { id: "ash-milk", name: "Ash milk", color: "#b8b0a0" },

  // — Vulcanized rubber —
  latex: { id: "latex", name: "Latex", color: "#e8e4d8" },
  sulfur: { id: "sulfur", name: "Sulfur", color: "#e6c84a" },
  rubber: { id: "rubber", name: "Vulcanized rubber", color: "#2a241c" },
  "sticky-mix": { id: "sticky-mix", name: "Sticky mix", color: "#c4a574" },

  // — Paper —
  water: { id: "water", name: "Water", color: "#9bb8c9" },
  chips: { id: "chips", name: "Wood chips", color: "#b8956a" },
  pulp: { id: "pulp", name: "Pulp", color: "#d9d0c0" },
  paper: { id: "paper", name: "Paper", color: "#f4f0e6" },

  // — Glass —
  sand: { id: "sand", name: "Sand", color: "#e2d3a8" },
  ash: { id: "ash", name: "Ash", color: "#9a9590" },
  flux: { id: "flux", name: "Flux", color: "#b0a898" },
  glass: { id: "glass", name: "Glass", color: "#c5dce6" },
  batch: { id: "batch", name: "Glass batch", color: "#cfc4a8" },

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
