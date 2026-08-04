"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { actions } from "../_lib/actions";
import { applyAction } from "../_lib/engine";
import { items } from "../_lib/items";
import { puzzles } from "../_lib/puzzles";
import type { ActionId, HintLevel, ItemId, Puzzle } from "../_lib/types";
import "./alchemy.css";
import { ActionsPanel } from "./ActionsPanel";
import { AlchemyModal } from "./AlchemyModal";
import { HintPanel } from "./HintPanel";
import { Inventory } from "./Inventory";
import {
  clampToCanvas,
  clientToCanvasLocal,
  HIT_SIZE,
  Workspace,
  type CanvasInstance,
  type InventoryGhost,
} from "./Workspace";

type Feedback =
  | { kind: "idle" }
  | { kind: "success"; name: string }
  | { kind: "fail"; detail?: string }
  | { kind: "win"; name: string };

const REVEAL_MS = 650;
const FAIL_SHAKE_MS = 420;
const POP_CLEAR_MS = 520;

function formatEraPlace(raw: string) {
  const bce = raw.match(/^(\d+)\s+BCE\s+(.+)$/i);
  if (bce) return `${bce[1]} BCE · ${bce[2]}`;
  const ce = raw.match(/^(\d+)\s+(.+)$/);
  if (ce) return `${ce[1]} · ${ce[2]}`;
  return raw;
}

