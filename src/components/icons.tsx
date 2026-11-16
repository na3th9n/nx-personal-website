// Inline SVG icons (no icon library). All decorative: aria-hidden.
const base = {
  "aria-hidden": true,
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
} as const;

export function MoonIcon() {
  return (
    <svg {...base} width={16} height={16} strokeWidth={1.8}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg {...base} width={16} height={16} strokeWidth={1.8}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function PanelIcon({ open }: { open: boolean }) {
  return (
    <svg {...base} width={18} height={18} strokeWidth={1.6}>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d={open ? "M9 4v16M16 10l-2 2 2 2" : "M9 4v16M14 10l2 2-2 2"} />
    </svg>
  );
}

export function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg {...base} width={14} height={14} strokeWidth={2}>
      <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}
