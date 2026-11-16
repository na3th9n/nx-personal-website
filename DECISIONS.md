# Decisions

Judgment calls made while building from the v5 plan and the mockup.

## Repo and hosting

- **Reused the existing `na3th9n/nx-personal-website` repo and its Vercel project**
  instead of creating a new `portfolio` repo. `na3th9n/portfolio` already
  exists and is unrelated. This repo was already connected to Vercel with
  auto-deploy from `main`, so no new project or `vercel link` was needed. The
  old NATHAN.OS code was removed in its own commit; history was not rewritten.
- The Vercel CLI wasn't logged in on the build machine. That didn't matter,
  because deploys come from the GitHub integration.
- `docs/PLAN.md` (the build plan) and `design/mockup.html` (the approved
  mockup) are committed alongside the code for reference.

## Cursor trail: fewer pixels

- Nathan asked for fewer trailing pixels than the mockup. Two new
  `content.yaml` settings handle this:
  - `spacing: 3`: the trail drops one pixel every 3 grid cells the mouse
    crosses (the mockup filled every cell).
  - `max_pixels: 16`: at most 16 trail pixels on screen (the plan said 60).
- `fade_ms` lowered from 700 to 600 for a shorter tail.
- The click explosion is unchanged (18 pixels, 150 particle cap overall).

## Content file

- Added extra entries to `labels:` for text that screen readers announce but
  that isn't visible: skip link, nav landmark name, collapse/expand, theme
  toggle actions, slideshow name, prev/next, and "Photo {n} of {total}". This
  keeps every string out of `.ts`/`.tsx` files, as the plan requires.
