import type { ProjectStatus } from "@/content/types";

const looks: Record<ProjectStatus, string> = {
  "in-progress": "bg-transparent",
  archived: "bg-chip-grey border-chip-grey",
  shipped: "bg-signal",
};

/**
 * Small status square. `onDark` swaps the black border for white, for use
 * inside inverted (black) rows.
 */
export function StatusSquare({
  status,
  size = 10,
  onDark = false,
}: {
  status: ProjectStatus;
  size?: 9 | 10;
  onDark?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`inline-block shrink-0 border-2 ${
        onDark ? "border-paper" : "border-ink"
      } ${looks[status]}`}
    />
  );
}
