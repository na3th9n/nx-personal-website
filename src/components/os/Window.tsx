"use client";

import { useDragControls, useMotionValue } from "motion/react";
import * as m from "motion/react-m";
import {
  useEffect,
  useRef,
  useState,
  type ActionDispatch,
  type ReactNode,
} from "react";
import { Close } from "./icons";
import type { Action, WinState } from "./useWindowManager";
import type { WindowDef } from "./windows";

const SPRING = {
  type: "spring",
  stiffness: 500,
  damping: 32,
} as const;
const EXIT = { duration: 0.12 };
const TILE_WIDTH = 108;
const TILE_MIDDLE = 38; // taskbar tile centre, below the desktop's bottom edge

type Props = {
  def: WindowDef;
  index: number; // position in the taskbar
  win: WinState;
  focused: boolean;
  mobile: boolean;
  bounds: { w: number; h: number } | null;
  dispatch: ActionDispatch<[action: Action]>;
  children: ReactNode;
};

export function Window({
  def,
  index,
  win,
  focused,
  mobile,
  bounds,
  dispatch,
  children,
}: Props) {
  const { id, title, width, height } = def;
  const titleId = `${id}-title`;
  const frameRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dragControls = useDragControls();
  const [dragging, setDragging] = useState(false);

  // Position lives in motion values so dragging doesn't re-render every frame.
  const x = useMotionValue(win.x);
  const y = useMotionValue(win.y);
  useEffect(() => {
    x.set(win.x);
    y.set(win.y);
  }, [x, y, win.x, win.y]);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new ResizeObserver(() => {
      dispatch({
        type: "measure",
        id,
        w: frame.offsetWidth,
        h: frame.offsetHeight,
      });
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [dispatch, id]);

  // Grow out of (and shrink back into) the window's taskbar tile.
  const originX = bounds
    ? bounds.w / 2 + (index - 1.5) * TILE_WIDTH - win.x
    : width / 2;
  const originY = bounds ? bounds.h + TILE_MIDDLE - win.y : 0;

  const motionProps = mobile
    ? {
        initial: { y: "100%" },
        // Full reset: the first render assumes desktop, so a phone can start
        // from the desktop values before this branch takes over.
        animate: { scale: 1, opacity: 1, x: 0, y: 0 },
        exit: { y: "100%", transition: EXIT },
      }
    : {
        initial: { scale: 0.92, opacity: 0, x: 0, y: 12 },
        animate: {
          scale: 1,
          opacity: 1,
          x: dragging ? -2 : 0,
          y: dragging ? -2 : 0,
        },
        exit: { scale: 0.92, opacity: 0, y: 12, transition: EXIT },
      };

  return (
    <m.div
      className="pointer-events-auto absolute top-0 left-0 max-md:inset-0"
      style={{
        zIndex: win.z,
        x: mobile ? 0 : x,
        y: mobile ? 0 : y,
      }}
      drag={!mobile}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      // Numbers, not a ref: with a ref, Motion rescales positions on browser
      // resize behind the window manager's back.
      dragConstraints={
        bounds
          ? {
              left: 0,
              top: 0,
              right: Math.max(0, bounds.w - win.w),
              bottom: Math.max(0, bounds.h - win.h),
            }
          : false
      }
      onDragStart={() => setDragging(true)}
      onDragEnd={() => {
        setDragging(false);
        dispatch({ type: "move", id, x: x.get(), y: y.get() });
      }}
      onPointerDownCapture={() => dispatch({ type: "focus", id })}
    >
      <m.section
        ref={frameRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        className={`flex max-h-[calc(100dvh-164px)] flex-col border-2 border-ink bg-paper max-md:size-full max-md:max-h-none max-md:border-0 ${
          dragging ? "shadow-lift" : "md:shadow-window"
        }`}
        style={{
          width: mobile ? undefined : width,
          height: mobile ? undefined : height,
          transformOrigin: mobile ? undefined : `${originX}px ${originY}px`,
        }}
        transition={SPRING}
        {...motionProps}
      >
        <div
          onPointerDown={(event) => {
            if (!mobile) dragControls.start(event);
          }}
          className={`flex h-[38px] shrink-0 items-center justify-between border-b-2 border-ink pr-3 pl-2 select-none ${
            mobile
              ? ""
              : `touch-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`
          }`}
        >
          <button
            type="button"
            aria-label={`Close ${title}`}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => dispatch({ type: "close", id })}
            className="flex size-[22px] items-center justify-center border-2 border-ink bg-paper text-ink hover:bg-ink hover:text-paper"
          >
            <Close aria-hidden="true" className="size-4" />
          </button>
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`size-2.5 border-2 ${
                focused ? "border-ink bg-signal" : "border-muted"
              }`}
            />
            <h2
              ref={titleRef}
              id={titleId}
              tabIndex={-1}
              className={`font-condensed text-[19px] font-bold tracking-[0.04em] uppercase outline-none ${
                focused ? "text-ink" : "text-muted"
              }`}
            >
              {title}
            </h2>
          </div>
        </div>
        <div className="os-scroll min-h-0 flex-1">{children}</div>
      </m.section>
    </m.div>
  );
}
