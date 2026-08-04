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
      className="alchemy-inventory alchemy-actions flex max-h-[46vh] w-full shrink-0 flex-col overflow-hidden md:w-56 lg:h-[35rem] lg:max-h-[calc(100dvh-9rem)] lg:w-64"
    >
      <h2 className="mb-2 shrink-0 border-b border-[#1a1510]/20 pb-2 font-[family-name:var(--font-eb-garamond)] text-sm font-semibold uppercase tracking-[0.18em] text-[#5c5348]">
        Actions
      </h2>
      <p className="mb-2 shrink-0 font-[family-name:var(--font-eb-garamond)] text-sm italic leading-snug text-[#5c5348]">
        Select on the bench, then apply.
        {selectionCount > 0 ? ` (${selectionCount} selected)` : ""}
      </p>
      <ul className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain pr-1">
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
                  "w-full border px-3.5 py-3 text-left transition",
                  "border-[#1a1510]/15 hover:border-[#1a1510]/40",
                  disabled ? "opacity-50" : "",
                  !disabled && selectionCount > 0 && !arityOk
                    ? "opacity-60"
                    : "",
                  !disabled && arityOk
                    ? "border-[#1a1510]/45 bg-[#1a1510]/05"
                    : "",
                ].join(" ")}
                title={action.blurb}
              >
                <span className="block font-[family-name:var(--font-eb-garamond)] text-base font-medium tracking-wide text-[#1a1510]">
                  {action.name}
                </span>
                <span className="mt-1 block font-[family-name:var(--font-eb-garamond)] text-sm italic leading-snug text-[#5c5348]">
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
