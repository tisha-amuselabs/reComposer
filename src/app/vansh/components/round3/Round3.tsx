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
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span aria-hidden>🗺️</span> Round 3 — When and where?
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Slide to your best guess year, then tap the map for where you think{" "}
          {item.name.toLowerCase()} was first made.
        </p>
      </div>

      <EraSlider
        value={year}
        minYear={item.origin.minYear}
        maxYear={item.origin.maxYear}
        onChange={(y) => onUpdateGuess({ year: y })}
      />

      <WorldMapGuesser
        guessLat={round3.guess.lat}
        guessLng={round3.guess.lng}
        onGuess={(lat, lng) => onUpdateGuess({ lat, lng })}
      />

      <Button disabled={!hasLocation} onClick={onSubmit}>
        Submit guess
      </Button>
    </div>
  );
}
