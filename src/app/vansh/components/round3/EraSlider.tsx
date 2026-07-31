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
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-500 dark:text-zinc-400">{minYear}</span>
        <span className="font-mono text-lg font-bold">{value}</span>
        <span className="text-zinc-500 dark:text-zinc-400">{maxYear}</span>
      </div>
      <input
        type="range"
        min={minYear}
        max={maxYear}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-zinc-900 dark:accent-zinc-100"
      />
    </div>
  );
}
