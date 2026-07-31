import type { ElementCategory } from "../types/element";

// Deliberately avoids green/yellow/gray hues, which are reserved for Wordle-style
// round feedback and would otherwise collide visually on the same screen.
export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  "alkali-metal": "bg-rose-200 text-rose-950 dark:bg-rose-900 dark:text-rose-100",
  "alkaline-earth-metal": "bg-orange-200 text-orange-950 dark:bg-orange-900 dark:text-orange-100",
  "transition-metal": "bg-sky-200 text-sky-950 dark:bg-sky-900 dark:text-sky-100",
  "post-transition-metal": "bg-indigo-200 text-indigo-950 dark:bg-indigo-900 dark:text-indigo-100",
  metalloid: "bg-teal-200 text-teal-950 dark:bg-teal-900 dark:text-teal-100",
  nonmetal: "bg-cyan-200 text-cyan-950 dark:bg-cyan-900 dark:text-cyan-100",
  halogen: "bg-fuchsia-200 text-fuchsia-950 dark:bg-fuchsia-900 dark:text-fuchsia-100",
  "noble-gas": "bg-violet-200 text-violet-950 dark:bg-violet-900 dark:text-violet-100",
  lanthanide: "bg-pink-200 text-pink-950 dark:bg-pink-900 dark:text-pink-100",
  actinide: "bg-purple-200 text-purple-950 dark:bg-purple-900 dark:text-purple-100",
};

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  "alkali-metal": "Alkali metal",
  "alkaline-earth-metal": "Alkaline earth metal",
  "transition-metal": "Transition metal",
  "post-transition-metal": "Post-transition metal",
  metalloid: "Metalloid",
  nonmetal: "Nonmetal",
  halogen: "Halogen",
  "noble-gas": "Noble gas",
  lanthanide: "Lanthanide",
  actinide: "Actinide",
};
