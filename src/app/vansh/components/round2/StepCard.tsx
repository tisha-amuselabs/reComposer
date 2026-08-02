"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ManufacturingStep } from "../../types/item";

export function StepCard({
  id,
  index,
  step,
}: {
  id: string;
  index: number;
  step: ManufacturingStep;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-4 rounded-sm border border-[#94a3b8]/16 bg-[#1b2438]/90 p-4 transition-colors hover:border-[#7bd0ff]/40 hover:bg-[#222d43] ${
        isDragging ? "z-20 opacity-60 shadow-2xl shadow-black/50" : ""
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-[#94a3b8]/15 bg-[#0b1326] font-mono text-sm font-semibold text-[#7bd0ff]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex-1">
        <p className="font-medium text-[#dae2fd]">{step.label}</p>
        <p className="mt-1 text-xs leading-5 text-[#8e9ab1]">{step.description}</p>
      </div>
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none rounded-sm border border-transparent p-2 font-mono text-lg text-[#68758e] transition-colors hover:border-[#94a3b8]/20 hover:text-[#7bd0ff] active:cursor-grabbing"
        aria-label={`Drag to reorder ${step.label}`}
      >
        ⠿
      </button>
    </li>
  );
}
