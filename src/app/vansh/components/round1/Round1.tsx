"use client";

import { useState } from "react";
import type { ItemOfDay } from "../../types/item";
import type { Round1State } from "../../types/game-state";
import { PeriodicTable } from "./PeriodicTable";
import { CompositionSlots } from "./CompositionSlots";
import { ElementSearch } from "./ElementSearch";
import { Round1Results } from "./Round1Results";
import { Button } from "../Button";
import { ELEMENT_BY_SYMBOL } from "../../data/periodicTable";

interface Round1Draft {
  assignments: (string | null)[];
  activeSlot: number;
}

export function Round1({
  item,
  round1,
  onSubmit,
  onReplay,
}: {
  item: ItemOfDay;
  round1: Round1State;
  onSubmit: (assignments: (string | null)[]) => void;
  onReplay: () => void;
}) {
  const [draft, setDraft] = useState<Round1Draft>(() => ({
    assignments: Array(item.composition.length).fill(null),
    activeSlot: 0,
  }));
  const [showPeriodicTable, setShowPeriodicTable] = useState(false);

  if (round1.submitted) {
    return (
      <Round1Results item={item} round1={round1} onReplay={onReplay} />
    );
  }

  function pickElement(symbol: string) {
    setDraft((prev) => {
      const isTogglingOff = prev.assignments[prev.activeSlot] === symbol;
      const cleared = prev.assignments.map((v) => (v === symbol ? null : v));
      cleared[prev.activeSlot] = isTogglingOff ? null : symbol;
      const nextEmpty = cleared.findIndex((v) => v === null);
      return {
        assignments: cleared,
        activeSlot: nextEmpty === -1 ? prev.activeSlot : nextEmpty,
      };
    });
  }

  function selectSlot(index: number) {
    setDraft((prev) => ({ ...prev, activeSlot: index }));
  }

  const canSubmit = draft.assignments.some((v) => v !== null);
  const quickSymbols = ["Fe", "Cr", "Ni", "C", "Ti", "Al"];
  const chartColors = ["#18a7df", "#1eb7aa", "#ad2730", "#6e7b91", "#8f99ff"];
  const chartTotal = item.composition.reduce((total, part) => total + part.approxPercent, 0);
  const chartSegments = item.composition.map((part, index) => {
    const start = item.composition
      .slice(0, index)
      .reduce((total, previousPart) => total + previousPart.approxPercent, 0);
    const end = start + part.approxPercent;
    return { start, end };
  });
  const compositionStops = chartSegments.map(
    (segment, index) =>
      `${chartColors[index % chartColors.length]} ${segment.start}% ${segment.end}%`
  );
  const chartStops =
    chartTotal < 100
      ? [...compositionStops, `#344158 ${chartTotal}% 100%`]
      : compositionStops;

  function chartLabelPosition(start: number, end: number, radius = 61) {
    const angle = (((start + end) / 2) * 360) / 100 - 90;
    const radians = (angle * Math.PI) / 180;
    return {
      left: `${50 + Math.cos(radians) * radius}%`,
      top: `${50 + Math.sin(radians) * radius}%`,
    };
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(25rem,1fr)]">
      <section className="materia-panel flex flex-col rounded-xl p-5 sm:p-7">
        <p className="materia-label">Stage 01 // Composition</p>

        <div className="relative my-7 min-h-[21rem] rounded-lg border border-[#94a3b8]/8 bg-[#060e20]/24 px-2 py-5 sm:min-h-[24rem]">
          <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 sm:h-64 sm:w-64">
            <div
              className="materia-donut h-full w-full"
              style={{ background: `conic-gradient(${chartStops.join(", ")})` }}
            >
              <div className="materia-donut-core">
                <span className="text-3xl text-[#68758e]" aria-hidden>
                  ⚗
                </span>
                <span className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-[#94a3b8]">
                  Scanning mass...
                </span>
              </div>
            </div>

            {item.composition.map((part, index) => {
              const segment = chartSegments[index];
              const assignment = draft.assignments[index];
              return (
                <button
                  key={`${part.approxPercent}-${index}`}
                  type="button"
                  onClick={() => selectSlot(index)}
                  style={chartLabelPosition(segment.start, segment.end)}
                  className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm border bg-[#131b2e]/95 px-2.5 py-1.5 font-mono text-[10px] shadow-lg backdrop-blur sm:text-xs ${
                    draft.activeSlot === index
                      ? "border-[#7bd0ff] text-[#7bd0ff] shadow-[0_0_14px_rgba(123,208,255,0.16)]"
                      : "border-[#94a3b8]/30 text-[#94a3b8]"
                  }`}
                >
                  {part.approxPercent}%&nbsp; [&nbsp;{assignment ?? "?"}&nbsp;]
                </button>
              );
            })}

            {chartTotal < 100 && (
              <span
                style={chartLabelPosition(chartTotal, 100, 58)}
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm border border-[#94a3b8]/20 bg-[#131b2e]/90 px-2.5 py-1.5 font-mono text-[10px] text-[#77849a] shadow-lg backdrop-blur sm:text-xs"
              >
                {100 - chartTotal}% other
              </span>
            )}
          </div>
        </div>

        <CompositionSlots
          composition={item.composition}
          assignments={draft.assignments}
          activeSlot={draft.activeSlot}
          onSelectSlot={selectSlot}
        />

        <Button
          className="mt-7 w-full self-stretch"
          disabled={!canSubmit}
          onClick={() => onSubmit(draft.assignments)}
        >
          Analyze composition
        </Button>
      </section>

      <section className="materia-panel min-w-0 rounded-xl p-5 sm:p-7">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="materia-label">Material database</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#dae2fd]">Element library</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowPeriodicTable(true)}
            aria-expanded={showPeriodicTable}
            className="w-fit rounded-sm border border-[#7bd0ff]/35 bg-[#7bd0ff]/10 px-3 py-2 font-mono text-xs uppercase tracking-wider text-[#7bd0ff] transition-colors hover:bg-[#7bd0ff]/20"
          >
            ⠿ Periodic table
          </button>
        </div>

        <ElementSearch onPick={pickElement} />

        <div className="mt-5 border-t border-[#94a3b8]/10 pt-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {quickSymbols.map((symbol) => {
              const element = ELEMENT_BY_SYMBOL[symbol];
              const selected = draft.assignments.includes(symbol);
              return (
                <button
                  key={symbol}
                  type="button"
                  onClick={() => pickElement(symbol)}
                  className={`relative flex min-h-36 flex-col items-center justify-center rounded-sm border bg-[#202a3d] p-4 transition-all hover:border-[#7bd0ff]/60 hover:bg-[#263249] ${
                    selected
                      ? "border-[#7bd0ff] shadow-[0_0_18px_rgba(123,208,255,0.14)]"
                      : "border-[#94a3b8]/10"
                  }`}
                >
                  <span className="absolute left-2 top-2 font-mono text-[10px] text-[#7d899e]">
                    {element.atomicNumber}
                  </span>
                  <span className="font-mono text-3xl font-semibold text-[#dae2fd]">{symbol}</span>
                  <span className="mt-2 font-mono text-xs text-[#9aa6bb]">{element.name}</span>
                  {selected && (
                    <span className="absolute bottom-2 right-2 text-xs text-[#7bd0ff]">◉</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#94a3b8]/10 pt-5 font-mono text-[10px] text-[#68758e]">
            <span>Viewing 6 of 118 elements</span>
            <button
              type="button"
              onClick={() => setShowPeriodicTable(true)}
              className="text-[#7bd0ff] hover:text-[#c4e7ff]"
            >
              Browse all →
            </button>
          </div>
        </div>
      </section>

      {showPeriodicTable && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#060e20]/85 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Periodic table"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowPeriodicTable(false);
          }}
        >
          <section className="materia-panel max-h-[90vh] w-full max-w-6xl overflow-auto rounded-xl p-5 sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="materia-label">Reference database</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#dae2fd]">Periodic table</h2>
                <p className="materia-muted mt-2 text-sm">
                  Select an element to assign it to the active composition slot.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPeriodicTable(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-[#94a3b8]/25 bg-[#222a3d] font-mono text-[#c4c6cd] hover:border-[#7bd0ff] hover:text-[#7bd0ff]"
                aria-label="Close periodic table"
              >
                ×
              </button>
            </div>
            <PeriodicTable
              selectedSymbols={draft.assignments.filter((v): v is string => v !== null)}
              onPick={(symbol) => {
                pickElement(symbol);
                setShowPeriodicTable(false);
              }}
            />
          </section>
        </div>
      )}
    </div>
  );
}
