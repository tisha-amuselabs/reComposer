import type { ItemOfDay } from "../../types/item";
import type { Round1State } from "../../types/game-state";
import { ELEMENT_BY_SYMBOL } from "../../data/periodicTable";
import { Button } from "../Button";
import {
  ROUND1_EXACT_POINTS,
  ROUND1_PARTIAL_POINTS,
  round1Score,
} from "./round1.logic";

export function Round1Results({
  item,
  round1,
  onContinue,
}: {
  item: ItemOfDay;
  round1: Round1State;
  onContinue: () => void;
}) {
  const score = round1Score(round1.feedback);
  const maxPoints = item.composition.length * ROUND1_EXACT_POINTS;

  return (
    <section className="materia-panel flex flex-col gap-7 rounded-xl p-5 sm:p-8">
      <div>
        <p className="materia-label">Stage 01 // Analysis complete</p>
        <h2 className="mt-3 text-2xl font-semibold text-[#dae2fd]">Composition results</h2>
        <p className="materia-muted mt-2 text-sm">
          Here&rsquo;s how your guesses stacked up against the real composition.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-sm border border-[#7bd0ff]/30 bg-[#7bd0ff]/8 px-3 py-2 font-mono text-sm text-[#7bd0ff]">
            {score.points}/{maxPoints} points
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8e9ab1]">
            <span className="text-[#2dd4bf]">{ROUND1_EXACT_POINTS} pts exact</span>
            {" // "}
            <span className="text-[#f6c177]">{ROUND1_PARTIAL_POINTS} pt top-five element</span>
          </span>
        </div>
      </div>

      <div
        className="grid gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${item.composition.length}, minmax(0, 1fr))` }}
      >
        {item.composition.map((truth, i) => {
          const feedback = round1.feedback?.[i] ?? "gray";
          const isCorrect = feedback === "green";
          const isPartial = feedback === "yellow";
          const guessedSymbol = round1.assignments[i];
          const guessedEl = guessedSymbol ? ELEMENT_BY_SYMBOL[guessedSymbol] : null;
          const trueEl = ELEMENT_BY_SYMBOL[truth.symbol];

          return (
            <div
              key={truth.symbol}
              className={`animate-tile-pop flex min-h-32 flex-col items-center justify-center gap-1 rounded-sm border p-2 text-center sm:p-4 ${
                isCorrect
                  ? "border-[#2dd4bf]/60 bg-[#2dd4bf]/10 shadow-[0_0_16px_rgba(45,212,191,0.1)]"
                  : isPartial
                    ? "border-[#f6c177]/60 bg-[#f6c177]/10 shadow-[0_0_16px_rgba(246,193,119,0.08)]"
                    : "border-[#94a3b8]/20 bg-[#0b1326]/65"
              }`}
            >
              <span className="font-mono text-xs text-[#8e9ab1]">{truth.approxPercent}% mass</span>
              <span className="font-mono text-2xl font-bold text-[#dae2fd]">{trueEl?.symbol ?? truth.symbol}</span>
              <span className="text-[10px] text-[#8e9ab1] sm:text-xs">
                {trueEl?.name}
              </span>
              <span
                className={`mt-1 text-[10px] sm:text-[11px] ${
                  isCorrect ? "text-[#2dd4bf]" : isPartial ? "text-[#f6c177]" : "text-[#ffb4ab]"
                }`}
              >
                {isCorrect
                  ? `Exact match · +${ROUND1_EXACT_POINTS}`
                  : isPartial
                    ? `${guessedEl?.symbol} is top five · +${ROUND1_PARTIAL_POINTS}`
                    : guessedEl
                      ? `You guessed ${guessedEl.symbol}`
                      : "No guess"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="materia-subpanel rounded-sm p-4">
        <p className="materia-label text-[#8e9ab1]">Why this composition?</p>
        <p className="mt-2 text-sm leading-6 text-[#c4c6cd]">{item.compositionExplanation}</p>
      </div>

      <Button onClick={onContinue}>Proceed to process</Button>
    </section>
  );
}
