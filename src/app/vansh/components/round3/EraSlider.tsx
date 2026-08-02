"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent,
} from "react";

const PIXELS_PER_YEAR = 2;
const TICK_INTERVAL = 10;
const LABEL_INTERVAL = 100;

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
  const rulerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startScrollLeft: number } | null>(
    null
  );
  const scaleWidth = (maxYear - minYear) * PIXELS_PER_YEAR;
  const ticks = Array.from(
    { length: Math.floor((maxYear - minYear) / TICK_INTERVAL) + 1 },
    (_, index) => minYear + index * TICK_INTERVAL
  );

  const boundedYear = useCallback(
    (nextYear: number) => Math.min(maxYear, Math.max(minYear, Math.round(nextYear))),
    [maxYear, minYear]
  );

  function scrollToYear(nextYear: number, behavior: ScrollBehavior = "auto") {
    rulerRef.current?.scrollTo({
      left: (boundedYear(nextYear) - minYear) * PIXELS_PER_YEAR,
      behavior,
    });
  }

  useEffect(() => {
    const ruler = rulerRef.current;
    if (!ruler) return;
    const expectedScrollLeft = (boundedYear(value) - minYear) * PIXELS_PER_YEAR;
    if (Math.abs(ruler.scrollLeft - expectedScrollLeft) > 1) {
      ruler.scrollLeft = expectedScrollLeft;
    }
  }, [boundedYear, minYear, value]);

  function updateFromScroll() {
    const ruler = rulerRef.current;
    if (!ruler) return;
    const nextYear = boundedYear(minYear + ruler.scrollLeft / PIXELS_PER_YEAR);
    if (nextYear !== value) onChange(nextYear);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const ruler = event.currentTarget;
    ruler.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: ruler.scrollLeft,
    };
    ruler.dataset.dragging = "true";
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.currentTarget.scrollLeft = drag.startScrollLeft - (event.clientX - drag.startX);
  }

  function stopDragging(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.scrollLeft += event.deltaX || event.deltaY;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const increments: Partial<Record<string, number>> = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -25,
      PageUp: 25,
    };
    const increment = increments[event.key];

    if (increment !== undefined) {
      event.preventDefault();
      scrollToYear(value + increment, "smooth");
    } else if (event.key === "Home") {
      event.preventDefault();
      scrollToYear(minYear, "smooth");
    } else if (event.key === "End") {
      event.preventDefault();
      scrollToYear(maxYear, "smooth");
    }
  }

  return (
    <div>
      <div className="relative">
        <div className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 border-x-[6px] border-t-[9px] border-x-transparent border-t-[#7bd0ff] drop-shadow-[0_0_6px_#7bd0ff]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 -translate-x-1/2 border-x-[6px] border-b-[9px] border-x-transparent border-b-[#7bd0ff] drop-shadow-[0_0_6px_#7bd0ff]" />
        <div className="pointer-events-none absolute inset-y-3 left-1/2 z-10 w-px -translate-x-1/2 bg-[#7bd0ff]/35 shadow-[0_0_8px_#7bd0ff]" />

        <div
          ref={rulerRef}
          role="slider"
          tabIndex={0}
          aria-label="Discovery year"
          aria-valuemin={minYear}
          aria-valuemax={maxYear}
          aria-valuenow={value}
          aria-valuetext={`${value} AD`}
          onScroll={updateFromScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          className="materia-era-ruler h-28 cursor-grab overflow-x-scroll rounded-xl border border-[#94a3b8]/25 bg-[#111a2d]/85 outline-none backdrop-blur-xl focus-visible:border-[#7bd0ff]/60"
        >
          <div
            className="relative h-full"
            style={{
              width: `${scaleWidth}px`,
              marginInline: "50%",
            }}
          >
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#94a3b8]/28" />
            {ticks.map((year) => {
              const isLabel = year % LABEL_INTERVAL === 0;
              return (
                <div
                  key={year}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(year - minYear) * PIXELS_PER_YEAR}px` }}
                >
                  <span
                    className={`block w-px ${
                      isLabel
                        ? "h-11 bg-[#b9c8de]"
                        : "h-5 bg-[#94a3b8]/75"
                    }`}
                  />
                  {isLabel && (
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-[#111a2d] px-1.5 py-1 font-mono text-[10px] font-medium text-[#dae2fd]">
                      {year === 0 ? "0 AD" : year}
                    </span>
                  )}
                </div>
              );
            })}
            <div
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${scaleWidth}px` }}
            >
              <span className="block h-11 w-px bg-[#7bd0ff]" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-[#111a2d] px-1.5 py-1 font-mono text-[10px] text-[#7bd0ff]">
                {maxYear}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#68758e]">
          Drag scale // Scroll // Arrow keys
        </p>
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-[#8e9ab1]">
          Selected
          <input
            type="number"
            min={minYear}
            max={maxYear}
            step={1}
            value={value}
            onChange={(event) => {
              const nextYear = event.currentTarget.valueAsNumber;
              if (!Number.isFinite(nextYear)) return;
              const nextBoundedYear = boundedYear(nextYear);
              onChange(nextBoundedYear);
              scrollToYear(nextBoundedYear);
            }}
            className="w-24 rounded-sm border border-[#7bd0ff]/35 bg-[#0b1326] px-2 py-1.5 text-center text-sm text-[#7bd0ff] outline-none transition-colors focus:border-[#7bd0ff]"
            aria-label="Enter exact discovery year"
          />
          AD
        </label>
      </div>
    </div>
  );
}
