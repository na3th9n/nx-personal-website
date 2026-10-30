import { Fragment } from "react";
import { site } from "@/content/site";

/**
 * Quiet credits line, e.g. "INSPIRED BY POOLSUITE & SPECOS · ICONS PIXELARTICONS".
 * Desktop: bottom-right corner, behind windows. Below xl the taskbar would
 * collide with it, so it sits just above the taskbar row instead.
 * Mobile: hidden here (shown in the About window from Phase 3).
 */
export function Credits() {
  return (
    <p className="absolute right-4 bottom-[88px] z-0 hidden font-mono text-[10px] tracking-label text-muted uppercase md:block xl:bottom-3">
      {site.credits.map((credit, i) => (
        <Fragment key={credit.role}>
          {i > 0 && <span aria-hidden="true"> · </span>}
          {credit.role}{" "}
          {credit.links.map((link, j) => (
            <Fragment key={link.href}>
              {j > 0 && " & "}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted no-underline hover:text-ink hover:underline"
              >
                {link.label}
              </a>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </p>
  );
}
