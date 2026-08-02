"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  eraPlace,
  history,
  items,
  scenario,
  startIds,
  targetId,
  targetLabel,
} from "../_lib/casein";
import { combine } from "../_lib/engine";
import type { ItemId } from "../_lib/types";
import "./alchemy.css";
import { AlchemyModal } from "./AlchemyModal";
import { Inventory } from "./Inventory";
import {
  clampToCanvas,
  clientToCanvasLocal,
  findOverlapTarget,
  HIT_SIZE,
  Workspace,
  type CanvasInstance,
  type InventoryGhost,
} from "./Workspace";

type Feedback =
  | { kind: "idle" }
  | { kind: "success"; name: string }
  | { kind: "fail" }
  | { kind: "win"; name: string };

const REVEAL_MS = 650;
const FAIL_SHAKE_MS = 420;
const POP_CLEAR_MS = 520;

/** Elegant display of eraPlace, e.g. "1897 · Munich, Germany" */
function formatEraPlace(raw: string) {
  const match = raw.match(/^(\d{4})\s+(.+)$/);
  if (!match) return raw;
  return `${match[1]} · ${match[2]}`;
}

/** Elapsed seconds → `m:ss` (e.g. `0:45`, `1:23`) */
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
  const [inventory, setInventory] = useState<ItemId[]>(startIds);
  const [instances, setInstances] = useState<CanvasInstance[]>([]);
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

  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const instancesRef = useRef(instances);
  instancesRef.current = instances;
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

  const beginPlay = useCallback(() => {
    if (playingRef.current) return;
    playingRef.current = true;
    startedAtRef.current = Date.now();
    setElapsedSec(0);
    setShowStartModal(false);
  }, []);

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

  const runCombineAt = useCallback(
    (
      a: ItemId,
      b: ItemId,
      dropX: number,
      dropY: number,
      removeIds: string[],
    ): boolean => {
      if (busyRef.current || wonRef.current || !playingRef.current) return false;

      const result = combine(a, b);
      if (!result) {
        setFailPulse(true);
        setFeedback({ kind: "fail" });
        window.setTimeout(() => setFailPulse(false), FAIL_SHAKE_MS);
        return false;
      }

      clearTimers();
      setBusy(true);
      setInstances((prev) =>
        prev.filter((inst) => !removeIds.includes(inst.instanceId)),
      );

      spawnAt(result, dropX, dropY, true);
      addToInventory(result);

      if (result === targetId) {
        const secs =
          startedAtRef.current !== null
            ? (Date.now() - startedAtRef.current) / 1000
            : 0;
        setFinalTimeSec(secs);
        setElapsedSec(secs);
        setWon(true);
        setFeedback({ kind: "win", name: items[result].name });
      } else {
        setFeedback({ kind: "success", name: items[result].name });
      }

      settleRef.current = setTimeout(() => {
        setBusy(false);
        if (result === targetId) {
          setShowWinModal(true);
        }
      }, REVEAL_MS);

      return true;
    },
    [addToInventory, clearTimers, spawnAt],
  );

  const handleMove = useCallback((instanceId: string, x: number, y: number) => {
    setInstances((prev) =>
      prev.map((inst) =>
        inst.instanceId === instanceId ? { ...inst, x, y } : inst,
      ),
    );
  }, []);

  const handleCombineInstances = useCallback(
    (draggedId: string, targetInstId: string, dropX: number, dropY: number) => {
      const list = instancesRef.current;
      const dragged = list.find((i) => i.instanceId === draggedId);
      const target = list.find((i) => i.instanceId === targetInstId);
      if (!dragged || !target) return false;

      return runCombineAt(dragged.itemId, target.itemId, dropX, dropY, [
        draggedId,
        targetInstId,
      ]);
    },
    [runCombineAt],
  );

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

      const target = findOverlapTarget(
        instancesRef.current,
        null,
        pos.x,
        pos.y,
      );
      if (target) {
        const ok = runCombineAt(itemId, target.itemId, pos.x, pos.y, [
          target.instanceId,
        ]);
        if (!ok) {
          const offset = clampToCanvas(
            surface,
            pos.x + HIT_SIZE * 0.75,
            pos.y,
          );
          spawnAt(itemId, offset.x, offset.y);
        }
        return;
      }

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
  }, [runCombineAt, spawnAt, spawnNearCenter]);

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
    const t = setTimeout(() => setFeedback({ kind: "idle" }), 1800);
    return () => clearTimeout(t);
  }, [feedback]);

  const locked = busy || won || showStartModal;
  const eraPlaceDisplay = formatEraPlace(eraPlace);
  const displayTime = formatElapsed(
    finalTimeSec !== null ? finalTimeSec : elapsedSec,
  );

  const dismissWinModal = useCallback(() => setShowWinModal(false), []);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 sm:gap-6">
        <h1 className="font-[family-name:var(--font-eb-garamond)] text-xl text-[#1a1510] sm:text-2xl">
          Can you create <em className="italic">{targetLabel}</em>?
        </h1>
        <div className="flex items-baseline gap-4 sm:gap-6">
          {!showStartModal && (
            <p
              className="tabular-nums font-[family-name:var(--font-eb-garamond)] text-xl tracking-wide text-[#3d3429]"
              aria-live="polite"
              aria-label={`Elapsed time ${displayTime}`}
            >
              {displayTime}
            </p>
          )}
          <p className="font-[family-name:var(--font-eb-garamond)] text-xl tracking-wide text-[#5c5348]">
            {eraPlaceDisplay}
          </p>
        </div>
      </header>

      <Workspace
        instances={instances}
        surfaceRef={surfaceRef}
        busy={busy}
        disabled={won || showStartModal}
        inventoryGhost={inventoryGhost}
        failPulse={failPulse}
        onMove={handleMove}
        onCombineInstances={handleCombineInstances}
      />

      <div
        className={[
          "min-h-[1.75rem] text-center font-[family-name:var(--font-eb-garamond)] text-base italic text-[#3d3429]",
          feedback.kind === "fail" || feedback.kind === "success"
            ? "alchemy-fade-in"
            : "",
        ].join(" ")}
        role="status"
        aria-live="polite"
      >
        {feedback.kind === "success" && (
          <span>Discovered: {feedback.name}</span>
        )}
        {feedback.kind === "fail" && <span>Nothing happened</span>}
        {feedback.kind === "win" && !showWinModal && (
          <span className="not-italic font-medium text-[#1a1510]">
            You made {feedback.name}!
          </span>
        )}
      </div>

      {showStartModal && (
        <AlchemyModal titleId="alchemy-start-title" dismissible={false}>
          <p
            id="alchemy-start-title"
            className="font-[family-name:var(--font-eb-garamond)] text-[11px] uppercase tracking-[0.24em] text-[#5c5348]"
          >
            {eraPlaceDisplay}
          </p>
          <p className="mt-3 font-[family-name:var(--font-eb-garamond)] text-base leading-relaxed text-[#2a241c]">
            {scenario}
          </p>
          <p className="mt-4 font-[family-name:var(--font-eb-garamond)] text-xl text-[#1a1510]">
            Can you create <em className="italic">{targetLabel}</em>?
          </p>
          <button
            type="button"
            onClick={beginPlay}
            className="mt-6 font-[family-name:var(--font-eb-garamond)] text-sm tracking-wide text-[#1a1510] underline decoration-[#1a1510]/35 underline-offset-4 transition hover:decoration-[#1a1510]/70"
          >
            Begin
          </button>
        </AlchemyModal>
      )}

      {showWinModal && (
        <AlchemyModal titleId="alchemy-win-title" onDismiss={dismissWinModal}>
          <p
            id="alchemy-win-title"
            className="font-[family-name:var(--font-eb-garamond)] text-2xl text-[#1a1510]"
          >
            You did it!
          </p>
          <p className="mt-2 font-[family-name:var(--font-eb-garamond)] text-base tracking-wide text-[#5c5348]">
            Time:{" "}
            <span className="tabular-nums text-[#1a1510]">
              {formatElapsed(finalTimeSec ?? elapsedSec)}
            </span>
          </p>
          <p className="mt-5 font-[family-name:var(--font-eb-garamond)] text-lg italic leading-relaxed text-[#2a241c]">
            {history}
          </p>
          <button
            type="button"
            onClick={dismissWinModal}
            className="mt-5 font-[family-name:var(--font-eb-garamond)] text-sm tracking-wide text-[#1a1510] underline decoration-[#1a1510]/35 underline-offset-4 transition hover:decoration-[#1a1510]/70"
          >
            Continue
          </button>
        </AlchemyModal>
      )}

      <Inventory
        ids={inventory}
        onPointerDragStart={handleInventoryPointerDown}
        disabled={locked}
      />
    </div>
  );
}
