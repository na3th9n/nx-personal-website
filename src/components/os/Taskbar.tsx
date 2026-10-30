import { TaskbarTile } from "./TaskbarTile";
import type { ManagerState } from "./useWindowManager";
import { WINDOWS, type WindowId } from "./windows";

type Props = {
  windows: ManagerState["windows"];
  focused: WindowId | null;
  onToggle: (id: WindowId) => void;
};

export function Taskbar({ windows, focused, onToggle }: Props) {
  return (
    <nav
      aria-label="Windows"
      className="absolute inset-x-0 bottom-0 z-30 flex justify-center"
    >
      <div className="flex w-full border-t-2 border-ink bg-paper md:w-auto md:border-x-2 md:shadow-[4px_0_0_0_var(--color-ink)]">
        {WINDOWS.map((win) => (
          <TaskbarTile
            key={win.id}
            win={win}
            open={windows[win.id].open}
            focused={focused === win.id}
            onClick={() => onToggle(win.id)}
          />
        ))}
      </div>
    </nav>
  );
}
