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
    <section aria-label="Inventory" className="alchemy-inventory">
      <h2 className="mb-4 border-b border-[#1a1510]/20 pb-2 font-[family-name:var(--font-eb-garamond)] text-xs font-semibold uppercase tracking-[0.2em] text-[#5c5348]">
        Inventory
      </h2>
      <p className="mb-3 font-[family-name:var(--font-eb-garamond)] text-sm italic text-[#5c5348]">
        Tap to place on the workspace, or drag onto the canvas.
      </p>
      <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
        {ids.map((id) => (
          <li key={id}>
            <ItemTile
              id={id}
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
