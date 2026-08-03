export interface ElementGuessTarget {
  symbol: string;
  approxPercent: number;
}

export interface ManufacturingStep {
  id: string;
  label: string;
  description: string;
}

// Little-Alchemy-style combination graph: start with `startIds`, drag two
// items together on the workspace, and if a combination matches you get a
// new item. Chain combinations until you reach `targetId`.
export interface AlchemyNode {
  id: string;
  label: string;
  emoji: string;
}

export interface AlchemyCombination {
  inputs: [string, string];
  result: string;
}

export interface AlchemyRecipe {
  nodes: Record<string, AlchemyNode>;
  startIds: string[];
  combinations: AlchemyCombination[];
  targetId: string;
}

export interface ItemOrigin {
  year: number;
  yearLabel: string;
  locationName: string;
  lat: number;
  lng: number;
  minYear: number;
  maxYear: number;
}

export interface ItemOfDay {
  id: string;
  name: string;
  tagline: string;
  composition: ElementGuessTarget[];
  rawMaterials: string[];
  steps: ManufacturingStep[];
  alchemy: AlchemyRecipe;
  origin: ItemOrigin;
  trivia: string[];
  // Shown on each round's results screen, before "Continue" — a short,
  // plain-language "why is the answer this?" explanation.
  compositionExplanation: string;
  processExplanation: string;
  originExplanation: string;
}
