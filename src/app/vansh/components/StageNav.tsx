"use client";

import type { GamePhase } from "../types/game-state";
import { Button } from "./Button";

const PHASE_LABEL: Record<GamePhase, string> = {
  round1: "Composition",
  round2: "How is it made?",
  round3: "History",
  end: "Trivia",
};

const PHASE_ORDER: GamePhase[] = ["round1", "round2", "round3", "end"];

export function previousPhase(phase: GamePhase): GamePhase | null {
  const i = PHASE_ORDER.indexOf(phase);
  return i > 0 ? PHASE_ORDER[i - 1] : null;
}

export function nextPhase(phase: GamePhase): GamePhase | null {
  const i = PHASE_ORDER.indexOf(phase);
  return i >= 0 && i < PHASE_ORDER.length - 1 ? PHASE_ORDER[i + 1] : null;
}

export function StageNav({
  phase,
  canGoBack,
  canGoNext,
  canReplay,
  onBack,
  onNext,
  onReplay,
  compact = false,
}: {
  phase: GamePhase;
  canGoBack: boolean;
  canGoNext: boolean;
  canReplay: boolean;
  onBack: () => void;
  onNext: () => void;
  onReplay: () => void;
  compact?: boolean;
}) {
  const prev = previousPhase(phase);
  const next = nextPhase(phase);
  const replayLabel = phase === "end" ? "Play again" : "Replay stage";

  return (
    <nav
      aria-label="Stage navigation"
      className={[
        "flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#94a3b8]/15",
        compact ? "mt-2 pt-2" : "mt-10 gap-4 pt-6",
      ].join(" ")}
    >
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={!canGoBack || !prev}
        className={compact ? "!px-4 !py-2 !text-xs" : ""}
      >
        {prev ? `Back · ${PHASE_LABEL[prev]}` : "Back"}
      </Button>

      <Button
        variant="ghost"
        onClick={onReplay}
        disabled={!canReplay}
        className={["mx-auto", compact ? "!px-4 !py-2 !text-xs" : ""].join(" ")}
      >
        {replayLabel}
      </Button>

      <Button
        onClick={onNext}
        disabled={!canGoNext || !next}
        className={compact ? "!px-4 !py-2 !text-xs" : ""}
      >
        {next ? `Next · ${PHASE_LABEL[next]}` : "Next"}
      </Button>
    </nav>
  );
}
