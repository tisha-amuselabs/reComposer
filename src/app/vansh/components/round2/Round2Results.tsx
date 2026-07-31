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
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          Your order
        </h3>
        <ol className="flex flex-col gap-2">
          {round2.order.map((id, i) => {
            const color = round2.feedback?.[i] ?? "gray";
            const isGreen = color === "green";
            return (
              <li
                key={id}
                className={`flex items-center gap-3 rounded-lg border-2 p-3 ${
                  isGreen ? "border-green-500" : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                    isGreen ? "bg-green-500" : "bg-zinc-400 dark:bg-zinc-600"
                  }`}
                >
                  {i + 1}
                </span>
                <p className="font-medium">{stepById[id]?.label}</p>
              </li>
            );
          })}
        </ol>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          Correct order
        </h3>
        <ol className="flex flex-col gap-2">
          {item.steps.map((step, i) => (
            <li
              key={step.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold dark:bg-zinc-800">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{step.label}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <Button onClick={onContinue}>Continue to Round 3</Button>
    </div>
  );
}
