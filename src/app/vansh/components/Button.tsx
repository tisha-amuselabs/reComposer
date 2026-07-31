import type { ButtonHTMLAttributes } from "react";

export function Button({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`self-start rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-lg shadow-purple-500/30 transition-all duration-150 hover:scale-[1.03] hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:scale-100 ${className}`}
      {...props}
    />
  );
}
