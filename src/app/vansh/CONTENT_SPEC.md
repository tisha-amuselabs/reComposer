# Item of the Day — content spec (for a curation agent)

Give this whole file to your content-curating AI agent as its instructions. It
describes exactly one deliverable: a single TypeScript file for one new
"Item of the Day" entry, ready to paste into this codebase with no edits.

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
  rawMaterials: string[]; // plain-language precursor materials (display list)
  steps: ManufacturingStep[]; // 4-6 steps, in the REAL correct order (scoring key)
  processLab: ProcessLab; // reaction chamber: materials + actions + recipes
  trivia: string[]; // 2-4 short standalone fun facts
  origin: ItemOrigin;
}

interface ProcessMaterial { id: string; name: string; accent?: string }
interface ProcessAction { id: string; name: string; arity: 1 | 2; blurb: string }
interface ProcessRecipe {
  action: string;
  inputs: string[];      // 1 or 2 material ids
  results: string[];     // 1+ products (breakdown may return 2)
  stepId?: string;       // optional link to ManufacturingStep.id for scoring
}
interface ProcessLab {
  materials: ProcessMaterial[];
  actions: ProcessAction[];
  recipes: ProcessRecipe[];
  startIds: string[];    // starting inventory
  targetId: string;      // winning product the player must synthesize
  hints: ProcessHint[];  // escalating process hints
}

interface ProcessHint {
  id: string;
  level: 1 | 2 | 3;      // 1 flavor, 2 process, 3 near-spoiler
  whenHas?: string[];    // optional: show when these materials are known
  whenMissing?: string[];
  text: string;
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
- **steps**: the real, objectively-correct manufacturing sequence — this
  becomes the puzzle's scored answer, so get the order right. 4-6 steps.
- **processLab**: playable reaction chamber that reconstructs those steps.
  `recipes` should cover a path from `startIds` to `targetId`. Link key
  recipes to `stepId` values from `steps` so scoring can mark operations
  as reconstructed. Include a `break` action with a few reverse recipes.
  Keep arity to 1 or 2 materials per action. Provide 4–6 `hints` that
  escalate from flavor (1) to process (2) to near-spoiler (3), preferably
  gated with `whenHas` / `whenMissing` material ids.
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
};
```

## Return format

Return exactly one fenced ` ```ts ` code block with the filled-in template.
No prose before or after it.
