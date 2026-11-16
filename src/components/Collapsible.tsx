"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronIcon } from "./icons";

/**
 * A row heading that is always visible, plus details that slide open when
 * the "More details" button is pressed. Collapsed details stay in the HTML
 * (for search engines) but are `inert`, so they can't be tabbed into.
 */
export function Collapsible({
  head,
  children,
  showLabel,
  hideLabel,
}: {
  head: ReactNode;
  children: ReactNode;
  showLabel: string;
  hideLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <div className="row-head">
        {head}
        <button
          type="button"
          className="more-btn"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? hideLabel : showLabel}
          <ChevronIcon dir="down" size={12} />
        </button>
      </div>
      <div id={id} className="row-more" data-open={open} inert={!open}>
        <div className="row-more-inner">{children}</div>
      </div>
    </>
  );
}
