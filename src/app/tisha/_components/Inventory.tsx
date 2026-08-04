"use client";

import type { ItemId } from "../_lib/types";
import { ItemTile } from "./ItemTile";

type InventoryProps = {
  ids: ItemId[];
  onPointerDragStart: (
    id: ItemId,
    pointerId: number,
    clientX: number,
    clientY: number,
  ) => void;
  disabled?: boolean;
};

export function Inventory({
  ids,
  onPointerDragStart,
  disabled = false,
}: InventoryProps) {
  return (
    <section
      aria-label="Materials"
      className="alchemy-inventory flex max-h-[46vh] w-full shrink-0 flex-col overflow-hidden md:w-56 lg:h-[35rem] lg:max-h-[calc(100dvh-9rem)] lg:w-64"
    >
      <h2 className="mb-2 shrink-0 border-b border-[#1a1510]/20 pb-2 font-[family-name:var(--font-eb-garamond)] text-sm font-semibold uppercase tracking-[0.18em] text-[#5c5348]">
        Materials
      </h2>
      <p className="mb-3 shrink-0 font-[family-name:var(--font-eb-garamond)] text-sm italic leading-snug text-[#5c5348]">
        Tap or drag onto the canvas.
      </p>
      <ul className="grid min-h-0 flex-1 auto-rows-min grid-cols-3 content-start justify-items-center gap-x-2 gap-y-3 overflow-y-auto overscroll-contain pr-1 md:grid-cols-2">
        {ids.map((id) => (
          <li key={id} className="w-full max-w-[5.75rem]">
            <ItemTile
              id={id}
              size="sm"
              muted={disabled}
              onPointerDown={
                disabled
                  ? undefined
                  : (e) => {
                      e.preventDefault();
                      onPointerDragStart(
                        id,
                        e.pointerId,
                        e.clientX,
                        e.clientY,
                      );
                    }
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
