# Item of the Day — content spec (for a curation agent)

Give this whole file to your content-curating AI agent as its instructions. It
describes exactly one deliverable: a single TypeScript file for one new
"Item of the Day" entry, ready to paste into this codebase with no edits.

Live AI hints (via `/api/hint`, see bottom of this file) are generated
automatically from whatever data you provide here — there is nothing to
author for hints specifically. Just make sure every field below is accurate,
since the hint prompts quote your data directly.

## Your job

Research one everyday manufactured/produced item and return **one TypeScript
code block** — nothing else, no commentary before or after — containing a
`const` object that satisfies the `ItemOfDay` interface below. The person
receiving your output will paste it directly into a new file, so it must be
valid, complete TypeScript as-is.

## The interface you must satisfy

```ts
interface ElementGuessTarget {
  symbol: string; // must be a real element symbol, see list below
  approxPercent: number; // approximate % of total mass
}

interface ManufacturingStep {
  id: string; // kebab-case, unique within this item, e.g. "cut-splints"
  label: string; // short present-tense action, e.g. "Cut wood into splints"
  description: string; // one sentence, plain language
}

// Little-Alchemy-style combination graph for the "Alchemy station" round:
// start with `startIds`, combine two nodes at a time, and if a pair matches
// a `combinations` entry you get the result node. Chain forward until you
// reach `targetId` (should be the final node representing the item itself).
type AlchemyActionId = "heat" | "cool" | "pressurize" | "stir"; // reuse these four verbs where sensible; you can name additional simple actions if none of these fit, but prefer reuse

interface AlchemyNode {
  id: string; // kebab-case, unique within this item's alchemy graph
  label: string; // display name, e.g. "Oxidizer blend"
  emoji: string; // one emoji, decorative tile icon
  // "material" = raw ingredients AND every combination result, including the
  // final target. "action" = only the reusable tool verbs (see
  // AlchemyActionId above). Drives which of the two inventory panels
  // (Materials on the left, Actions on the right) a node appears in.
  type: "material" | "action";
}

interface AlchemyCombination {
  inputs: [string, string]; // two existing node ids (order doesn't matter)
  result: string; // the node id this combination produces
}

interface AlchemyRecipe {
  nodes: Record<string, AlchemyNode>; // EVERY node used anywhere below, keyed by its own id
  startIds: string[]; // node ids the player begins with in their inventory (raw materials + action tools)
  combinations: AlchemyCombination[]; // 4-7 steps, chained start->intermediate(s)->target
  targetId: string; // must equal the id of the final node, reached by the last combination
}

interface ItemOrigin {
  year: number; // best-known year of first invention/production of THIS item
  yearLabel: string; // usually just String(year), e.g. "1826"
  locationName: string; // "City, Country"
  lat: number;
  lng: number;
  minYear: number; // lower bound for the guessing slider
  maxYear: number; // upper bound for the guessing slider (2026 is fine as "present day")
}

interface ItemOfDay {
  id: string; // kebab-case slug, globally unique, e.g. "pencil-lead"
  name: string; // display name, e.g. "Pencil lead"
  tagline: string; // one punchy sentence of flavor text
  composition: ElementGuessTarget[]; // top elements by mass, MOST to LEAST, max 5
  rawMaterials: string[]; // plain-language precursor materials
  steps: ManufacturingStep[]; // 4-6 steps, in the REAL correct order (deprecated round, kept for compatibility — still fill it in)
  alchemy: AlchemyRecipe;
  origin: ItemOrigin;
  trivia: string[]; // 2-4 short standalone fun facts, shown at the very end
  // Shown on each round's own results screen, right after the reveal and
  // before "Continue" — a short, plain-language "why is the answer this?"
  // paragraph. These are NOT trivia — they explain the reasoning, not facts.
  compositionExplanation: string; // why these elements/ratios, in these amounts
  processExplanation: string; // why the combination chain happens in this order
  originExplanation: string; // why this specific year + place is the real answer
}
```

## Exact output template

Fill in every `___`. Keep the const name SCREAMING_SNAKE_CASE matching the
`id`, and match the file/export pattern exactly — this becomes the entire
contents of a new file.

