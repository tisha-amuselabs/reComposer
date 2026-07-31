import type { ItemOfDay } from "../../types/item";
import type { Round1State } from "../../types/game-state";
import { ELEMENT_BY_SYMBOL } from "../../data/periodicTable";
import { Button } from "../Button";

export function Round1Results({
  item,
  round1,
  onContinue,
}: {
  item: ItemOfDay;
  round1: Round1State;
  onContinue: () => void;
}) {
  return (
    <section className="materia-panel flex flex-col gap-7 rounded-xl p-5 sm:p-8">
      <div>
        <p className="materia-label">Stage 01 // Analysis complete</p>
        <h2 className="mt-3 text-2xl font-semibold text-[#dae2fd]">Composition results</h2>
        <p className="materia-muted mt-2 text-sm">
          Here&rsquo;s how your guesses stacked up against the real composition.
        </p>
      </div>

      <div
        className="grid gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${item.composition.length}, minmax(0, 1fr))` }}
      >
        {item.composition.map((truth, i) => {
          const isCorrect = round1.feedback?.[i] === "green";
          const guessedSymbol = round1.assignments[i];
          const guessedEl = guessedSymbol ? ELEMENT_BY_SYMBOL[guessedSymbol] : null;
          const trueEl = ELEMENT_BY_SYMBOL[truth.symbol];

          return (
            <div
              key={truth.symbol}
              className={`animate-tile-pop flex min-h-32 flex-col items-center justify-center gap-1 rounded-sm border p-2 text-center sm:p-4 ${
                isCorrect
                  ? "border-[#2dd4bf]/60 bg-[#2dd4bf]/10 shadow-[0_0_16px_rgba(45,212,191,0.1)]"
                  : "border-[#94a3b8]/20 bg-[#0b1326]/65"
              }`}
            >
              <span className="font-mono text-xs text-[#8e9ab1]">{truth.approxPercent}% mass</span>
              <span className="font-mono text-2xl font-bold text-[#dae2fd]">{trueEl?.symbol ?? truth.symbol}</span>
              <span className="text-[10px] text-[#8e9ab1] sm:text-xs">
                {trueEl?.name}
              </span>
              {!isCorrect && (
                <span className="mt-1 text-[10px] text-[#ffb4ab] sm:text-[11px]">
                  {guessedEl ? `You guessed ${guessedEl.symbol}` : "No guess"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <Button onClick={onContinue}>Proceed to process</Button>
    </section>
  );
}
