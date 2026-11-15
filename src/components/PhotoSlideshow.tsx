"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ChevronIcon } from "./icons";

type Photo = { src: string; alt: string; caption: string; focus: string };
type Labels = { photos: string; previous: string; next: string; position: string };

const INTERVAL = 5000;
const pad = (n: number) => String(n).padStart(2, "0");

function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function usePageHidden() {
  return useSyncExternalStore(
    (cb) => {
      document.addEventListener("visibilitychange", cb);
      return () => document.removeEventListener("visibilitychange", cb);
    },
    () => document.hidden,
    () => false,
  );
}

export function PhotoSlideshow({ photos, labels }: { photos: Photo[]; labels: Labels }) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [announce, setAnnounce] = useState("");
  const reduced = useReducedMotion();
  const hidden = usePageHidden();
  const count = photos.length;
  const multi = count > 1;

  useEffect(() => {
    if (!multi || reduced || hovered || focused || hidden) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % count), INTERVAL);
    return () => clearTimeout(t);
  }, [active, multi, reduced, hovered, focused, hidden, count]);

  const go = (delta: number) => {
    const next = (active + delta + count) % count;
    setActive(next);
    setAnnounce(
      labels.position.replace("{n}", String(next + 1)).replace("{total}", String(count)),
    );
  };

  const current = photos[active];

  return (
    <figure className="photos" aria-roledescription="carousel" aria-label={labels.photos}>
      <div
        className="frame"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
        }}
      >
        {photos.map((p, i) => (
          <div
            key={p.src + i}
            className={i === active ? "slide on" : "slide"}
            aria-hidden={i === active ? undefined : true}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 767px) 100vw, 300px"
              preload={i === 0}
              loading={i === 0 || i === (active + 1) % count ? "eager" : "lazy"}
              style={{ objectFit: "cover", objectPosition: p.focus }}
            />
          </div>
        ))}
        {multi && (
          <div className="slide-ctrls">
            <button
              type="button"
              className="slide-btn"
              aria-label={labels.previous}
              onClick={() => go(-1)}
            >
              <span>
                <ChevronIcon dir="left" />
              </span>
            </button>
            <button
              type="button"
              className="slide-btn"
              aria-label={labels.next}
              onClick={() => go(1)}
            >
              <span>
                <ChevronIcon dir="right" />
              </span>
            </button>
          </div>
        )}
      </div>
      <figcaption>
        <span className="cap">{current.caption}</span>
        {multi && (
          <span className="count" aria-hidden="true">
            {pad(active + 1)} / {pad(count)}
          </span>
        )}
      </figcaption>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </figure>
  );
}
