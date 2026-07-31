"use client";

import type { ItemOfDay } from "../../types/item";
import type { Round3Guess, Round3State } from "../../types/game-state";
import { EraSlider } from "./EraSlider";
import { WorldMapGuesser } from "./WorldMapGuesser";
import { Round3Results } from "./Round3Results";
import { Button } from "../Button";

export function Round3({
  item,
  round3,
  onUpdateGuess,
  onSubmit,
  onContinue,
}: {
  item: ItemOfDay;
  round3: Round3State;
  onUpdateGuess: (partial: Partial<Round3Guess>) => void;
  onSubmit: () => void;
  onContinue: () => void;
}) {
  if (round3.submitted) {
    return <Round3Results item={item} round3={round3} onContinue={onContinue} />;
  }

  const year = round3.guess.year ?? Math.round((item.origin.minYear + item.origin.maxYear) / 2);
  const hasLocation = round3.guess.lat !== null && round3.guess.lng !== null;

  return (
    <div>
      <div className="mb-7">
        <p className="materia-label">Stage 03 // Discovery history</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#dae2fd]">
          Locate the origin
        </h2>
        <p className="materia-muted mt-2 max-w-2xl text-sm leading-6">
          Identify the first known production coordinates and select the corresponding era.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_22rem]">
        <section className="materia-panel overflow-hidden rounded-xl p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="materia-label">Coordinate array</p>
              <h3 className="mt-2 text-xl font-semibold text-[#dae2fd]">Discovery globe</h3>
            </div>
            <span className="rounded-sm border border-[#7bd0ff]/25 bg-[#7bd0ff]/5 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-[#7bd0ff]">
              {hasLocation ? "Coordinates locked" : "Awaiting coordinates"}
            </span>
          </div>
          <WorldMapGuesser
            guessLat={round3.guess.lat}
            guessLng={round3.guess.lng}
            onGuess={(lat, lng) => onUpdateGuess({ lat, lng })}
          />
        </section>

        <aside className="materia-panel flex flex-col rounded-xl p-5 sm:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#8e9ab1]">
            Target material
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-[#dae2fd]">{item.name}</h3>
          <div className="my-7 h-px bg-[#94a3b8]/12" />
          <p className="text-sm leading-6 text-[#c4c6cd]">
            Select the primary location where this material entered documented production.
          </p>
          <div className="mt-auto space-y-3 pt-10">
            <div className="rounded-sm border border-[#94a3b8]/25 bg-[#0b1326]/60 p-4 font-mono text-sm uppercase tracking-wider text-[#c4c6cd]">
              Region{" "}
              <span className="float-right text-[#7bd0ff]">{hasLocation ? "SET" : "--"}</span>
            </div>
            <div className="rounded-sm border border-[#94a3b8]/25 bg-[#0b1326]/60 p-4 font-mono text-sm uppercase tracking-wider text-[#c4c6cd]">
              Era <span className="float-right text-[#7bd0ff]">{year}</span>
            </div>
          </div>
        </aside>
      </div>

      <section className="materia-panel mt-6 rounded-xl p-5 sm:p-7">
        <p className="materia-label mb-5">Temporal calibration</p>
        <EraSlider
          value={year}
          minYear={item.origin.minYear}
          maxYear={item.origin.maxYear}
          onChange={(y) => onUpdateGuess({ year: y })}
        />
      </section>

      <div className="mt-6 flex justify-end">
        <Button disabled={!hasLocation} onClick={onSubmit}>
          Confirm selection
        </Button>
      </div>
    </div>
  );
}
