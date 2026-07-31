import type { ElementGuessTarget } from "../../types/item";
import { ELEMENT_BY_SYMBOL } from "../../data/periodicTable";
import { CATEGORY_COLORS } from "../../data/categoryColors";

export function CompositionSlots({
  composition,
  assignments,
  activeSlot,
  onSelectSlot,
}: {
  composition: ElementGuessTarget[];
  assignments: (string | null)[];
  activeSlot: number;
  onSelectSlot: (index: number) => void;
}) {
  return (
    <div
      className="grid gap-2 sm:gap-3"
      style={{ gridTemplateColumns: `repeat(${composition.length}, minmax(0, 1fr))` }}
    >
      {composition.map((c, i) => {
        const symbol = assignments[i];
        const el = symbol ? ELEMENT_BY_SYMBOL[symbol] : null;
        const isActive = activeSlot === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelectSlot(i)}
            className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-2xl border-2 p-1 shadow-sm transition-all ${
              isActive
                ? "scale-105 border-fuchsia-500 ring-4 ring-fuchsia-300/60 dark:ring-fuchsia-800/60"
                : "border-zinc-300 dark:border-zinc-700"
            } ${el ? CATEGORY_COLORS[el.category] : "bg-zinc-100 dark:bg-zinc-800"}`}
          >
            <span className="text-lg font-black sm:text-2xl">{c.approxPercent}%</span>
            <span className="text-xl font-bold sm:text-2xl">{el ? el.symbol : "?"}</span>
          </button>
        );
      })}
    </div>
  );
}
