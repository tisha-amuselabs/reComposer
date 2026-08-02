import type { Metadata } from "next";
import { GameLoader } from "./GameLoader";
import "./vansh.css";

export const metadata: Metadata = {
  title: "Materia — Item of the Day",
  description: "Analyze the composition, manufacture, and history of an everyday material.",
};

export default function VanshPage() {
  return <GameLoader />;
}
