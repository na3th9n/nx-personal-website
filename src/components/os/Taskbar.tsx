import { TaskbarTile } from "./TaskbarTile";
import { WINDOWS } from "./windows";

// Phase 1: static tiles. Phase 2 wires open/focus state and click logic.
export function Taskbar() {
  return (
    <nav
      aria-label="Windows"
      className="absolute inset-x-0 bottom-0 z-30 flex justify-center"
    >
      <div className="flex w-full border-t-2 border-ink bg-paper md:w-auto md:border-x-2 md:shadow-[4px_0_0_0_var(--color-ink)]">
        {WINDOWS.map((win) => (
          <TaskbarTile key={win.id} win={win} open={false} focused={false} />
        ))}
      </div>
    </nav>
  );
}
