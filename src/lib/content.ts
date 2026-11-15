// Loads content.yaml once, at build time (module scope), validates it and
// exposes typed data to the pages. Nothing here ships to the browser.
import fs from "node:fs";
import path from "node:path";
import { LineCounter, parseDocument, isNode, type Document } from "yaml";
import { contentSchema, type Content } from "./schema";

const FILE = "content.yaml";
const ROOT = process.cwd();

function formatPath(p: PropertyKey[]): string {
  return p
    .map((k, i) =>
      typeof k === "number" ? `[${k}]` : i === 0 ? String(k) : `.${String(k)}`,
    )
    .join("");
}

// Find the line of the deepest node that exists along `p`.
function lineOf(doc: Document, lc: LineCounter, p: PropertyKey[]): number | null {
  for (let i = p.length; i >= 1; i--) {
    const node = doc.getIn(p.slice(0, i) as (string | number)[], true);
    if (isNode(node) && node.range) return lc.linePos(node.range[0]).line;
  }
  return null;
}

function getAt(obj: unknown, p: PropertyKey[]): unknown {
  let cur: unknown = obj;
  for (const k of p) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<PropertyKey, unknown>)[k];
  }
  return cur;
}

function fail(lines: string[]): never {
  throw new Error(
    `\n\n${FILE} has ${lines.length === 1 ? "a problem" : `${lines.length} problems`}:\n` +
      lines.map((l) => `  • ${l}`).join("\n") +
      `\n\nFix the line(s) above in ${FILE} and save (or commit) again.\n`,
  );
}

function load(): Content {
  const file = path.join(ROOT, FILE);
  let src: string;
  try {
    src = fs.readFileSync(file, "utf8");
  } catch {
    fail([`could not find ${FILE} at the project root`]);
  }

  const lc = new LineCounter();
  const doc = parseDocument(src, { lineCounter: lc, prettyErrors: true });
  if (doc.errors.length) {
    fail(
      doc.errors.map((e) => {
        const pos = e.linePos?.[0];
        const where = pos ? `line ${pos.line}` : "somewhere";
        return `${where}: ${e.message.split("\n")[0]} (check the indentation and quotes)`;
      }),
    );
  }

  const raw = doc.toJS();
  const result = contentSchema.safeParse(raw);
  if (!result.success) {
    fail(
      result.error.issues.map((issue) => {
        const p = issue.path;
        const line = lineOf(doc, lc, p);
        const where = `${FILE}${line ? ` (line ${line})` : ""} → ${formatPath(p) || "(top level)"}`;
        const value = getAt(raw, p);
        if (value === undefined || value === null) return `${where} is missing`;
        if (issue.code === "invalid_value" && "values" in issue)
          return `${where} must be one of: ${issue.values.join(", ")}`;
        return `${where}: ${issue.message}`;
      }),
    );
  }

  const content = result.data;

  const missing = content.photos
    .map((p, i) => ({ i, file: p.file }))
    .filter(({ file }) => !fs.existsSync(path.join(ROOT, "public", "photos", file)));
  if (missing.length) {
    fail(
      missing.map(
        ({ i, file }) =>
          `${FILE} → photos[${i}].file: "${file}" is not in public/photos/ (check the spelling, including .jpg/.png)`,
      ),
    );
  }

  return content;
}

export const content = load();

export const photos = content.photos.map((p) => ({
  src: `/photos/${p.file}`,
  alt: p.alt,
  caption: p.caption ?? "",
  focus: p.focus ?? "center",
}));

export type Photo = (typeof photos)[number];

/** Fonts the site already self-hosts through next/font. */
export const SITE_FONTS: Record<string, string> = {
  Newsreader: "var(--font-newsreader)",
  Inter: "var(--font-inter)",
};

/**
 * One Google Fonts stylesheet for the name-cycle fonts, subset with `text=`
 * to only the letters in the name so each file is a few KB.
 */
export function nameFontsHref(): string | null {
  const families = content.name_fonts.fonts
    .filter((f) => !(f.font in SITE_FONTS))
    .map((f) => {
      const fam = f.font.trim().replace(/ /g, "+");
      if (f.italic && f.weight !== 400) return `family=${fam}:ital,wght@1,${f.weight}`;
      if (f.italic) return `family=${fam}:ital@1`;
      if (f.weight !== 400) return `family=${fam}:wght@${f.weight}`;
      return `family=${fam}`;
    });
  if (!families.length) return null;
  const letters = [...new Set(content.site.name)].join("");
  return `https://fonts.googleapis.com/css2?${[...new Set(families)].join("&")}&text=${encodeURIComponent(letters)}&display=swap`;
}
