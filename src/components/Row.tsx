import type { ReactNode } from "react";

// One dated row with a rule above it (Experience, Education, Projects).
export function Row({ when, children }: { when: string; children: ReactNode }) {
  return (
    <li className="row">
      <span className="row-when">{when}</span>
      <div className="row-what">{children}</div>
    </li>
  );
}

export function Pills({
  items,
  colorOf,
}: {
  items: string[];
  colorOf?: (tech: string) => string | undefined;
}) {
  if (!items.length) return null;
  return (
    <ul className="pills">
      {items.map((s, i) => {
        const color = colorOf?.(s);
        return (
          <li key={s + i} className={color ? `pill pill-${color}` : "pill"}>
            {s}
          </li>
        );
      })}
    </ul>
  );
}
