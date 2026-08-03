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
  // Little-Alchemy-style combination chain: stir each active material into a
  // slurry, coat it onto its foil, wind the two coated foils together, fill
  // with electrolyte, then seal the can under pressure.
  alchemy: {
    nodes: {
      "lithium-cobalt-oxide": {
        id: "lithium-cobalt-oxide",
        label: "Lithium cobalt oxide",
        emoji: "⚫",
        type: "material",
      },
      graphite: { id: "graphite", label: "Graphite", emoji: "⬛", type: "material" },
      "copper-foil": { id: "copper-foil", label: "Copper foil", emoji: "🟧", type: "material" },
      "aluminum-foil": { id: "aluminum-foil", label: "Aluminum foil", emoji: "⬜", type: "material" },
      electrolyte: { id: "electrolyte", label: "Liquid electrolyte", emoji: "🧴", type: "material" },
      stir: { id: "stir", label: "Stir", emoji: "🌀", type: "action" },
      pressurize: { id: "pressurize", label: "Pressurize", emoji: "⇅", type: "action" },
      "cathode-slurry": { id: "cathode-slurry", label: "Cathode slurry", emoji: "🥣", type: "material" },
      "anode-slurry": { id: "anode-slurry", label: "Anode slurry", emoji: "🥣", type: "material" },
      "coated-cathode": { id: "coated-cathode", label: "Coated cathode", emoji: "🧯", type: "material" },
      "coated-anode": { id: "coated-anode", label: "Coated anode", emoji: "🧯", type: "material" },
      "wound-cell": { id: "wound-cell", label: "Wound cell", emoji: "🌀", type: "material" },
      "filled-cell": { id: "filled-cell", label: "Filled cell", emoji: "🧪", type: "material" },
      "lithium-ion-battery": {
        id: "lithium-ion-battery",
        label: "Lithium-ion battery",
        emoji: "🔋",
        type: "material",
      },
    },
    startIds: [
      "lithium-cobalt-oxide",
      "graphite",
      "copper-foil",
      "aluminum-foil",
      "electrolyte",
      "stir",
      "pressurize",
    ],
    combinations: [
      { inputs: ["lithium-cobalt-oxide", "stir"], result: "cathode-slurry" },
      { inputs: ["graphite", "stir"], result: "anode-slurry" },
      { inputs: ["cathode-slurry", "aluminum-foil"], result: "coated-cathode" },
      { inputs: ["anode-slurry", "copper-foil"], result: "coated-anode" },
      { inputs: ["coated-cathode", "coated-anode"], result: "wound-cell" },
      { inputs: ["wound-cell", "electrolyte"], result: "filled-cell" },
      { inputs: ["filled-cell", "pressurize"], result: "lithium-ion-battery" },
    ],
    targetId: "lithium-ion-battery",
  },
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
  compositionExplanation:
    "Graphite (the anode) is mostly carbon, so carbon tops the list by mass even though it's not what gives the battery its name. Lithium cobalt oxide contributes both oxygen and cobalt, and the copper and aluminum foils that the electrodes are coated onto add real mass too — despite being 'just' structural backing rather than active chemistry. Lithium itself barely registers on a top-5-by-mass list.",
  processExplanation:
    "Each active material has to become a spreadable slurry (via stirring) before it can be coated onto its own metal foil — graphite always goes on copper, lithium cobalt oxide always goes on aluminum, because pairing them the other way corrodes the foil. Once both electrodes are coated, they're wound together with a separator between them, filled with electrolyte so ions can actually move between the electrodes, and finally sealed under pressure to keep that liquid in.",
  originExplanation:
    "Sony and Asahi Kasei were racing to power Sony's own line of camcorders and needed a rechargeable cell with far higher energy density than nickel-cadmium. Tokyo, 1991 is where that commercial cell — using this exact graphite/lithium-cobalt-oxide chemistry — first shipped, even though the underlying lithium-ion research had been developing in labs worldwide through the 1970s and 80s.",
};