"use client";

import { useCallback, useState } from "react";
import type { DailyGameState, GamePhase, Round3Guess } from "../types/game-state";
import type { ItemOfDay } from "../types/item";
import { getLocalDateKey, itemForDate } from "./date";
import { readStorage, writeStorage } from "./storage";
import { haversineKm } from "./haversine";
import { computeRound1Feedback } from "../components/round1/round1.logic";
import { computeChamberFeedback } from "../components/round2/chamber.logic";

const SCHEMA_VERSION = 2;

export const PHASE_ORDER: GamePhase[] = ["round1", "round2", "round3", "end"];

const NEXT_PHASE: Record<GamePhase, GamePhase> = {
  round1: "round2",
  round2: "round3",
  round3: "end",
  end: "end",
};

const PREV_PHASE: Record<GamePhase, GamePhase | null> = {
  round1: null,
  round2: "round1",
  round3: "round2",
  end: "round3",
};

/** A phase is reachable once every prior round has been submitted. */
export function isPhaseUnlocked(
  state: Pick<DailyGameState, "round1" | "round2" | "round3">,
  phase: GamePhase,
): boolean {
  if (phase === "round1") return true;
  if (phase === "round2") return state.round1.submitted;
  if (phase === "round3") return state.round2.submitted;
  return state.round3.submitted;
}

function storageKey(dateKey: string): string {
  return `iotd:v${SCHEMA_VERSION}:${dateKey}`;
}

function createInitialState(item: ItemOfDay, dateKey: string): DailyGameState {
  return {
    schemaVersion: SCHEMA_VERSION,
    dateKey,
    itemId: item.id,
    phase: "round1",
    round1: {
      assignments: Array(item.composition.length).fill(null),
      submitted: false,
      feedback: null,
    },
    round2: {
      inventory: [...item.processLab.startIds],
      completedSteps: [],
      synthesized: false,
      submitted: false,
      feedback: null,
    },
    round3: {
      guess: { year: null, lat: null, lng: null },
      submitted: false,
      yearDiff: null,
      kmDiff: null,
    },
  };
}

interface GameSnapshot {
  item: ItemOfDay;
  state: DailyGameState;
}

function loadInitialSnapshot(): GameSnapshot {
  const today = new Date();
  const dateKey = getLocalDateKey(today);
  const todaysItem = itemForDate(today);
  const stored = readStorage<DailyGameState>(storageKey(dateKey));

  const isValid =
    stored &&
    stored.schemaVersion === SCHEMA_VERSION &&
    stored.dateKey === dateKey &&
    stored.itemId === todaysItem.id &&
    Array.isArray(stored.round2?.inventory);

  const initialState = isValid
    ? {
        ...stored,
        round1: stored.round1.submitted
          ? {
              ...stored.round1,
              feedback: computeRound1Feedback(
                stored.round1.assignments,
                todaysItem.composition,
              ),
            }
          : stored.round1,
        round2: stored.round2.submitted
          ? {
              ...stored.round2,
              feedback: computeChamberFeedback(
                stored.round2.completedSteps,
                todaysItem.steps.map((s) => s.id),
              ),
            }
          : stored.round2,
      }
    : createInitialState(todaysItem, dateKey);

  return {
    item: todaysItem,
    state: initialState,
  };
}

