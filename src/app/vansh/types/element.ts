export type ElementCategory =
  | "alkali-metal"
  | "alkaline-earth-metal"
  | "transition-metal"
  | "post-transition-metal"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble-gas"
  | "lanthanide"
  | "actinide";

export interface PeriodicElement {
  atomicNumber: number;
  symbol: string;
  name: string;
  category: ElementCategory;
  gridRow: number;
  gridColumn: number;
}
