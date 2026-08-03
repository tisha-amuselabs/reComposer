"use client";

import { useDailyGame } from "../lib/useDailyGame";
import { ProgressDots } from "./ProgressDots";
import { StageNav } from "./StageNav";
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
    recordChamberReaction,
    submitRound2,
    updateRound3Guess,
    submitRound3,
    goBack,
    goNext,
    canGoBack,
    canGoNext,
    canReplayStage,
    replayStage,
    playAgain,
  } = useDailyGame();

  if (!isLoaded || !item || !state) {
    return (
      <div className="materia flex min-h-screen items-center justify-center">
        <p className="materia-label animate-pulse">
          Initializing material analysis&hellip;
        </p>
      </div>
    );
  }

  const showItemHeader = state.phase === "round1" && !state.round1.submitted;
  const compactShell =
    state.phase === "round2" && !state.round2.submitted;

  return (
    <div className="materia">
      <div className="relative z-10 min-h-screen">
        <header className="border-b border-[#94a3b8]/15 bg-[#0b1326]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-5 px-4 sm:px-8 lg:px-16">
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

        <div
          className={[
            "mx-auto flex w-full max-w-[1440px] flex-col px-4 sm:px-8 lg:px-16",
            compactShell
              ? "pb-3 pt-3 lg:h-[calc(100dvh-4rem)] lg:min-h-0 lg:overflow-hidden lg:pb-2 lg:pt-3"
              : "pb-16 pt-10 lg:pt-14",
          ].join(" ")}
        >
          {showItemHeader && (
            <div className="mb-8 flex flex-col justify-between gap-5 lg:mb-10 lg:flex-row lg:items-end">
              <div className="max-w-4xl">
                <p className="materia-label mb-4">
                  Daily analysis // {state.dateKey}
                </p>
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

          <main
            className={[
              "materia-grid-glow",
              compactShell ? "min-h-0 flex-1" : "",
            ].join(" ")}
          >
            {state.phase === "round1" ? (
              <Round1
                item={item}
                round1={state.round1}
                onSubmit={submitRound1}
                onReplay={replayStage}
              />
            ) : state.phase === "round2" ? (
              <Round2
                item={item}
                round2={state.round2}
                onReaction={recordChamberReaction}
                onSubmit={submitRound2}
                onReplay={replayStage}
              />
            ) : state.phase === "round3" ? (
              <Round3
                item={item}
                round3={state.round3}
                onUpdateGuess={updateRound3Guess}
                onSubmit={submitRound3}
                onReplay={replayStage}
              />
            ) : (
              <EndScreen
                item={item}
                state={state}
                onPlayAgain={playAgain}
              />
            )}
          </main>

          <StageNav
            phase={state.phase}
            canGoBack={canGoBack}
            canGoNext={canGoNext}
            canReplay={canReplayStage}
            onBack={goBack}
            onNext={goNext}
            onReplay={state.phase === "end" ? playAgain : replayStage}
            compact={compactShell}
          />
        </div>
      </div>
    </div>
  );
}
