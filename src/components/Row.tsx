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

export function Pills({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="pills">
      {items.map((s, i) => (
        <li key={s + i} className="pill">
          {s}
        </li>
      ))}
    </ul>
  );
}
