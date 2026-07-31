import type { ItemOfDay } from "../../types/item";
import type { Round2State } from "../../types/game-state";
import { Button } from "../Button";

export function Round2Results({
  item,
  round2,
  onContinue,
}: {
  item: ItemOfDay;
  round2: Round2State;
  onContinue: () => void;
}) {
  const stepById = Object.fromEntries(item.steps.map((s) => [s.id, s]));

  return (
    <section className="materia-panel flex flex-col gap-7 rounded-xl p-5 sm:p-8">
      <div>
        <p className="materia-label">Stage 02 // Reaction complete</p>
        <h2 className="mt-3 text-2xl font-semibold text-[#dae2fd]">Sequence results</h2>
      </div>
      <div className="grid gap-7 lg:grid-cols-2">
        <div>
        <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-[#8e9ab1]">
          Your order
        </h3>
        <ol className="flex flex-col gap-2.5">
          {round2.order.map((id, i) => {
            const color = round2.feedback?.[i] ?? "gray";
            const isGreen = color === "green";
            return (
              <li
                key={id}
                className={`flex items-center gap-3 rounded-sm border p-3 ${
                  isGreen ? "border-[#2dd4bf]/60 bg-[#2dd4bf]/8" : "border-[#94a3b8]/18 bg-[#0b1326]/45"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm font-mono text-xs font-bold ${
                    isGreen ? "bg-[#2dd4bf] text-[#042f2e]" : "bg-[#2d3449] text-[#c4c6cd]"
                  }`}
                >
                  {i + 1}
                </span>
                <p className="text-sm font-medium text-[#dae2fd]">{stepById[id]?.label}</p>
              </li>
            );
          })}
        </ol>
      </div>

        <div>
        <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-[#8e9ab1]">
          Correct order
        </h3>
        <ol className="flex flex-col gap-2.5">
          {item.steps.map((step, i) => (
            <li
              key={step.id}
              className="flex items-center gap-3 rounded-sm border border-[#94a3b8]/18 bg-[#0b1326]/45 p-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-[#2d3449] font-mono text-xs font-bold text-[#7bd0ff]">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-[#dae2fd]">{step.label}</p>
                <p className="mt-1 text-xs text-[#8e9ab1]">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        </div>
      </div>

      <Button onClick={onContinue}>Proceed to history</Button>
    </section>
  );
}
