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
      aria-label="Laboratory hints"
      className="border border-[#1a1510]/12 bg-[#fffcf7]/80 px-4 py-3"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--font-eb-garamond)] text-xs font-semibold uppercase tracking-[0.2em] text-[#5c5348]">
          Ask the laboratory
        </h2>
        <button
          type="button"
          onClick={onAsk}
          disabled={disabled || loading || exhausted}
          className="font-[family-name:var(--font-eb-garamond)] text-sm tracking-wide text-[#1a1510] underline decoration-[#1a1510]/35 underline-offset-4 transition hover:decoration-[#1a1510]/70 disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
        >
          {loading ? "Consulting…" : exhausted ? "No more hints" : "Request hint"}
        </button>
      </div>
      {text && (
        <p
          className="alchemy-fade-in mt-3 font-[family-name:var(--font-eb-garamond)] text-base italic leading-relaxed text-[#2a241c]"
          role="status"
          aria-live="polite"
        >
          {text}
        </p>
      )}
      {!text && !exhausted && (
        <p className="mt-2 font-[family-name:var(--font-eb-garamond)] text-sm text-[#5c5348]/80">
          Stuck on the process? The bench notebook can nudge you—without always
          spoiling the recipe.
        </p>
      )}
    </section>
  );
}
