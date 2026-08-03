import type { ItemOfDay } from "../../types/item";
import type { DailyGameState } from "../../types/game-state";
import { TriviaReveal } from "./TriviaReveal";
import { ShareCard } from "./ShareCard";
import { ComeBackTomorrow } from "./ComeBackTomorrow";
import { ROUND1_EXACT_POINTS, round1Score } from "../round1/round1.logic";
import { Button } from "../Button";

export function EndScreen({
  item,
  state,
  onPlayAgain,
}: {
  item: ItemOfDay;
  state: DailyGameState;
  onPlayAgain: () => void;
}) {
  const compositionScore = round1Score(state.round1.feedback);
  const compositionMaxPoints = item.composition.length * ROUND1_EXACT_POINTS;
  const processScore = state.round2.feedback?.filter((value) => value === "green").length ?? 0;

  return (
    <div className="flex flex-col gap-10">
      <div className="text-center">
        <p className="materia-label">Analysis report // Complete</p>
        <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-[#b9c8de] sm:text-6xl">
          Synthesis complete
        </h2>
        <p className="materia-muted mx-auto mt-4 max-w-2xl text-base leading-7 sm:text-lg">
          Material identified through structural, chemical, and historical analysis.
        </p>
        <div className="mt-6 flex justify-center">
          <Button onClick={onPlayAgain}>Play again</Button>
        </div>
      </div>

      <section className="materia-panel relative overflow-hidden rounded-xl p-6 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(123,208,255,0.09),transparent_35%)]" />
        <div className="relative">
          <p className="materia-label">Material ID // {item.id}</p>
          <h3 className="mt-5 text-3xl font-bold tracking-tight text-[#dae2fd] sm:text-5xl">
            {item.name}
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#c4c6cd]">{item.tagline}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="materia-subpanel rounded-sm p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#8e9ab1]">
                Composition
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#dae2fd]">
                {compositionScore.points}/{compositionMaxPoints} pts
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[#8e9ab1]">
                {compositionScore.exact} exact · {compositionScore.partial} partial
              </p>
            </div>
            <div className="materia-subpanel rounded-sm p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#8e9ab1]">
                How is it made?
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#dae2fd]">
                {processScore}/{item.steps.length}
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[#8e9ab1]">
                operations reconstructed
              </p>
            </div>
            <div className="materia-subpanel rounded-sm p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#8e9ab1]">
                Year variance
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#dae2fd]">
                {state.round3.yearDiff ?? "—"} yr
              </p>
            </div>
            <div className="materia-subpanel rounded-sm p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#8e9ab1]">
                Location variance
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#dae2fd]">
                {state.round3.kmDiff !== null
                  ? `${Math.round(state.round3.kmDiff).toLocaleString()} km`
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div>
        <p className="materia-label mb-4">Knowledge archive</p>
        <h3 className="mb-5 text-2xl font-semibold text-[#dae2fd]">Did you know?</h3>
        <TriviaReveal trivia={item.trivia} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <ShareCard item={item} state={state} />
        <ComeBackTomorrow />
      </div>
    </div>
  );
}
