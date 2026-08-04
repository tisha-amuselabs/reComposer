import type { Action, ActionId } from "./types";

/** Shared lab operations. Materials live in items.ts. */
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
  energy: {
    id: "energy",
    name: "Energy",
    kind: "transform",
    arity: 1,
    blurb: "Spend energy to kindle a burn. Wood wants this.",
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
  sieve: {
    id: "sieve",
    name: "Sieve",
    kind: "breakdown",
    arity: 1,
    blurb: "Strain solids from liquid.",
  },
  dry: {
    id: "dry",
    name: "Dry",
    kind: "transform",
    arity: 1,
    blurb: "Drive off moisture with air or warmth.",
  },
  mould: {
    id: "mould",
    name: "Mould",
    kind: "transform",
    arity: 1,
    blurb: "Press into a lasting shape.",
  },
  melt: {
    id: "melt",
    name: "Melt",
    kind: "transform",
    arity: 1,
    blurb: "Liquefy in the forge.",
  },
};
