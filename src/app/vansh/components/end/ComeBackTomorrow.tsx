"use client";

import { useEffect, useState } from "react";

function timeUntilMidnight(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const diffMs = next.getTime() - now.getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  const minutes = Math.floor((diffMs % 3_600_000) / 60_000);
  return `${hours}h ${minutes}m`;
}

export function ComeBackTomorrow() {
  const [label, setLabel] = useState(timeUntilMidnight());

  useEffect(() => {
    const id = setInterval(() => setLabel(timeUntilMidnight()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="text-sm text-zinc-500 dark:text-zinc-400">
      Next item of the day in {label}. Come back tomorrow!
    </p>
  );
}