function formatElapsed(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, "0")}`;
}

function newInstanceId() {
  return `i-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function Game() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const puzzle = puzzles[puzzleIndex];
  const puzzleRef = useRef(puzzle);
  puzzleRef.current = puzzle;

  const [inventory, setInventory] = useState<ItemId[]>(() => [
    ...puzzle.startIds,
  ]);
  const [instances, setInstances] = useState<CanvasInstance[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback>({ kind: "idle" });
  const [won, setWon] = useState(false);
  const [showStartModal, setShowStartModal] = useState(true);
  const [showWinModal, setShowWinModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failPulse, setFailPulse] = useState(false);
  const [inventoryGhost, setInventoryGhost] = useState<InventoryGhost | null>(
    null,
  );
  const [elapsedSec, setElapsedSec] = useState(0);
  const [finalTimeSec, setFinalTimeSec] = useState<number | null>(null);
  const [hintText, setHintText] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [usedHintIds, setUsedHintIds] = useState<string[]>([]);
  const [hintsExhausted, setHintsExhausted] = useState(false);

  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const instancesRef = useRef(instances);
  instancesRef.current = instances;
  const selectedRef = useRef(selectedIds);
  selectedRef.current = selectedIds;
  const ghostRef = useRef<InventoryGhost | null>(null);
  ghostRef.current = inventoryGhost;
  const busyRef = useRef(busy);
  const wonRef = useRef(won);
  const playingRef = useRef(false);
  busyRef.current = busy;
  wonRef.current = won;

  const invDragRef = useRef<{
    itemId: ItemId;
    pointerId: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  const clearTimers = useCallback(() => {
    if (settleRef.current) {
      clearTimeout(settleRef.current);
      settleRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (showStartModal || won) return;
    if (startedAtRef.current === null) return;

    const tick = () => {
      if (startedAtRef.current === null) return;
      setElapsedSec((Date.now() - startedAtRef.current) / 1000);
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [showStartModal, won]);

  const resetForPuzzle = useCallback(
    (next: Puzzle) => {
      clearTimers();
      playingRef.current = false;
      startedAtRef.current = null;
      invDragRef.current = null;
      ghostRef.current = null;
      setInventory([...next.startIds]);
      setInstances([]);
      setSelectedIds([]);
      setFeedback({ kind: "idle" });
      setWon(false);
      setShowWinModal(false);
      setShowStartModal(true);
      setBusy(false);
      setFailPulse(false);
      setInventoryGhost(null);
      setElapsedSec(0);
      setFinalTimeSec(null);
      setHintText(null);
      setHintLoading(false);
      setUsedHintIds([]);
      setHintsExhausted(false);
    },
    [clearTimers],
  );

  const beginPlay = useCallback(() => {
    if (playingRef.current) return;
    playingRef.current = true;
    startedAtRef.current = Date.now();
    setElapsedSec(0);
    setShowStartModal(false);
  }, []);

  const goToPuzzle = useCallback(
    (index: number) => {
      const next = puzzles[index];
      if (!next) return;
      setPuzzleIndex(index);
      resetForPuzzle(next);
    },
    [resetForPuzzle],
  );

  const goToNextPuzzle = useCallback(() => {
    const nextIndex = (puzzleIndex + 1) % puzzles.length;
    goToPuzzle(nextIndex);
  }, [goToPuzzle, puzzleIndex]);

  const clearProcess = useCallback(() => {
    if (busyRef.current || showStartModal) return;
    clearTimers();
    invDragRef.current = null;
    ghostRef.current = null;
    const current = puzzleRef.current;
    playingRef.current = true;
    setInventory([...current.startIds]);
    setInstances([]);
    setSelectedIds([]);
    setFeedback({ kind: "idle" });
    setWon(false);
    setShowWinModal(false);
    setBusy(false);
    setFailPulse(false);
    setInventoryGhost(null);
    setHintText(null);
    setHintLoading(false);
    setUsedHintIds([]);
    setHintsExhausted(false);
    setFinalTimeSec(null);
    startedAtRef.current = Date.now();
    setElapsedSec(0);
  }, [clearTimers, showStartModal]);

  const addToInventory = useCallback((id: ItemId) => {
    setInventory((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const spawnAt = useCallback(
    (itemId: ItemId, x: number, y: number, popping = false) => {
      const surface = surfaceRef.current;
      const pos = surface ? clampToCanvas(surface, x, y) : { x, y };
      const instanceId = newInstanceId();
      setInstances((prev) => [
        ...prev,
        { instanceId, itemId, x: pos.x, y: pos.y, popping },
      ]);
      if (popping) {
        window.setTimeout(() => {
          setInstances((prev) =>
            prev.map((inst) =>
              inst.instanceId === instanceId
                ? { ...inst, popping: false }
                : inst,
            ),
          );
        }, POP_CLEAR_MS);
      }
      return instanceId;
    },
    [],
  );

  const spawnNearCenter = useCallback(
    (itemId: ItemId) => {
      const surface = surfaceRef.current;
      if (!surface) return;
      const jitter = () => (Math.random() - 0.5) * 80;
      const x = surface.clientWidth / 2 - HIT_SIZE / 2 + jitter();
      const y = surface.clientHeight / 2 - HIT_SIZE / 2 + jitter();
      spawnAt(itemId, x, y);
    },
    [spawnAt],
  );

  const pulseFail = useCallback((detail?: string) => {
    setFailPulse(true);
    setFeedback({ kind: "fail", detail });
    window.setTimeout(() => setFailPulse(false), FAIL_SHAKE_MS);
  }, []);

  const runAction = useCallback(
    (actionId: ActionId) => {
      if (busyRef.current || wonRef.current || !playingRef.current) return;

      const current = puzzleRef.current;
      const action = actions[actionId];
      if (!action) return;

      const selected = instancesRef.current.filter((inst) =>
        selectedRef.current.includes(inst.instanceId),
      );

      if (selected.length !== action.arity) {
        pulseFail(
          action.arity === 2
            ? `Select two materials for ${action.name}`
            : `Select one material for ${action.name}`,
        );
        return;
      }

      const results = applyAction(
        actionId,
        selected.map((s) => s.itemId),
        current.recipes,
      );

      if (!results) {
        pulseFail("That process does nothing here");
        return;
      }

      clearTimers();
      setBusy(true);
      setSelectedIds([]);

      const removeIds = new Set(selected.map((s) => s.instanceId));
      const base = selected[0];
      setInstances((prev) => prev.filter((inst) => !removeIds.has(inst.instanceId)));

      results.forEach((resultId, i) => {
        const ox = (i % 2) * (HIT_SIZE + 12);
        const oy = Math.floor(i / 2) * (HIT_SIZE + 28);
        spawnAt(resultId, base.x + ox, base.y + oy, true);
        addToInventory(resultId);
      });

      const hitTarget = results.includes(current.targetId);
      const names = results.map((id) => items[id]?.name ?? id).join(" · ");

      if (hitTarget) {
        const secs =
          startedAtRef.current !== null
            ? (Date.now() - startedAtRef.current) / 1000
            : 0;
        setFinalTimeSec(secs);
        setElapsedSec(secs);
        setWon(true);
        setFeedback({
          kind: "win",
          name: items[current.targetId].name,
        });
      } else {
        setFeedback({ kind: "success", name: names });
      }

      settleRef.current = setTimeout(() => {
        setBusy(false);
        if (hitTarget) setShowWinModal(true);
      }, REVEAL_MS);
    },
    [addToInventory, clearTimers, pulseFail, spawnAt],
  );

  const handleMove = useCallback((instanceId: string, x: number, y: number) => {
    setInstances((prev) =>
      prev.map((inst) =>
        inst.instanceId === instanceId ? { ...inst, x, y } : inst,
      ),
    );
  }, []);

  const handleToggleSelect = useCallback((instanceId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(instanceId)) {
        return prev.filter((id) => id !== instanceId);
      }
      if (prev.length >= 2) return [...prev.slice(1), instanceId];
      return [...prev, instanceId];
    });
    setFeedback({ kind: "idle" });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const drag = invDragRef.current;
      const surface = surfaceRef.current;
      if (!drag || drag.pointerId !== e.pointerId || !surface) return;
      const dist = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);
      if (dist > 8) drag.moved = true;
      if (!drag.moved) return;
      const local = clientToCanvasLocal(surface, e.clientX, e.clientY);
      const pos = clampToCanvas(
        surface,
        local.x - HIT_SIZE / 2,
        local.y - HIT_SIZE / 2,
      );
      const ghost = { itemId: drag.itemId, x: pos.x, y: pos.y };
      ghostRef.current = ghost;
      setInventoryGhost(ghost);
    };

    const onUp = (e: PointerEvent) => {
      const drag = invDragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;

      const surface = surfaceRef.current;
      const ghost = ghostRef.current;
      const moved = drag.moved;
      const itemId = drag.itemId;
      invDragRef.current = null;
      ghostRef.current = null;
      setInventoryGhost(null);

      if (busyRef.current || wonRef.current || !playingRef.current || !surface)
        return;

      const rect = surface.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!moved) {
        spawnNearCenter(itemId);
        return;
      }

      if (!inside) return;

      const local = clientToCanvasLocal(surface, e.clientX, e.clientY);
      const pos = clampToCanvas(
        surface,
        ghost?.x ?? local.x - HIT_SIZE / 2,
        ghost?.y ?? local.y - HIT_SIZE / 2,
      );
      spawnAt(itemId, pos.x, pos.y);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [spawnAt, spawnNearCenter]);

  const handleInventoryPointerDown = (
    itemId: ItemId,
    pointerId: number,
    clientX: number,
    clientY: number,
  ) => {
    if (busy || won || showStartModal) return;
    invDragRef.current = {
      itemId,
      pointerId,
      startX: clientX,
      startY: clientY,
      moved: false,
    };
    setFeedback({ kind: "idle" });
  };

  useEffect(() => {
    if (feedback.kind !== "success" && feedback.kind !== "fail") return;
    const t = setTimeout(() => setFeedback({ kind: "idle" }), 2200);
    return () => clearTimeout(t);
  }, [feedback]);

  const askHint = useCallback(async () => {
    if (hintLoading || hintsExhausted || won || showStartModal) return;
    setHintLoading(true);
    try {
      const res = await fetch("/api/tisha/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          puzzleId: puzzleRef.current.id,
          inventory,
          usedHintIds,
          minLevel: 1,
        }),
      });
      const data = (await res.json()) as {
        exhausted?: boolean;
        text?: string | null;
        hintId?: string | null;
        level?: HintLevel | null;
      };
      if (data.exhausted || !data.text || !data.hintId) {
        setHintsExhausted(true);
        setHintText("The notebook has nothing more. Trust the bench.");
      } else {
        setHintText(data.text);
        setUsedHintIds((prev) => [...prev, data.hintId!]);
      }
    } catch {
      setHintText("The laboratory is quiet. Try again in a moment.");
    } finally {
      setHintLoading(false);
    }
  }, [hintLoading, hintsExhausted, won, showStartModal, inventory, usedHintIds]);

  const locked = busy || won || showStartModal;
  const eraPlaceDisplay = formatEraPlace(puzzle.eraPlace);
  const displayTime = formatElapsed(
    finalTimeSec !== null ? finalTimeSec : elapsedSec,
  );
  const hasNext = puzzleIndex < puzzles.length - 1;
  const puzzleProgress = `${puzzleIndex + 1} / ${puzzles.length}`;

  const dismissWinModal = useCallback(() => setShowWinModal(false), []);

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col gap-4 overflow-hidden px-4 py-5 sm:gap-5 sm:px-6 sm:py-6">
      <header className="flex shrink-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-2 sm:gap-6">
        <div className="min-w-0">
          <p className="mb-1 font-[family-name:var(--font-eb-garamond)] text-sm font-semibold uppercase tracking-[0.18em] text-[#3d3429]">
            Reinventing the wheel · {puzzleProgress}
          </p>
          <h1 className="font-[family-name:var(--font-eb-garamond)] text-2xl leading-snug text-[#1a1510] sm:text-3xl">
            Can you create <em className="italic">{puzzle.targetLabel}</em>?
          </h1>
        </div>
        <div className="flex items-baseline gap-4 sm:gap-6">
          {!showStartModal && (
            <p
              className="tabular-nums font-[family-name:var(--font-eb-garamond)] text-2xl tracking-wide text-[#3d3429]"
              aria-live="polite"
              aria-label={`Elapsed time ${displayTime}`}
            >
              {displayTime}
            </p>
          )}
          <p className="font-[family-name:var(--font-eb-garamond)] text-2xl tracking-wide text-[#5c5348]">
            {eraPlaceDisplay}
          </p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto lg:flex-row lg:items-start lg:justify-center lg:gap-5 lg:overflow-hidden">
        <Inventory
          ids={inventory}
          onPointerDragStart={handleInventoryPointerDown}
          disabled={locked}
        />

        <div className="flex min-w-0 w-full flex-col gap-3 lg:min-w-0 lg:flex-1 lg:max-w-3xl">
          <Workspace
            instances={instances}
            surfaceRef={surfaceRef}
            busy={busy}
            disabled={won || showStartModal}
            inventoryGhost={inventoryGhost}
            failPulse={failPulse}
            selectedIds={selectedIds}
            onMove={handleMove}
            onToggleSelect={handleToggleSelect}
            onClearSelection={handleClearSelection}
            onClearProcess={clearProcess}
            clearDisabled={busy || showStartModal}
          />

          <div
            className={[
              "min-h-[1.75rem] shrink-0 text-center font-[family-name:var(--font-eb-garamond)] text-lg italic text-[#3d3429]",
              feedback.kind === "fail" || feedback.kind === "success"
                ? "alchemy-fade-in"
                : "",
            ].join(" ")}
            role="status"
            aria-live="polite"
          >
            {feedback.kind === "success" && (
              <span>Process yielded: {feedback.name}</span>
            )}
            {feedback.kind === "fail" && (
              <span>{feedback.detail ?? "Nothing happened"}</span>
            )}
            {feedback.kind === "win" && !showWinModal && (
              <span className="not-italic font-medium text-[#1a1510]">
                You made {feedback.name}!
              </span>
            )}
          </div>

          <div className="shrink-0">
            <HintPanel
              text={hintText}
              loading={hintLoading}
              disabled={locked}
              exhausted={hintsExhausted}
              onAsk={askHint}
            />
          </div>
        </div>

        <ActionsPanel
          actionIds={puzzle.actionIds}
          onSelect={runAction}
          disabled={locked}
          selectionCount={selectedIds.length}
        />
      </div>

      {showStartModal && (
        <AlchemyModal titleId="alchemy-start-title" dismissible={false}>
          <p
            id="alchemy-start-title"
            className="font-[family-name:var(--font-eb-garamond)] text-sm uppercase tracking-[0.2em] text-[#5c5348]"
          >
            {eraPlaceDisplay}
          </p>
          <p className="mt-3 font-[family-name:var(--font-eb-garamond)] text-lg leading-relaxed text-[#2a241c]">
            {puzzle.scenario}
          </p>
          <p className="mt-4 font-[family-name:var(--font-eb-garamond)] text-base italic leading-relaxed text-[#5c5348]">
            Place materials from the left. Select them on the bench. Apply
            actions from the right, including Break apart.
          </p>
          <p className="mt-4 font-[family-name:var(--font-eb-garamond)] text-2xl text-[#1a1510]">
            Can you create <em className="italic">{puzzle.targetLabel}</em>?
          </p>
          <button
            type="button"
            onClick={beginPlay}
            className="mt-6 font-[family-name:var(--font-eb-garamond)] text-base tracking-wide text-[#1a1510] underline decoration-[#1a1510]/35 underline-offset-4 transition hover:decoration-[#1a1510]/70"
          >
            Begin
          </button>
        </AlchemyModal>
      )}

      {showWinModal && (
        <AlchemyModal titleId="alchemy-win-title" onDismiss={dismissWinModal}>
          <p
            id="alchemy-win-title"
            className="font-[family-name:var(--font-eb-garamond)] text-3xl text-[#1a1510]"
          >
            You did it!
          </p>
          <p className="mt-2 font-[family-name:var(--font-eb-garamond)] text-lg tracking-wide text-[#5c5348]">
            Time:{" "}
            <span className="tabular-nums text-[#1a1510]">
              {formatElapsed(finalTimeSec ?? elapsedSec)}
            </span>
          </p>
          <p className="mt-5 text-left font-[family-name:var(--font-eb-garamond)] text-lg leading-relaxed text-[#2a241c]">
            {puzzle.history}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {hasNext ? (
              <button
                type="button"
                onClick={goToNextPuzzle}
                className="font-[family-name:var(--font-eb-garamond)] text-base tracking-wide text-[#1a1510] underline decoration-[#1a1510]/35 underline-offset-4 transition hover:decoration-[#1a1510]/70"
              >
                Next invention
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goToPuzzle(0)}
                className="font-[family-name:var(--font-eb-garamond)] text-base tracking-wide text-[#1a1510] underline decoration-[#1a1510]/35 underline-offset-4 transition hover:decoration-[#1a1510]/70"
              >
                Start over
              </button>
            )}
            <button
              type="button"
              onClick={dismissWinModal}
              className="font-[family-name:var(--font-eb-garamond)] text-base tracking-wide text-[#5c5348] underline decoration-[#5c5348]/35 underline-offset-4 transition hover:decoration-[#5c5348]/70"
            >
              Stay here
            </button>
          </div>
        </AlchemyModal>
      )}
    </div>
  );
}
