"use client";

import { useCallback, useState } from "react";
import type { DailyGameState, GamePhase, Round3Guess } from "../types/game-state";
import type { ItemOfDay } from "../types/item";
import { getLocalDateKey, itemForDate } from "./date";
import { readStorage, writeStorage } from "./storage";
import { haversineKm } from "./haversine";
import { computeRound1Feedback } from "../components/round1/round1.logic";
import { seededShuffle, computeRound2Feedback } from "../components/round2/round2.logic";

const SCHEMA_VERSION = 1;

const NEXT_PHASE: Record<GamePhase, GamePhase> = {
  round1: "round2",
  round2: "round3",
  round3: "end",
  end: "end",
};

function storageKey(dateKey: string): string {
  return `iotd:v${SCHEMA_VERSION}:${dateKey}`;
}

function createInitialState(item: ItemOfDay, dateKey: string): DailyGameState {
  const stepIds = item.steps.map((s) => s.id);
  const shuffledOrder = seededShuffle(stepIds, `${dateKey}:${item.id}`);
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
    round2: { shuffledOrder, order: shuffledOrder, submitted: false, feedback: null },
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

// This hook only ever runs inside a next/dynamic({ssr:false}) boundary, so it's
// safe to read Date/localStorage during the lazy initializer rather than an
// effect — avoids an extra render pass and a setState-in-effect lint error.
function loadInitialSnapshot(): GameSnapshot {
  const today = new Date();
  const dateKey = getLocalDateKey(today);
  const todaysItem = itemForDate(today);
  const stored = readStorage<DailyGameState>(storageKey(dateKey));

  const isValid =
    stored &&
    stored.schemaVersion === SCHEMA_VERSION &&
    stored.dateKey === dateKey &&
    stored.itemId === todaysItem.id;

  return {
    item: todaysItem,
    state: isValid ? stored : createInitialState(todaysItem, dateKey),
  };
}

export function useDailyGame() {
  const [{ item, state }, setSnapshot] = useState(loadInitialSnapshot);

  const persist = useCallback((next: DailyGameState) => {
    setSnapshot((snapshot) => ({ ...snapshot, state: next }));
    writeStorage(storageKey(next.dateKey), next);
  }, []);

  const advancePhase = useCallback(() => {
    persist({ ...state, phase: NEXT_PHASE[state.phase] });
  }, [state, persist]);

  const submitRound1 = useCallback(
    (assignments: (string | null)[]) => {
      const feedback = computeRound1Feedback(assignments, item.composition);
      persist({
        ...state,
        round1: { assignments, submitted: true, feedback },
      });
    },
    [state, item, persist]
  );

  const updateRound2Order = useCallback(
    (order: string[]) => {
      persist({ ...state, round2: { ...state.round2, order } });
    },
    [state, persist]
  );

  const submitRound2 = useCallback(() => {
    const correctOrder = item.steps.map((s) => s.id);
    const feedback = computeRound2Feedback(state.round2.order, correctOrder);
    persist({
      ...state,
      round2: { ...state.round2, submitted: true, feedback },
    });
  }, [state, item, persist]);

  const updateRound3Guess = useCallback(
    (partial: Partial<Round3Guess>) => {
      persist({ ...state, round3: { ...state.round3, guess: { ...state.round3.guess, ...partial } } });
    },
    [state, persist]
  );

  const submitRound3 = useCallback(() => {
    const { year, lat, lng } = state.round3.guess;
    const yearDiff = year !== null ? Math.abs(year - item.origin.year) : null;
    const kmDiff =
      lat !== null && lng !== null ? haversineKm(lat, lng, item.origin.lat, item.origin.lng) : null;
    persist({
      ...state,
      round3: { ...state.round3, submitted: true, yearDiff, kmDiff },
    });
  }, [state, item, persist]);

  return {
    item,
    state,
    isLoaded: true,
    advancePhase,
    submitRound1,
    updateRound2Order,
    submitRound2,
    updateRound3Guess,
    submitRound3,
  };
}
