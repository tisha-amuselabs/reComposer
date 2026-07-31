import type { Metadata } from "next";
import { GameLoader } from "./GameLoader";

export const metadata: Metadata = {
  title: "Item of the Day",
  description: "Guess today's item's composition, process, and origin — Wordle style.",
};

export default function VanshPage() {
  return (
    <div className="flex flex-1 flex-col">
      <GameLoader />
    </div>
  );
}
