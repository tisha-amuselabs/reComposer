import type { GamePhase } from "../types/game-state";

const ROUND_META = [
  { phase: "round1" as const, label: "Composition" },
  { phase: "round2" as const, label: "Process" },
  { phase: "round3" as const, label: "History" },
  { phase: "end" as const, label: "Trivia" },
];

export function ProgressDots({ phase }: { phase: GamePhase }) {
  const currentIndex = ROUND_META.findIndex((r) => r.phase === phase);

  return (
    <nav aria-label="Game progress" className="flex min-w-max items-center gap-5 sm:gap-8">
      {ROUND_META.map((r, i) => {
        const isDone = phase === "end" || i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <span
            key={r.phase}
            aria-current={isCurrent ? "step" : undefined}
            className={`relative py-5 text-sm transition-colors sm:text-base ${
              isCurrent
                ? "text-[#7bd0ff]"
                : isDone
                  ? "text-[#c4c6cd]"
                  : "text-[#7d879c]"
            }`}
          >
            <span className="font-mono text-[10px] text-[#68758e] sm:hidden">
              {String(i + 1).padStart(2, "0")}{" "}
            </span>
            {r.label}
            {isCurrent && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#7bd0ff] shadow-[0_0_10px_#7bd0ff]" />
            )}
          </span>
        );
      })}
    </nav>
  );
}
