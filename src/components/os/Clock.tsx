"use client";

import { useSyncExternalStore } from "react";

const TICK_MS = 15_000;

// The store's value is the current minute, so React re-renders only when
// the displayed time actually changes, even though we poll every 15s.
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, TICK_MS);
  return () => clearInterval(id);
}
const getMinute = () => Math.floor(Date.now() / 60_000);
// Server render (and the first client render) shows placeholders, which
// avoids a hydration mismatch and keeps the prerendered shell static.
const getServerMinute = () => null;

type Reading = {
  date: string; // THU 29 OCT 2026
  zone: string; // EDT
  offset: string; // UTC−4
  hours: string; // 19
  minutes: string; // 52
  iso: string;
};

function read(minute: number, timeZone: string): Reading {
  const at = new Date(minute * 60_000);
  const parts = (options: Intl.DateTimeFormatOptions) =>
    Object.fromEntries(
      new Intl.DateTimeFormat("en-CA", { timeZone, ...options })
        .formatToParts(at)
        .map((p) => [p.type, p.value]),
    ) as Partial<Record<Intl.DateTimeFormatPartTypes, string>>;

  const clean = (s = "") => s.replace(/\./g, "").toUpperCase();
  const d = parts({
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const t = parts({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  // "GMT-4" → "UTC−4" (typographic minus); "GMT" alone means UTC+0.
  const offset = (parts({ timeZoneName: "shortOffset" }).timeZoneName ?? "")
    .replace("GMT", "UTC")
    .replace("-", "−");

  return {
    date: `${clean(d.weekday)} ${d.day} ${clean(d.month)} ${d.year}`,
    zone: clean(parts({ timeZoneName: "short" }).timeZoneName),
    offset,
    hours: t.hour ?? "--",
    minutes: t.minute ?? "--",
    iso: at.toISOString(),
  };
}

const PLACEHOLDER: Reading = {
  date: "--- -- --- ----",
  zone: "---",
  offset: "UTC−-",
  hours: "--",
  minutes: "--",
  iso: "",
};

const segment =
  "flex items-center border-l-2 border-ink px-3 md:px-4 whitespace-nowrap";

/** Menu-bar date + city/zone/time segments, always in the site's time zone. */
export function Clock({ city, timeZone }: { city: string; timeZone: string }) {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  const now = minute === null ? PLACEHOLDER : read(minute, timeZone);

  return (
    <div className="flex items-stretch font-mono text-xs tracking-label">
      <div className={`${segment} hidden md:flex`}>{now.date}</div>
      <div className={`${segment} gap-2.5`}>
        <span className="hidden md:inline">{city.toUpperCase()}</span>
        <span className="hidden text-muted md:inline">
          {now.zone} · {now.offset}
        </span>
        <time
          dateTime={now.iso || undefined}
          className="font-semibold tabular-nums"
        >
          {now.hours}
          <span className="colon-blink" aria-hidden="true">
            :
          </span>
          <span className="sr-only">:</span>
          {now.minutes}
        </time>
      </div>
    </div>
  );
}
