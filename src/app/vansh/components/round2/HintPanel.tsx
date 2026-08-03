"use client";

type HintPanelProps = {
  text: string | null;
  loading?: boolean;
  disabled?: boolean;
  onAsk: () => void;
  exhausted?: boolean;
};

export function HintPanel({
  text,
  loading = false,
  disabled = false,
  onAsk,
  exhausted = false,
}: HintPanelProps) {
  return (
    <section
      aria-label="Process hints"
      className="materia-panel flex items-center gap-3 rounded-xl border border-[#94a3b8]/15 px-3 py-2"
    >
      <div className="min-w-0 flex-1">
        {text ? (
          <p
            className="truncate text-sm leading-5 text-[#c4c6cd]"
            role="status"
            aria-live="polite"
            title={text}
          >
            {text}
          </p>
        ) : (
          <p className="truncate text-sm leading-5 text-[#8e9ab1]">
            Stuck? Request a process nudge.
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onAsk}
        disabled={disabled || loading || exhausted}
        className="shrink-0 rounded-sm border border-[#7bd0ff]/35 bg-[#7bd0ff]/8 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#7bd0ff] transition hover:border-[#7bd0ff]/70 hover:bg-[#7bd0ff]/14 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "…" : exhausted ? "Done" : "Hint"}
      </button>
    </section>
  );
}
