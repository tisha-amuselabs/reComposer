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
      className="grid gap-2"
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
            className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-sm border p-1 transition-all ${
              isActive
                ? "border-[#7bd0ff] bg-[#7bd0ff]/10 shadow-[0_0_14px_rgba(123,208,255,0.16)]"
                : "border-[#94a3b8]/15"
            } ${el ? CATEGORY_COLORS[el.category] : "bg-[#0b1326]/70 text-[#8e9ab1]"}`}
          >
            <span className="font-mono text-[9px] uppercase tracking-wider opacity-75 sm:text-[10px]">
              {c.approxPercent}% mass
            </span>
            <span className="font-mono text-lg font-semibold sm:text-xl">{el ? el.symbol : "+"}</span>
          </button>
        );
      })}
    </div>
  );
}
