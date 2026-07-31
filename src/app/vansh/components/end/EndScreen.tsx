import type { ItemOfDay } from "../../types/item";
import type { DailyGameState } from "../../types/game-state";
import { TriviaReveal } from "./TriviaReveal";
import { ShareCard } from "./ShareCard";
import { ComeBackTomorrow } from "./ComeBackTomorrow";

export function EndScreen({ item, state }: { item: ItemOfDay; state: DailyGameState }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span aria-hidden>🎉</span> That&rsquo;s a wrap!
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Here&rsquo;s everything about today&rsquo;s item: {item.name}.
        </p>
      </div>
      <TriviaReveal trivia={item.trivia} />
      <ShareCard item={item} state={state} />
      <ComeBackTomorrow />
    </div>
  );
}
