import type { ItemOfDay } from "../../types/item";

export const MATCHSTICK_TIP: ItemOfDay = {
  id: "matchstick-tip",
  name: "Matchstick tip",
  tagline: "The tiny chemical bomb on the end of every match.",
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
      description:
        "Softwood is sliced into thin, even splints that will form the matchstick bodies.",
    },
    {
      id: "prepare-paste",
      label: "Prepare the chemical head paste",
      description:
        "Potassium chlorate, antimony trisulfide, sulfur, and a binder are mixed into a thick paste.",
    },
    {
      id: "dip-tip",
      label: "Dip the tip in the paste",
      description: "Each splint tip is dipped into the paste to form the match head.",
    },
    {
      id: "dry",
      label: "Dry the coated heads",
      description:
        "Coated tips are dried so the paste hardens into a stable, ignitable head.",
    },
    {
      id: "package",
      label: "Package the finished matches",
      description: "Dried matches are sorted, counted, and boxed for sale.",
    },
  ],
  processLab: {
    startIds: ["timber", "chlorate", "antimony", "sulfur", "binder"],
    targetId: "match-box",
    materials: [
      { id: "timber", name: "Timber blank", accent: "#a67c52" },
      { id: "chlorate", name: "Potassium chlorate", accent: "#f6c177" },
      { id: "antimony", name: "Antimony trisulfide", accent: "#94a3b8" },
      { id: "sulfur", name: "Sulfur", accent: "#e6c84a" },
      { id: "binder", name: "Starch binder", accent: "#c4c6cd" },
      { id: "splint", name: "Wood splint", accent: "#b8956a" },
      { id: "oxidizer-mix", name: "Oxidizer mix", accent: "#f59e0b" },
      { id: "head-base", name: "Head base", accent: "#d97706" },
      { id: "head-paste", name: "Head paste", accent: "#b45309" },
      { id: "wet-match", name: "Wet match", accent: "#78716c" },
      { id: "dried-match", name: "Dried match", accent: "#a8a29e" },
      { id: "match-box", name: "Boxed matches", accent: "#7bd0ff" },
    ],
    actions: [
      {
        id: "cut",
        name: "Cut",
        arity: 1,
        blurb: "Slice timber into splints.",
      },
      {
        id: "mix",
        name: "Mix",
        arity: 2,
        blurb: "Combine chemicals toward a paste.",
      },
      {
        id: "dip",
        name: "Dip",
        arity: 2,
        blurb: "Coat a splint tip in paste.",
      },
      {
        id: "dry",
        name: "Dry",
        arity: 1,
        blurb: "Harden the coated head.",
      },
      {
        id: "package",
        name: "Package",
        arity: 1,
        blurb: "Box the finished matches.",
      },
      {
        id: "break",
        name: "Break apart",
        arity: 1,
        blurb: "Separate a composite back into parts.",
      },
    ],
    recipes: [
      {
        action: "cut",
        inputs: ["timber"],
        results: ["splint"],
        stepId: "cut-splints",
      },
      {
        action: "mix",
        inputs: ["chlorate", "antimony"],
        results: ["oxidizer-mix"],
        stepId: "prepare-paste",
      },
      {
        action: "mix",
        inputs: ["oxidizer-mix", "sulfur"],
        results: ["head-base"],
        stepId: "prepare-paste",
      },
      {
        action: "mix",
        inputs: ["head-base", "binder"],
        results: ["head-paste"],
        stepId: "prepare-paste",
      },
      {
        action: "dip",
        inputs: ["splint", "head-paste"],
        results: ["wet-match"],
        stepId: "dip-tip",
      },
      {
        action: "dry",
        inputs: ["wet-match"],
        results: ["dried-match"],
        stepId: "dry",
      },
      {
        action: "package",
        inputs: ["dried-match"],
        results: ["match-box"],
        stepId: "package",
      },
      {
        action: "break",
        inputs: ["head-paste"],
        results: ["head-base", "binder"],
      },
      {
        action: "break",
        inputs: ["wet-match"],
        results: ["splint", "head-paste"],
      },
    ],
    hints: [
      {
        id: "mt-1",
        level: 1,
        whenMissing: ["splint"],
        text: "Timber is not a matchstick yet—Cut it into a splint first.",
      },
      {
        id: "mt-2",
        level: 1,
        whenMissing: ["head-paste"],
        text: "The head is a layered chemistry. Mix the oxidizer stream before you ever Dip.",
      },
      {
        id: "mt-3",
        level: 2,
        whenHas: ["splint", "head-paste"],
        whenMissing: ["wet-match"],
        text: "Dip the splint into the finished head paste.",
      },
      {
        id: "mt-4",
        level: 2,
        whenHas: ["wet-match"],
        whenMissing: ["match-box"],
        text: "Wet heads must Dry before they can be Packaged.",
      },
      {
        id: "mt-5",
        level: 3,
        text: "Cut timber → Mix chlorate+antimony → Mix in sulfur → Mix in binder → Dip splint → Dry → Package.",
      },
    ],
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
};
