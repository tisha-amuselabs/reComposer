export interface ElementGuessTarget {
  symbol: string;
  approxPercent: number;
}

export interface ManufacturingStep {
  id: string;
  label: string;
  description: string;
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

/** Bench material used in the Round 2 reaction chamber */
export interface ProcessMaterial {
  id: string;
  name: string;
  /** Accent for the tile chip */
  accent?: string;
}

export interface ProcessAction {
  id: string;
  name: string;
  /** How many chamber materials must be selected */
  arity: 1 | 2;
  blurb: string;
}

/**
 * Action applied to one or two materials.
 * Optional `stepId` links the recipe to a ManufacturingStep for scoring.
 */
export interface ProcessRecipe {
  action: string;
  inputs: string[];
  results: string[];
  stepId?: string;
}

export type HintLevel = 1 | 2 | 3;

/** Authored process hint for the reaction chamber */
export interface ProcessHint {
  id: string;
  level: HintLevel;
  /** Prefer when player has all of these material ids */
  whenHas?: string[];
  /** Prefer when player still lacks all of these */
  whenMissing?: string[];
  text: string;
}

/** Materials-left / chamber-center / actions-right lab for Stage 02 */
export interface ProcessLab {
  materials: ProcessMaterial[];
  actions: ProcessAction[];
  recipes: ProcessRecipe[];
  /** Starting material ids in the inventory */
  startIds: string[];
  /** Winning product id */
  targetId: string;
  /** Escalating process hints (flavor → process → near-spoiler) */
  hints: ProcessHint[];
}

export interface ItemOfDay {
  id: string;
  name: string;
  tagline: string;
  composition: ElementGuessTarget[];
  rawMaterials: string[];
  steps: ManufacturingStep[];
  /** Reaction chamber — build the manufacturing process */
  processLab: ProcessLab;
  origin: ItemOrigin;
  trivia: string[];
}
