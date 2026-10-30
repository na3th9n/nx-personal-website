"use client";

import { useReducer } from "react";
import { WINDOWS, type WindowId } from "./windows";

const CASCADE = 32;
const FALLBACK_HEIGHT = 480; // until a window has been measured

type Bounds = { w: number; h: number };

export type WinState = {
  id: WindowId;
  open: boolean;
  x: number;
  y: number;
  z: number;
  w: number; // measured size, used for clamping
  h: number;
  slot: number | null; // cascade step from centre; null once dragged
};

export type ManagerState = {
  windows: Record<WindowId, WinState>;
  topZ: number;
  bounds: Bounds | null;
  single: boolean; // mobile: one window at a time
};

export type Action =
  | { type: "open" | "close" | "focus" | "toggle"; id: WindowId }
  | { type: "move"; id: WindowId; x: number; y: number }
  | { type: "measure"; id: WindowId; w: number; h: number }
  | { type: "clampAll"; bounds: Bounds }
  | { type: "setSingle"; single: boolean };

function clamp(win: WinState, bounds: Bounds | null): WinState {
  if (!bounds) return win;
  const x = Math.min(Math.max(0, win.x), Math.max(0, bounds.w - win.w));
  const y = Math.min(Math.max(0, win.y), Math.max(0, bounds.h - win.h));
  return x === win.x && y === win.y ? win : { ...win, x, y };
}

/** Centred (plus its cascade step) until the user drags it, then just clamped. */
function place(win: WinState, bounds: Bounds | null): WinState {
  if (!bounds || win.slot === null) return clamp(win, bounds);
  const step = win.slot * CASCADE;
  return clamp(
    {
      ...win,
      x: Math.round((bounds.w - win.w) / 2) + step,
      y: Math.round((bounds.h - win.h) / 2) + step,
    },
    bounds,
  );
}

/** The open window with the highest z, if any. */
export function getFocused(state: ManagerState): WindowId | null {
  const open = Object.values(state.windows).filter((win) => win.open);
  if (open.length === 0) return null;
  return open.reduce((top, win) => (win.z > top.z ? win : top)).id;
}

function focus(state: ManagerState, id: WindowId): ManagerState {
  if (getFocused(state) === id) return state;
  const topZ = state.topZ + 1;
  const win = { ...state.windows[id], z: topZ };
  return { ...state, topZ, windows: { ...state.windows, [id]: win } };
}

function close(state: ManagerState, id: WindowId): ManagerState {
  const win = { ...state.windows[id], open: false };
  return { ...state, windows: { ...state.windows, [id]: win } };
}

function closeAllExcept(state: ManagerState, id: WindowId | null) {
  return WINDOWS.reduce(
    (next, { id: other }) => (other === id ? next : close(next, other)),
    state,
  );
}

function open(state: ManagerState, id: WindowId): ManagerState {
  if (state.windows[id].open) return focus(state, id);

  // Step away from centre per window already open, so none hides another.
  const slot = Object.values(state.windows).filter((win) => win.open).length;
  const topZ = state.topZ + 1;
  const win = place(
    { ...state.windows[id], open: true, z: topZ, slot },
    state.bounds,
  );
  const next = { ...state, topZ, windows: { ...state.windows, [id]: win } };
  return state.single ? closeAllExcept(next, id) : next;
}

function reducer(state: ManagerState, action: Action): ManagerState {
  switch (action.type) {
    case "open":
      return open(state, action.id);
    case "close":
      return close(state, action.id);
    case "focus":
      return focus(state, action.id);
    case "toggle":
      if (!state.windows[action.id].open) return open(state, action.id);
      return getFocused(state) === action.id
        ? close(state, action.id)
        : focus(state, action.id);
    case "move": {
      const { id, x, y } = action;
      const win = { ...state.windows[id], x, y, slot: null };
      return { ...state, windows: { ...state.windows, [id]: win } };
    }
    case "measure": {
      const { id, w, h } = action;
      const current = state.windows[id];
      if (current.w === w && current.h === h) return state;
      const win = place({ ...current, w, h }, state.bounds);
      return { ...state, windows: { ...state.windows, [id]: win } };
    }
    case "clampAll": {
      const windows = { ...state.windows };
      for (const { id } of WINDOWS) {
        windows[id] = place(windows[id], action.bounds);
      }
      return { ...state, windows, bounds: action.bounds };
    }
    case "setSingle": {
      if (state.single === action.single) return state;
      const next = { ...state, single: action.single };
      return action.single ? closeAllExcept(next, getFocused(state)) : next;
    }
  }
}

function initialState(): ManagerState {
  const windows = {} as Record<WindowId, WinState>;
  WINDOWS.forEach(({ id, width, height }) => {
    windows[id] = {
      id,
      open: id === "about",
      x: 0,
      y: 0,
      z: id === "about" ? 1 : 0,
      w: width,
      h: height ?? FALLBACK_HEIGHT,
      slot: 0,
    };
  });
  return { windows, topZ: 1, bounds: null, single: false };
}

export function useWindowManager() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  return { state, dispatch, focused: getFocused(state) };
}
