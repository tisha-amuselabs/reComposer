import type { ItemOfDay } from "../../types/item";

export const LITHIUM_ION_BATTERY: ItemOfDay = {
  id: "lithium-ion-battery",
  name: "Lithium-ion battery",
  tagline:
    "The rechargeable powerhouse that untethered modern electronics from the wall outlet.",
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
    {
      id: "mix-slurries",
      label: "Mix active materials into slurries",
      description:
        "Powdered graphite and lithium compounds are mixed with binders and solvents to create separate anode and cathode liquids.",
    },
    {
      id: "coat-foils",
      label: "Coat slurries onto metal foils",
      description:
        "The anode slurry is coated continuously onto copper foil, while the cathode slurry is coated onto aluminum foil.",
    },
    {
      id: "wind-jelly-roll",
      label: "Wind layers into a jelly roll",
      description:
        "The coated foils are layered with a thin plastic separator and wound tightly into a dense spiral.",
    },
    {
      id: "inject-electrolyte",
      label: "Insert into casing and inject electrolyte",
      description:
        "The wound roll is placed inside a metal can, injected with a lithium-salt liquid electrolyte, and hermetically sealed.",
    },
    {
      id: "formation-cycling",
      label: "Condition through formation cycling",
      description:
        "The sealed cell undergoes its first carefully controlled charge and discharge cycles to stabilize the internal chemistry.",
    },
  ],
  processLab: {
    startIds: [
      "graphite",
      "lco",
      "binder",
      "copper-foil",
      "aluminum-foil",
      "separator",
      "electrolyte",
      "casing",
    ],
    targetId: "battery",
    materials: [
      { id: "graphite", name: "Graphite", accent: "#4b5563" },
      { id: "lco", name: "Lithium cobalt oxide", accent: "#1d4ed8" },
      { id: "binder", name: "Binder / solvent", accent: "#64748b" },
      { id: "copper-foil", name: "Copper foil", accent: "#b87333" },
      { id: "aluminum-foil", name: "Aluminum foil", accent: "#94a3b8" },
      { id: "separator", name: "Separator film", accent: "#38bdf8" },
      { id: "electrolyte", name: "Electrolyte", accent: "#7bd0ff" },
      { id: "casing", name: "Metal casing", accent: "#68758e" },
      { id: "anode-slurry", name: "Anode slurry", accent: "#374151" },
      { id: "cathode-slurry", name: "Cathode slurry", accent: "#2563eb" },
      { id: "coated-anode", name: "Coated anode", accent: "#92400e" },
      { id: "coated-cathode", name: "Coated cathode", accent: "#1e40af" },
      { id: "electrode-pair", name: "Electrode stack", accent: "#0ea5e9" },
      { id: "jelly-roll", name: "Jelly roll", accent: "#2dd4bf" },
      { id: "filled-roll", name: "Electrolyte fill", accent: "#38bdf8" },
      { id: "sealed-cell", name: "Sealed cell", accent: "#94a3b8" },
      { id: "battery", name: "Li-ion battery", accent: "#7bd0ff" },
    ],
    actions: [
      {
        id: "mix",
        name: "Mix",
        arity: 2,
        blurb: "Blend two inputs into a slurry or stack.",
      },
      {
        id: "coat",
        name: "Coat",
        arity: 2,
        blurb: "Lay slurry onto a metal foil.",
      },
      {
        id: "layer",
        name: "Layer",
        arity: 2,
        blurb: "Stack coated electrodes together.",
      },
      {
        id: "wind",
        name: "Wind",
        arity: 2,
        blurb: "Spiral the stack with a separator.",
      },
      {
        id: "inject",
        name: "Inject / seal",
        arity: 2,
        blurb: "Fill electrolyte and close the can.",
      },
      {
        id: "condition",
        name: "Condition",
        arity: 1,
        blurb: "Run formation charge cycles.",
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
        action: "mix",
        inputs: ["graphite", "binder"],
        results: ["anode-slurry"],
        stepId: "mix-slurries",
      },
      {
        action: "mix",
        inputs: ["lco", "binder"],
        results: ["cathode-slurry"],
        stepId: "mix-slurries",
      },
      {
        action: "coat",
        inputs: ["anode-slurry", "copper-foil"],
        results: ["coated-anode"],
        stepId: "coat-foils",
      },
      {
        action: "coat",
        inputs: ["cathode-slurry", "aluminum-foil"],
        results: ["coated-cathode"],
        stepId: "coat-foils",
      },
      {
        action: "layer",
        inputs: ["coated-anode", "coated-cathode"],
        results: ["electrode-pair"],
        stepId: "wind-jelly-roll",
      },
      {
        action: "wind",
        inputs: ["electrode-pair", "separator"],
        results: ["jelly-roll"],
        stepId: "wind-jelly-roll",
      },
      {
        action: "inject",
        inputs: ["jelly-roll", "electrolyte"],
        results: ["filled-roll"],
        stepId: "inject-electrolyte",
      },
      {
        action: "inject",
        inputs: ["filled-roll", "casing"],
        results: ["sealed-cell"],
        stepId: "inject-electrolyte",
      },
      {
        action: "condition",
        inputs: ["sealed-cell"],
        results: ["battery"],
        stepId: "formation-cycling",
      },
      {
        action: "break",
        inputs: ["anode-slurry"],
        results: ["graphite", "binder"],
      },
      {
        action: "break",
        inputs: ["cathode-slurry"],
        results: ["lco", "binder"],
      },
      {
        action: "break",
        inputs: ["coated-anode"],
        results: ["anode-slurry", "copper-foil"],
      },
      {
        action: "break",
        inputs: ["coated-cathode"],
        results: ["cathode-slurry", "aluminum-foil"],
      },
      {
        action: "break",
        inputs: ["jelly-roll"],
        results: ["electrode-pair", "separator"],
      },
      {
        action: "break",
        inputs: ["filled-roll"],
        results: ["jelly-roll", "electrolyte"],
      },
    ],
    hints: [
      {
        id: "lib-1",
        level: 1,
        whenMissing: ["anode-slurry", "cathode-slurry"],
        text: "Powders do not coat foil dry. Mix each active material with binder first.",
      },
      {
        id: "lib-2",
        level: 1,
        whenHas: ["anode-slurry"],
        whenMissing: ["coated-anode"],
        text: "Anode chemistry wants copper as its current collector—not aluminum.",
      },
      {
        id: "lib-3",
        level: 2,
        whenHas: ["coated-anode", "coated-cathode"],
        whenMissing: ["jelly-roll"],
        text: "Layer the coated foils, then Wind the stack with the separator film.",
      },
      {
        id: "lib-4",
        level: 2,
        whenHas: ["jelly-roll"],
        whenMissing: ["sealed-cell", "battery"],
        text: "A dry jelly roll still needs electrolyte—and a can—before formation.",
      },
      {
        id: "lib-5",
        level: 2,
        whenHas: ["sealed-cell"],
        whenMissing: ["battery"],
        text: "The sealed cell is not finished until Condition runs formation cycles.",
      },
      {
        id: "lib-6",
        level: 3,
        text: "Mix graphite+binder and LCO+binder → Coat onto Cu/Al foils → Layer → Wind with separator → Inject electrolyte then casing → Condition.",
      },
    ],
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
    "If unrolled, the electrodes inside a standard cylindrical laptop battery cell would stretch roughly two to three feet long.",
  ],
};
