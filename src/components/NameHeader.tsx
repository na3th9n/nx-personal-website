"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type NameFont = {
  family: string; // CSS font-family value (may be a var(--…) for site fonts)
  load: string; // family name passed to document.fonts.load (or a var)
  weight: number;
  italic: boolean;
  tracking: number; // em
};

type Props = {
  name: string;
  fonts: NameFont[];
  href: string | null; // Google Fonts stylesheet, subset to the name's letters
  size: number; // desktop px for the first font; others match its width
  enabled: boolean;
  holdMs: number;
  typeMs: number;
  deleteMs: number;
  cursor: "block" | "bar";
};

// The size is tuned for a ~590px text column; scale down with the column.
const DESIGN_WIDTH = 590;

function fontStyle(f: NameFont, size: number, ratio: number): CSSProperties {
  const base = `min(${size}px, ${((size / DESIGN_WIDTH) * 100).toFixed(3)}cqi)`;
  return {
    fontFamily: f.family,
    fontWeight: f.weight,
    fontStyle: f.italic ? "italic" : "normal",
    fontSize: ratio === 1 ? base : `calc(${base} * ${ratio.toFixed(4)})`,
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

// Scale every font so its capital letters are as tall as the first font's,
// which is what reads as "the same size" (fonts differ a lot in proportions).
// Width is capped so wide fonts can't outgrow the first one by more than 60% (so they still fit).
const MAX_WIDTH_RATIO = 1.6;

function measureRatios(text: string, fonts: NameFont[], px: number): number[] {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fonts.map(() => 1);
  const capital = [...text].find((ch) => /\p{Lu}/u.test(ch)) ?? text[0];
  const metrics = fonts.map((f) => {
    // Measure at the real rendered size: variable fonts (Newsreader's optical
    // size axis) change proportions with size.
    ctx.font = `${f.italic ? "italic " : ""}${f.weight} ${px}px ${resolveFamily(f.load)}`;
    ctx.letterSpacing = `${f.tracking * px}px`;
    return {
      // The name fonts are subset to the name's letters, so measure a capital
      // from the name itself (the first letter), not a fixed "H".
      cap: ctx.measureText(capital).actualBoundingBoxAscent,
      width: ctx.measureText(text).width,
    };
  });
  const [first] = metrics;
  return metrics.map(({ cap, width }) => {
    if (!(cap > 0 && width > 0)) return 1;
    const byHeight = first.cap / cap;
    const widthCap = (first.width * MAX_WIDTH_RATIO) / width;
    return Math.max(0.5, Math.min(byHeight, widthCap, 1.6));
  });
}

export function NameHeader(p: Props) {
  const { name, fonts } = p;
  const [fontIndex, setFontIndex] = useState(0);
  const [shown, setShown] = useState(name.length);
  const [ratios, setRatios] = useState<number[] | null>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);

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
      if (cancelled) return;
      const px = h1Ref.current ? parseFloat(getComputedStyle(h1Ref.current).fontSize) : 0;
      if (px > 0) setRatios(measureRatios(name, fonts, px));
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
      <h1 ref={h1Ref} className="name" aria-label={name} style={fontStyle(fonts[fontIndex], p.size, ratios?.[fontIndex] ?? 1)}>
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
