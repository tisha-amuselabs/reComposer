"use client";

import type { ProcessMaterial } from "../../types/item";

export function MaterialsPanel({
  inventoryIds,
  materials,
  disabled,
  onPlace,
}: {
  inventoryIds: string[];
  materials: ProcessMaterial[];
  disabled?: boolean;
  onPlace: (materialId: string) => void;
}) {
  const byId = Object.fromEntries(materials.map((m) => [m.id, m]));

  return (
    <aside className="materia-panel flex min-h-0 flex-col overflow-hidden rounded-xl p-3.5 lg:p-4">
      <p className="materia-label text-[#8e9ab1]">Materials</p>
      <p className="mt-1 text-xs leading-4 text-[#8e9ab1]">
        Tap an icon to place it on the bench.
      </p>
      <ul className="mt-3 grid min-h-0 flex-1 grid-cols-2 content-start gap-2 overflow-y-auto pr-0.5">
        {inventoryIds.map((id) => {
          const material = byId[id];
          if (!material) return null;
          const initials = material.name
            .split(/\s+/)
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();
          return (
            <li key={id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onPlace(id)}
                className="group flex w-full flex-col items-center gap-1.5 rounded-sm border border-[#94a3b8]/18 bg-[#0b1326]/55 p-2 text-center transition hover:border-[#7bd0ff]/50 hover:bg-[#7bd0ff]/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span
                  className="grid h-12 w-12 place-items-center rounded-sm border font-mono text-xs font-semibold uppercase tracking-wide text-[#dae2fd] shadow-[inset_0_0_18px_rgba(123,208,255,0.06)] transition group-hover:scale-[1.03]"
                  style={{
                    backgroundColor: `${material.accent ?? "#222a3d"}55`,
                    borderColor: `${material.accent ?? "#94a3b8"}77`,
                  }}
                >
                  {initials.slice(0, 2)}
                </span>
                <span className="line-clamp-2 min-h-[1.75rem] text-[11px] leading-snug text-[#c4c6cd]">
                  {material.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
