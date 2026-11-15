"use client";

import { useEffect, useState, type CSSProperties } from "react";

export type NameFont = {
  family: string; // CSS font-family value (may be a var(--…) for site fonts)
  load: string; // family name passed to document.fonts.load (or a var)
  weight: number;
  italic: boolean;
  size: number; // desktop px
  tracking: number; // em
};

type Props = {
  name: string;
  fonts: NameFont[];
  href: string | null; // Google Fonts stylesheet, subset to the name's letters
  enabled: boolean;
  holdMs: number;
  typeMs: number;
  deleteMs: number;
  cursor: "block" | "bar";
};

// Sizes are tuned for a ~640px text column; scale down with the column.
const DESIGN_WIDTH = 640;

function fontStyle(f: NameFont): CSSProperties {
  return {
    fontFamily: f.family,
    fontWeight: f.weight,
    fontStyle: f.italic ? "italic" : "normal",
    fontSize: `min(${f.size}px, ${((f.size / DESIGN_WIDTH) * 100).toFixed(3)}cqi)`,
    letterSpacing: `${f.tracking}em`,
  };
}

function resolveFamily(value: string) {
  const m = /^var\((--[\w-]+)\)/.exec(value.trim());
  if (!m) return value;
  return getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim() || value;
}

function loadStylesheet(href: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLLinkElement>(`link[data-name-fonts]`);
    if (existing) return resolve();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.nameFonts = "";
    link.onload = () => resolve();
    link.onerror = () => reject(new Error("name fonts failed to load"));
    document.head.appendChild(link);
  });
}

export function NameHeader(p: Props) {
  const { name, fonts } = p;
  const [fontIndex, setFontIndex] = useState(0);
  const [shown, setShown] = useState(name.length);

  useEffect(() => {
    if (!p.enabled || fonts.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let timer = 0;
    let pendingMs: number | null = null;
    let font = 0;
    let len = name.length;
    let phase: "delete" | "type" = "delete";

    // One setTimeout chain drives everything; paused while the tab is hidden.
    const schedule = (ms: number) => {
      if (cancelled) return;
      if (document.hidden) {
        pendingMs = ms;
        return;
      }
      timer = window.setTimeout(step, ms);
    };

    const step = () => {
      timer = 0;
      if (phase === "delete") {
        len -= 1;
        setShown(len);
        if (len > 0) return schedule(p.deleteMs);
        font = (font + 1) % fonts.length;
        setFontIndex(font);
        phase = "type";
        return schedule(300);
      }
      len += 1;
      setShown(len);
      if (len < name.length) return schedule(p.typeMs + (Math.random() * 50 - 25));
      phase = "delete";
      schedule(p.holdMs);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (timer) {
          clearTimeout(timer);
          timer = 0;
          pendingMs = phase === "delete" ? p.deleteMs : p.typeMs;
        }
      } else if (pendingMs !== null) {
        const ms = pendingMs;
        pendingMs = null;
        schedule(ms);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Inject the subset stylesheet after first paint, then wait for every
    // face so no fallback font ever flashes in mid-cycle.
    const start = async () => {
      try {
        if (p.href) await loadStylesheet(p.href);
        await Promise.all(
          fonts.map((f) =>
            document.fonts.load(
              `${f.italic ? "italic " : ""}${f.weight} 64px ${resolveFamily(f.load)}`,
              name,
            ),
          ),
        );
        await document.fonts.ready;
      } catch {
        return; // fonts unavailable: keep the static name
      }
      schedule(p.holdMs);
    };
    const raf = requestAnimationFrame(() => void start());

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [p.enabled, p.href, p.holdMs, p.typeMs, p.deleteMs, name, fonts]);

  return (
    <div className="name-box">
      <h1 className="name" aria-label={name} style={fontStyle(fonts[fontIndex])}>
        <span aria-hidden="true">{name.slice(0, shown)}</span>
        {p.enabled && (
          <span
            className={p.cursor === "bar" ? "caret bar" : "caret"}
            aria-hidden="true"
          />
        )}
      </h1>
    </div>
  );
}
