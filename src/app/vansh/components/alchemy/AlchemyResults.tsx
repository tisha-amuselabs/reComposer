import type { ItemOfDay } from "../../types/item";
import type { AlchemyState } from "../../types/game-state";
import { Button } from "../Button";

export function AlchemyResults({
  item,
  alchemy,
  onContinue,
}: {
  item: ItemOfDay;
  alchemy: AlchemyState;
  onContinue: () => void;
}) {
  const recipe = item.alchemy;

  return (
    <section className="materia-panel flex flex-col gap-7 rounded-xl p-5 sm:p-8">
      <div>
        <p className="materia-label">
          Stage 02 // {alchemy.solved ? "Synthesis complete" : "Synthesis ended"}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-[#dae2fd]">
          {alchemy.solved ? `You synthesized ${item.name}!` : "Recipe revealed"}
        </h2>
        <p className="materia-muted mt-2 text-sm">
          {alchemy.solved
            ? "Here's the full combination chain you discovered."
            : `Here's the real combination chain for ${item.name.toLowerCase()}.`}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-sm border border-[#7bd0ff]/30 bg-[#7bd0ff]/8 px-3 py-2 font-mono text-sm text-[#7bd0ff]">
            {alchemy.correctCount}/{alchemy.totalRequired} combinations
          </span>
          <span className="rounded-sm border border-[#94a3b8]/20 bg-[#222a3d] px-3 py-2 font-mono text-xs uppercase tracking-wider text-[#c4c6cd]">
            {alchemy.successRate}% success rate
          </span>
        </div>
      </div>

      <div>
        <p className="materia-label text-[#8e9ab1]">Combination chain</p>
        <ol className="mt-3 flex flex-col gap-2">
          {recipe.combinations.map((combo, i) => {
            const [a, b] = combo.inputs;
            return (
              <li
                key={combo.result}
                className="flex flex-wrap items-center gap-2 rounded-sm border border-[#94a3b8]/15 bg-[#0b1326]/60 p-3 text-sm text-[#c4c6cd]"
              >
                <span className="font-mono text-[10px] text-[#68758e]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  {recipe.nodes[a]?.emoji} {recipe.nodes[a]?.label}
                </span>
                <span className="text-[#68758e]">+</span>
                <span>
                  {recipe.nodes[b]?.emoji} {recipe.nodes[b]?.label}
                </span>
                <span className="text-[#68758e]">→</span>
                <span className="text-[#dae2fd]">
                  {recipe.nodes[combo.result]?.emoji} {recipe.nodes[combo.result]?.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="materia-subpanel rounded-sm p-4">
        <p className="materia-label text-[#8e9ab1]">Why this process?</p>
        <p className="mt-2 text-sm leading-6 text-[#c4c6cd]">{item.processExplanation}</p>
      </div>

      <Button onClick={onContinue}>Continue to history</Button>
    </section>
  );
}
