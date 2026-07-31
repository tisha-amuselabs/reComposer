export type SlotColor = "green" | "yellow" | "gray";
export type TemperatureBand = "green" | "yellowgreen" | "yellow" | "orange" | "red";
export type GamePhase = "round1" | "round2" | "round3" | "end";

export interface Round1State {
  assignments: (string | null)[];
  submitted: boolean;
  feedback: SlotColor[] | null;
}

export interface Round2State {
  shuffledOrder: string[];
  order: string[];
  submitted: boolean;
  feedback: SlotColor[] | null;
}

export interface Round3Guess {
  year: number | null;
  lat: number | null;
  lng: number | null;
}

export interface Round3State {
  guess: Round3Guess;
  submitted: boolean;
  yearDiff: number | null;
  kmDiff: number | null;
}

export interface DailyGameState {
  schemaVersion: 1;
  dateKey: string;
  itemId: string;
  phase: GamePhase;
  round1: Round1State;
  round2: Round2State;
  round3: Round3State;
}
