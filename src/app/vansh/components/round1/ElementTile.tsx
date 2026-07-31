import type { PeriodicElement } from "../../types/element";
import { CATEGORY_COLORS } from "../../data/categoryColors";

export function ElementTile({
  element,
  selected,
  onClick,
}: {
  element: PeriodicElement;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ gridRow: element.gridRow, gridColumn: element.gridColumn }}
      title={element.name}
      className={`flex aspect-square flex-col items-center justify-center rounded-sm border text-[10px] leading-none transition-all hover:z-10 hover:scale-110 hover:border-[#7bd0ff] sm:text-xs ${CATEGORY_COLORS[element.category]} ${
        selected
          ? "z-10 scale-110 border-[#7bd0ff] ring-2 ring-[#7bd0ff]/50"
          : "border-white/5 opacity-80 hover:opacity-100"
      }`}
    >
      <span className="text-[8px] opacity-70 sm:text-[10px]">{element.atomicNumber}</span>
      <span className="font-mono text-sm font-bold sm:text-base">{element.symbol}</span>
    </button>
  );
}
