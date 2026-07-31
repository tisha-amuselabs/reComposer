"use client";

import type { MouseEvent } from "react";
import {
  COUNTRY_PATHS,
  GRATICULE_PATH,
  MAP_HEIGHT,
  MAP_WIDTH,
  OUTLINE_PATH,
  latLngToPixel,
  pixelToLatLng,
} from "./mapProjection";

export function WorldMapGuesser({
  guessLat,
  guessLng,
  onGuess,
}: {
  guessLat: number | null;
  guessLng: number | null;
  onGuess: (lat: number, lng: number) => void;
}) {
  function handleClick(e: MouseEvent<SVGSVGElement>) {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * MAP_WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * MAP_HEIGHT;
    const coords = pixelToLatLng(x, y);
    if (coords) onGuess(coords.lat, coords.lng);
  }

  const pin = guessLat !== null && guessLng !== null ? latLngToPixel(guessLat, guessLng) : null;

  return (
    <div className="aspect-[2.1/1] w-full overflow-hidden rounded-2xl border-2 border-sky-200 shadow-inner dark:border-sky-900">
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        onClick={handleClick}
        className="h-full w-full cursor-crosshair fill-sky-100 dark:fill-slate-900"
        role="img"
        aria-label="World map — click to place your guess"
      >
        <path d={OUTLINE_PATH} />
        <path
          d={GRATICULE_PATH}
          className="fill-none stroke-sky-300/50 dark:stroke-sky-100/10"
          strokeWidth={0.5}
        />
        {COUNTRY_PATHS.map((c) => (
          <path
            key={c.id}
            d={c.d}
            className="fill-emerald-600/90 stroke-emerald-900/30 transition-colors hover:fill-emerald-500 dark:fill-emerald-700/80 dark:stroke-emerald-950/60 dark:hover:fill-emerald-600"
            strokeWidth={0.6}
          />
        ))}
        {pin && (
          <circle
            cx={pin.x}
            cy={pin.y}
            r={7}
            className="fill-rose-500 stroke-2 stroke-white drop-shadow-md dark:stroke-zinc-900"
          />
        )}
      </svg>
    </div>
  );
}
