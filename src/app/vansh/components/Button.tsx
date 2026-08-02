import type { ButtonHTMLAttributes } from "react";

export function Button({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`self-start rounded-sm border border-[#b9c8de]/70 bg-[#b9c8de] px-6 py-3 font-mono text-sm font-semibold uppercase tracking-[0.08em] text-[#0d1c2d] shadow-[0_0_18px_rgba(123,208,255,0.12)] transition duration-200 hover:border-[#7bd0ff] hover:bg-[#c4e7ff] hover:shadow-[0_0_22px_rgba(123,208,255,0.22)] disabled:cursor-not-allowed disabled:border-[#44474c] disabled:bg-[#222a3d] disabled:text-[#697386] disabled:shadow-none ${className}`}
      {...props}
    />
  );
}
