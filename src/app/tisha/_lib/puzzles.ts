import type { Puzzle } from "./types";

/**
 * Reinventing-the-wheel puzzles: materials on the left, actions on the right.
 * Recipes are operations applied to selected bench materials.
 */
export const puzzles: Puzzle[] = [
  {
    id: "casein-plastic",
    targetId: "plastic",
    targetLabel: "Bioplastic",
    eraPlace: "1897 Munich, Germany",
    scenario:
      "Munich, 1897. Chemists are after a plastic made from milk and lemon, not exotic resins. Side experiments get weird.",
    history:
      "In 1897, Wilhelm Krische and Adolf Spitteler patented Galalith, a hard plastic made from milk casein. Factories moulded it into buttons, beads, and piano keys as a cheap substitute for ivory and horn.",
    startIds: ["milk", "lemon", "tree"],
    actionIds: ["mix", "chop", "energy", "burn", "break", "sieve", "dry", "mould"],
    recipes: [
      // — Correct path —
      { action: "mix", inputs: ["milk", "lemon"], results: ["curd"] },
      { action: "sieve", inputs: ["curd"], results: ["protein", "whey"] },
      { action: "dry", inputs: ["protein"], results: ["dried-protein"] },
      { action: "mould", inputs: ["dried-protein"], results: ["plastic"] },

      // — Tree → fire (Energy, not a free Heat action) —
      { action: "chop", inputs: ["tree"], results: ["wood"] },
      { action: "energy", inputs: ["wood"], results: ["fire"] },
      { action: "break", inputs: ["wood"], results: ["chips"] },
      { action: "break", inputs: ["curd"], results: ["whey", "solids"] },
      { action: "sieve", inputs: ["solids"], results: ["protein"] },
      { action: "dry", inputs: ["solids"], results: ["dried-protein"] },

      // — Funny / throw-off paths —
      { action: "burn", inputs: ["wood"], results: ["charcoal"] },
      { action: "burn", inputs: ["tree"], results: ["charcoal", "smoke"] },
      { action: "mix", inputs: ["milk", "fire"], results: ["warm-milk"] },
      { action: "mix", inputs: ["warm-milk", "fire"], results: ["burnt-milk"] },
      { action: "burn", inputs: ["milk"], results: ["burnt-milk"] },
      { action: "burn", inputs: ["warm-milk"], results: ["burnt-milk", "smoke"] },
      { action: "mix", inputs: ["milk", "wood"], results: ["soggy-wood"] },
      { action: "mix", inputs: ["lemon", "wood"], results: ["citrus-chips"] },
      { action: "mix", inputs: ["curd", "wood"], results: ["curd-toast"] },
      { action: "mix", inputs: ["protein", "wood"], results: ["curd-toast"] },
      { action: "mix", inputs: ["curd", "fire"], results: ["cheese-candle"] },
      { action: "burn", inputs: ["lemon"], results: ["lemon-ash"] },
      { action: "mix", inputs: ["lemon", "fire"], results: ["lemon-ash"] },
      { action: "mix", inputs: ["whey", "wood"], results: ["soggy-wood"] },
      { action: "mix", inputs: ["whey", "lemon"], results: ["regret"] },
      { action: "mix", inputs: ["burnt-milk", "lemon"], results: ["regret"] },
      { action: "mix", inputs: ["milk", "tree"], results: ["forest-milk"] },
      { action: "mix", inputs: ["lemon", "tree"], results: ["sour-sawdust"] },
      { action: "mix", inputs: ["curd", "lemon"], results: ["double-curdle"] },
      { action: "mix", inputs: ["warm-milk", "wood"], results: ["milkshake-splinter"] },
      { action: "mix", inputs: ["warm-milk", "chips"], results: ["milkshake-splinter"] },
      { action: "mix", inputs: ["protein", "fire"], results: ["scorched-protein"] },
      { action: "mix", inputs: ["dried-protein", "fire"], results: ["scorched-protein"] },
      { action: "mix", inputs: ["whey", "fire"], results: ["whey-tea"] },
      { action: "mix", inputs: ["charcoal", "milk"], results: ["ash-milk"] },
      { action: "mix", inputs: ["charcoal", "lemon"], results: ["regret"] },
      { action: "mix", inputs: ["protein", "lemon"], results: ["sticky-mess"] },
      { action: "mix", inputs: ["dried-protein", "lemon"], results: ["sticky-mess"] },
      { action: "mix", inputs: ["dried-protein", "whey"], results: ["sticky-mess"] },
      { action: "mix", inputs: ["chips", "lemon"], results: ["sour-sawdust"] },
      { action: "mix", inputs: ["chips", "fire"], results: ["charcoal"] },
      { action: "mix", inputs: ["forest-milk", "lemon"], results: ["double-curdle"] },
      { action: "chop", inputs: ["lemon"], results: ["citrus-chips"] },
      { action: "chop", inputs: ["milk"], results: ["regret"] },
      { action: "burn", inputs: ["curd"], results: ["cheese-candle"] },
      { action: "burn", inputs: ["protein"], results: ["scorched-protein"] },
      { action: "dry", inputs: ["lemon"], results: ["lemon-ash"] },
      { action: "sieve", inputs: ["lemon"], results: ["regret"] },
      { action: "mould", inputs: ["warm-milk"], results: ["regret"] },
      { action: "mould", inputs: ["whey"], results: ["regret"] },
      { action: "break", inputs: ["fire"], results: ["smoke"] },
      { action: "break", inputs: ["burnt-milk"], results: ["smoke", "regret"] },
      { action: "break", inputs: ["soggy-wood"], results: ["milk", "wood"] },
      { action: "break", inputs: ["citrus-chips"], results: ["lemon", "chips"] },
      { action: "break", inputs: ["curd-toast"], results: ["curd", "chips"] },
      { action: "break", inputs: ["forest-milk"], results: ["milk", "chips"] },
      { action: "break", inputs: ["cheese-candle"], results: ["curd", "smoke"] },
      { action: "break", inputs: ["charcoal"], results: ["chips", "smoke"] },
      { action: "break", inputs: ["sticky-mess"], results: ["protein", "lemon"] },
      { action: "mould", inputs: ["curd"], results: ["curd"] },
      { action: "dry", inputs: ["milk"], results: ["warm-milk"] },
      { action: "sieve", inputs: ["milk"], results: ["milk"] },
      { action: "mould", inputs: ["wood"], results: ["chips"] },
      { action: "dry", inputs: ["whey"], results: ["regret"] },
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
        whenMissing: ["protein", "plastic"],
        text: "Curds are wet and mixed. Use Sieve to strain them and free the protein.",
      },
      {
        id: "cp-3",
        level: 2,
        whenHas: ["protein"],
        whenMissing: ["dried-protein", "plastic"],
        text: "Coagulated protein still holds water. Dry it before you shape it.",
      },
      {
        id: "cp-4",
        level: 2,
        whenHas: ["dried-protein"],
        whenMissing: ["plastic"],
        text: "Dry protein wants a form. Mould it into bioplastic.",
      },
      {
        id: "cp-5",
        level: 2,
        whenHas: ["warm-milk"],
        text: "Warm milk is a detour. More fire may scorch it, unless you meant to make breakfast disasters.",
      },
      {
        id: "cp-5b",
        level: 1,
        whenHas: ["tree"],
        whenMissing: ["fire", "plastic"],
        text: "No free Heat on this bench. Chop the tree, then spend Energy on the wood if you want Fire.",
      },
      {
        id: "cp-6",
        level: 3,
        text: "Mix milk + lemon → Sieve the curd → Dry the protein → Mould into bioplastic.",
      },
    ],
  },
  {
    id: "vulcanized-rubber",
    targetId: "rubber",
    targetLabel: "Rubber",
    eraPlace: "1839 Woburn, Massachusetts",
    scenario:
      "Woburn, 1839. Soft latex melts in summer and cracks in winter. Sulfur waits on the bench. The right operations, not luck, will remake the gum.",
    history:
      "In 1839, Charles Goodyear found that heating natural latex with sulfur produces vulcanized rubber. The material stays flexible in heat and cold, which made tires, boots, and industrial seals practical.",
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
        text: "The sticky blend still fears summer heat, unless you Heat it on purpose.",
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
      "Luoyang, 105 CE. Wood and water wait. Chop, break apart, mix, and press. The empire needs a lighter page.",
    history:
      "Around 105 CE, Cai Lun improved paper by pressing plant-fiber pulp into sheets. The method spread along the Silk Road and replaced heavier writing surfaces such as bamboo slips and silk.",
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
      "By about 1500 BCE in Mesopotamia, glassmakers heated sand with plant ash. The ash acts as a flux, lowering the melting point so the mix can form beads, vessels, and later window glass.",
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
        text: "Ash is not decoration. It helps sand melt at a lower heat.",
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
      "Babylon. Fat, ash, and water: kitchen scraps and hearth sweepings. Mix them in the right order.",
    history:
      "Soap forms when fat meets alkaline ash water (lye). Recipes for this reaction appear in Babylonian records from around 2800 BCE, and the same chemistry still underlies modern soapmaking.",
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
      "Bronze is an alloy of copper and tin. It is harder than pure copper, holds a sharper edge, and gave its name to the Bronze Age because it could not be mined as a single ore.",
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
      "Roman concrete (opus caementicium) mixed lime-based cement with crushed rock and water. The resulting binder set underwater and still holds harbors, aqueducts, and the dome of the Pantheon.",
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
        text: "Cement waits for water. Mix them to pour the stone.",
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
