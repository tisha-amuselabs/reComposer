"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "self-start rounded-sm border px-6 py-3 font-mono text-sm font-semibold uppercase tracking-[0.08em] transition duration-200 disabled:cursor-not-allowed disabled:shadow-none";

  const styles =
    variant === "ghost"
      ? "border-[#94a3b8]/35 bg-transparent text-[#c4c6cd] hover:border-[#7bd0ff]/55 hover:bg-[#7bd0ff]/8 hover:text-[#dae2fd] disabled:border-[#44474c] disabled:bg-transparent disabled:text-[#697386]"
      : "border-[#b9c8de]/70 bg-[#b9c8de] text-[#0d1c2d] shadow-[0_0_18px_rgba(123,208,255,0.12)] hover:border-[#7bd0ff] hover:bg-[#c4e7ff] hover:shadow-[0_0_22px_rgba(123,208,255,0.22)] disabled:border-[#44474c] disabled:bg-[#222a3d] disabled:text-[#697386]";

  return (
    <button type="button" className={`${base} ${styles} ${className}`} {...props} />
  );
}
