"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { externalProps } from "@/lib/inline";
import { PanelIcon } from "./icons";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  monogram: string;
  nav: { href: string; label: string }[];
  links: { label: string; url: string }[];
  labels: {
    mainNav: string;
    collapse: string;
    expand: string;
    dark: string;
    light: string;
    toDark: string;
    toLight: string;
  };
};

const STORAGE_KEY = "sidebar-collapsed";
const EVENT = "sidebar-change";

// The collapsed flag lives on <html data-sidebar="collapsed">. A tiny inline
// script in <head> sets it before first paint, so CSS lays out the right width
// immediately; React just mirrors it for aria-expanded.
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
const getSnapshot = () => document.documentElement.dataset.sidebar === "collapsed";
const getServerSnapshot = () => false;

function setCollapsed(collapsed: boolean) {
  const html = document.documentElement;
  html.classList.add("sb-anim");
  if (collapsed) html.dataset.sidebar = "collapsed";
  else delete html.dataset.sidebar;
  try {
    localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  } catch {
    /* storage blocked: state just won't persist */
  }
  window.dispatchEvent(new Event(EVENT));
}

function isTyping(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
}

export function Sidebar({ monogram, nav, links, labels }: Props) {
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const collapseRef = useRef<HTMLButtonElement>(null);
  const expandRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "[" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTyping(e.target)) return;
      if (window.matchMedia("(max-width: 767px)").matches) return;
      setCollapsed(!getSnapshot());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The pressed button disappears with its pane; hand focus to its twin.
  const toggleFromButton = (next: boolean) => {
    setCollapsed(next);
    requestAnimationFrame(() => (next ? expandRef : collapseRef).current?.focus());
  };

  const themeLabels = {
    dark: labels.dark,
    light: labels.light,
    toDark: labels.toDark,
    toLight: labels.toLight,
  };

  return (
    <aside id="sidebar" className="sidebar">
      <div className="sb-expanded">
        <div className="sb-top">
          <div className="sb-head">
            <Link href="/" className="monogram">
              {monogram}
            </Link>
            <button
              ref={collapseRef}
              type="button"
              className="icon-btn collapse-btn"
              aria-label={labels.collapse}
              aria-expanded={!collapsed}
              aria-controls="sidebar"
              aria-keyshortcuts="["
              onClick={() => toggleFromButton(true)}
            >
              <PanelIcon open />
            </button>
          </div>
          <nav className="nav" aria-label={labels.mainNav}>
            {nav.map((n) => (
              <NavLink key={n.href} href={n.href}>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="sb-bottom">
          {links.length > 0 && (
            <div className="side-links">
              {links.map((l) => (
                <a key={l.url} href={l.url} {...externalProps(l.url)}>
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
          <ThemeToggle variant="pill" labels={themeLabels} />
        </div>
      </div>

      <div className="sb-rail">
        <div className="rail-top">
          <button
            ref={expandRef}
            type="button"
            className="icon-btn"
            aria-label={labels.expand}
            aria-expanded={!collapsed}
            aria-controls="sidebar"
            aria-keyshortcuts="["
            onClick={() => toggleFromButton(false)}
          >
            <PanelIcon open={false} />
          </button>
          <nav className="rail-nav" aria-label={labels.mainNav}>
            {nav.map((n) => (
              <NavLink key={n.href} href={n.href}>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <ThemeToggle variant="round" labels={themeLabels} />
      </div>
    </aside>
  );
}