export function useDailyGame() {
  const [{ item, state }, setSnapshot] = useState(loadInitialSnapshot);

  const updateState = useCallback((recipe: (prev: DailyGameState) => DailyGameState) => {
    setSnapshot((snapshot) => {
      const next = recipe(snapshot.state);
      writeStorage(storageKey(next.dateKey), next);
      return { ...snapshot, state: next };
    });
  }, []);

  const advancePhase = useCallback(() => {
    updateState((prev) => ({ ...prev, phase: NEXT_PHASE[prev.phase] }));
  }, [updateState]);

  const goToPhase = useCallback(
    (phase: GamePhase) => {
      updateState((prev) => {
        if (!isPhaseUnlocked(prev, phase)) return prev;
        return { ...prev, phase };
      });
    },
    [updateState],
  );

  const goBack = useCallback(() => {
    updateState((prev) => {
      const target = PREV_PHASE[prev.phase];
      if (!target) return prev;
      return { ...prev, phase: target };
    });
  }, [updateState]);

  const goNext = useCallback(() => {
    updateState((prev) => {
      const target = NEXT_PHASE[prev.phase];
      if (prev.phase === "end" || !isPhaseUnlocked(prev, target)) return prev;
      return { ...prev, phase: target };
    });
  }, [updateState]);

  const canGoBack = state.phase !== "round1";
  const canGoNext =
    state.phase !== "end" && isPhaseUnlocked(state, NEXT_PHASE[state.phase]);

  const submitRound1 = useCallback(
    (assignments: (string | null)[]) => {
      const feedback = computeRound1Feedback(assignments, item.composition);
      updateState((prev) => ({
        ...prev,
        round1: { assignments, submitted: true, feedback },
      }));
    },
    [item, updateState],
  );

  const recordChamberReaction = useCallback(
    (payload: {
      discoveries: string[];
      stepId?: string;
      synthesized?: boolean;
    }) => {
      updateState((prev) => {
        const inventory = new Set(prev.round2.inventory);
        for (const id of payload.discoveries) inventory.add(id);

        let completedSteps = prev.round2.completedSteps;
        if (payload.stepId && !completedSteps.includes(payload.stepId)) {
          completedSteps = [...completedSteps, payload.stepId];
        }

        return {
          ...prev,
          round2: {
            ...prev.round2,
            inventory: [...inventory],
            completedSteps,
            synthesized: prev.round2.synthesized || Boolean(payload.synthesized),
          },
        };
      });
    },
    [updateState],
  );

  const submitRound2 = useCallback(() => {
    updateState((prev) => {
      if (!prev.round2.synthesized) return prev;
      const correctOrder = item.steps.map((s) => s.id);
      const feedback = computeChamberFeedback(
        prev.round2.completedSteps,
        correctOrder,
      );
      return {
        ...prev,
        round2: { ...prev.round2, submitted: true, feedback },
      };
    });
  }, [item, updateState]);

  const updateRound3Guess = useCallback(
    (partial: Partial<Round3Guess>) => {
      updateState((prev) => ({
        ...prev,
        round3: {
          ...prev.round3,
          guess: { ...prev.round3.guess, ...partial },
        },
      }));
    },
    [updateState],
  );

  const submitRound3 = useCallback(() => {
    updateState((prev) => {
      const { year, lat, lng } = prev.round3.guess;
      const yearDiff = year !== null ? Math.abs(year - item.origin.year) : null;
      const kmDiff =
        lat !== null && lng !== null
          ? haversineKm(lat, lng, item.origin.lat, item.origin.lng)
          : null;
      return {
        ...prev,
        round3: { ...prev.round3, submitted: true, yearDiff, kmDiff },
      };
    });
  }, [item, updateState]);

  /** Reset the current stage (and everything after it) so the player can retry. */
  const replayStage = useCallback(() => {
    updateState((prev) => {
      const fresh = createInitialState(item, prev.dateKey);
      if (prev.phase === "round1" || prev.phase === "end") {
        return { ...fresh, phase: "round1" };
      }
      if (prev.phase === "round2") {
        return {
          ...fresh,
          phase: "round2",
          round1: prev.round1,
        };
      }
      // round3
      return {
        ...fresh,
        phase: "round3",
        round1: prev.round1,
        round2: prev.round2,
      };
    });
  }, [item, updateState]);

  /** Full session restart from Composition. */
  const playAgain = useCallback(() => {
    updateState((prev) => createInitialState(item, prev.dateKey));
  }, [item, updateState]);

  const canReplayStage =
    state.phase === "end" ||
    (state.phase === "round1" && state.round1.submitted) ||
    (state.phase === "round2" && state.round2.submitted) ||
    (state.phase === "round3" && state.round3.submitted);

  return {
    item,
    state,
    isLoaded: true,
    advancePhase,
    goToPhase,
    goBack,
    goNext,
    canGoBack,
    canGoNext,
    canReplayStage,
    replayStage,
    playAgain,
    submitRound1,
    recordChamberReaction,
    submitRound2,
    updateRound3Guess,
    submitRound3,
  };
}
