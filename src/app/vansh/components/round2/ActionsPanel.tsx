"use client";

import type { ProcessAction } from "../../types/item";

const ACTION_GLYPH: Record<string, string> = {
  mix: "⧉",
  coat: "▭",
  layer: "☰",
  wind: "◎",
  inject: "⇩",
  condition: "⚡",
  break: "✂",
  cut: "⟋",
  dip: "▾",
  dry: "☀",
  package: "▤",
  melt: "♨",
  heat: "♨",
  burn: "▴",
  press: "⬇",
  chop: "⟋",
};

export function ActionsPanel({
  actions,
  selectionCount,
  disabled,
  onApply,
}: {
  actions: ProcessAction[];
  selectionCount: number;
  disabled?: boolean;
  onApply: (actionId: string) => void;
}) {
  return (
    <aside className="materia-panel flex min-h-0 flex-col overflow-hidden rounded-xl p-3.5 lg:p-4">
      <p className="materia-label text-[#8e9ab1]">Actions</p>
      <p className="mt-1 text-xs leading-4 text-[#8e9ab1]">
        Select samples, then tap an action.
        {selectionCount > 0 ? ` (${selectionCount} selected)` : ""}
      </p>
      <ul className="mt-3 grid min-h-0 flex-1 grid-cols-2 content-start gap-2 overflow-y-auto pr-0.5">
        {actions.map((action) => {
          const arityOk = selectionCount === action.arity;
          const glyph = ACTION_GLYPH[action.id] ?? action.name.slice(0, 1);
          return (
            <li key={action.id}>
              <button
                type="button"
                disabled={disabled}
                title={action.blurb}
                onClick={() => onApply(action.id)}
                className={[
                  "group flex w-full flex-col items-center gap-1.5 rounded-sm border p-2 text-center transition",
                  arityOk && !disabled
                    ? "border-[#7bd0ff]/55 bg-[#7bd0ff]/10 shadow-[0_0_16px_rgba(123,208,255,0.14)]"
                    : "border-[#94a3b8]/15 bg-[#0b1326]/45 hover:border-[#94a3b8]/40",
                  disabled ? "cursor-not-allowed opacity-40" : "",
                ].join(" ")}
              >
                <span
                  className={[
                    "grid h-12 w-12 place-items-center rounded-sm border text-lg transition group-hover:scale-[1.03]",
                    arityOk && !disabled
                      ? "border-[#7bd0ff]/45 bg-[#7bd0ff]/12 text-[#7bd0ff]"
                      : "border-[#94a3b8]/25 bg-[#131b2e] text-[#94a3b8]",
                  ].join(" ")}
                >
                  {glyph}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#7bd0ff]">
                  {action.name}
                </span>
                <span className="line-clamp-2 min-h-[1.5rem] text-[10px] leading-snug text-[#8e9ab1]">
                  {action.arity === 2 ? "2 samples" : "1 sample"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
