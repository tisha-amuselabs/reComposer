"use client";

import dynamic from "next/dynamic";
import type { GlobeMarker } from "./GlobeCanvas";

const GlobeCanvas = dynamic(
  () => import("./GlobeCanvas").then((module) => module.GlobeCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full min-h-[360px] place-items-center">
        <p className="materia-label animate-pulse">Calibrating globe&hellip;</p>
      </div>
    ),
  }
);

export function WorldMapGuesser({
  guessLat,
  guessLng,
  onGuess,
}: {
  guessLat: number | null;
  guessLng: number | null;
  onGuess: (lat: number, lng: number) => void;
}) {
  const markers: GlobeMarker[] =
    guessLat !== null && guessLng !== null
      ? [{ lat: guessLat, lng: guessLng, color: "#7bd0ff", label: "Your origin guess" }]
      : [];

  return (
    <div
      className="h-[28rem] w-full overflow-hidden rounded-lg border border-[#94a3b8]/16 bg-[radial-gradient(circle_at_50%_45%,#1a263d_0%,#0b1326_62%,#060e20_100%)] shadow-inner shadow-black/40"
      role="application"
      aria-label="Interactive world globe — drag to rotate and click to place your guess"
    >
      <GlobeCanvas markers={markers} onGuess={onGuess} />
    </div>
  );
}

export function WorldGlobeResults({
  guessLat,
  guessLng,
  trueLat,
  trueLng,
}: {
  guessLat: number | null;
  guessLng: number | null;
  trueLat: number;
  trueLng: number;
}) {
  const markers: GlobeMarker[] = [
    ...(guessLat !== null && guessLng !== null
      ? [{ lat: guessLat, lng: guessLng, color: "#ffb4ab", label: "Your guess" }]
      : []),
    { lat: trueLat, lng: trueLng, color: "#7bd0ff", label: "True origin" },
  ];

  return (
    <div className="relative h-[28rem] w-full overflow-hidden rounded-lg border border-[#94a3b8]/16 bg-[radial-gradient(circle_at_50%_45%,#1a263d_0%,#0b1326_62%,#060e20_100%)] shadow-inner">
      <GlobeCanvas markers={markers} focusOnMarkers />
      <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col gap-2 rounded-sm border border-[#94a3b8]/16 bg-[#0b1326]/80 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-[#aab4c7] backdrop-blur">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#ffb4ab] shadow-[0_0_7px_#ffb4ab]" />
          Your selection
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#7bd0ff] shadow-[0_0_7px_#7bd0ff]" />
          True origin
        </span>
      </div>
    </div>
  );
}
