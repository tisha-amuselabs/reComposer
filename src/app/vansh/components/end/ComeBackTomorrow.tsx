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
    <div className="rounded-sm border border-[#94a3b8]/20 bg-[#222a3d]/80 px-6 py-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-[#8e9ab1]">Next analysis</p>
      <p className="mt-2 font-mono text-lg font-semibold text-[#b9c8de]">{label}</p>
    </div>
  );
}
