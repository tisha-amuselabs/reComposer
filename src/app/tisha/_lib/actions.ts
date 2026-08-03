import type { Action, ActionId } from "./types";

/** Shared lab operations — materials live in items.ts */
export const actions: Record<ActionId, Action> = {
  mix: {
    id: "mix",
    name: "Mix",
    kind: "combine",
    arity: 2,
    blurb: "Combine two materials on the bench.",
  },
  chop: {
    id: "chop",
    name: "Chop",
    kind: "transform",
    arity: 1,
    blurb: "Split a solid with the blade.",
  },
  burn: {
    id: "burn",
    name: "Burn",
    kind: "transform",
    arity: 1,
    blurb: "Feed something to the flame.",
  },
  heat: {
    id: "heat",
    name: "Heat",
    kind: "transform",
    arity: 1,
    blurb: "Apply sustained warmth.",
  },
  press: {
    id: "press",
    name: "Press",
    kind: "transform",
    arity: 1,
    blurb: "Flatten under weight.",
  },
  break: {
    id: "break",
    name: "Break apart",
    kind: "breakdown",
    arity: 1,
    blurb: "Separate a material into parts.",
  },
  melt: {
    id: "melt",
    name: "Melt",
    kind: "transform",
    arity: 1,
    blurb: "Liquefy in the forge.",
  },
};
