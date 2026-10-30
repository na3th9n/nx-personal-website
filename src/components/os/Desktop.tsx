import { Credits } from "./Credits";
import { MenuBar } from "./MenuBar";
import { Taskbar } from "./Taskbar";

// Phase 1 shell. Phase 2 turns this into the client-side window manager.
export function Desktop() {
  return (
    <div className="desk-grid relative h-dvh overflow-hidden text-ink">
      <MenuBar />
      {/* Windows live here, between the menu bar and the taskbar. The layer
          ignores pointer events so the credits underneath stay clickable;
          windows opt back in. */}
      <main
        id="desktop"
        aria-label="Desktop"
        className="pointer-events-none absolute inset-x-0 top-10 bottom-16 z-10 md:bottom-[76px]"
      />
      <Credits />
      <Taskbar />
    </div>
  );
}
