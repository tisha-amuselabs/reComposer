"use client";

import dynamic from "next/dynamic";

const Game = dynamic(() => import("./components/Game").then((m) => m.Game), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-zinc-500 dark:text-zinc-400">Loading today&rsquo;s item&hellip;</p>
    </div>
  ),
});

export function GameLoader() {
  return <Game />;
}
