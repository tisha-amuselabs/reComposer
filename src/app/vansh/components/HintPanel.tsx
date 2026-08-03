"use client";

import { useState } from "react";

export function HintPanel({ onRequestHint }: { onRequestHint: () => Promise<string> }) {
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const text = await onRequestHint();
      setHint(text);
      setCount((c) => c + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't get a hint right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-sm border border-[#94a3b8]/15 bg-[#0b1326]/50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="materia-label text-[#8e9ab1]">
          Stuck?{count > 0 ? ` Hint ${count}` : ""}
        </p>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className="shrink-0 rounded-sm border border-[#7bd0ff]/35 bg-[#7bd0ff]/10 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-[#7bd0ff] transition-colors hover:bg-[#7bd0ff]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Thinking…" : hint ? "Another hint" : "Get a hint"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-[#ffb4ab]">{error}</p>}
      {hint && !error && <p className="mt-2 text-sm italic leading-6 text-[#dae2fd]">{hint}</p>}
    </div>
  );
}
