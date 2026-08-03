"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import type { AlchemyNode } from "../../types/item";

export type CanvasInstance = {
  instanceId: string;
  nodeId: string;
  x: number;
  y: number;
  popping?: boolean;
};

/** Tile hit-box used for overlap / drop targeting */
export const HIT_SIZE = 72;

export type InventoryGhost = {
  nodeId: string;
  x: number;
  y: number;
};

type WorkspaceProps = {
  nodes: Record<string, AlchemyNode>;
  instances: CanvasInstance[];
  surfaceRef: RefObject<HTMLDivElement | null>;
  busy: boolean;
  disabled: boolean;
  inventoryGhost: InventoryGhost | null;
  failPulse?: boolean;
  onMove: (instanceId: string, x: number, y: number) => void;
  /** Dropped one canvas instance onto another. Return true if combine succeeded. */
  onCombineInstances: (draggedId: string, targetId: string, dropX: number, dropY: number) => boolean;
  onRemoveInstance: (instanceId: string) => void;
};

function overlaps(ax: number, ay: number, bx: number, by: number, size = HIT_SIZE): boolean {
  return ax < bx + size && ax + size > bx && ay < by + size && ay + size > by;
}

export function findOverlapTarget(
  instances: CanvasInstance[],
  excludeId: string | null,
  x: number,
  y: number
): CanvasInstance | null {
  for (let i = instances.length - 1; i >= 0; i--) {
    const inst = instances[i];
    if (excludeId && inst.instanceId === excludeId) continue;
    if (overlaps(x, y, inst.x, inst.y)) return inst;
  }
  return null;
}

export function clientToCanvasLocal(
  surface: HTMLDivElement,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  const rect = surface.getBoundingClientRect();
  return { x: clientX - rect.left, y: clientY - rect.top };
}

export function clampToCanvas(surface: HTMLDivElement, x: number, y: number): { x: number; y: number } {
  const maxX = Math.max(0, surface.clientWidth - HIT_SIZE);
  const maxY = Math.max(0, surface.clientHeight - HIT_SIZE);
  return { x: Math.min(Math.max(0, x), maxX), y: Math.min(Math.max(0, y), maxY) };
}

function TileFace({
  node,
  popping,
  dragging,
  onRemove,
}: {
  node: AlchemyNode;
  popping?: boolean;
  dragging?: boolean;
  onRemove?: () => void;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1 ${popping ? "animate-tile-pop" : ""} ${
        dragging ? "scale-110" : ""
      }`}
      style={{ width: HIT_SIZE }}
    >
      <span
        className="relative grid place-items-center rounded-sm border border-[#7bd0ff]/25 bg-[#171f33] text-3xl shadow-lg"
        style={{ width: HIT_SIZE, height: HIT_SIZE }}
      >
        {node.emoji}
        {onRemove && (
          <button
            type="button"
            aria-label={`Remove ${node.label}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full border border-[#94a3b8]/30 bg-[#0b1326] text-[10px] leading-none text-[#8e9ab1] shadow-md transition-colors hover:border-red-400/60 hover:text-red-300"
          >
            ✕
          </button>
        )}
      </span>
      <span className="max-w-20 truncate text-center font-mono text-[10px] text-[#c4c6cd]">
        {node.label}
      </span>
    </div>
  );
}

type CanvasDrag = {
  instanceId: string;
  originX: number;
  originY: number;
  pointerId: number;
  offsetX: number;
  offsetY: number;
};

