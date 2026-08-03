import type { ItemOfDay } from "../../types/item";

export const MATCHSTICK_TIP: ItemOfDay = {
  id: "matchstick-tip",
  name: "Matchstick tip",
  tagline: "The tiny chemical bomb on the end of every match.",
  // Approximate elemental mass % — no single authoritative assay exists for a
  // classic friction-match head, so these are derived from a representative
  // recipe (potassium chlorate oxidizer + antimony trisulfide + sulfur +
  // starch/gum binder), broken down into elements. Oxygen edging out
  // chlorine/potassium is a genuine (and fun) surprise most players miss.
  composition: [
    { symbol: "O", approxPercent: 29 },
    { symbol: "Sb", approxPercent: 18 },
    { symbol: "K", approxPercent: 16 },
    { symbol: "Cl", approxPercent: 14 },
    { symbol: "S", approxPercent: 12 },
  ],
  rawMaterials: [
    "Wood (splint)",
    "Potassium chlorate",
    "Antimony trisulfide",
    "Sulfur",
    "Starch / gum binder",
  ],
  steps: [
    {
      id: "cut-splints",
      label: "Cut wood into splints",
      description: "Softwood is sliced into thin, even splints that will form the matchstick bodies.",
    },
    {
      id: "prepare-paste",
      label: "Prepare the chemical head paste",
      description: "Potassium chlorate, antimony trisulfide, sulfur, and a binder are mixed into a thick paste.",
    },
    {
      id: "dip-tip",
      label: "Dip the tip in the paste",
      description: "Each splint tip is dipped into the paste to form the match head.",
    },
    {
      id: "dry",
      label: "Dry the coated heads",
      description: "Coated tips are dried so the paste hardens into a stable, ignitable head.",
    },
    {
      id: "package",
      label: "Package the finished matches",
      description: "Dried matches are sorted, counted, and boxed for sale.",
    },
  ],
  // Little-Alchemy-style combination chain reconstructing the real process:
  // oxidizer + fuel -> paste -> bound -> stirred -> dipped -> dried tip.
  alchemy: {
    nodes: {
      wood: { id: "wood", label: "Wood (splint)", emoji: "🪵", type: "material" },
      "potassium-chlorate": {
        id: "potassium-chlorate",
        label: "Potassium chlorate",
        emoji: "🧂",
        type: "material",
      },
      "antimony-trisulfide": {
        id: "antimony-trisulfide",
        label: "Antimony trisulfide",
        emoji: "🪨",
        type: "material",
      },
      sulfur: { id: "sulfur", label: "Sulfur", emoji: "🟡", type: "material" },
      binder: { id: "binder", label: "Starch / gum binder", emoji: "🧴", type: "material" },
      stir: { id: "stir", label: "Stir", emoji: "🌀", type: "action" },
      heat: { id: "heat", label: "Heat", emoji: "🔥", type: "action" },
      "oxidizer-blend": { id: "oxidizer-blend", label: "Oxidizer blend", emoji: "⚗️", type: "material" },
      "raw-paste": { id: "raw-paste", label: "Raw paste", emoji: "🥣", type: "material" },
      "bound-paste": { id: "bound-paste", label: "Bound paste", emoji: "🧪", type: "material" },
      "chemical-paste": { id: "chemical-paste", label: "Chemical paste", emoji: "🧫", type: "material" },
      "dipped-splint": { id: "dipped-splint", label: "Dipped splint", emoji: "🖊️", type: "material" },
      "matchstick-tip": { id: "matchstick-tip", label: "Matchstick tip", emoji: "🔥", type: "material" },
    },
    startIds: [
      "wood",
      "potassium-chlorate",
      "antimony-trisulfide",
      "sulfur",
      "binder",
      "stir",
      "heat",
    ],
    combinations: [
      { inputs: ["potassium-chlorate", "antimony-trisulfide"], result: "oxidizer-blend" },
      { inputs: ["oxidizer-blend", "sulfur"], result: "raw-paste" },
      { inputs: ["raw-paste", "binder"], result: "bound-paste" },
      { inputs: ["bound-paste", "stir"], result: "chemical-paste" },
      { inputs: ["chemical-paste", "wood"], result: "dipped-splint" },
      { inputs: ["dipped-splint", "heat"], result: "matchstick-tip" },
    ],
    targetId: "matchstick-tip",
  },
  origin: {
    year: 1826,
    yearLabel: "1826",
    locationName: "Stockton-on-Tees, England",
    lat: 54.5642,
    lng: -1.3188,
    minYear: 1700,
    maxYear: 2026,
  },
  trivia: [
    "Most historians credit English chemist John Walker with inventing the friction match in 1826 — though he didn't sell his first box until 1827.",
    "Walker never patented his invention, so other manufacturers quickly copied and refined the formula.",
    "Early friction matches were notoriously unstable — they could ignite from the friction of just walking around in your pocket.",
  ],
  compositionExplanation:
    "A match head needs an oxidizer to supply oxygen for combustion and a fuel for that oxygen to burn. Potassium chlorate (KClO₃) is the oxidizer — and since each molecule is nearly 40% oxygen by weight, oxygen ends up the single biggest element overall, ahead of the potassium and chlorine that make up the rest of that same compound. Antimony trisulfide is the fuel that actually ignites, and sulfur adds extra kindling.",
  processExplanation:
    "The oxidizer and fuel are combined first because that reactive pair is the chemical heart of the head — everything else just shapes and stabilizes it. Sulfur boosts the mix's flammability, a binder holds the powder together as a paste, and only once that paste is stirred smooth does it get dipped onto the wood. Heat comes last: it's not an ingredient, it's what dries and hardens the dipped paste into a stable, strikeable head.",
  originExplanation:
    "English chemist John Walker stumbled onto this exact formula in 1826 in Stockton-on-Tees while trying to remove a dried chemical coating from a stirring stick — it caught fire when scraped against his hearth. It predates the later 'safety match' (with red phosphorus isolated on the strike strip) by decades, making it the true origin point for a match head with this composition.",
};
