"use client";

// Deprecated: this manufacturing-sequence round has been replaced by the
// Little-Alchemy-style mixing mechanic in `components/alchemy/`. Kept
// unwired (not imported by Game.tsx) rather than deleted, in case the
// step-ordering mechanic is wanted again later.

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
    <div>
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="materia-label">Stage 02 // Process</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#dae2fd]">
            Manufacturing sequence
          </h2>
          <p className="materia-muted mt-2 max-w-2xl text-sm leading-6">
            Reorder the operations to reconstruct the material&rsquo;s real production path.
          </p>
        </div>
        <span className="w-fit rounded-sm border border-[#94a3b8]/20 bg-[#222a3d] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#c4c6cd]">
          {item.steps.length} operations
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="materia-panel rounded-xl p-5 sm:p-6">
          <p className="materia-label text-[#8e9ab1]">Input inventory</p>
          <h3 className="mt-3 text-xl font-semibold text-[#dae2fd]">Raw materials</h3>
          <ul className="mt-5 divide-y divide-[#94a3b8]/10 border-y border-[#94a3b8]/10">
            {item.rawMaterials.map((material, index) => (
              <li key={material} className="flex items-center gap-3 py-3 text-sm text-[#c4c6cd]">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-sm border border-[#7bd0ff]/25 bg-[#7bd0ff]/5 font-mono text-[10px] text-[#7bd0ff]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {material}
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-sm border border-[#94a3b8]/15 bg-[#0b1326]/70 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#68758e]">
              Protocol
            </p>
            <p className="mt-2 text-xs leading-5 text-[#8e9ab1]">
              Drag by the grip or use the keyboard controls to place every operation.
            </p>
          </div>
        </aside>

        <section className="materia-panel rounded-xl p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="materia-label">Reaction board</p>
              <h3 className="mt-2 text-xl font-semibold text-[#dae2fd]">Process queue</h3>
            </div>
            <span className="h-2 w-2 rounded-full bg-[#7bd0ff] shadow-[0_0_10px_#7bd0ff]" />
          </div>
          <ManufacturingBoard steps={item.steps} order={round2.order} onReorder={onReorder} />
          <div className="mt-7 flex justify-end border-t border-[#94a3b8]/10 pt-6">
            <Button onClick={onSubmit}>Initiate reaction</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
