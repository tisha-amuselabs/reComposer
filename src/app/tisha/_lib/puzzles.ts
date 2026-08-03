import type { Puzzle } from "./types";

/**
 * Reinventing-the-wheel puzzles: materials on the left, actions on the right.
 * Recipes are operations applied to selected bench materials.
 */
export const puzzles: Puzzle[] = [
  {
    id: "casein-plastic",
    targetId: "plastic",
    targetLabel: "Plastic",
    eraPlace: "1897 Munich, Germany",
    scenario:
      "Munich, 1897. Chemists chase a plastic from the commonplace—milk, citrus, timber. Select materials on the bench, then apply lab actions from the right.",
    history:
      "Later, this milk-based plastic—known as Galalith—was carved into buttons as an affordable stand-in for ivory.",
    startIds: ["milk", "lemon", "tree"],
    actionIds: ["mix", "chop", "burn", "heat", "break"],
    recipes: [
      { action: "mix", inputs: ["milk", "lemon"], results: ["curd"] },
      { action: "chop", inputs: ["tree"], results: ["wood"] },
      { action: "burn", inputs: ["wood"], results: ["heat"] },
      { action: "heat", inputs: ["curd"], results: ["plastic"] },
      { action: "heat", inputs: ["milk"], results: ["warm-milk"] },
      { action: "break", inputs: ["curd"], results: ["whey", "solids"] },
      { action: "heat", inputs: ["solids"], results: ["plastic"] },
      { action: "break", inputs: ["wood"], results: ["chips"] },
    ],
    hints: [
      {
        id: "cp-1",
        level: 1,
        whenMissing: ["curd"],
        text: "Milk alone will not harden. Something acidic must separate the solids.",
      },
      {
        id: "cp-2",
        level: 1,
        whenHas: ["curd"],
        whenMissing: ["heat", "plastic"],
        text: "Curds on a cold bench stay soft. The hearth has more to teach.",
      },
      {
        id: "cp-3",
        level: 2,
        whenMissing: ["wood", "heat"],
        text: "Heat need not arrive as a finished tool—burn what you can chop from the tree.",
      },
      {
        id: "cp-4",
        level: 2,
        whenHas: ["curd", "heat"],
        text: "You hold curds and warmth. Apply Heat to the curdled milk.",
      },
      {
        id: "cp-5",
        level: 3,
        text: "Mix milk with lemon → Chop the tree → Burn the wood → Heat the curds (or Break curds, then Heat the solids).",
      },
    ],
  },
  {
    id: "vulcanized-rubber",
    targetId: "rubber",
    targetLabel: "Rubber",
    eraPlace: "1839 Woburn, Massachusetts",
    scenario:
      "Woburn, 1839. Soft latex melts in summer and cracks in winter. Sulfur waits on the bench. Operations—not luck—will remake the gum.",
    history:
      "Charles Goodyear’s accident—sulfur, latex, and heat—gave the world vulcanized rubber: tires, boots, and the industrial age’s bounce.",
    startIds: ["latex", "sulfur"],
    actionIds: ["mix", "heat", "break"],
    recipes: [
      { action: "mix", inputs: ["latex", "sulfur"], results: ["sticky-mix"] },
      { action: "heat", inputs: ["sticky-mix"], results: ["rubber"] },
      { action: "break", inputs: ["sticky-mix"], results: ["latex", "sulfur"] },
    ],
    hints: [
      {
        id: "vr-1",
        level: 1,
        whenMissing: ["sticky-mix"],
        text: "Latex and sulfur must meet before either can be transformed by heat.",
      },
      {
        id: "vr-2",
        level: 2,
        whenHas: ["sticky-mix"],
        text: "The sticky blend still fears summer heat—unless you Heat it on purpose.",
      },
      {
        id: "vr-3",
        level: 3,
        text: "Mix latex with sulfur, then Heat the sticky mix. Break apart undoes a bad blend.",
      },
    ],
  },
  {
    id: "paper",
    targetId: "paper",
    targetLabel: "Paper",
    eraPlace: "105 Luoyang, China",
    scenario:
      "Luoyang, 105 CE. Wood and water wait. Chop, break apart, mix, and press—the empire needs a lighter page.",
    history:
      "Cai Lun’s method—fiber pulp pressed into sheets—spread along the Silk Road and remade how knowledge travelled.",
    startIds: ["tree", "water"],
    actionIds: ["chop", "break", "mix", "press"],
    recipes: [
      { action: "chop", inputs: ["tree"], results: ["wood"] },
      { action: "break", inputs: ["wood"], results: ["chips"] },
      { action: "mix", inputs: ["chips", "water"], results: ["pulp"] },
      { action: "press", inputs: ["pulp"], results: ["paper"] },
      { action: "break", inputs: ["tree"], results: ["chips"] },
    ],
    hints: [
      {
        id: "pa-1",
        level: 1,
        whenMissing: ["chips", "pulp"],
        text: "A whole tree will not become a page. Fibers must be freed and wetted.",
      },
      {
        id: "pa-2",
        level: 2,
        whenHas: ["wood"],
        whenMissing: ["chips"],
        text: "Break the wood apart before you Mix it with water.",
      },
      {
        id: "pa-3",
        level: 2,
        whenHas: ["pulp"],
        text: "Wet pulp wants weight. Press it into a sheet.",
      },
      {
        id: "pa-4",
        level: 3,
        text: "Chop tree → Break wood into chips → Mix chips with water → Press the pulp.",
      },
    ],
  },
  {
    id: "glass",
    targetId: "glass",
    targetLabel: "Glass",
    eraPlace: "1500 BCE Mesopotamia",
    scenario:
      "Mesopotamia, deep antiquity. Sand and ash on the bench. Heat and Mix until light catches in the melt.",
    history:
      "Early glassmakers learned that ash softens sand in the heat, yielding beads, vessels, and eventually windows on the world.",
    startIds: ["sand", "ash"],
    actionIds: ["heat", "mix", "break"],
    recipes: [
      { action: "heat", inputs: ["ash"], results: ["flux"] },
      { action: "mix", inputs: ["sand", "flux"], results: ["batch"] },
      { action: "heat", inputs: ["batch"], results: ["glass"] },
      { action: "mix", inputs: ["sand", "ash"], results: ["batch"] },
      { action: "break", inputs: ["glass"], results: ["sand"] },
    ],
    hints: [
      {
        id: "gl-1",
        level: 1,
        whenMissing: ["flux", "batch", "glass"],
        text: "Ash is not decoration—it helps sand yield at a lower heat.",
      },
      {
        id: "gl-2",
        level: 2,
        whenHas: ["flux"],
        whenMissing: ["glass"],
        text: "Mix flux into sand, then Heat the batch until it clears.",
      },
      {
        id: "gl-3",
        level: 3,
        text: "Heat ash into flux → Mix with sand → Heat the batch. (Or Mix sand with ash, then Heat.)",
      },
    ],
  },
  {
    id: "soap",
    targetId: "soap",
    targetLabel: "Soap",
    eraPlace: "2800 BCE Babylon",
    scenario:
      "Babylon. Fat, ash, and water—kitchen scraps and hearth sweepings. Mix them in the right order.",
    history:
      "Alkaline ash water (lye) meeting fat yields soap—a chemistry older than most empires, still under every sink.",
    startIds: ["fat", "ash", "water"],
    actionIds: ["mix", "break"],
    recipes: [
      { action: "mix", inputs: ["ash", "water"], results: ["lye"] },
      { action: "mix", inputs: ["fat", "lye"], results: ["soap"] },
      { action: "break", inputs: ["soap"], results: ["fat", "lye"] },
    ],
    hints: [
      {
        id: "so-1",
        level: 1,
        whenMissing: ["lye"],
        text: "Ash wants water before it can wash anything.",
      },
      {
        id: "so-2",
        level: 2,
        whenHas: ["lye"],
        text: "Lye alone bites. Mix it with fat to tame it into soap.",
      },
      {
        id: "so-3",
        level: 3,
        text: "Mix ash with water → Mix fat with the lye.",
      },
    ],
  },
  {
    id: "bronze",
    targetId: "bronze",
    targetLabel: "Bronze",
    eraPlace: "3000 BCE Sumer",
    scenario:
      "Sumer. Soft copper, patient tin, and the melt. One metal alone will not arm an age.",
    history:
      "Copper plus tin made bronze—harder tools, sharper blades, and an age named for a metal nobody digs from the ground alone.",
    startIds: ["copper", "tin"],
    actionIds: ["melt", "mix", "heat", "break"],
    recipes: [
      { action: "melt", inputs: ["copper"], results: ["molten-copper"] },
      { action: "mix", inputs: ["molten-copper", "tin"], results: ["bronze"] },
      { action: "heat", inputs: ["copper"], results: ["molten-copper"] },
      { action: "break", inputs: ["bronze"], results: ["copper", "tin"] },
    ],
    hints: [
      {
        id: "br-1",
        level: 1,
        whenMissing: ["molten-copper"],
        text: "Cold copper will not take tin. Soften it in the forge first.",
      },
      {
        id: "br-2",
        level: 2,
        whenHas: ["molten-copper"],
        text: "While copper runs liquid, Mix in the tin.",
      },
      {
        id: "br-3",
        level: 3,
        text: "Melt (or Heat) copper → Mix molten copper with tin.",
      },
    ],
  },
  {
    id: "concrete",
    targetId: "concrete",
    targetLabel: "Concrete",
    eraPlace: "125 BCE Rome",
    scenario:
      "Rome. Limestone, clay, water. Fire the stone, blend a binder, then wet it until it pours.",
    history:
      "Roman concrete (opus caementicium) bound crushed rock with lime-based cement—harbors and domes that still stand.",
    startIds: ["limestone", "clay", "water"],
    actionIds: ["heat", "mix", "break"],
    recipes: [
      { action: "heat", inputs: ["limestone"], results: ["lime"] },
      { action: "mix", inputs: ["lime", "clay"], results: ["cement"] },
      { action: "mix", inputs: ["cement", "water"], results: ["concrete"] },
      { action: "break", inputs: ["limestone"], results: ["lime"] },
      { action: "break", inputs: ["concrete"], results: ["cement", "water"] },
    ],
    hints: [
      {
        id: "co-1",
        level: 1,
        whenMissing: ["lime"],
        text: "Limestone must know the kiln before it can bind.",
      },
      {
        id: "co-2",
        level: 2,
        whenHas: ["lime"],
        whenMissing: ["cement"],
        text: "Mix quicklime with clay to dress a cement.",
      },
      {
        id: "co-3",
        level: 2,
        whenHas: ["cement"],
        text: "Cement waits for water—Mix them to pour the stone.",
      },
      {
        id: "co-4",
        level: 3,
        text: "Heat limestone → Mix lime with clay → Mix cement with water.",
      },
    ],
  },
];

export const puzzleCount = puzzles.length;

export function findPuzzle(id: string): Puzzle | undefined {
  return puzzles.find((p) => p.id === id);
}
