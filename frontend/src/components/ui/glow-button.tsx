"use client";

import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function GlowButton({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={clsx(
        "rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-cyan-300/60",
        variant === "primary"
          ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-black neon-glow hover:scale-[1.03]"
          : "border border-white/20 bg-white/5 text-zinc-100 hover:border-cyan-300/60 hover:bg-cyan-400/10",
        className,
      )}
      {...props}
    />
  );
}
