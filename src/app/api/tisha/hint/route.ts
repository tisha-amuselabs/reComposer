import { pickHint } from "@/app/tisha/_lib/hints";
import { findPuzzle } from "@/app/tisha/_lib/puzzles";
import type { HintLevel, ItemId } from "@/app/tisha/_lib/types";

export const dynamic = "force-dynamic";

type HintBody = {
  puzzleId?: string;
  inventory?: ItemId[];
  usedHintIds?: string[];
  minLevel?: HintLevel;
};

async function maybePolishWithAi(
  baseText: string,
  eraPlace: string,
  targetLabel: string,
): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return baseText;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 120,
        messages: [
          {
            role: "system",
            content:
              "You are a laconic laboratory notebook from the historical period given. Rewrite the hint in one or two short sentences. Keep the same meaning and difficulty—do not add new steps or spoil beyond what the hint already says. No quotes, no preamble.",
          },
          {
            role: "user",
            content: `Period: ${eraPlace}\nGoal: create ${targetLabel}\nHint to rewrite:\n${baseText}`,
          },
        ],
      }),
    });
    if (!res.ok) return baseText;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const polished = data.choices?.[0]?.message?.content?.trim();
    return polished || baseText;
  } catch {
    return baseText;
  }
}

export async function POST(request: Request) {
  let body: HintBody;
  try {
    body = (await request.json()) as HintBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const puzzle = body.puzzleId ? findPuzzle(body.puzzleId) : undefined;
  if (!puzzle) {
    return Response.json({ error: "Unknown puzzle" }, { status: 404 });
  }

  const inventory = body.inventory ?? [];
  const usedHintIds = body.usedHintIds ?? [];
  const minLevel = body.minLevel ?? 1;

  const hint = pickHint(puzzle.hints, inventory, usedHintIds, minLevel);
  if (!hint) {
    return Response.json({
      exhausted: true,
      text: null,
      hintId: null,
      level: null,
      source: "authored",
    });
  }

  const text = await maybePolishWithAi(
    hint.text,
    puzzle.eraPlace,
    puzzle.targetLabel,
  );

  return Response.json({
    exhausted: false,
    text,
    hintId: hint.id,
    level: hint.level,
    source: process.env.OPENAI_API_KEY ? "ai" : "authored",
  });
}
