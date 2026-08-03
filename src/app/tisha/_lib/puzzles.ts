import type { Puzzle } from "./types";

/**
 * Reinventing-the-wheel puzzles: everyday materials rediscovered
 * from humble ingredients at a historical moment.
 */
export const puzzles: Puzzle[] = [
  {
    id: "casein-plastic",
    targetId: "plastic",
    targetLabel: "Plastic",
    eraPlace: "1897 Munich, Germany",
    scenario:
      "Munich, 1897. In a quiet laboratory, chemists chase a new material—plastic wrought not from exotic resins, but from the commonplace: milk, lemon, wood, and flame. The workbench is yours.",
    history:
      "Later, this milk-based plastic—known as Galalith—was carved into buttons as an affordable stand-in for ivory.",
    startIds: ["milk", "lemon", "tree", "fire", "axe"],
    recipes: [
      { inputs: ["milk", "lemon"], result: "curd" },
      { inputs: ["tree", "axe"], result: "wood" },
      { inputs: ["wood", "fire"], result: "heat" },
      { inputs: ["curd", "heat"], result: "plastic" },
      { inputs: ["milk", "fire"], result: "warm-milk" },
    ],
  },
  {
    id: "vulcanized-rubber",
    targetId: "rubber",
    targetLabel: "Rubber",
    eraPlace: "1839 Woburn, Massachusetts",
    scenario:
      "Woburn, 1839. Soft latex melts in summer and cracks in winter. On the stove sits sulfur—and a stubborn inventor who refuses to quit. Can heat remake the gum of the tropics?",
    history:
      "Charles Goodyear’s accident—sulfur, latex, and heat—gave the world vulcanized rubber: tires, boots, and the industrial age’s bounce.",
    startIds: ["latex", "sulfur", "fire"],
    recipes: [
      { inputs: ["latex", "sulfur"], result: "sticky-mix" },
      { inputs: ["sulfur", "fire"], result: "heat" },
      { inputs: ["sticky-mix", "heat"], result: "rubber" },
      { inputs: ["latex", "fire"], result: "heat" },
    ],
  },
  {
    id: "paper",
    targetId: "paper",
    targetLabel: "Paper",
    eraPlace: "105 Luoyang, China",
    scenario:
      "Luoyang, 105 CE. Silk is precious and bamboo awkward. In the imperial workshop, wood, water, and a heavy stone wait. The empire needs a lighter page.",
    history:
      "Cai Lun’s method—fiber pulp pressed into sheets—spread along the Silk Road and remade how knowledge travelled.",
    startIds: ["tree", "axe", "water", "stone"],
    recipes: [
      { inputs: ["tree", "axe"], result: "chips" },
      { inputs: ["chips", "water"], result: "pulp" },
      { inputs: ["pulp", "stone"], result: "paper" },
    ],
  },
  {
    id: "glass",
    targetId: "glass",
    targetLabel: "Glass",
    eraPlace: "1500 BCE Mesopotamia",
    scenario:
      "Mesopotamia, deep antiquity. Desert sand, camp ash, and fire—ingredients of the everyday. Somewhere between them lies a material that catches light.",
    history:
      "Early glassmakers learned that ash softens sand in the heat, yielding beads, vessels, and eventually windows on the world.",
    startIds: ["sand", "ash", "fire"],
    recipes: [
      { inputs: ["ash", "fire"], result: "flux" },
      { inputs: ["sand", "fire"], result: "heat" },
      { inputs: ["sand", "flux"], result: "glass" },
      { inputs: ["sand", "heat"], result: "glass" },
    ],
  },
  {
    id: "soap",
    targetId: "soap",
    targetLabel: "Soap",
    eraPlace: "2800 BCE Babylon",
    scenario:
      "Babylon, four millennia ago. Animal fat, wood ash, and water: kitchen scraps and hearth sweepings. Combined rightly, they clean more than they soil.",
    history:
      "Alkaline ash water (lye) meeting fat yields soap—a chemistry older than most empires, still under every sink.",
    startIds: ["fat", "ash", "water"],
    recipes: [
      { inputs: ["ash", "water"], result: "lye" },
      { inputs: ["fat", "lye"], result: "soap" },
    ],
  },
  {
    id: "bronze",
    targetId: "bronze",
    targetLabel: "Bronze",
    eraPlace: "3000 BCE Sumer",
    scenario:
      "Sumer, dawn of the Bronze Age. Soft copper alone bends too easily. Tin waits nearby, and the forge is lit. An alloy will arm a civilization.",
    history:
      "Copper plus tin made bronze—harder tools, sharper blades, and an age named for a metal nobody digs from the ground alone.",
    startIds: ["copper", "tin", "fire"],
    recipes: [
      { inputs: ["copper", "fire"], result: "molten-copper" },
      { inputs: ["molten-copper", "tin"], result: "bronze" },
      { inputs: ["tin", "fire"], result: "heat" },
    ],
  },
  {
    id: "concrete",
    targetId: "concrete",
    targetLabel: "Concrete",
    eraPlace: "125 BCE Rome",
    scenario:
      "Rome, late Republic. Limestone, clay, water, and fire—the quarry and the kiln. The city that would pave an empire needs a stone it can pour.",
    history:
      "Roman concrete (opus caementicium) bound crushed rock with lime-based cement—harbors and domes that still stand.",
    startIds: ["limestone", "clay", "fire", "water"],
    recipes: [
      { inputs: ["limestone", "fire"], result: "lime" },
      { inputs: ["lime", "clay"], result: "cement" },
      { inputs: ["cement", "water"], result: "concrete" },
    ],
  },
];

export const puzzleCount = puzzles.length;
