"use client";

import { useDailyGame } from "../lib/useDailyGame";
import { ProgressDots } from "./ProgressDots";
import { Round1 } from "./round1/Round1";
import { Round2 } from "./round2/Round2";
import { Round3 } from "./round3/Round3";
import { EndScreen } from "./end/EndScreen";

export function Game() {
  const {
    item,
    state,
    isLoaded,
    submitRound1,
    updateRound2Order,
    submitRound2,
    updateRound3Guess,
    submitRound3,
    advancePhase,
  } = useDailyGame();

  if (!isLoaded || !item || !state) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400">Loading today&rsquo;s item&hellip;</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-gradient text-3xl font-black tracking-tight sm:text-4xl">
            🔬 Item of the Day
          </h1>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{item.tagline}</p>
        </div>
        <ProgressDots phase={state.phase} />
      </header>

      <main className="flex flex-1 flex-col rounded-3xl border border-white/60 bg-white/90 p-6 shadow-xl shadow-purple-500/10 backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-950/90 sm:p-8">
        {state.phase === "round1" ? (
          <Round1
            item={item}
            round1={state.round1}
            onSubmit={submitRound1}
            onContinue={advancePhase}
          />
        ) : state.phase === "round2" ? (
          <Round2
            item={item}
            round2={state.round2}
            onReorder={updateRound2Order}
            onSubmit={submitRound2}
            onContinue={advancePhase}
          />
        ) : state.phase === "round3" ? (
          <Round3
            item={item}
            round3={state.round3}
            onUpdateGuess={updateRound3Guess}
            onSubmit={submitRound3}
            onContinue={advancePhase}
          />
        ) : (
          <EndScreen item={item} state={state} />
        )}
      </main>
    </div>
  );
}
