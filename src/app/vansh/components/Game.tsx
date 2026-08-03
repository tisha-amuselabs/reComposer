"use client";

import { useDailyGame } from "../lib/useDailyGame";
import { isDemoMode } from "../lib/demo";
import { ITEMS } from "../data/items";
import { ProgressDots } from "./ProgressDots";
import { DemoBar } from "./DemoBar";
import { Round1 } from "./round1/Round1";
import { AlchemyStation } from "./alchemy/AlchemyStation";
import { Round3 } from "./round3/Round3";
import { EndScreen } from "./end/EndScreen";

export function Game() {
  const {
    item,
    state,
    isLoaded,
    submitRound1,
    submitAlchemy,
    updateRound3Guess,
    submitRound3,
    advancePhase,
  } = useDailyGame();

  if (!isLoaded || !item || !state) {
    return (
      <div className="materia flex min-h-screen items-center justify-center">
        <p className="materia-label animate-pulse">Initializing material analysis&hellip;</p>
      </div>
    );
  }

  const showItemHeader = state.phase === "round1" && !state.round1.submitted;

  return (
    <div className="materia">
      <div className="relative z-10 min-h-screen">
        <header className="border-b border-[#94a3b8]/15 bg-[#0b1326]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-360 items-center justify-between gap-5 px-4 sm:px-8 lg:px-16">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-sm border border-[#7bd0ff]/35 bg-[#7bd0ff]/10 font-mono text-sm font-bold text-[#7bd0ff]">
                M
              </span>
              <span className="text-xl font-bold tracking-[-0.04em] text-[#b9c8de] sm:text-2xl">
                Materia
              </span>
            </div>
            <div className="max-w-[70vw] overflow-x-auto">
              <ProgressDots phase={state.phase} />
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-360 flex-col px-4 pb-16 pt-10 sm:px-8 lg:px-16 lg:pt-14">
          {isDemoMode() && <DemoBar items={ITEMS} currentId={item.id} />}

          {showItemHeader && (
            <div className="mb-8 flex flex-col justify-between gap-5 lg:mb-10 lg:flex-row lg:items-end">
              <div className="max-w-4xl">
                <p className="materia-label mb-4">Daily analysis // {state.dateKey}</p>
                <h1 className="text-4xl font-bold tracking-[-0.035em] text-[#dae2fd] sm:text-5xl">
                  {item.name}
                </h1>
                <p className="materia-muted mt-3 max-w-3xl text-base leading-7 sm:text-lg">
                  {item.tagline}
                </p>
              </div>
              <div className="materia-subpanel flex w-fit items-center gap-3 rounded-sm px-4 py-3 font-mono text-xs uppercase tracking-[0.08em] text-[#94a3b8]">
                <span className="h-2 w-2 rounded-full bg-[#7bd0ff] shadow-[0_0_10px_#7bd0ff]" />
                Session active
              </div>
            </div>
          )}

          <main className="materia-grid-glow">
            {state.phase === "round1" ? (
              <Round1
                item={item}
                round1={state.round1}
                onSubmit={submitRound1}
                onContinue={advancePhase}
              />
            ) : state.phase === "round2" ? (
              <AlchemyStation
                item={item}
                alchemy={state.alchemy}
                onSubmit={submitAlchemy}
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
      </div>
    </div>
  );
}
