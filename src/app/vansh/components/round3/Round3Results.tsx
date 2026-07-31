import type { ItemOfDay } from "../../types/item";
import type { Round3State } from "../../types/game-state";
import {
  COUNTRY_PATHS,
  GRATICULE_PATH,
  MAP_HEIGHT,
  MAP_WIDTH,
  OUTLINE_PATH,
  latLngToPixel,
} from "./mapProjection";
import { TEMPERATURE_BAND_COLORS, kmRatio, temperatureBand, yearRatio } from "./round3.logic";
import { Button } from "../Button";

export function Round3Results({
  item,
  round3,
  onContinue,
}: {
  item: ItemOfDay;
  round3: Round3State;
  onContinue: () => void;
}) {
  const guessPin =
    round3.guess.lat !== null && round3.guess.lng !== null
      ? latLngToPixel(round3.guess.lat, round3.guess.lng)
      : null;
  const truePin = latLngToPixel(item.origin.lat, item.origin.lng);

  const yearBand =
    round3.yearDiff !== null
      ? temperatureBand(yearRatio(round3.yearDiff, item.origin.minYear, item.origin.maxYear))
      : null;
  const kmBand = round3.kmDiff !== null ? temperatureBand(kmRatio(round3.kmDiff)) : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-zinc-200 p-4 text-center dark:border-zinc-800">
          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Year guess
          </p>
          <p className="text-2xl font-bold">{round3.guess.year ?? "—"}</p>
          {round3.yearDiff !== null && yearBand && (
            <p
              className={`mt-1 inline-block rounded px-2 py-0.5 text-sm font-semibold text-white ${TEMPERATURE_BAND_COLORS[yearBand]}`}
            >
              {round3.yearDiff} years off
            </p>
          )}
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 text-center dark:border-zinc-800">
          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Location guess
          </p>
          <p className="text-2xl font-bold">
            {round3.kmDiff !== null ? `${Math.round(round3.kmDiff)} km` : "—"}
          </p>
          {kmBand && (
            <p
              className={`mt-1 inline-block rounded px-2 py-0.5 text-sm font-semibold text-white ${TEMPERATURE_BAND_COLORS[kmBand]}`}
            >
              off target
            </p>
          )}
        </div>
      </div>

      <div className="aspect-[2.1/1] w-full overflow-hidden rounded-2xl border-2 border-sky-200 shadow-inner dark:border-sky-900">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full fill-sky-100 dark:fill-slate-900"
          role="img"
          aria-label="Map showing your guess versus the true location"
        >
          <path d={OUTLINE_PATH} />
          <path
            d={GRATICULE_PATH}
            className="fill-none stroke-sky-300/50 dark:stroke-sky-100/10"
            strokeWidth={0.5}
          />
          {COUNTRY_PATHS.map((c) => (
            <path
              key={c.id}
              d={c.d}
              className="fill-emerald-600/90 stroke-emerald-900/30 dark:fill-emerald-700/80 dark:stroke-emerald-950/60"
              strokeWidth={0.6}
            />
          ))}
          {guessPin && truePin && (
            <line
              x1={guessPin.x}
              y1={guessPin.y}
              x2={truePin.x}
              y2={truePin.y}
              className="stroke-zinc-500"
              strokeDasharray="4 3"
            />
          )}
          {guessPin && (
            <circle
              cx={guessPin.x}
              cy={guessPin.y}
              r={7}
              className="fill-rose-500 stroke-2 stroke-white drop-shadow-md dark:stroke-zinc-900"
            />
          )}
          {truePin && (
            <circle
              cx={truePin.x}
              cy={truePin.y}
              r={7}
              className="fill-yellow-400 stroke-2 stroke-white drop-shadow-md dark:stroke-zinc-900"
            />
          )}
        </svg>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        The real answer: <strong>{item.origin.yearLabel}</strong>, {item.origin.locationName}.
      </p>

      <Button onClick={onContinue}>See trivia</Button>
    </div>
  );
}
