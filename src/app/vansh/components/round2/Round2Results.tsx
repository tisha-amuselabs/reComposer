import type { ItemOfDay } from "../../types/item";
import type { Round2State } from "../../types/game-state";
import { Button } from "../Button";

export function Round2Results({
  item,
  round2,
  onReplay,
}: {
  item: ItemOfDay;
  round2: Round2State;
  onReplay: () => void;
}) {
  const unlocked = new Set(round2.completedSteps);
  const hits = round2.feedback?.filter((c) => c === "green").length ?? 0;

  return (
    <section className="materia-panel flex flex-col gap-7 rounded-xl p-5 sm:p-8">
      <div>
        <p className="materia-label">Stage 02 // How is it made?</p>
        <h2 className="mt-3 text-3xl font-semibold text-[#dae2fd]">
          Manufacturing results
        </h2>
        <p className="mt-2 text-sm text-[#8e9ab1]">
          {hits}/{item.steps.length} manufacturing operations reconstructed
          {round2.synthesized ? " · target synthesized" : ""}.
        </p>
      </div>

      <div className="grid gap-7 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-[#8e9ab1]">
            Your chamber path
          </h3>
          {round2.completedSteps.length === 0 ? (
            <p className="rounded-sm border border-[#94a3b8]/18 bg-[#0b1326]/45 p-4 text-sm text-[#8e9ab1]">
              No manufacturing steps were unlocked.
            </p>
          ) : (
            <ol className="flex flex-col gap-2.5">
              {round2.completedSteps.map((id, i) => {
                const step = item.steps.find((s) => s.id === id);
                const firstIndex = item.steps.findIndex((s) => s.id === id);
                const inOrder =
                  round2.feedback?.[firstIndex] === "green" || unlocked.has(id);
                return (
                  <li
                    key={`${id}-${i}`}
                    className={`flex items-center gap-3 rounded-sm border p-3 ${
                      inOrder
                        ? "border-[#2dd4bf]/60 bg-[#2dd4bf]/8"
                        : "border-[#94a3b8]/18 bg-[#0b1326]/45"
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-[#2dd4bf] font-mono text-xs font-bold text-[#042f2e]">
                      {i + 1}
                    </span>
                    <p className="text-sm font-medium text-[#dae2fd]">
                      {step?.label ?? id}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-[#8e9ab1]">
            Canonical process
          </h3>
          <ol className="flex flex-col gap-2.5">
            {item.steps.map((step, i) => {
              const hit = round2.feedback?.[i] === "green";
              return (
                <li
                  key={step.id}
                  className={`flex items-start gap-3 rounded-sm border p-3 ${
                    hit
                      ? "border-[#2dd4bf]/40 bg-[#2dd4bf]/6"
                      : "border-[#94a3b8]/18 bg-[#0b1326]/45"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm font-mono text-xs font-bold ${
                      hit
                        ? "bg-[#2dd4bf] text-[#042f2e]"
                        : "bg-[#2d3449] text-[#7bd0ff]"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#dae2fd]">
                      {step.label}
                    </p>
                    <p className="mt-1 text-xs text-[#8e9ab1]">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <Button variant="ghost" onClick={onReplay}>
        Play this stage again
      </Button>
    </section>
  );
}
