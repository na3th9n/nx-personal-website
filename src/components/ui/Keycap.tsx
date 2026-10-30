import type { ReactNode } from "react";

/** Keyboard key hint, e.g. the `A` shown above the About taskbar tile. */
export function Keycap({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-[22px] min-w-[22px] items-center justify-center border-2 border-ink bg-paper px-1 font-mono text-[11px] leading-none font-semibold text-ink shadow-[2px_2px_0_0_var(--color-ink)]">
      {children}
    </kbd>
  );
}