export function Workspace({
  nodes,
  instances,
  surfaceRef,
  busy,
  disabled,
  inventoryGhost,
  failPulse = false,
  onMove,
  onCombineInstances,
  onRemoveInstance,
}: WorkspaceProps) {
  const dragRef = useRef<CanvasDrag | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const instancesRef = useRef(instances);
  useEffect(() => {
    instancesRef.current = instances;
  }, [instances]);

  const endCanvasDrag = useCallback(
    (pointerId: number) => {
      const current = dragRef.current;
      if (!current || current.pointerId !== pointerId) return;

      const inst = instancesRef.current.find((i) => i.instanceId === current.instanceId);
      if (inst) {
        const target = findOverlapTarget(instancesRef.current, current.instanceId, inst.x, inst.y);
        if (target) {
          const ok = onCombineInstances(current.instanceId, target.instanceId, inst.x, inst.y);
          if (!ok) onMove(current.instanceId, current.originX, current.originY);
        }
      }

      dragRef.current = null;
      setDraggingId(null);
    },
    [onCombineInstances, onMove]
  );

  useEffect(() => {
    const onMoveWin = (e: PointerEvent) => {
      const current = dragRef.current;
      const surface = surfaceRef.current;
      if (!current || current.pointerId !== e.pointerId || !surface) return;
      const local = clientToCanvasLocal(surface, e.clientX, e.clientY);
      const pos = clampToCanvas(surface, local.x - current.offsetX, local.y - current.offsetY);
      onMove(current.instanceId, pos.x, pos.y);
    };

    const onUpWin = (e: PointerEvent) => endCanvasDrag(e.pointerId);

    window.addEventListener("pointermove", onMoveWin);
    window.addEventListener("pointerup", onUpWin);
    window.addEventListener("pointercancel", onUpWin);
    return () => {
      window.removeEventListener("pointermove", onMoveWin);
      window.removeEventListener("pointerup", onUpWin);
      window.removeEventListener("pointercancel", onUpWin);
    };
  }, [endCanvasDrag, onMove, surfaceRef]);

  const onInstancePointerDown = (inst: CanvasInstance, e: ReactPointerEvent) => {
    if (disabled || busy) return;
    e.preventDefault();
    e.stopPropagation();
    const surface = surfaceRef.current;
    if (!surface) return;
    const local = clientToCanvasLocal(surface, e.clientX, e.clientY);
    dragRef.current = {
      instanceId: inst.instanceId,
      originX: inst.x,
      originY: inst.y,
      pointerId: e.pointerId,
      offsetX: local.x - inst.x,
      offsetY: local.y - inst.y,
    };
    setDraggingId(inst.instanceId);
  };

  return (
    <div
      ref={surfaceRef}
      className={`relative h-[min(52vh,26rem)] w-full touch-none overflow-hidden rounded-lg border-2 border-dashed ${
        failPulse ? "animate-wiggle border-red-400/60" : "border-[#94a3b8]/20"
      } bg-[#060e20]/30`}
    >
      {instances.length === 0 && (
        <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono text-xs uppercase tracking-wider text-[#68758e]">
          Drag items from your inventory and combine them here
        </p>
      )}

      {instances.map((inst) => (
        <div
          key={inst.instanceId}
          role="button"
          tabIndex={disabled || busy ? -1 : 0}
          aria-label={nodes[inst.nodeId]?.label}
          className={`absolute select-none outline-none ${
            disabled || busy ? "cursor-default" : "cursor-grab active:cursor-grabbing"
          } ${draggingId === inst.instanceId ? "z-20" : "z-10"}`}
          style={{ left: inst.x, top: inst.y }}
          onPointerDown={(e) => onInstancePointerDown(inst, e)}
        >
          <TileFace
            node={nodes[inst.nodeId]}
            popping={inst.popping}
            dragging={draggingId === inst.instanceId}
            onRemove={disabled || busy ? undefined : () => onRemoveInstance(inst.instanceId)}
          />
        </div>
      ))}

      {inventoryGhost && (
        <div
          className="pointer-events-none absolute z-30 opacity-90"
          style={{ left: inventoryGhost.x, top: inventoryGhost.y }}
        >
          <TileFace node={nodes[inventoryGhost.nodeId]} dragging />
        </div>
      )}
    </div>
  );
}
