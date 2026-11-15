"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "./icons";

type Labels = {
  dark: string;
  light: string;
  toDark: string;
  toLight: string;
};

// Which icon/text shows is decided by CSS (.when-light / .when-dark keyed off
// the <html class="dark">), so the server HTML is correct for every theme and
// there is nothing to hydrate differently.
export function ThemeToggle({
  variant,
  labels,
}: {
  variant: "pill" | "round";
  labels: Labels;
}) {
  const { setTheme } = useTheme();
  const toggle = () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      className={variant === "pill" ? "theme-pill" : "theme-round"}
      onClick={toggle}
    >
      <span className="sr-only when-light">{labels.toDark}</span>
      <span className="sr-only when-dark">{labels.toLight}</span>
      <span className="when-light" aria-hidden="true">
        <MoonIcon />
      </span>
      <span className="when-dark" aria-hidden="true">
        <SunIcon />
      </span>
      {variant === "pill" && (
        <>
          <span className="when-light" aria-hidden="true">
            {labels.dark}
          </span>
          <span className="when-dark" aria-hidden="true">
            {labels.light}
          </span>
        </>
      )}
    </button>
  );
}
