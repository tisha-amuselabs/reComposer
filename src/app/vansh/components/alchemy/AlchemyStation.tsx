"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ItemOfDay } from "../../types/item";
import type { AlchemyState } from "../../types/game-state";
import { Inventory } from "./Inventory";
import { AlchemyResults } from "./AlchemyResults";
import { HintPanel } from "../HintPanel";
import { requestHint } from "../../lib/requestHint";
import { combine, totalSteps } from "./alchemy.logic";
import {
  clampToCanvas,
  clientToCanvasLocal,
  findOverlapTarget,
  HIT_SIZE,
  Workspace,
  type CanvasInstance,
  type InventoryGhost,
} from "./Workspace";

const REVEAL_MS = 650;
const FAIL_SHAKE_MS = 420;
const POP_CLEAR_MS = 520;
const WIN_SETTLE_MS = 900;

function newInstanceId() {
  return `i-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

type Feedback = { kind: "idle" } | { kind: "success"; name: string } | { kind: "fail" };

export function AlchemyStation({
  item,
  alchemy,
  onSubmit,
  onContinue,
}: {
  item: ItemOfDay;
  alchemy: AlchemyState;
  onSubmit: (result: { solved: boolean; correctCount: number }) => void;
  onContinue: () => void;
}) {
  const recipe = item.alchemy;
  const [inventory, setInventory] = useState<string[]>(recipe.startIds);
  const [instances, setInstances] = useState<CanvasInstance[]>([]);
  const [feedback, setFeedback] = useState<Feedback>({ kind: "idle" });
  const [busy, setBusy] = useState(false);
  const [failPulse, setFailPulse] = useState(false);
  const [inventoryGhost, setInventoryGhost] = useState<InventoryGhost | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [won, setWon] = useState(false);

  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const instancesRef = useRef(instances);
  const ghostRef = useRef<InventoryGhost | null>(null);
  const busyRef = useRef(busy);
  const wonRef = useRef(won);

  const invDragRef = useRef<{
    nodeId: string;
    pointerId: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    instancesRef.current = instances;
  }, [instances]);
  useEffect(() => {
    ghostRef.current = inventoryGhost;
  }, [inventoryGhost]);
  useEffect(() => {
    busyRef.current = busy;
  }, [busy]);
  useEffect(() => {
    wonRef.current = won;
  }, [won]);

  useEffect(
    () => () => {
      if (settleRef.current) clearTimeout(settleRef.current);
    },
    []
  );

  const total = totalSteps(recipe);

  const addToInventory = useCallback((id: string) => {
    setInventory((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const spawnAt = useCallback((nodeId: string, x: number, y: number, popping = false) => {
    const surface = surfaceRef.current;
    const pos = surface ? clampToCanvas(surface, x, y) : { x, y };
    const instanceId = newInstanceId();
    setInstances((prev) => [...prev, { instanceId, nodeId, x: pos.x, y: pos.y, popping }]);
    if (popping) {
      window.setTimeout(() => {
        setInstances((prev) =>
          prev.map((inst) => (inst.instanceId === instanceId ? { ...inst, popping: false } : inst))
        );
      }, POP_CLEAR_MS);
    }
    return instanceId;
  }, []);

  const spawnNearCenter = useCallback(
    (nodeId: string) => {
      const surface = surfaceRef.current;
      if (!surface) return;
      const jitter = () => (Math.random() - 0.5) * 70;
      const x = surface.clientWidth / 2 - HIT_SIZE / 2 + jitter();
      const y = surface.clientHeight / 2 - HIT_SIZE / 2 + jitter();
      spawnAt(nodeId, x, y);
    },
    [spawnAt]
  );

  const runCombineAt = useCallback(
    (a: string, b: string, dropX: number, dropY: number, removeIds: string[]): boolean => {
      if (busyRef.current || wonRef.current) return false;

      const result = combine(recipe, a, b);
      if (!result) {
        setFailPulse(true);
        setFeedback({ kind: "fail" });
        window.setTimeout(() => setFailPulse(false), FAIL_SHAKE_MS);
        return false;
      }

      setBusy(true);
      setInstances((prev) => prev.filter((inst) => !removeIds.includes(inst.instanceId)));
      spawnAt(result, dropX, dropY, true);
      addToInventory(result);
      setCorrectCount((c) => c + 1);
      setFeedback({ kind: "success", name: recipe.nodes[result]?.label ?? result });

      const isWin = result === recipe.targetId;
      if (isWin) setWon(true);

      settleRef.current = setTimeout(
        () => {
          setBusy(false);
          if (isWin) onSubmit({ solved: true, correctCount: total });
        },
        isWin ? WIN_SETTLE_MS : REVEAL_MS
      );

      return true;
    },
    [addToInventory, onSubmit, recipe, spawnAt, total]
  );

  const handleMove = useCallback((instanceId: string, x: number, y: number) => {
    setInstances((prev) => prev.map((inst) => (inst.instanceId === instanceId ? { ...inst, x, y } : inst)));
  }, []);

  const handleRemoveInstance = useCallback((instanceId: string) => {
    setInstances((prev) => prev.filter((inst) => inst.instanceId !== instanceId));
  }, []);

  const handleCombineInstances = useCallback(
    (draggedId: string, targetInstId: string, dropX: number, dropY: number) => {
      const list = instancesRef.current;
      const dragged = list.find((i) => i.instanceId === draggedId);
      const target = list.find((i) => i.instanceId === targetInstId);
      if (!dragged || !target) return false;
      return runCombineAt(dragged.nodeId, target.nodeId, dropX, dropY, [draggedId, targetInstId]);
    },
    [runCombineAt]
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
      const pos = clampToCanvas(surface, local.x - HIT_SIZE / 2, local.y - HIT_SIZE / 2);
      const ghost = { nodeId: drag.nodeId, x: pos.x, y: pos.y };
      ghostRef.current = ghost;
      setInventoryGhost(ghost);
    };

    const onUp = (e: PointerEvent) => {
      const drag = invDragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;

      const surface = surfaceRef.current;
      const ghost = ghostRef.current;
      const moved = drag.moved;
      const nodeId = drag.nodeId;
      invDragRef.current = null;
      ghostRef.current = null;
      setInventoryGhost(null);

      if (busyRef.current || wonRef.current || !surface) return;

      const rect = surface.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!moved) {
        spawnNearCenter(nodeId);
        return;
      }
      if (!inside) return;

      const local = clientToCanvasLocal(surface, e.clientX, e.clientY);
      const pos = clampToCanvas(
        surface,
        ghost?.x ?? local.x - HIT_SIZE / 2,
        ghost?.y ?? local.y - HIT_SIZE / 2
      );

      const target = findOverlapTarget(instancesRef.current, null, pos.x, pos.y);
      if (target) {
        const ok = runCombineAt(nodeId, target.nodeId, pos.x, pos.y, [target.instanceId]);
        if (!ok) {
          const offset = clampToCanvas(surface, pos.x + HIT_SIZE * 0.75, pos.y);
          spawnAt(nodeId, offset.x, offset.y);
        }
        return;
      }

      spawnAt(nodeId, pos.x, pos.y);
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
    nodeId: string,
    pointerId: number,
    clientX: number,
    clientY: number
  ) => {
    if (busy || won) return;
    invDragRef.current = { nodeId, pointerId, startX: clientX, startY: clientY, moved: false };
    setFeedback({ kind: "idle" });
  };

  useEffect(() => {
    if (feedback.kind !== "success" && feedback.kind !== "fail") return;
    const t = setTimeout(() => setFeedback({ kind: "idle" }), 1800);
    return () => clearTimeout(t);
  }, [feedback]);

  if (alchemy.submitted) {
    return <AlchemyResults item={item} alchemy={alchemy} onContinue={onContinue} />;
  }

  function giveUp() {
    onSubmit({ solved: false, correctCount });
  }

  const discoveredIds = new Set(inventory.filter((id) => !recipe.startIds.includes(id)));

  return (
    <div>
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="materia-label">Stage 02 // Alchemy</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#dae2fd]">Alchemy station</h2>
          <p className="materia-muted mt-2 max-w-2xl text-sm leading-6">
            Combine materials and actions, two at a time, to synthesize {item.name.toLowerCase()}.
          </p>
        </div>
        <span className="w-fit rounded-sm border border-[#94a3b8]/20 bg-[#222a3d] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#c4c6cd]">
          {correctCount}/{total} combinations
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[23rem_minmax(0,1fr)]">
        <aside className="materia-panel rounded-xl p-5 sm:p-6">
          <p className="materia-label text-[#8e9ab1]">Input inventory</p>
          <h3 className="mb-4 mt-3 text-xl font-semibold text-[#dae2fd]">Materials &amp; actions</h3>
          <Inventory
            nodes={recipe.nodes}
            ids={inventory}
            discoveredIds={discoveredIds}
            onPointerDragStart={handleInventoryPointerDown}
            disabled={busy || won}
          />

          <div className="mt-5">
            <HintPanel onRequestHint={() => requestHint(item.id, "round2", { inventory })} />
          </div>
        </aside>

        <section className="materia-panel flex flex-col rounded-xl p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="materia-label">Reaction chamber</p>
              <h3 className="mt-2 text-xl font-semibold text-[#dae2fd]">Workspace</h3>
            </div>
            <span className="h-2 w-2 rounded-full bg-[#7bd0ff] shadow-[0_0_10px_#7bd0ff]" />
          </div>

          <Workspace
            nodes={recipe.nodes}
            instances={instances}
            surfaceRef={surfaceRef}
            busy={busy}
            disabled={won}
            inventoryGhost={inventoryGhost}
            failPulse={failPulse}
            onMove={handleMove}
            onCombineInstances={handleCombineInstances}
            onRemoveInstance={handleRemoveInstance}
          />

          <div
            className="mt-4 min-h-[1.5rem] text-center font-mono text-xs uppercase tracking-wider"
            role="status"
            aria-live="polite"
          >
            {feedback.kind === "success" && (
              <span className="text-[#2dd4bf]">Synthesized: {feedback.name}</span>
            )}
            {feedback.kind === "fail" && <span className="text-[#ffb4ab]">Nothing happened</span>}
          </div>

          <div className="mt-4 flex items-center justify-end border-t border-[#94a3b8]/10 pt-6">
            <button
              type="button"
              onClick={giveUp}
              className="font-mono text-xs uppercase tracking-wider text-[#68758e] underline decoration-dotted transition-colors hover:text-[#c4c6cd]"
            >
              Reveal recipe &amp; continue
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
