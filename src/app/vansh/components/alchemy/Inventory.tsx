"use client";

import type { AlchemyNode } from "../../types/item";

export function Inventory({
  nodes,
  ids,
  discoveredIds,
  onPointerDragStart,
  disabled = false,
}: {
  nodes: Record<string, AlchemyNode>;
  ids: string[];
  discoveredIds: Set<string>;
  onPointerDragStart: (id: string, pointerId: number, clientX: number, clientY: number) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <p className="materia-label text-[#8e9ab1]">Tap to place, or drag onto the workspace</p>
      <ul className="mt-4 grid grid-cols-2 gap-4">
        {ids.map((id) => {
          const node = nodes[id];
          const isDiscovered = discoveredIds.has(id);
          return (
            <li key={id}>
              <button
                type="button"
                disabled={disabled}
                onPointerDown={
                  disabled
                    ? undefined
                    : (e) => {
                        e.preventDefault();
                        onPointerDragStart(id, e.pointerId, e.clientX, e.clientY);
                      }
                }
                className={`flex min-h-[5.5rem] w-full touch-none flex-col items-center justify-center gap-2 rounded-sm border p-4 transition-all ${
                  isDiscovered
                    ? "border-[#2dd4bf]/40 bg-[#2dd4bf]/5"
                    : "border-[#94a3b8]/15 bg-[#171f33]"
                } ${disabled ? "cursor-default opacity-50" : "cursor-grab hover:border-[#7bd0ff]/40 active:cursor-grabbing"}`}
              >
                <span className="text-3xl" aria-hidden>
                  {node.emoji}
                </span>
                <span className="text-center font-mono text-[11px] leading-snug text-[#c4c6cd]">
                  {node.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
