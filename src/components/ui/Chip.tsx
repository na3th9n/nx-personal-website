import type { ReactNode } from "react";

type ChipVariant = "outline" | "black" | "grey" | "signal";

const variants: Record<ChipVariant, string> = {
  outline: "border-ink bg-paper text-ink",
  black: "border-ink bg-ink text-paper",
  grey: "border-chip-grey bg-chip-grey text-ink",
  signal: "border-ink bg-signal text-ink",
};

export function Chip({
  variant = "outline",
  children,
}: {
  variant?: ChipVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center border-2 px-2 py-[3px] font-mono text-[10px] leading-none font-medium tracking-label uppercase ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
