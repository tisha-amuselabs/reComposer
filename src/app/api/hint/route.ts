import { NextResponse } from "next/server";
import { itemById } from "../../vansh/data/items";
import { buildHintPrompt, type HintContext, type HintRound } from "./prompt";

const VALID_ROUNDS: HintRound[] = ["round1", "round2", "round3"];

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Hints aren't configured yet — add GEMINI_API_KEY to your environment." },
      { status: 503 }
    );
  }

  let body: { itemId?: string; round?: HintRound; context?: HintContext };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { itemId, round, context } = body;
  if (!itemId || !round || !context || !VALID_ROUNDS.includes(round)) {
    return NextResponse.json({ error: "Missing or invalid itemId, round, or context." }, { status: 400 });
  }

  const item = itemById(itemId);
  const prompt = buildHintPrompt(item, round, context);
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  let geminiRes: Response;
  try {
    geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 400,
            temperature: 0.8,
            // gemini-2.5-* models "think" before answering by default, and
            // those thinking tokens count against maxOutputTokens — without
            // this, a small budget gets consumed entirely by reasoning and
            // the visible answer comes back empty or cut off.
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );
  } catch (err) {
    console.error("[api/hint] fetch to Gemini failed:", err);
    return NextResponse.json({ error: "Couldn't reach the hint service." }, { status: 502 });
  }

  const data = await geminiRes.json().catch(() => null);

  if (!geminiRes.ok) {
    console.error("[api/hint] Gemini returned an error:", geminiRes.status, JSON.stringify(data));
    return NextResponse.json({ error: "Hint service is unavailable right now." }, { status: 502 });
  }

  const candidate = data?.candidates?.[0];
  const hint: string | undefined = candidate?.content?.parts
    ?.map((part: { text?: string }) => part.text ?? "")
    .join("")
    .trim();

  console.log(
    "[api/hint]",
    JSON.stringify({
      model,
      round,
      itemId,
      finishReason: candidate?.finishReason,
      hintLength: hint?.length ?? 0,
    })
  );

  if (!hint) {
    console.error("[api/hint] Empty hint text. Full response:", JSON.stringify(data));
    return NextResponse.json({ error: "No hint came back — try again." }, { status: 502 });
  }

  return NextResponse.json({ hint });
}
