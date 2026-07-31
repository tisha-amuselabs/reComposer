"use client";

import dynamic from "next/dynamic";

const Game = dynamic(() => import("./components/Game").then((m) => m.Game), {
  ssr: false,
  loading: () => (
    <div className="materia flex min-h-screen items-center justify-center">
      <p className="materia-label animate-pulse">Initializing material analysis&hellip;</p>
    </div>
  ),
});

export function GameLoader() {
  return <Game />;
}
