import type { WindowDef } from "./windows";

type Props = {
  win: WindowDef;
  open: boolean;
  focused: boolean;
  onClick?: () => void;
};

/**
 * One taskbar tile. Closed: white. Open: green LED in the corner.
 * Focused (topmost window): inverted, LED with a white border.
 */
export function TaskbarTile({ win, open, focused, onClick }: Props) {
  const { Icon, title } = win;

  return (
    <button
      type="button"
      aria-pressed={open}
      onClick={onClick}
      className={`group relative flex h-16 flex-1 items-center justify-center border-r-2 border-ink font-mono text-[10px] tracking-label uppercase last:border-r-0 focus-visible:outline-current focus-visible:-outline-offset-8 md:h-[76px] md:w-[108px] md:flex-none md:text-[11px] ${
        focused ? "bg-ink text-paper" : "bg-paper text-ink"
      }`}
    >
      {open && (
        <span
          aria-hidden="true"
          className={`absolute top-[7px] right-[7px] size-2 border-2 bg-signal ${
            focused ? "border-paper" : "border-ink"
          }`}
        />
      )}
      {/* press: whole content shifts down 1px */}
      <span className="flex flex-col items-center gap-1.5 group-active:translate-y-px md:gap-2">
        {/* hover: icon nudges up 2px */}
        <Icon
          aria-hidden="true"
          className="size-6 transition-transform duration-100 ease-out group-hover:-translate-y-0.5"
        />
        {title}
      </span>
    </button>
  );
}
