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
    <div className="overflow-x-auto pb-3">
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: "repeat(18, minmax(1.9rem, 1fr))",
          gridTemplateRows: "repeat(10, minmax(1.9rem, 1fr))",
          minWidth: "680px",
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
