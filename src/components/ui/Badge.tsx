/** Numbered square badge (SpecOS annotations). Solid for the newest item. */
export function Badge({
  n,
  variant = "solid",
}: {
  n: number;
  variant?: "solid" | "outline";
}) {
  const look =
    variant === "solid"
      ? "border-ink bg-ink text-paper"
      : "border-ink bg-paper text-ink";

  return (
    <span
      className={`inline-flex size-7 shrink-0 items-center justify-center border-2 font-mono text-xs font-semibold ${look}`}
    >
      {n}
    </span>
  );
}
