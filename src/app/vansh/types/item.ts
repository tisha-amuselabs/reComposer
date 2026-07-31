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

export interface ItemOfDay {
  id: string;
  name: string;
  tagline: string;
  composition: ElementGuessTarget[];
  rawMaterials: string[];
  steps: ManufacturingStep[];
  origin: ItemOrigin;
  trivia: string[];
}
