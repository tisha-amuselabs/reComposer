import { pickProcessHint } from "@/app/vansh/components/round2/chamber.logic";
import { ITEMS } from "@/app/vansh/data/items";
import type { HintLevel } from "@/app/vansh/types/item";

export const dynamic = "force-dynamic";

type HintBody = {
  itemId?: string;
  inventory?: string[];
  usedHintIds?: string[];
  minLevel?: HintLevel;
};

async function maybePolishWithAi(
  baseText: string,
  itemName: string,
  originLabel: string,
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
              "You are a terse materials-science lab notebook. Rewrite the hint in one or two short sentences with a cool technical tone. Keep the same meaning and difficulty—do not add new steps or spoil beyond what the hint already says. No quotes, no preamble.",
          },
          {
            role: "user",
            content: `Item: ${itemName}\nOrigin context: ${originLabel}\nHint to rewrite:\n${baseText}`,
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

  const found = body.itemId
    ? ITEMS.find((entry) => entry.id === body.itemId)
    : undefined;
  if (!found) {
    return Response.json({ error: "Unknown item" }, { status: 404 });
  }

  const inventory = body.inventory ?? [];
  const usedHintIds = body.usedHintIds ?? [];
  const minLevel = body.minLevel ?? 1;

  const hint = pickProcessHint(
    found.processLab.hints,
    inventory,
    usedHintIds,
    minLevel,
  );
  if (!hint) {
    return Response.json({
      exhausted: true,
      text: null,
      hintId: null,
      level: null,
      source: "authored",
    });
  }

  const originLabel = `${found.origin.yearLabel} · ${found.origin.locationName}`;
  const text = await maybePolishWithAi(hint.text, found.name, originLabel);

  return Response.json({
    exhausted: false,
    text,
    hintId: hint.id,
    level: hint.level,
    source: process.env.OPENAI_API_KEY ? "ai" : "authored",
  });
}
