"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { Taskbar } from "./Taskbar";
import { useIsMobile } from "./useIsMobile";
import { useWindowManager } from "./useWindowManager";
import { Window } from "./Window";
import { WINDOWS, isWindowId } from "./windows";

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

// The menu bar and credits are server components, passed in as slots so
// their code and content stay out of the client bundle.
export function Desktop({
  menuBar,
  credits,
}: {
  menuBar: ReactNode;
  credits: ReactNode;
}) {
  const { state, dispatch, focused } = useWindowManager();
  const mobile = useIsMobile();
  const desktopRef = useRef<HTMLElement>(null);

  useEffect(() => {
    dispatch({ type: "setSingle", single: mobile });
  }, [dispatch, mobile]);

  // Track the desktop's size, re-clamping every window when it changes.
  useEffect(() => {
    const desktop = desktopRef.current;
    if (!desktop) return;
    const observer = new ResizeObserver(() => {
      dispatch({
        type: "clampAll",
        bounds: { w: desktop.clientWidth, h: desktop.clientHeight },
      });
    });
    observer.observe(desktop);
    return () => observer.disconnect();
  }, [dispatch]);

  // A deep link opens that window instead of About. Runs before paint so
  // About never flashes first.
  useLayoutEffect(() => {
    const id = window.location.hash.slice(1);
    if (isWindowId(id) && id !== "about") {
      dispatch({ type: "close", id: "about" });
      dispatch({ type: "open", id });
    }
  }, [dispatch]);

  useEffect(() => {
    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      if (isWindowId(id)) dispatch({ type: "open", id });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [dispatch]);

  // The URL hash follows the focused window, without a scroll jump.
  useEffect(() => {
    const { pathname, search } = window.location;
    const url = focused ? `#${focused}` : `${pathname}${search}`;
    window.history.replaceState(window.history.state, "", url);
  }, [focused]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTyping(event.target)) return;

      if (event.key === "Escape") {
        if (focused) dispatch({ type: "close", id: focused });
        return;
      }
      const win = WINDOWS.find(
        (def) => def.shortcut === event.key.toUpperCase(),
      );
      if (win) dispatch({ type: "toggle", id: win.id });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch, focused]);

  return (
    <div className="desk-grid relative h-dvh overflow-hidden text-ink">
      {menuBar}
      {/* Windows live here, between the menu bar and the taskbar. The layer
          ignores pointer events so the credits underneath stay clickable;
          windows opt back in. */}
      <main
        ref={desktopRef}
        id="desktop"
        aria-label="Desktop"
        className="pointer-events-none absolute inset-x-0 top-10 bottom-16 z-10 md:bottom-[76px]"
      >
        <AnimatePresence>
          {WINDOWS.map((def, index) =>
            state.windows[def.id].open ? (
              <Window
                key={def.id}
                def={def}
                index={index}
                win={state.windows[def.id]}
                focused={focused === def.id}
                mobile={mobile}
                bounds={state.bounds}
                dispatch={dispatch}
              >
                {/* Phase 3 replaces this with the real window contents. */}
                <div className="min-h-48 p-6 text-sm text-muted">
                  {def.title} content arrives in Phase 3.
                </div>
              </Window>
            ) : null,
          )}
        </AnimatePresence>
      </main>
      {credits}
      <Taskbar
        windows={state.windows}
        focused={focused}
        onToggle={(id) => dispatch({ type: "toggle", id })}
      />
    </div>
  );
}
