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
      className={`flex aspect-square flex-col items-center justify-center rounded-md border text-[10px] leading-none transition-transform hover:scale-110 sm:text-xs ${CATEGORY_COLORS[element.category]} ${
        selected
          ? "scale-110 ring-2 ring-fuchsia-500 ring-offset-1 dark:ring-fuchsia-400"
          : "border-black/10 dark:border-white/10"
      }`}
    >
      <span className="text-[8px] opacity-70 sm:text-[10px]">{element.atomicNumber}</span>
      <span className="text-sm font-bold sm:text-base">{element.symbol}</span>
    </button>
  );
}