```ts
import type { ItemOfDay } from "../../types/item";

export const ___EXPORT_NAME___: ItemOfDay = {
  id: "___kebab-case-id___",
  name: "___Display Name___",
  tagline: "___One punchy sentence.___",
  composition: [
    { symbol: "___", approxPercent: ___ },
    { symbol: "___", approxPercent: ___ },
    { symbol: "___", approxPercent: ___ },
    { symbol: "___", approxPercent: ___ },
    { symbol: "___", approxPercent: ___ },
  ],
  rawMaterials: ["___", "___", "___"],
  steps: [
    { id: "___", label: "___", description: "___" },
    { id: "___", label: "___", description: "___" },
    { id: "___", label: "___", description: "___" },
    { id: "___", label: "___", description: "___" },
  ],
  alchemy: {
    nodes: {
      "___node-id___": { id: "___node-id___", label: "___Label___", emoji: "___", type: "material" },
      // ...one entry for every id referenced in startIds/combinations below, each with type: "material" | "action"
    },
    startIds: ["___", "___", "___", "___", "___"],
    combinations: [
      { inputs: ["___", "___"], result: "___" },
      { inputs: ["___", "___"], result: "___" },
      { inputs: ["___", "___"], result: "___" },
      { inputs: ["___", "___"], result: "___" },
    ],
    targetId: "___final-node-id-matching-last-combination-result___",
  },
  origin: {
    year: ___,
    yearLabel: "___",
    locationName: "___, ___",
    lat: ___,
    lng: ___,
    minYear: ___,
    maxYear: 2026,
  },
  trivia: ["___", "___", "___"],
  compositionExplanation: "___",
  processExplanation: "___",
  originExplanation: "___",
};
```

## Field-by-field rules

- **id**: kebab-case, must not collide with existing ids (see list below).
- **composition**: real chemistry, not vibes. Break the item's actual known
  ingredients down into their constituent elements and estimate mass % from
  the real chemical formulas. Sort descending by `approxPercent`. It's fine
  (expected) if the top 5 don't sum to 100 — minor binders/trace elements are
  omitted. If no authoritative single assay exists, say so in `trivia`, not
  in the data itself.
- **steps**: the real, objectively-correct manufacturing sequence, 4-6 steps.
  This round is currently unused in the live game (superseded by `alchemy`)
  but the field is still required — fill it in accurately anyway, both for
  forward-compatibility and because `alchemy` should tell the same story.
- **alchemy**: this drives the live "Alchemy station" round, so it has to
  actually work as a puzzle:
  - Every combination's two `inputs` must each be either a `startId` or the
    `result` of an earlier combination — never something not yet reachable.
  - The final combination's `result` must equal `targetId`.
  - `startIds` should be your `rawMaterials` (as their own node ids — reuse
    consistent kebab-case ids, they don't have to match the `rawMaterials`
    strings verbatim) plus 1-3 action-tool nodes (`heat`, `stir`, `cool`,
    `pressurize`, or another simple verb if none fit) representing real steps
    from your `steps` list that aren't "ingredients" per se.
  - Aim for 4-7 total combinations — enough to feel like a real process,
    short enough to stay solvable without a hint.
  - Every node you reference (in `startIds`, `inputs`, or `result`) must have
    a matching entry in `nodes`, and vice versa — no orphans either way.
  - Set every node's `type` correctly: `"action"` for the tool-verb nodes
    only, `"material"` for everything else (raw materials AND every
    combination result, including the final target). This is what splits the
    game's Materials panel from its Actions panel, so a wrong `type` puts a
    node in the wrong column.
