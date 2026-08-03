"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { items } from "../_lib/items";
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
  selectedIds: string[];
  onMove: (instanceId: string, x: number, y: number) => void;
  onToggleSelect: (instanceId: string) => void;
  onClearSelection: () => void;
};

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
  selected,
}: {
  itemId: ItemId;
  size?: number;
  popping?: boolean;
  dragging?: boolean;
  selected?: boolean;
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
        className={[
          "relative flex items-center justify-center overflow-hidden rounded-sm border transition",
          selected
            ? "border-[#1a1510] ring-2 ring-[#1a1510]/35"
            : "border-[#1a1510]/25",
        ].join(" ")}
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
  moved: boolean;
};

export function Workspace({
  instances,
  surfaceRef,
  busy,
  disabled,
  inventoryGhost,
  failPulse = false,
  selectedIds,
  onMove,
  onToggleSelect,
  onClearSelection,
}: WorkspaceProps) {
  const dragRef = useRef<CanvasDrag | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const instancesRef = useRef(instances);
  instancesRef.current = instances;

  const endCanvasDrag = useCallback(
    (pointerId: number) => {
      const current = dragRef.current;
      if (!current || current.pointerId !== pointerId) return;

      if (!current.moved) {
        onToggleSelect(current.instanceId);
      }

      dragRef.current = null;
      setDraggingId(null);
    },
    [onToggleSelect],
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
      const dist = Math.hypot(pos.x - current.originX, pos.y - current.originY);
      if (dist > 6) current.moved = true;
      if (current.moved) {
        onMove(current.instanceId, pos.x, pos.y);
      }
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
      moved: false,
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
        onPointerDown={() => {
          if (!disabled && !busy) onClearSelection();
        }}
      >
        <p className="pointer-events-none absolute inset-x-0 top-3 text-center font-[family-name:var(--font-eb-garamond)] text-sm italic text-[#1a1510]/30">
          Select materials, then use an action
        </p>

        {instances.map((inst) => {
          const selected = selectedIds.includes(inst.instanceId);
          return (
            <div
              key={inst.instanceId}
              role="button"
              tabIndex={disabled || busy ? -1 : 0}
              aria-label={items[inst.itemId].name}
              aria-pressed={selected}
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
                selected={selected}
              />
            </div>
          );
        })}

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
