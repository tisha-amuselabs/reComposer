import type { ItemOfDay } from "../../types/item";
import type { Round3State } from "../../types/game-state";
import { TEMPERATURE_BAND_COLORS, kmRatio, temperatureBand, yearRatio } from "./round3.logic";
import { Button } from "../Button";
import { WorldGlobeResults } from "./WorldMapGuesser";

export function Round3Results({
  item,
  round3,
  onContinue,
}: {
  item: ItemOfDay;
  round3: Round3State;
  onContinue: () => void;
}) {
  const yearBand =
    round3.yearDiff !== null
      ? temperatureBand(yearRatio(round3.yearDiff))
      : null;
  const kmBand = round3.kmDiff !== null ? temperatureBand(kmRatio(round3.kmDiff)) : null;

  return (
    <section className="materia-panel flex flex-col gap-7 rounded-xl p-5 sm:p-8">
      <div>
        <p className="materia-label">Stage 03 // Coordinates resolved</p>
        <h2 className="mt-3 text-2xl font-semibold text-[#dae2fd]">Discovery results</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="materia-subpanel rounded-sm p-4 text-center">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#8e9ab1]">
            Year guess
          </p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#dae2fd]">{round3.guess.year ?? "—"}</p>
          {round3.yearDiff !== null && yearBand && (
            <p
              className={`mt-2 inline-block rounded-sm px-2 py-1 font-mono text-xs font-semibold text-white ${TEMPERATURE_BAND_COLORS[yearBand]}`}
            >
              {round3.yearDiff} years off
            </p>
          )}
        </div>
        <div className="materia-subpanel rounded-sm p-4 text-center">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#8e9ab1]">
            Location guess
          </p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#dae2fd]">
            {round3.kmDiff !== null ? `${Math.round(round3.kmDiff)} km` : "—"}
          </p>
          {kmBand && (
            <p
              className={`mt-2 inline-block rounded-sm px-2 py-1 font-mono text-xs font-semibold text-white ${TEMPERATURE_BAND_COLORS[kmBand]}`}
            >
              off target
            </p>
          )}
        </div>
      </div>

      <WorldGlobeResults
        guessLat={round3.guess.lat}
        guessLng={round3.guess.lng}
        trueLat={item.origin.lat}
        trueLng={item.origin.lng}
      />

      <p className="materia-subpanel rounded-sm p-4 text-sm text-[#c4c6cd]">
        The real answer: <strong>{item.origin.yearLabel}</strong>, {item.origin.locationName}.
      </p>

      <div className="materia-subpanel rounded-sm p-4">
        <p className="materia-label text-[#8e9ab1]">Why here and then?</p>
        <p className="mt-2 text-sm leading-6 text-[#c4c6cd]">{item.originExplanation}</p>
      </div>

      <Button onClick={onContinue}>Complete synthesis</Button>
    </section>
  );
}
