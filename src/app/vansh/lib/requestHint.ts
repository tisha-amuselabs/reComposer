export type HintRound = "round1" | "round2" | "round3";

export async function requestHint(
  itemId: string,
  round: HintRound,
  context: unknown
): Promise<string> {
  const res = await fetch("/api/hint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, round, context }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Couldn't get a hint right now.");
  }

  return data.hint as string;
}
