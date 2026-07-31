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
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span aria-hidden>🧪</span> Round 1 results
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
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
              className={`animate-tile-pop flex flex-col items-center gap-0.5 rounded-2xl border-2 p-2 text-center shadow-sm sm:p-3 ${
                isCorrect
                  ? "border-green-500 bg-green-50 dark:bg-green-950/40"
                  : "border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
              }`}
            >
              <span className="text-lg font-black sm:text-2xl">{truth.approxPercent}%</span>
              <span className="text-xl font-bold sm:text-2xl">{trueEl?.symbol ?? truth.symbol}</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 sm:text-xs">
                {trueEl?.name}
              </span>
              {!isCorrect && (
                <span className="mt-0.5 text-[10px] text-red-500 sm:text-[11px]">
                  {guessedEl ? `You guessed ${guessedEl.symbol}` : "No guess"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <Button onClick={onContinue}>Continue to Round 2</Button>
    </div>
  );
}
