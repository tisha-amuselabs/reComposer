import type { ItemOfDay } from "../types/item";

export function DemoBar({ items, currentId }: { items: ItemOfDay[]; currentId: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 rounded-sm border border-amber-400/30 bg-amber-400/5 px-4 py-3">
      <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-amber-300">
        Demo mode
      </span>
      {items.map((it) => (
        <a
          key={it.id}
          href={`?item=${it.id}&demo=1`}
          className={`rounded-sm border px-2.5 py-1 font-mono text-xs transition-colors ${
            it.id === currentId
              ? "border-amber-400/60 bg-amber-400/15 text-amber-200"
              : "border-[#94a3b8]/20 text-[#c4c6cd] hover:border-amber-400/40"
          }`}
        >
          {it.name}
        </a>
      ))}
      <a
        href="/vansh"
        className="ml-auto font-mono text-xs text-[#68758e] underline decoration-dotted transition-colors hover:text-[#c4c6cd]"
      >
        Exit demo
      </a>
    </div>
  );
}
