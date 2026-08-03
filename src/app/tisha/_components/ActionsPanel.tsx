"use client";

import { actions } from "../_lib/actions";
import type { ActionId } from "../_lib/types";

type ActionsPanelProps = {
  actionIds: ActionId[];
  onSelect: (id: ActionId) => void;
  disabled?: boolean;
  /** How many materials are currently selected on the bench */
  selectionCount: number;
};

export function ActionsPanel({
  actionIds,
  onSelect,
  disabled = false,
  selectionCount,
}: ActionsPanelProps) {
  return (
    <section
      aria-label="Actions"
      className="alchemy-inventory alchemy-actions flex w-full shrink-0 flex-col md:w-56 lg:w-64"
    >
      <h2 className="mb-4 border-b border-[#1a1510]/20 pb-2 font-[family-name:var(--font-eb-garamond)] text-xs font-semibold uppercase tracking-[0.2em] text-[#5c5348]">
        Actions
      </h2>
      <p className="mb-3 font-[family-name:var(--font-eb-garamond)] text-sm italic text-[#5c5348]">
        Select materials on the bench, then apply an action.
        {selectionCount > 0 ? ` (${selectionCount} selected)` : ""}
      </p>
      <ul className="flex flex-col gap-2">
        {actionIds.map((id) => {
          const action = actions[id];
          const arityOk = selectionCount === action.arity;
          return (
            <li key={id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(id)}
                className={[
                  "w-full border px-3 py-2.5 text-left transition",
                  "border-[#1a1510]/15 hover:border-[#1a1510]/40",
                  disabled ? "opacity-50" : "",
                  !disabled && selectionCount > 0 && !arityOk
                    ? "opacity-60"
                    : "",
                  !disabled && arityOk ? "border-[#1a1510]/45 bg-[#1a1510]/05" : "",
                ].join(" ")}
                title={action.blurb}
              >
                <span className="block font-[family-name:var(--font-eb-garamond)] text-sm font-medium tracking-wide text-[#1a1510]">
                  {action.name}
                </span>
                <span className="mt-0.5 block font-[family-name:var(--font-eb-garamond)] text-xs italic text-[#5c5348]">
                  {action.kind === "breakdown"
                    ? "Breaks into parts"
                    : action.arity === 2
                      ? "Needs 2 materials"
                      : "Needs 1 material"}
                  {" · "}
                  {action.blurb}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
