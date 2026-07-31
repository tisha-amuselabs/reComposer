"use client";

import type { ItemOfDay } from "../../types/item";
import type { Round2State } from "../../types/game-state";
import { ManufacturingBoard } from "./ManufacturingBoard";
import { Round2Results } from "./Round2Results";
import { Button } from "../Button";

export function Round2({
  item,
  round2,
  onReorder,
  onSubmit,
  onContinue,
}: {
  item: ItemOfDay;
  round2: Round2State;
  onReorder: (order: string[]) => void;
  onSubmit: () => void;
  onContinue: () => void;
}) {
  if (round2.submitted) {
    return <Round2Results item={item} round2={round2} onContinue={onContinue} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span aria-hidden>🛠️</span> Round 2 — Put the process in order
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Raw materials: {item.rawMaterials.join(", ")}. Drag these steps into the order you think
          they really happen in.
        </p>
      </div>

      <ManufacturingBoard steps={item.steps} order={round2.order} onReorder={onReorder} />

      <Button onClick={onSubmit}>Submit order</Button>
    </div>
  );
}
