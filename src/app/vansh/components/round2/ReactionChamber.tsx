"use client";

import type { ProcessMaterial } from "../../types/item";

export type ChamberInstance = {
  instanceId: string;
  materialId: string;
  popping?: boolean;
};

export function ReactionChamber({
  instances,
  materials,
  selectedIds,
  disabled,
  status,
  celebration,
  onToggleSelect,
  onClearSelection,
}: {
  instances: ChamberInstance[];
  materials: ProcessMaterial[];
  selectedIds: string[];
  disabled?: boolean;
  status?: string | null;
  celebration?: { title: string; detail: string } | null;
  onToggleSelect: (instanceId: string) => void;
  onClearSelection: () => void;
}) {
  const byId = Object.fromEntries(materials.map((m) => [m.id, m]));

  return (
    <section className="materia-panel relative flex min-h-0 flex-col overflow-hidden rounded-xl p-3 lg:p-3.5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="materia-label">Reaction chamber</p>
        <span className="h-1.5 w-1.5 rounded-full bg-[#7bd0ff] shadow-[0_0_10px_#7bd0ff]" />
      </div>

      {celebration && (
        <div
          key={`${celebration.title}-${celebration.detail}`}
          className="materia-step-celebrate absolute inset-x-3 top-9 z-20 rounded-sm border border-[#2dd4bf]/45 bg-[#0b1326]/95 px-3 py-2 backdrop-blur-sm lg:inset-x-3.5"
          role="status"
          aria-live="polite"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2dd4bf]">
            Operation complete
          </p>
          <p className="mt-0.5 text-sm font-semibold text-[#dae2fd]">
            {celebration.title}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-4 text-[#9fe7da]">
            {celebration.detail}
          </p>
        </div>
      )}

      <div
        className="relative flex min-h-0 flex-1 flex-col overflow-y-auto rounded-lg border border-dashed border-[#7bd0ff]/18 bg-[#060e20]/40 p-2.5"
        onClick={() => {
          if (!disabled) onClearSelection();
        }}
      >
        {instances.length === 0 ? (
          <p className="m-auto max-w-[14rem] text-center text-xs italic text-[#68758e]">
            Place materials, select them, then apply an action.
          </p>
        ) : (
          <ul className="flex flex-wrap content-start justify-center gap-2">
            {instances.map((inst) => {
              const material = byId[inst.materialId];
              const selected = selectedIds.includes(inst.instanceId);
              const initials = (material?.name ?? "?")
                .split(/\s+/)
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase();
              return (
                <li
                  key={inst.instanceId}
                  className={inst.popping ? "materia-tile-pop" : undefined}
                >
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect(inst.instanceId);
                    }}
                    className={[
                      "flex w-[5.5rem] flex-col items-center gap-1 rounded-sm border p-2 text-center transition",
                      selected
                        ? "border-[#7bd0ff] bg-[#7bd0ff]/12 shadow-[0_0_18px_rgba(123,208,255,0.18)]"
                        : "border-[#94a3b8]/20 bg-[#131b2e]/80 hover:border-[#7bd0ff]/40",
                      disabled ? "cursor-not-allowed opacity-50" : "",
                    ].join(" ")}
                    aria-pressed={selected}
                  >
                    <span
                      className="grid h-10 w-10 place-items-center rounded-sm border font-mono text-[11px] uppercase text-[#dae2fd]"
                      style={{
                        backgroundColor: `${material?.accent ?? "#222a3d"}40`,
                        borderColor: `${material?.accent ?? "#94a3b8"}66`,
                      }}
                    >
                      {initials.slice(0, 2)}
                    </span>
                    <span className="line-clamp-2 text-[10px] leading-tight text-[#c4c6cd]">
                      {material?.name ?? inst.materialId}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-2 truncate font-mono text-[10px] uppercase tracking-[0.08em] text-[#8e9ab1]">
        {status ?? "Awaiting operation"}
      </div>
    </section>
  );
}
