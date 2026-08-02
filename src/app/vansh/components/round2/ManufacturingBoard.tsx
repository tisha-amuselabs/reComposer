"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ManufacturingStep } from "../../types/item";
import { StepCard } from "./StepCard";

export function ManufacturingBoard({
  steps,
  order,
  onReorder,
}: {
  steps: ManufacturingStep[];
  order: string[];
  onReorder: (order: string[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const stepById = Object.fromEntries(steps.map((s) => [s.id, s]));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(String(active.id));
    const newIndex = order.indexOf(String(over.id));
    onReorder(arrayMove(order, oldIndex, newIndex));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <ol className="flex flex-col gap-3 rounded-lg border border-dashed border-[#7bd0ff]/18 bg-[#060e20]/30 p-3 sm:p-5">
          {order.map((id, index) => (
            <StepCard key={id} id={id} index={index} step={stepById[id]} />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}
