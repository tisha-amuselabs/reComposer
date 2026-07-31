"use client";

import { useState } from "react";
import { PERIODIC_TABLE } from "../../data/periodicTable";

export function ElementSearch({ onPick }: { onPick: (symbol: string) => void }) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim().toLowerCase();

  const matches = trimmed
    ? PERIODIC_TABLE.filter(
        (el) => el.name.toLowerCase().includes(trimmed) || el.symbol.toLowerCase() === trimmed
      ).slice(0, 6)
    : [];

  return (
    <div className="relative">
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search an element by name or symbol…"
          className="w-full rounded-full border-2 border-zinc-300 bg-white py-2.5 pl-11 pr-4 text-sm font-medium shadow-sm transition-colors focus:border-fuchsia-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      {matches.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          {matches.map((el) => (
            <li key={el.symbol}>
              <button
                type="button"
                onClick={() => {
                  onPick(el.symbol);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/40"
              >
                <span className="font-bold">{el.symbol}</span>
                <span className="text-zinc-500 dark:text-zinc-400">{el.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