- Added `# yaml-language-server: $schema=./content.schema.json` as line 1.
  The schema is generated from the zod schema with `npm run schema` (uses
  zod 4's built-in `z.toJSONSchema`; no extra dependency).
- `status` on a project renders as small muted text next to the stack pills.
  The plan allowed the field but didn't place it.
- Build errors give the field path and the source line, e.g.
  `content.yaml (line 95) → experience[2].title is missing`.

## Layout

- **About grid stacks by container width, not viewport.** At a 768–1100px
  viewport with the sidebar expanded, a 300px photo column plus a 56px gap
  leaves too little room for the name. The About grid uses a container query
  (`.about-wrap`) and moves the photo above the text when the content column
  is narrow (780px originally, 680px after the size reduction). That covers mobile, tablets and the expanded sidebar.
- Name sizes scale with the text column (`min(<size>px, <size>/640 × 100cqi)`).
  640px is the text column width at 1440px with the sidebar expanded. The
  fixed-height name box scales the same way, so nothing below it moves.
- Main padding drops from 72px to 56/48px between 768px and 1100px.
- On mobile the sidebar's GitHub/LinkedIn/Résumé links move to a footer at the
  end of `<main>`.
- Styling is mostly hand-written CSS classes in `globals.css`, mirroring the
  mockup's structure, with Tailwind v4 for the reset, the `dark` variant and
  `sr-only`. That kept the build close to the approved mockup.

## Revision 1 (smaller sizing, same-size name, collapsible jobs)

- **About 20–25% smaller overall:**
  - sidebar 300 → 240px, rail 72 → 64px
  - nav 34 → 26px, body 21 → 17.5px, row titles 21 → 17px
  - page title 64 → 48px, photo frame 300×375 → 240×300
  - main padding 72 → 56px, About max width 1000 → 880px
  The About grid now stacks below a 680px content column.
- **One name size instead of one per font.** `name_fonts.size` (76) sets the
  first font. The others are scaled so their capital letters are equally
  tall, measured in the browser after the fonts load, at the rendered size
  (Newsreader is a variable font whose proportions change with size).
  Equal *width* was tried first, but it made narrow fonts like Instrument
  Serif about 50% taller.
- Wide fonts are capped at 1.6× the first font's width so they always fit
  the column. Silkscreen, a very wide pixel font, hits that cap and renders
  at about 94% of the others' height.
- Collapsible "More details" experience rows were tried and then removed
  at Nathan's request. Rows always show the description and pills again.
- Added Instagram, TikTok and YouTube to the sidebar links.

## Revision 2 (Experience page, photo alignment)

- Experience moved to its own `/experience` page, between About and
  Projects in the nav (new `labels.nav_experience`). It uses the same page
  layout as Projects (48px title, 640px column). Education stays on About.
- The About grid is now three rows: name + subtitle, then intro + photo,
  then education. The photo frame's top edge lines up with the first bullet
  instead of the name. When the column stacks on narrow screens, the photo
  still goes first.

## Revision 3 (photos, pastel pills, About cleanup)

- Education removed from About and from `content.yaml`/schema entirely.
- The About photo is vertically centred on the intro bullets
  (`align-self: center` on both, in the same grid row).
- Real photos replace the placeholders, each with a `focus` point so faces
  stay in the 4:5 crop. Captions and alt text are first drafts for Nathan
  to edit.
- **Experience spacing matches Projects.** Vertical padding was already the
  same (18px rows), so this copies the horizontal rhythm: the date column
  is 128px, which leaves the same ~57px between the dates and the role as
  Projects leaves after the year. Titles are 19px on both pages.
- **Pastel pills on Experience only.** `pill_colors` in `content.yaml` maps
  each tech to one of 12 named colours (case-insensitive); unlisted techs
  stay plain. Colours follow brand association where it's obvious
  (TypeScript blue, JavaScript yellow, Ruby/Rails red, GraphQL pink, Svelte
  orange, Node green), and same-row clashes are avoided otherwise. Dark mode
  derives a deep tint and a light text colour from each hue, because the
  light pastels washed out on the dark background.

## Theme and sidebar

- The theme toggle's icon, text and screen-reader label switch with CSS
  (`.when-light` / `.when-dark` keyed off `html.dark`), not React state. The
  server HTML is correct for both themes, so there's no hydration mismatch and
  no icon flash.
- The sidebar state lives on `<html data-sidebar="collapsed">`, set by an
  inline `<head>` script before paint; React reads it with
  `useSyncExternalStore`. The expanded pane and the rail each have a fixed
  width and swap with a 220ms fade, so text is clipped, not squashed, while
  the width animates. The fade is enabled only after the first toggle, so the
  page doesn't fade in on load.
- After clicking collapse/expand, focus moves to the twin button, because the
  clicked button gets hidden.

## Photos and images

- `priority` on `next/image` is deprecated in Next 16, so the first slide uses
  `preload`. The next slide gets `loading="eager"`.
- The original placeholder photos were SVGs, which Next serves
  unoptimized automatically. They've since been replaced by real JPEGs, which
  `next/image` resizes and serves as WebP/AVIF.
- The résumé lives at `public/nathan-xie-resume.pdf`, and the sidebar link
  points to it.
- The favicon is `src/app/icon.svg` (Next's file convention), not
  `public/icon.svg`.

## Next.js 16 specifics

- `create-next-app` now turns on `cacheComponents` and `partialPrefetching`.
  Reading `content.yaml` with `fs.readFileSync` at module scope counts as
  "predictable" under Cache Components, so all routes still prerender as
  static.
- During the build, one production build served a stale CSS chunk from the
  Turbopack cache (the scaffold's CSS). A clean `rm -rf .next` fixed it, and
  later incremental builds picked up CSS edits correctly. If a deploy ever
  shows old styles, redeploy from Vercel with **"Use existing build cache"**
  unchecked.

## Verification

Checked with Playwright against `npm run build && npm start`:

- Screenshots at 360, 768 and 1440px; light and dark; sidebar expanded and
  collapsed. No horizontal overflow.
- Experience/Education rules end at the same x as the intro column at 1440,
  1100, 1024, 900 and 768px, expanded and collapsed. They never run under the
  photo.
- The intro's bounding box stayed identical over 33s of slideshow advances,
  manual prev/next and three or more font swaps.
- Each of the 5 name fonts fits the column (widest: 524px in a 640px column).
- With the sidebar collapsed, first paint is already 72px wide. In dark mode,
  `html.dark` is set at DOMContentLoaded (no light flash).
- Tab order: skip link → monogram → collapse → nav → links → theme → email →
  prev/next. The `[` shortcut toggles the sidebar.
- Reduced motion: static name, no caret blink, no auto-advance.
- `/nope` returns a 404 with the "Not found" page.
