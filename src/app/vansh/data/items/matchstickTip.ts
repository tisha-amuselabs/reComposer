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
};