- **origin**: pick one specific, mainstream-documented "first invented/made"
  year + place for this exact version of the item. If the date is disputed
  or fuzzy, still commit to one answer for scoring, and put the nuance in
  `trivia` (see the matchstick-tip example below for exactly this pattern).
  Set `minYear`/`maxYear` to a range that comfortably brackets the true year
  without being absurdly wide (roughly true year ± 100-300 years depending on
  how confidently it's dated).
- **trivia**: original phrasing, 2-4 sentences, each one standalone (players
  see these without other context). This is also where you hedge any
  approximations or historical disputes from the fields above.
- **compositionExplanation / processExplanation / originExplanation**: 2-4
  sentences each, plain language, written for someone who just saw the
  answer and wants the "oh, that's why" — not a restatement of the data, the
  underlying reasoning (e.g. *why* an oxidizer contributes the most oxygen by
  mass, *why* combination order can't be swapped, *why* that year/city and
  not another). These are shown mid-game, so don't reference `trivia` content
  or assume the player has finished the whole item yet.
- No copyrighted text — paraphrase everything in your own words.

## Valid element symbols (only use these)

H, He, Li, Be, B, C, N, O, F, Ne, Na, Mg, Al, Si, P, S, Cl, Ar, K, Ca, Sc, Ti,
V, Cr, Mn, Fe, Co, Ni, Cu, Zn, Ga, Ge, As, Se, Br, Kr, Rb, Sr, Y, Zr, Nb, Mo,
Tc, Ru, Rh, Pd, Ag, Cd, In, Sn, Sb, Te, I, Xe, Cs, Ba, La, Ce, Pr, Nd, Pm, Sm,
Eu, Gd, Tb, Dy, Ho, Er, Tm, Yb, Lu, Hf, Ta, W, Re, Os, Ir, Pt, Au, Hg, Tl, Pb,
Bi, Po, At, Rn, Fr, Ra, Ac, Th, Pa, U, Np, Pu, Am, Cm, Bk, Cf, Es, Fm, Md, No,
Lr, Rf, Db, Sg, Bh, Hs, Mt, Ds, Rg, Cn, Nh, Fl, Mc, Lv, Ts, Og

## Ids already taken

- `matchstick-tip`
- `lithium-ion-battery`

## Worked example (existing, shipped item)

```ts
export const MATCHSTICK_TIP: ItemOfDay = {
  id: "matchstick-tip",
  name: "Matchstick tip",
  tagline: "The tiny chemical bomb on the end of every match.",
  composition: [
    { symbol: "O", approxPercent: 29 },
    { symbol: "Sb", approxPercent: 18 },
    { symbol: "K", approxPercent: 16 },
    { symbol: "Cl", approxPercent: 14 },
    { symbol: "S", approxPercent: 12 },
  ],
  rawMaterials: [
    "Wood (splint)",
    "Potassium chlorate",
    "Antimony trisulfide",
    "Sulfur",
    "Starch / gum binder",
  ],
  steps: [
    { id: "cut-splints", label: "Cut wood into splints", description: "..." },
    { id: "prepare-paste", label: "Prepare the chemical head paste", description: "..." },
    { id: "dip-tip", label: "Dip the tip in the paste", description: "..." },
    { id: "dry", label: "Dry the coated heads", description: "..." },
    { id: "package", label: "Package the finished matches", description: "..." },
  ],
  alchemy: {
    nodes: {
      wood: { id: "wood", label: "Wood (splint)", emoji: "🪵", type: "material" },
      "potassium-chlorate": { id: "potassium-chlorate", label: "Potassium chlorate", emoji: "🧂", type: "material" },
      "antimony-trisulfide": { id: "antimony-trisulfide", label: "Antimony trisulfide", emoji: "🪨", type: "material" },
      sulfur: { id: "sulfur", label: "Sulfur", emoji: "🟡", type: "material" },
      binder: { id: "binder", label: "Starch / gum binder", emoji: "🧴", type: "material" },
      stir: { id: "stir", label: "Stir", emoji: "🌀", type: "action" },
      heat: { id: "heat", label: "Heat", emoji: "🔥", type: "action" },
      "oxidizer-blend": { id: "oxidizer-blend", label: "Oxidizer blend", emoji: "⚗️", type: "material" },
      "raw-paste": { id: "raw-paste", label: "Raw paste", emoji: "🥣", type: "material" },
      "bound-paste": { id: "bound-paste", label: "Bound paste", emoji: "🧪", type: "material" },
      "chemical-paste": { id: "chemical-paste", label: "Chemical paste", emoji: "🧫", type: "material" },
      "dipped-splint": { id: "dipped-splint", label: "Dipped splint", emoji: "🖊️", type: "material" },
      "matchstick-tip": { id: "matchstick-tip", label: "Matchstick tip", emoji: "🔥", type: "material" },
    },
    startIds: ["wood", "potassium-chlorate", "antimony-trisulfide", "sulfur", "binder", "stir", "heat"],
    combinations: [
      { inputs: ["potassium-chlorate", "antimony-trisulfide"], result: "oxidizer-blend" },
      { inputs: ["oxidizer-blend", "sulfur"], result: "raw-paste" },
      { inputs: ["raw-paste", "binder"], result: "bound-paste" },
      { inputs: ["bound-paste", "stir"], result: "chemical-paste" },
      { inputs: ["chemical-paste", "wood"], result: "dipped-splint" },
      { inputs: ["dipped-splint", "heat"], result: "matchstick-tip" },
    ],
    targetId: "matchstick-tip",
  },
  origin: {
    year: 1826,
    yearLabel: "1826",
    locationName: "Stockton-on-Tees, England",
    lat: 54.5642,
    lng: -1.3188,
    minYear: 1700,
    maxYear: 2026,
  },
  trivia: [
    "Most historians credit English chemist John Walker with inventing the friction match in 1826 — though he didn't sell his first box until 1827.",
    "...",
  ],
  compositionExplanation:
    "A match head needs an oxidizer to supply oxygen for combustion and a fuel for that oxygen to burn. Potassium chlorate (KClO₃) is the oxidizer — and since each molecule is nearly 40% oxygen by weight, oxygen ends up the single biggest element overall...",
  processExplanation:
    "The oxidizer and fuel are combined first because that reactive pair is the chemical heart of the head — everything else just shapes and stabilizes it...",
  originExplanation:
    "English chemist John Walker stumbled onto this exact formula in 1826 in Stockton-on-Tees while trying to remove a dried chemical coating from a stirring stick...",
};
```

## Return format

Return exactly one fenced ` ```ts ` code block with the filled-in template.
No prose before or after it.

## About hints (informational, nothing to do here)

The live game has a "Get a hint" button on each round, backed by
`src/app/api/hint/route.ts`. It sends whatever data you authored above (the
true composition/recipe/origin, plus the player's current progress) to
Gemini with instructions to nudge without revealing the answer. Accurate,
well-written fields here directly become better hints — there's no separate
hint content to write.
