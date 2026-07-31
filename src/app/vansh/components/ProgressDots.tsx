import type { GamePhase } from "../types/game-state";

const ROUND_META = [
  { phase: "round1" as const, emoji: "🧪", bg: "bg-fuchsia-500", ring: "ring-fuchsia-300 dark:ring-fuchsia-800" },
  { phase: "round2" as const, emoji: "🛠️", bg: "bg-amber-500", ring: "ring-amber-300 dark:ring-amber-800" },
  { phase: "round3" as const, emoji: "🗺️", bg: "bg-sky-500", ring: "ring-sky-300 dark:ring-sky-800" },
];

export function ProgressDots({ phase }: { phase: GamePhase }) {
  const currentIndex = ROUND_META.findIndex((r) => r.phase === phase);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {ROUND_META.map((r, i) => {
        const isDone = phase === "end" || i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={r.phase} className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm shadow-sm transition-all sm:h-9 sm:w-9 ${
                isDone
                  ? `${r.bg} text-white`
                  : isCurrent
                    ? `${r.bg} scale-110 text-white ring-4 ${r.ring}`
                    : "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              {isDone && !isCurrent ? "✓" : r.emoji}
            </div>
            {i < ROUND_META.length - 1 && (
              <div
                className={`h-0.5 w-4 rounded transition-colors sm:w-6 ${
                  isDone ? r.bg : "bg-zinc-200 dark:bg-zinc-800"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
