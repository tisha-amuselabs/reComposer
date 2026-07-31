import { PERIODIC_TABLE } from "../../data/periodicTable";
import { ElementTile } from "./ElementTile";

export function PeriodicTable({
  selectedSymbols,
  onPick,
}: {
  selectedSymbols: string[];
  onPick: (symbol: string) => void;
}) {
  return (
    <div className="overflow-x-auto pb-2">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: "repeat(18, minmax(1.75rem, 1fr))",
          gridTemplateRows: "repeat(10, minmax(1.75rem, 1fr))",
          minWidth: "640px",
        }}
      >
        {PERIODIC_TABLE.map((el) => (
          <ElementTile
            key={el.symbol}
            element={el}
            selected={selectedSymbols.includes(el.symbol)}
            onClick={() => onPick(el.symbol)}
          />
        ))}
      </div>
    </div>
  );
}
