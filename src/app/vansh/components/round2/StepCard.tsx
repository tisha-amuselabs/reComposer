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
      className={`flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold dark:bg-zinc-800">
        {index + 1}
      </span>
      <div className="flex-1">
        <p className="font-medium">{step.label}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{step.description}</p>
      </div>
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none rounded p-2 text-lg text-zinc-400 hover:text-zinc-700 active:cursor-grabbing dark:hover:text-zinc-200"
        aria-label={`Drag to reorder ${step.label}`}
      >
        ⠿
      </button>
    </li>
  );
}
