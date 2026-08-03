// Backdoor for demos: /vansh?item=<id> plays that item directly, in an
// ephemeral session that never reads or writes the daily localStorage save,
// so it can't collide with (or get blocked by) real daily progress.

export function getDemoItemId(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("item");
}

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.has("item") || params.has("demo");
}
