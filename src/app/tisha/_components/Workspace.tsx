"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { items } from "../_lib/casein";
import type { ItemId } from "../_lib/types";

export type CanvasInstance = {
  instanceId: string;
  itemId: ItemId;
  x: number;
  y: number;
  /** Play creation pop when true */
  popping?: boolean;
};

/** Icon hit-box used for overlap / drop targeting */
export const HIT_SIZE = 64;

export type InventoryGhost = {
  itemId: ItemId;
  /** canvas-local top-left of the ghost hit box */
  x: number;
  y: number;
};

type WorkspaceProps = {
  instances: CanvasInstance[];
  surfaceRef: RefObject<HTMLDivElement | null>;
  busy: boolean;
  disabled: boolean;
  inventoryGhost: InventoryGhost | null;
  failPulse?: boolean;
  onMove: (instanceId: string, x: number, y: number) => void;
  /**
   * Dropped one canvas instance onto another.
   * Return true if combine succeeded; false to snap back.
   */
  onCombineInstances: (
    draggedId: string,
    targetId: string,
    dropX: number,
    dropY: number,
  ) => boolean;
};

function overlaps(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  size = HIT_SIZE,
): boolean {
  return (
    ax < bx + size && ax + size > bx && ay < by + size && ay + size > by
  );
}

export function findOverlapTarget(
  instances: CanvasInstance[],
  excludeId: string | null,
  x: number,
  y: number,
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
  clientY: number,
): { x: number; y: number } {
  const rect = surface.getBoundingClientRect();
  return { x: clientX - rect.left, y: clientY - rect.top };
}

export function clampToCanvas(
  surface: HTMLDivElement,
  x: number,
  y: number,
): { x: number; y: number } {
  const maxX = Math.max(0, surface.clientWidth - HIT_SIZE);
  const maxY = Math.max(0, surface.clientHeight - HIT_SIZE - 18);
  return {
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  };
}

function TileFace({
  itemId,
  size = HIT_SIZE,
  popping,
  dragging,
}: {
  itemId: ItemId;
  size?: number;
  popping?: boolean;
  dragging?: boolean;
}) {
  const item = items[itemId];
  const [showImg, setShowImg] = useState(true);

  return (
    <div
      className={[
        "flex flex-col items-center gap-1",
        popping ? "alchemy-pop" : "",
        dragging ? "alchemy-dragging" : "",
      ].join(" ")}
      style={{ width: size }}
    >
      <span
        className="relative flex items-center justify-center overflow-hidden rounded-sm border border-[#1a1510]/25"
        style={{
          width: size,
          height: size,
          backgroundColor: item.color,
        }}
      >
        <span className="px-1 text-center font-[family-name:var(--font-eb-garamond)] text-[10px] font-medium uppercase tracking-wide text-[#1a1510]/70">
          {item.name.split(" ")[0]}
        </span>
        {showImg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src ?? `/tisha/${itemId}.png`}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-contain p-1"
            draggable={false}
            onError={() => setShowImg(false)}
          />
        )}
      </span>
      <span className="max-w-[4.5rem] truncate text-center font-[family-name:var(--font-eb-garamond)] text-[11px] leading-tight text-[#2a241c]">
        {item.name}
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
  instances,
  surfaceRef,
  busy,
  disabled,
  inventoryGhost,
  failPulse = false,
  onMove,
  onCombineInstances,
}: WorkspaceProps) {
  const dragRef = useRef<CanvasDrag | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const instancesRef = useRef(instances);
  instancesRef.current = instances;

  const endCanvasDrag = useCallback(
    (pointerId: number) => {
      const current = dragRef.current;
      if (!current || current.pointerId !== pointerId) return;

      const inst = instancesRef.current.find(
        (i) => i.instanceId === current.instanceId,
      );
      if (inst) {
        const target = findOverlapTarget(
          instancesRef.current,
          current.instanceId,
          inst.x,
          inst.y,
        );
        if (target) {
          const ok = onCombineInstances(
            current.instanceId,
            target.instanceId,
            inst.x,
            inst.y,
          );
          if (!ok) {
            onMove(current.instanceId, current.originX, current.originY);
          }
        }
      }

      dragRef.current = null;
      setDraggingId(null);
    },
    [onCombineInstances, onMove],
  );

  useEffect(() => {
    const onMoveWin = (e: PointerEvent) => {
      const current = dragRef.current;
      const surface = surfaceRef.current;
      if (!current || current.pointerId !== e.pointerId || !surface) return;
      const local = clientToCanvasLocal(surface, e.clientX, e.clientY);
      const pos = clampToCanvas(
        surface,
        local.x - current.offsetX,
        local.y - current.offsetY,
      );
      onMove(current.instanceId, pos.x, pos.y);
    };

    const onUpWin = (e: PointerEvent) => {
      endCanvasDrag(e.pointerId);
    };

    window.addEventListener("pointermove", onMoveWin);
    window.addEventListener("pointerup", onUpWin);
    window.addEventListener("pointercancel", onUpWin);
    return () => {
      window.removeEventListener("pointermove", onMoveWin);
      window.removeEventListener("pointerup", onUpWin);
      window.removeEventListener("pointercancel", onUpWin);
    };
  }, [endCanvasDrag, onMove, surfaceRef]);

  const onInstancePointerDown = (
    inst: CanvasInstance,
    e: ReactPointerEvent,
  ) => {
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
    <section aria-label="Workspace" className="flex w-full flex-col gap-3">
      <h2 className="border-b border-[#1a1510]/20 pb-2 text-center font-[family-name:var(--font-eb-garamond)] text-xs font-semibold uppercase tracking-[0.2em] text-[#5c5348]">
        Workspace
      </h2>
      <div
        ref={surfaceRef}
        className={[
          "alchemy-workspace relative h-[min(52vh,28rem)] w-full overflow-hidden rounded-sm border border-[#1a1510]/20 touch-none",
          failPulse ? "alchemy-shake" : "",
        ].join(" ")}
      >
        <p className="pointer-events-none absolute inset-x-0 top-3 text-center font-[family-name:var(--font-eb-garamond)] text-sm italic text-[#1a1510]/30">
          Drag items onto each other
        </p>

        {instances.map((inst) => (
          <div
            key={inst.instanceId}
            role="button"
            tabIndex={disabled || busy ? -1 : 0}
            aria-label={items[inst.itemId].name}
            className={[
              "absolute select-none outline-none",
              disabled || busy
                ? "cursor-default"
                : "cursor-grab active:cursor-grabbing",
              draggingId === inst.instanceId ? "z-20" : "z-10",
            ].join(" ")}
            style={{ left: inst.x, top: inst.y }}
            onPointerDown={(e) => onInstancePointerDown(inst, e)}
          >
            <TileFace
              itemId={inst.itemId}
              popping={inst.popping}
              dragging={draggingId === inst.instanceId}
            />
          </div>
        ))}

        {inventoryGhost && (
          <div
            className="pointer-events-none absolute z-30 opacity-90"
            style={{ left: inventoryGhost.x, top: inventoryGhost.y }}
          >
            <TileFace itemId={inventoryGhost.itemId} dragging />
          </div>
        )}
      </div>
    </section>
  );
}
