export function EraSlider({
  value,
  minYear,
  maxYear,
  onChange,
}: {
  value: number;
  minYear: number;
  maxYear: number;
  onChange: (year: number) => void;
}) {
  const selectedPercent = ((value - minYear) / (maxYear - minYear)) * 100;
  const ticks = Array.from({ length: 4 }, (_, index) =>
    Math.round(minYear + ((maxYear - minYear) * index) / 3)
  );

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex items-center justify-between font-mono text-xs text-[#c4c6cd]">
        {ticks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
      <div className="relative h-12">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#444f64]" />
        <div
          className="pointer-events-none absolute top-1/2 h-10 w-20 -translate-x-1/2 -translate-y-1/2 border border-[#7bd0ff]/40 bg-[#7bd0ff]/10"
          style={{ left: `${selectedPercent}%` }}
        >
          <span className="absolute left-1/2 top-1/2 h-5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-[#7bd0ff] shadow-[0_0_8px_#7bd0ff]" />
        </div>
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="materia-era-input absolute inset-0 z-10 w-full cursor-ew-resize"
          aria-label="Select discovery year"
        />
      </div>
      <p className="mt-2 text-center font-mono text-sm uppercase tracking-[0.08em] text-[#7bd0ff]">
        Selected: {value}
      </p>
    </div>
  );
}
