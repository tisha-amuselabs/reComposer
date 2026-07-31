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
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[#7bd0ff]">
          /
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search an element by name or symbol…"
          className="w-full rounded-sm border border-[#94a3b8]/20 bg-[#060e20] py-3 pl-11 pr-4 font-mono text-sm text-[#dae2fd] placeholder:text-[#68758e] transition-colors focus:border-[#7bd0ff] focus:outline-none"
        />
      </div>
      {matches.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-sm border border-[#94a3b8]/20 bg-[#131b2e] shadow-2xl">
          {matches.map((el) => (
            <li key={el.symbol}>
              <button
                type="button"
                onClick={() => {
                  onPick(el.symbol);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 border-b border-[#94a3b8]/10 px-4 py-3 text-left text-sm transition-colors last:border-0 hover:bg-[#7bd0ff]/10"
              >
                <span className="font-mono font-bold text-[#7bd0ff]">{el.symbol}</span>
                <span className="text-[#c4c6cd]">{el.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
