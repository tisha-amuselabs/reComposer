"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ItemOfDay } from "../../types/item";
import type { Round2State } from "../../types/game-state";
import { ActionsPanel } from "./ActionsPanel";
import { MaterialsPanel } from "./MaterialsPanel";
import {
  ReactionChamber,
  type ChamberInstance,
} from "./ReactionChamber";
import { HintPanel } from "./HintPanel";
import { Round2Results } from "./Round2Results";
import { Button } from "../Button";
import { applyProcessAction, materialName } from "./chamber.logic";

const POP_CLEAR_MS = 520;
const CELEBRATE_MS = 2200;

function newInstanceId() {
  return `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function Round2({
  item,
  round2,
  onReaction,
  onSubmit,
  onReplay,
}: {
  item: ItemOfDay;
  round2: Round2State;
  onReaction: (payload: {
    discoveries: string[];
    stepId?: string;
    synthesized?: boolean;
  }) => void;
  onSubmit: () => void;
  onReplay: () => void;
}) {
  const lab = item.processLab;
  const [instances, setInstances] = useState<ChamberInstance[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [hintText, setHintText] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [usedHintIds, setUsedHintIds] = useState<string[]>([]);
  const [hintsExhausted, setHintsExhausted] = useState(false);
  const [celebration, setCelebration] = useState<{
    title: string;
    detail: string;
  } | null>(null);

  const celebrateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedRef = useRef(round2.completedSteps);
  completedRef.current = round2.completedSteps;

  useEffect(() => {
    return () => {
      if (celebrateTimer.current) clearTimeout(celebrateTimer.current);
    };
  }, []);

  const locked = round2.submitted || round2.synthesized;

  const flashCelebration = useCallback((title: string, detail: string) => {
    if (celebrateTimer.current) clearTimeout(celebrateTimer.current);
    setCelebration({ title, detail });
    celebrateTimer.current = setTimeout(() => {
      setCelebration(null);
      celebrateTimer.current = null;
    }, CELEBRATE_MS);
  }, []);

  const placeMaterial = useCallback(
    (materialId: string) => {
      if (locked) return;
      setInstances((prev) => [
        ...prev,
        { instanceId: newInstanceId(), materialId },
      ]);
      setStatus(`Loaded ${materialName(lab.materials, materialId)}`);
    },
    [lab.materials, locked],
  );

  const toggleSelect = useCallback((instanceId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(instanceId)) {
        return prev.filter((id) => id !== instanceId);
      }
      if (prev.length >= 2) return [...prev.slice(1), instanceId];
      return [...prev, instanceId];
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  const applyAction = useCallback(
    (actionId: string) => {
      if (locked) return;
      const action = lab.actions.find((a) => a.id === actionId);
      if (!action) return;

      const selected = instances.filter((inst) =>
        selectedIds.includes(inst.instanceId),
      );
      if (selected.length !== action.arity) {
        setStatus(
          action.arity === 2
            ? `${action.name} needs two samples`
            : `${action.name} needs one sample`,
        );
        return;
      }

      const recipe = applyProcessAction(
        actionId,
        selected.map((s) => s.materialId),
        lab.recipes,
      );
      if (!recipe) {
        setStatus("No valid reaction for that selection");
        return;
      }

      const remove = new Set(selected.map((s) => s.instanceId));
      const spawned = recipe.results.map((materialId) => ({
        instanceId: newInstanceId(),
        materialId,
        popping: true,
      }));

      setInstances((prev) => [
        ...prev.filter((inst) => !remove.has(inst.instanceId)),
        ...spawned,
      ]);
      window.setTimeout(() => {
        const ids = new Set(spawned.map((s) => s.instanceId));
        setInstances((prev) =>
          prev.map((inst) =>
            ids.has(inst.instanceId) ? { ...inst, popping: false } : inst,
          ),
        );
      }, POP_CLEAR_MS);

      setSelectedIds([]);

      const isNewStep =
        Boolean(recipe.stepId) &&
        !completedRef.current.includes(recipe.stepId!);
      const hitTarget = recipe.results.includes(lab.targetId);

      onReaction({
        discoveries: recipe.results,
        stepId: recipe.stepId,
        synthesized: hitTarget,
      });

      const names = recipe.results
        .map((id) => materialName(lab.materials, id))
        .join(" · ");
      setStatus(`${action.name} → ${names}`);

      if (hitTarget) {
        flashCelebration(
          "Synthesis complete",
          `${materialName(lab.materials, lab.targetId)} is on the bench.`,
        );
        setStatus(
          `Target synthesized: ${materialName(lab.materials, lab.targetId)}`,
        );
      } else if (isNewStep && recipe.stepId) {
        const step = item.steps.find((s) => s.id === recipe.stepId);
        flashCelebration(
          step?.label ?? "Manufacturing step unlocked",
          step?.description ?? `Yielded ${names}.`,
        );
      }
    },
    [
      instances,
      selectedIds,
      lab,
      locked,
      onReaction,
      flashCelebration,
      item.steps,
    ],
  );

  const askHint = useCallback(async () => {
    if (hintLoading || hintsExhausted || locked) return;
    setHintLoading(true);
    try {
      const res = await fetch("/api/vansh/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          inventory: round2.inventory,
          usedHintIds,
          minLevel: 1,
        }),
      });
      const data = (await res.json()) as {
        exhausted?: boolean;
        text?: string | null;
        hintId?: string | null;
      };
      if (data.exhausted || !data.text || !data.hintId) {
        setHintsExhausted(true);
        setHintText("Notebook exhausted — trust the chamber readouts.");
      } else {
        setHintText(data.text);
        setUsedHintIds((prev) => [...prev, data.hintId!]);
      }
    } catch {
      setHintText("Telemetry offline — try the hint channel again shortly.");
    } finally {
      setHintLoading(false);
    }
  }, [
    hintLoading,
    hintsExhausted,
    locked,
    item.id,
    round2.inventory,
    usedHintIds,
  ]);

  if (round2.submitted) {
    return (
      <Round2Results item={item} round2={round2} onReplay={onReplay} />
    );
  }

  const stepsDone = new Set(round2.completedSteps).size;
  const stepsTotal = item.steps.length;

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 lg:overflow-hidden">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <p className="materia-label">Stage 02 // How is it made?</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#dae2fd] lg:text-3xl">
            How is it made?
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-sm border border-[#94a3b8]/20 bg-[#222a3d] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#c4c6cd]">
            {stepsDone}/{stepsTotal} unlocked
          </span>
          {round2.synthesized && (
            <span className="rounded-sm border border-[#2dd4bf]/35 bg-[#2dd4bf]/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#2dd4bf]">
              Target acquired
            </span>
          )}
          <Button
            onClick={onSubmit}
            disabled={!round2.synthesized}
            className="!px-4 !py-2 !text-xs"
          >
            {round2.synthesized ? "Lock process" : "Awaiting synthesis"}
          </Button>
        </div>
      </div>

      <div className="shrink-0">
        <HintPanel
          text={hintText}
          loading={hintLoading}
          disabled={locked}
          exhausted={hintsExhausted}
          onAsk={askHint}
        />
      </div>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(15rem,0.95fr)_minmax(20rem,1.35fr)_minmax(15rem,0.95fr)]">
        <MaterialsPanel
          inventoryIds={round2.inventory}
          materials={lab.materials}
          disabled={locked}
          onPlace={placeMaterial}
        />

        <ReactionChamber
          instances={instances}
          materials={lab.materials}
          selectedIds={selectedIds}
          disabled={locked}
          status={status}
          celebration={celebration}
          onToggleSelect={toggleSelect}
          onClearSelection={clearSelection}
        />

        <ActionsPanel
          actions={lab.actions}
          selectionCount={selectedIds.length}
          disabled={locked}
          onApply={applyAction}
        />
      </div>
    </div>
  );
}
