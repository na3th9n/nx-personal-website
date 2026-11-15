// Renders the two formatting patterns allowed in content.yaml text:
//   **bold**   and   [link text](https://url)
// Everything else is plain text; React escapes it, so no HTML gets through.
import type { ReactNode } from "react";

const TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Off-site links and files like the résumé PDF open in a new tab. */
export function isExternal(href: string) {
  return /^https?:\/\//i.test(href) || /\.pdf([?#].*)?$/i.test(href);
}

export function externalProps(href: string) {
  return isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

function safeHref(href: string) {
  return /^(https?:|mailto:|tel:|\/|#)/i.test(href) ? href : "#";
}

export function Inline({ text }: { text: string }): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    if (m[1] !== undefined) {
      out.push(<strong key={key++}>{m[1]}</strong>);
    } else {
      const href = safeHref(m[3]);
      out.push(
        <a key={key++} href={href} {...externalProps(href)}>
          {m[2]}
        </a>,
      );
    }
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
