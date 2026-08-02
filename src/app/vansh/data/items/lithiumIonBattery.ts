import type { ItemOfDay } from "../../types/item";

export const LITHIUM_ION_BATTERY: ItemOfDay = {
  id: "lithium-ion-battery",
  name: "Lithium-ion battery",
  tagline: "The rechargeable powerhouse that untethered modern electronics from the wall outlet.",
  composition: [
    { symbol: "C", approxPercent: 25 },
    { symbol: "O", approxPercent: 20 },
    { symbol: "Co", approxPercent: 15 },
    { symbol: "Cu", approxPercent: 10 },
    { symbol: "Al", approxPercent: 5 },
  ],
  rawMaterials: [
    "Lithium cobalt oxide",
    "Graphite",
    "Copper foil",
    "Aluminum foil",
    "Liquid electrolyte",
  ],
  steps: [
    { id: "mix-slurries", label: "Mix active materials into slurries", description: "Powdered graphite and lithium compounds are mixed with binders and solvents to create separate anode and cathode liquids." },
    { id: "coat-foils", label: "Coat slurries onto metal foils", description: "The anode slurry is coated continuously onto copper foil, while the cathode slurry is coated onto aluminum foil." },
    { id: "wind-jelly-roll", label: "Wind layers into a jelly roll", description: "The coated foils are layered with a thin plastic separator and wound tightly into a dense spiral." },
    { id: "inject-electrolyte", label: "Insert into casing and inject electrolyte", description: "The wound roll is placed inside a metal can, injected with a lithium-salt liquid electrolyte, and hermetically sealed." },
    { id: "formation-cycling", label: "Condition through formation cycling", description: "The sealed cell undergoes its first carefully controlled charge and discharge cycles to stabilize the internal chemistry." },
  ],
  origin: {
    year: 1991,
    yearLabel: "1991",
    locationName: "Tokyo, Japan",
    lat: 35.6762,
    lng: 139.6503,
    minYear: 1950,
    maxYear: 2026,
  },
  trivia: [
    "Despite giving the battery its name, lithium actually accounts for less than 3% of a typical cell's total mass.",
    "The tightly coiled internal structure is affectionately known in the manufacturing industry as a 'jelly roll'.",
    "Sony and Asahi Kasei commercialized the first rechargeable lithium-ion battery in 1991, primarily to power their early handheld camcorders.",
    "If unrolled, the electrodes inside a standard cylindrical laptop battery cell would stretch roughly two to three feet long."
  ],
};