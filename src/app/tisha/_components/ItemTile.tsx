"use client";

import { useState, type PointerEvent as ReactPointerEvent } from "react";
import { items } from "../_lib/casein";
import type { ItemId } from "../_lib/types";

type ItemTileProps = {
  id: ItemId;
  selected?: boolean;
  onClick?: () => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLButtonElement>) => void;
  size?: "sm" | "md";
  muted?: boolean;
  className?: string;
};

export function ItemTile({
  id,
  selected = false,
  onClick,
  onPointerDown,
  size = "md",
  muted = false,
  className = "",
}: ItemTileProps) {
  const item = items[id];
  const [showImg, setShowImg] = useState(true);
  const dim = size === "sm" ? "h-14 w-14" : "h-20 w-20";
  const interactive = Boolean(onClick || onPointerDown);

  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={onPointerDown}
      disabled={!interactive}
      className={[
        "group flex flex-col items-center gap-1.5 transition touch-none",
        interactive ? "cursor-grab active:cursor-grabbing" : "cursor-default",
        muted ? "opacity-50" : "",
        className,
      ].join(" ")}
      aria-pressed={selected}
      aria-label={item.name}
    >
      <span
        className={[
          dim,
          "relative flex items-center justify-center overflow-hidden rounded-sm border transition",
          selected
            ? "border-[#1a1510] ring-2 ring-[#1a1510]/30"
            : "border-[#1a1510]/25 group-hover:border-[#1a1510]/55",
        ].join(" ")}
        style={{ backgroundColor: item.color }}
      >
        <span className="px-1 text-center font-[family-name:var(--font-eb-garamond)] text-[10px] font-medium uppercase tracking-wide text-[#1a1510]/70">
          {item.name.split(" ")[0]}
        </span>
        {showImg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src ?? `/tisha/${id}.png`}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-contain p-1"
            draggable={false}
            onError={() => setShowImg(false)}
          />
        )}
      </span>
      <span className="max-w-[5.5rem] text-center font-[family-name:var(--font-eb-garamond)] text-xs leading-tight text-[#2a241c] sm:text-sm">
        {item.name}
      </span>
    </button>
  );
}
