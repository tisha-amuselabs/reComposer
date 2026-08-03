import type { ItemOfDay } from "../../types/item";

export const COMPACT_DISC: ItemOfDay = {
  id: "compact-disc",
  name: "Compact Disc (CD)",
  tagline: "The shiny plastic platter that brought digital audio to the masses.",
  composition: [
    { symbol: "C", approxPercent: 75 },
    { symbol: "O", approxPercent: 19 },
    { symbol: "H", approxPercent: 5 },
    { symbol: "Al", approxPercent: 1 },
  ],
  rawMaterials: [
    "Polycarbonate plastic",
    "Aluminum",
    "Acrylic lacquer",
  ],
  steps: [
    { id: "injection-mold", label: "Mold the base", description: "Melt polycarbonate and inject it into a mold under high pressure to form the pitted disc." },
    { id: "sputter-coat", label: "Sputter the aluminum", description: "Vaporize aluminum in a vacuum chamber to coat the disc with a microscopic reflective layer." },
    { id: "spin-coat", label: "Apply lacquer", description: "Spin the disc rapidly while dripping liquid acrylic lacquer to spread an even protective coat." },
    { id: "uv-cure", label: "Cure the lacquer", description: "Expose the lacquer to intense UV light to instantly harden it." },
  ],
  alchemy: {
    nodes: {
      "polycarbonate": { id: "polycarbonate", label: "Polycarbonate", emoji: "🧪", type: "material" },
      "aluminum": { id: "aluminum", label: "Aluminum", emoji: "🪨", type: "material" },
      "lacquer": { id: "lacquer", label: "Acrylic lacquer", emoji: "💧", type: "material" },
      "pressurize": { id: "pressurize", label: "Pressurize", emoji: "🗜️", type: "action" },
      "heat": { id: "heat", label: "Heat", emoji: "🔥", type: "action" },
      "molded-disc": { id: "molded-disc", label: "Molded clear disc", emoji: "💿", type: "material" },
      "vaporized-aluminum": { id: "vaporized-aluminum", label: "Vaporized aluminum", emoji: "💨", type: "material" },
      "reflective-disc": { id: "reflective-disc", label: "Reflective disc", emoji: "🪞", type: "material" },
      "raw-coated-disc": { id: "raw-coated-disc", label: "Wet coated disc", emoji: "💦", type: "material" },
      "compact-disc": { id: "compact-disc", label: "Compact disc", emoji: "💿", type: "material" },
    },
    startIds: ["polycarbonate", "aluminum", "lacquer", "pressurize", "heat"],
    combinations: [
      { inputs: ["polycarbonate", "pressurize"], result: "molded-disc" },
      { inputs: ["aluminum", "heat"], result: "vaporized-aluminum" },
      { inputs: ["molded-disc", "vaporized-aluminum"], result: "reflective-disc" },
      { inputs: ["reflective-disc", "lacquer"], result: "raw-coated-disc" },
      { inputs: ["raw-coated-disc", "heat"], result: "compact-disc" },
    ],
    targetId: "compact-disc",
  },
  origin: {
    year: 1982,
    yearLabel: "1982",
    locationName: "Langenhagen, West Germany",
    lat: 52.4394,
    lng: 9.7423,
    minYear: 1950,
    maxYear: 2026,
  },
  trivia: [
    "The standard 120-millimeter diameter was supposedly chosen to hold exactly 74 minutes of audio—enough to fit Beethoven's 9th Symphony on a single disc.",
    "Unlike vinyl records which are read from the outer edge inward, a CD is read by the laser starting from the center and moving outward.",
    "The microscopic data pits on a CD are so small that if the disc were scaled up to the size of a sports stadium, a single pit would be the size of a grain of sand.",
  ],
  compositionExplanation: "Polycarbonate plastic makes up roughly 99% of a standard CD's physical mass, which is why Carbon and Oxygen heavily dominate the elemental makeup. The aluminum layer that actually reflects the laser is astonishingly thin—often only 50 to 100 nanometers deep—contributing barely a fraction of a percent to the total weight.",
  processExplanation: "The clear polycarbonate base must be injection-molded first so the microscopic data pits are physically stamped into the plastic. Aluminum is then vaporized to coat those pits with a reflective mirror, and the lacquer must be applied immediately afterward to prevent the thin, highly reactive metal layer from oxidizing in the air.",
  originExplanation: "While Philips and Sony co-developed the digital audio format throughout the late 1970s, the world's very first commercial compact disc—ABBA's 'The Visitors'—was pressed in August 1982 at a Polydor factory in Langenhagen, West Germany.",
};