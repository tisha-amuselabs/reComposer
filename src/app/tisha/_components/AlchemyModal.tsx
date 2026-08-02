"use client";

import { useEffect, type ReactNode } from "react";

type AlchemyModalProps = {
  titleId: string;
  onDismiss?: () => void;
  /** When false, backdrop click / Escape do nothing (e.g. start modal). */
  dismissible?: boolean;
  children: ReactNode;
};

export function AlchemyModal({
  titleId,
  onDismiss,
  dismissible = true,
  children,
}: AlchemyModalProps) {
  useEffect(() => {
    if (!dismissible || !onDismiss) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismissible, onDismiss]);

  return (
    <div
      className="alchemy-modal-backdrop alchemy-fade-in"
      role="presentation"
      onClick={dismissible ? onDismiss : undefined}
    >
      <div
        className="alchemy-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
