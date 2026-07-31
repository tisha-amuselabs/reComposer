"use client";

import { useState } from "react";
import type { ItemOfDay } from "../../types/item";
import type { Round1State } from "../../types/game-state";
import { PeriodicTable } from "./PeriodicTable";
import { CompositionSlots } from "./CompositionSlots";
import { ElementSearch } from "./ElementSearch";
import { Round1Results } from "./Round1Results";
import { Button } from "../Button";

interface Round1Draft {
  assignments: (string | null)[];
  activeSlot: number;
}

export function Round1({
  item,
  round1,
  onSubmit,
  onContinue,
}: {
  item: ItemOfDay;
  round1: Round1State;
  onSubmit: (assignments: (string | null)[]) => void;
  onContinue: () => void;
}) {
  const [draft, setDraft] = useState<Round1Draft>(() => ({
    assignments: Array(item.composition.length).fill(null),
    activeSlot: 0,
  }));

  if (round1.submitted) {
    return <Round1Results item={item} round1={round1} onContinue={onContinue} />;
  }

  function pickElement(symbol: string) {
    setDraft((prev) => {
      const isTogglingOff = prev.assignments[prev.activeSlot] === symbol;
      const cleared = prev.assignments.map((v) => (v === symbol ? null : v));
      cleared[prev.activeSlot] = isTogglingOff ? null : symbol;
      const nextEmpty = cleared.findIndex((v) => v === null);
      return {
        assignments: cleared,
        activeSlot: nextEmpty === -1 ? prev.activeSlot : nextEmpty,
      };
    });
  }

  function selectSlot(index: number) {
    setDraft((prev) => ({ ...prev, activeSlot: index }));
  }

  const canSubmit = draft.assignments.some((v) => v !== null);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span aria-hidden>🧪</span> Round 1 — Guess the composition
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          These are {item.name.toLowerCase()}&rsquo;s real top {item.composition.length} elements
          by mass, in order. Tap a slot, then pick the element you think belongs there.
        </p>
      </div>

      <CompositionSlots
        composition={item.composition}
        assignments={draft.assignments}
        activeSlot={draft.activeSlot}
        onSelectSlot={selectSlot}
      />

      <ElementSearch onPick={pickElement} />

      <PeriodicTable
        selectedSymbols={draft.assignments.filter((v): v is string => v !== null)}
        onPick={pickElement}
      />

      <Button disabled={!canSubmit} onClick={() => onSubmit(draft.assignments)}>
        Submit guess
      </Button>
    </div>
  );
}
