# Portfolio — Build Plan (v5: minimal two-column, autonomous build)

> Hand this file to Claude Code with screenshots of the approved mockup (Claude canvas "Portfolio Mockup v2", light and dark).

## How to run this build: fully autonomous

**Do not ask Nathan for permission at any point.** Work through every phase in order, make every decision yourself, install the listed dependencies, commit, create the GitHub repo, push, and deploy to Vercel without stopping. When something is ambiguous, pick the option most consistent with this plan and the mockup, note the decision in `DECISIONS.md`, and keep going.

The only reason to stop is a hard blocker you cannot get past yourself, which in practice means **authentication**:

- **GitHub:** run `gh auth status`. If not logged in, print one line asking Nathan to run `gh auth login`, then continue with local work (Phases 1–4) and do the repo creation and push as soon as auth is available.
- **Vercel:** run `npx vercel whoami`. If not logged in, print one line asking Nathan to run `npx vercel login`, then continue the same way. Never ask for, read, print or store tokens.

Bootstrap the session before starting so it is not blocked by permission prompts (for example, run Claude Code with auto-accept or a permissive allowlist for `npm`, `npx`, `git`, `gh`, `vercel`).

### Commit rules (no approval needed, but keep them meaningful)

- Small commits, one logical change each, Conventional Commit style:
  - `chore: scaffold Next.js app with TypeScript and Tailwind`
  - `feat(layout): two-column shell with sidebar divider`
  - `feat(sidebar): collapsible sidebar with persisted state`
  - `feat(theme): light/dark toggle with system default`
  - `feat(content): load all site text from commented content.yaml`
  - `feat(about): hero with name, intro and photo slideshow`
  - `feat(projects): project list page`
  - `feat(fx): colourful pixel cursor trail`
  - `feat(fx): pixel explosion on click`
  - `feat(about): typed name header with terminal cursor and font cycle`
  - `fix(layout): stack sidebar above content on mobile`
- Run `npm run lint` before each commit; never commit a broken build.
- Never commit `.env*`, secrets, `node_modules` or build output. Never force-push or rewrite pushed history.
- Push to `main` at the end of each phase (Vercel redeploys automatically).

---

## Goal

A simple, clean personal site with two pages, **About** and **Projects**, built and deployed today.

- Frontend only. No backend, no database, no CMS.
- All wording, photos, jobs, projects and links live in **one commented `content.yaml` file** at the project root. Nathan edits only that file (locally or in GitHub's web editor) and never touches code. Ship with clear `TODO` placeholders and placeholder photos.
- Light and dark mode, collapsible sidebar, and a fading photo slideshow on About.
- Fast: static pages, tiny JS, no animation libraries.

## Stack

| Concern        | Choice                                                                                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework      | Next.js (App Router) + React + TypeScript, statically rendered                                                                                                                  |
| Styling        | Tailwind CSS (whatever `create-next-app` installs; if v4, tokens in `globals.css`, dark variant via `@custom-variant dark (&:where(.dark, .dark *))`)                           |
| Fonts          | `next/font/google`: **Newsreader** (nav, body, default name font) and **Inter** (labels, dates, links, toggle); name-cycle fonts from Google Fonts subset to the name's letters |
| Theme          | **`next-themes`** (`attribute="class"`, `defaultTheme="system"`, `enableSystem`)                                                                                                |
| Images         | `next/image` (automatic resizing, WebP/AVIF, lazy loading)                                                                                                                      |
| Content        | **`yaml`** (parse `content.yaml`) + **`zod`** (validate it, readable errors), both build-time only                                                                              |
| Analytics      | **`@vercel/analytics`**                                                                                                                                                         |
| Repo / hosting | GitHub (public repo `portfolio`) + Vercel, auto-deploy on push to `main`                                                                                                        |

No other dependencies (no Motion, UI kits or icon libraries; icons are inline SVG; the slideshow is CSS transitions).

---

## Design

Inspired by a friend's site (sidebar nav + serif body) but **not a copy**. Distinguishing features: the vertical divider line, a very large light-weight name header, the photo frame beside it, Newsreader + Inter, ink-coloured underlined links, the collapsible sidebar and the light/dark toggle.

### Tokens

| Token     | Light     | Dark      | Use                                         |
| --------- | --------- | --------- | ------------------------------------------- |
| `--bg`    | `#FAFAF8` | `#121211` | page                                        |
| `--ink`   | `#141414` | `#EDECE8` | headings, active nav, links                 |
| `--body`  | `#2E2E2C` | `#C9C8C3` | paragraphs                                  |
| `--muted` | `#6E6E69` | `#8C8B86` | inactive nav, dates, labels, captions       |
| `--rule`  | `#DDDCD7` | `#2E2D2B` | divider line, row separators, toggle border |
| `--frame` | `#EFEEEA` | `#1C1C1A` | photo frame background while an image loads |

Theme change fades background/text colour over 200ms; disabled under `prefers-reduced-motion`.

### Type

| Element                                | Font                                                                      | Size / weight                                           |
| -------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------- |
| Name header (About only)               | cycles through 5 fonts (see _Name header font cycle_); default Newsreader | 104px, 300, tracking −0.02em                            |
| Page header (Projects)                 | Newsreader                                                                | 64px, 300                                               |
| Sidebar nav (expanded)                 | Newsreader                                                                | 34px, 400; active `--ink`, inactive `--muted`           |
| Body                                   | Newsreader                                                                | 21px, line-height 1.6                                   |
| Row title                              | Newsreader                                                                | 21–24px, 500                                            |
| Labels, dates, links, toggle, captions | Inter                                                                     | 12–15px; section labels uppercase, 600, 0.16em tracking |

### Layout (matches the mockup)

```
expanded                                         collapsed
┌──────────────┬────────────────────────────┐    ┌────┬──────────────────────────────────┐
│ NX       [⇤] │ Nathan Xie        ┌──────┐ │    │[⇥] │ Nathan Xie              ┌──────┐ │
│              │ Software eng · TO │      │ │    │  A │ ...                     │photo │ │
│ About        │                   │photo │ │    │  b │                         │      │ │
│ Projects     │ [Intro]           │300×  │ │    │  o │                         └──────┘ │
│              │ Email: [link]     │375   │ │    │  u │                                  │
│              │                   └──────┘ │    │  t │ EXPERIENCE ...                   │
│              │                   caption 01/03  │    │                                  │
│              │ EXPERIENCE                 │    │ (☾)│                                  │
│ GitHub ↗     │ ───────────────            │    │    │                                  │
│ (☾ Dark)     │ [dates]  Role · Company    │    │    │                                  │
└──────────────┴────────────────────────────┘    └────┴──────────────────────────────────┘
```

#### Sidebar (collapsible)

- **Expanded:** 300px wide, padding `64px 40px 48px 72px`. Top row: `NX` monogram left, collapse button right (44×44, panel icon). Nav below (About, Projects). Bottom: GitHub / LinkedIn / Résumé links and the pill theme toggle (moon + "Dark" / sun + "Light").
- **Collapsed:** 72px rail. Expand button at top; nav as vertical text (`writing-mode: vertical-rl`, rotated 180°, 20px) so pages stay reachable; icon-only round theme toggle at the bottom.
- 1px `--rule` divider along the sidebar's right edge, full height, in both states.
- Animate the width over 250ms ease (`width`/`flex-basis`); swap the contents with a quick fade so text never squashes mid-animation. No animation under reduced motion.
- Collapse button: `aria-expanded`, `aria-controls`, labels "Collapse sidebar" / "Expand sidebar". Keyboard shortcut `[` toggles it (ignored while typing).
- Persist the state in `localStorage` (`sidebar-collapsed`), wrapped in try/catch. Read it in a tiny inline script in `<head>` that sets a `data-sidebar="collapsed"` attribute on `<html>` before paint, so a returning visitor never sees the sidebar jump.
- Sticky on desktop (`position: sticky; top: 0; height: 100dvh`).
- **Mobile (< 768px):** no collapse button; the sidebar becomes a top bar (`NX` left, theme toggle right, nav row below) with a horizontal 1px line under it; GitHub/LinkedIn/Résumé move to a footer.

#### Main column

- Padding `72px 72px 96px`, About grid max-width 1000px; Projects content max-width 720px.

### Name header: typing animation + font cycle (About only)

"Nathan Xie" is typed out letter by letter with a classic **blinking block cursor**, holds, gets deleted, then is retyped in the next font, looping through a set of very different typefaces.

- **Sequence:** page loads with the name already fully shown in the first font (so the header is never empty at first paint) and the cursor blinking → hold **1.8s** → delete one letter every **50ms** → swap to the next font → short 0.3s pause → type one letter every **80ms** (±25ms random jitter so it feels human) → hold 1.8s → repeat.
- **Cursor:** a solid block (`display: inline-block; width: 0.28em; height: 0.78em; margin-left: 0.08em; background: currentColor` — a slim block, about half a letter wide), sitting right after the last typed letter, scaled with the current font. **Blinks the whole time** (typing, deleting and holding): hard on/off, no fade, ~1.06s cycle (`animation: blink 1.06s steps(1, end) infinite`), like a real terminal. The animation runs on the cursor element continuously and is never restarted by the typing updates.
- **Accessibility/SEO:** the `<h1>` always contains the full text "Nathan Xie" for screen readers and search (`aria-label` on the `<h1>`, typed text and cursor `aria-hidden`). Server-rendered HTML shows the full name.
- **Fonts (default set, configurable in `content.yaml`):**
  | Font                                                                                                              | Weight / style | Size (desktop) | Tracking |
  | ----------------------------------------------------------------------------------------------------------------- | -------------- | -------------- | -------- |
  | Newsreader                                                                                                        | 300            | 104px          | −0.02em  |
  | Instrument Serif                                                                                                  | 400 italic     | 112px          | −0.01em  |
  | Space Mono                                                                                                        | 700            | 72px           | −0.04em  |
  | Bricolage Grotesque                                                                                               | 800            | 92px           | −0.04em  |
  | Silkscreen                                                                                                        | 400            | 64px           | 0        |
  | Sizes are tuned so every font fits the text column on one line; scale them all with `clamp()` on smaller screens. |
- **No layout shift:** the header sits in a fixed-height box (108px desktop, scaled on mobile), `white-space: nowrap`, text aligned to the box's bottom. Typing, deleting and changing font never move the subtitle, intro or photo by a pixel (add this to the Phase 4 measurement check). Width changes are fine because the text is left-aligned and nothing sits to its right in its column.
- **Loading (must stay fast):** load the alternate fonts from Google Fonts **subset to only the letters in the name**, using the `text=` parameter, e.g. `https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Space+Mono:wght@700&family=Bricolage+Grotesque:wght@800&family=Silkscreen&text=Nathan%20Xie&display=swap`. That makes each font a ~1–3 KB file. Build this URL from the font list in `content.yaml` at build time, add `<link rel="preconnect">` to `fonts.googleapis.com` and `fonts.gstatic.com`, and inject the stylesheet after first paint so it never delays the page. The first font (Newsreader) is the site font already loaded via `next/font`. Start cycling only once `document.fonts.ready` resolves, so no fallback font flashes in.
- **When it stops:** under `prefers-reduced-motion`, show the full name in the first font with a static (non-blinking) cursor and never type (blinking is motion too); pause when the tab is hidden; `enabled: false` in `content.yaml` turns the whole thing off. Implement timing with one `setTimeout` chain (not one timer per letter) and clear it on unmount.
- Component: `NameHeader.tsx` (`"use client"`), CSS-only blink keyframes in `globals.css`.
- **`content.yaml` block** (add after `cursor_trail`):

```yaml
# ------------------------------------------------------------
#  NAME ANIMATION (the big "Nathan Xie" on the About page)
#  Your name is typed out with a terminal cursor, deleted,
#  and retyped in the next font in this list, in a loop.
#  "font" must be the exact name of a Google Font (fonts.google.com).
#  The first one is what shows if animation is turned off.
#  Adjust "size" if a font looks too big or too small.
# ------------------------------------------------------------
name_fonts:
  enabled: true
  hold_seconds: 1.8 # how long the full name stays before deleting
  type_ms: 80 # time per letter when typing
  delete_ms: 50 # time per letter when deleting
  cursor: block # block (█) or bar (|)
  fonts:
    - {
        font: Newsreader,
        weight: 300,
        italic: false,
        size: 104,
        tracking: -0.02,
      }
    - {
        font: Instrument Serif,
        weight: 400,
        italic: true,
        size: 112,
        tracking: -0.01,
      }
    - {
        font: Space Mono,
        weight: 700,
        italic: false,
        size: 72,
        tracking: -0.04,
      }
    - {
        font: Bricolage Grotesque,
        weight: 800,
        italic: false,
        size: 92,
        tracking: -0.04,
      }
    - { font: Silkscreen, weight: 400, italic: false, size: 64, tracking: 0 }
```

### Cursor pixel trail (desktop) + click explosion

Colourful square pixels appear where the cursor moves and fade out, like the effect on GitHub's homepage, but **with no visible grid background** — the grid only exists invisibly to snap pixel positions.

- **Rendering:** one fixed, full-viewport `<canvas>` (`position: fixed; inset: 0; pointer-events: none; z-index: 50; aria-hidden`), sized to `devicePixelRatio` for crisp squares. Never DOM nodes per pixel. Component `CursorTrail.tsx` (`"use client"`), mounted once in `layout.tsx`.
- **Behaviour:** on `pointermove`, snap the cursor to an invisible 12px grid; when it enters a new cell, add a 12×12 square in a random colour from the palette. Each square fades from opacity 1 to 0 over **700ms** (ease-out), then is removed. Cap at 60 live squares. Fast movements fill the cells in between (step along the line from the last cell) so the trail stays continuous.
- **Click explosion:** on every `pointerdown` (mouse clicks, and taps on touch devices too unless reduced motion is on), burst **18 pixels** out from the click point in random trail colours. Each particle: 8px (70%) or 12px (30%) square, launched evenly around a circle with a little random jitter, speed 7–16 px/frame with a slight upward kick, gravity 0.9 px/frame², horizontal drag ×0.94/frame, positions snapped to a 4px grid when drawn (keeps the chunky pixel look), fades out over 650–900ms. Shares the same canvas, palette and rAF loop as the trail; total live particles capped at 150. Purely decorative: never `preventDefault`, so links and buttons work normally (the burst plays on top of the click).
- **Palette** (picked per theme so it reads on both backgrounds; set in `content.yaml`):
  - Light: `#1A7F37` green, `#0969DA` blue, `#8250DF` purple, `#BF3989` pink, `#BC4C00` orange, `#9A6700` amber
  - Dark: `#3FB950`, `#58A6FF`, `#BC8CFF`, `#F778BA`, `#F0883E`, `#E3B341`
- **Performance:** a single `requestAnimationFrame` loop that runs only while squares exist and stops when the last one fades; listeners are passive; no work at all when idle. Must not affect Lighthouse performance or cause layout work.
- **Off when it should be:** the trail is disabled on touch devices (`(pointer: coarse)` or no hover; the click explosion still plays on tap); both are disabled under `prefers-reduced-motion`, and when `cursor_trail.enabled` is `false` in `content.yaml`. Pauses when the tab is hidden. Drawn above the page but never blocks clicks or text selection.
- **`content.yaml` block** (add after `labels`):

```yaml
# ------------------------------------------------------------
#  CURSOR TRAIL
#  Colourful pixels that follow the mouse on desktop,
#  and burst out wherever you click.
#  Set enabled to false to turn it off.
#  Colours: any hex codes; one list for each theme.
# ------------------------------------------------------------
cursor_trail:
  enabled: true
  pixel_size: 12 # size of each square, in pixels
  fade_ms: 700 # how long each square takes to fade
  click_explosion: true # burst of pixels wherever you click
  explosion_pixels: 18 # how many pixels per burst
  colors_light:
    ["#1A7F37", "#0969DA", "#8250DF", "#BF3989", "#BC4C00", "#9A6700"]
  colors_dark:
    ["#3FB950", "#58A6FF", "#BC8CFF", "#F778BA", "#F0883E", "#E3B341"]
```

---

## Pages

### `/` — About

**Layout:** the whole About page is one CSS grid, `grid-template-columns: minmax(0, 1fr) 300px; column-gap: 56px; row-gap: 56px; align-items: start`. Row 1 = text column + photo frame; row 2 = Experience and Education, **in column 1 only**, so their divider lines end exactly where the intro text ends and never run under or past the photo. Below 768px the grid becomes a single column (photo first).

- **Text column** (grid column 1, `min-width: 0`): name header, subtitle (Inter 15px muted), then the intro as a **bulleted list** (`<ul>`, Newsreader 21px, line-height 1.55, 12px between items, 24px left indent, default disc bullets in `--body`). The last bullet is always the email line, rendered from `site.email`: "My email is [na3than.xie@gmail.com](mailto:na3than.xie@gmail.com). Contact me for anything :)" with the address as an underlined `mailto:` link in `--ink`.
- **Photo slideshow** (grid column 2), see below.

**Below the hero** (grid column 1, same width as the intro text): Experience section (label + rows: dates column 140px in Inter muted, role · company in 500 (company is an underlined link when `company_url` is set, opens in a new tab), one-line summary, then a wrapping row of **stack pills**: Inter 12px, `--muted` text, 1px `--rule` border, fully rounded, padding 3px 10px, 6px gap, 4px above; languages first, then frameworks/tools, in the order given in `content.yaml`; no pills if `stack` is empty), then Education rows. Rows separated by 1px `--rule` lines.

#### Photo slideshow — fixed frame, crossfade

The frame's size is fixed and independent of the photos, so images of any size or aspect ratio never move or resize the intro text.

- **Frame:** exactly **300×375px (4:5)** on desktop. `position: relative; overflow: hidden; background: var(--frame)`. Fixed `margin-top: 8px` (aligns the frame's top with the name's cap height) and a fixed 56px gap to the text column. The frame never changes size.
- **Images:** all slides stacked absolutely in the frame (`inset: 0`), each a `next/image` with `fill`, `sizes="300px"` (mobile: `"(max-width: 767px) 100vw, 300px"`), `style={{ objectFit: 'cover', objectPosition: photo.focus ?? 'center' }}`. Portrait, landscape and square photos are all cropped to fill the frame, never letterboxed or stretched.
- **Caption row:** fixed 18px height under the frame (12px gap): the current photo's caption on the left (single line, `text-overflow: ellipsis`), counter `01 / 03` on the right. An empty caption still reserves the row.
- **Crossfade:** only the active slide has `opacity: 1`; the others are `0`, with `transition: opacity 900ms ease`. Advance every 5s and loop.
- **Behaviour:**
  - First photo `priority` (loads immediately); preload the next one before it fades in.
  - Pause on hover and on keyboard focus within the frame; pause when the tab is hidden (`visibilitychange`).
  - Small prev/next buttons appear on hover/focus in the frame's bottom-right corner (44px targets, inline SVG chevrons).
  - `prefers-reduced-motion`: no auto-advance and no fade; show the first photo, prev/next still work.
  - With 1 photo: no timer, no counter, no buttons. With 0 photos: hide the frame and let the text column take the full width.
- **Accessibility:** `<figure aria-roledescription="carousel" aria-label="Photos">`; each image has meaningful `alt` from the content file; hidden slides get `aria-hidden="true"`; a visually hidden `aria-live="polite"` region announces "Photo 2 of 3" only when the user presses prev/next, not on auto-advance.
- **Mobile:** the frame moves **above** the text, full content width, `aspect-ratio: 4 / 5; max-width: 360px`, still fixed-ratio so nothing shifts.

### `/projects` — Projects

`Projects` header (64px), then rows separated by 1px `--rule` lines: year column (80px), title (Newsreader 24px, 500), 1–2 line summary, then one wrapping line with the **stack pills** (same style as Experience) followed by `Live ↗` / `Source ↗` links in Inter 13px `--ink` (hide missing links). Content max-width 720px.

### `not-found`

Same shell, header "Not found", link back to About.

---

## Content: one commented file, no code

**Every word on the site lives in one file at the project root: `content.yaml`.** Nathan never opens a `.ts` or `.tsx` file to change wording, add a job, add a project, swap a photo or change a link. Components read from this file; no copy is hardcoded anywhere else (including page titles, nav labels, section labels, the theme toggle text and the 404 message).

Why YAML: it allows comments, needs almost no punctuation (no braces, mostly no quotes), and indentation is the only structure. It is parsed at **build time only**, so it adds zero JavaScript to the site.

### How Nathan edits

- **On his laptop:** open `content.yaml`, change text, save. `npm run dev` hot-reloads the page.
- **From anywhere:** open `content.yaml` on GitHub, click the pencil, edit, "Commit changes". Vercel redeploys in about a minute. No terminal needed.
- If he makes a mistake (wrong indentation, missing field), the build fails with a plain-English message naming the line and field, e.g. `content.yaml → experience[2].title is missing`. The live site keeps serving the last good version.

### Text formatting allowed in any text field

- `**bold**` → bold
- `[link text](https://example.com)` → link (external links open in a new tab)
- Nothing else; keep it simple. A tiny inline renderer in the loader handles these two patterns (no markdown library), with HTML escaped.

### The file (ship it exactly like this, with every comment)

```yaml
# ============================================================
#  NATHAN'S WEBSITE CONTENT
#  Edit anything below, save, and the site updates.
#
#  Rules of thumb:
#   - Indentation matters: use 2 spaces, never tabs.
#   - A line starting with "- " is one item in a list.
#     Copy an existing item (all of its lines) to add another.
#   - If text contains a colon followed by a space (": "),
#     wrap the whole text in double quotes.
#   - **bold** and [link text](https://url) work in any text.
#   - Lines starting with # are notes for you; the site ignores them.
# ============================================================

# ------------------------------------------------------------
#  SITE BASICS
# ------------------------------------------------------------
site:
  name: Nathan Xie # big header on About, browser tab title
  subtitle: Software engineer · Toronto # small line under your name
  description: Software engineer in Toronto. # shown in Google results and link previews

# ------------------------------------------------------------
#  SIDEBAR
#  Links at the bottom of the sidebar. Remove a line to hide it.
#  Put your résumé PDF in the "public" folder and name it resume.pdf.
# ------------------------------------------------------------
sidebar:
  monogram: NX
  links:
    - label: GitHub
      url: https://github.com/na3th9n
    - label: LinkedIn
      url: https://www.linkedin.com/in/nathanxie/
    - label: Résumé
      url: /resume.pdf

# ------------------------------------------------------------
#  ABOUT PAGE — INTRO BULLETS
#  Each "- " line is one bullet. Add or remove freely.
#  The email bullet is added automatically at the end (see below).
# ------------------------------------------------------------
intro:
  - TODO
  - TODO
  - TODO

# The last bullet always reads:  My email is <email>. <email_note>
email: na3than.xie@gmail.com
email_note: Contact me for anything :)

# ------------------------------------------------------------
#  ABOUT PAGE — PHOTOS (slideshow next to your name)
#  1. Put photos in the folder  public/photos/
#  2. List them here in the order you want them shown.
#  Any size or shape works; they're cropped to fit the frame.
#  "focus" (optional) picks which part stays visible when cropped:
#     "50% 20%" = keep the top, "50% 80%" = keep the bottom.
#  Remove all photos to hide the slideshow.
# ------------------------------------------------------------
photos:
  - file: placeholder-1.svg
    alt: TODO describe the photo for screen readers
    caption: TODO
  - file: placeholder-2.svg
    alt: TODO
    caption: TODO
  - file: placeholder-3.svg
    alt: TODO
    caption: TODO

# ------------------------------------------------------------
#  ABOUT PAGE — EXPERIENCE (newest first)
#  To add a job: copy one whole block (from "- dates" to the
#  end of its "stack" line) and paste it where it should go.
#  "stack" = the pills under the job. Remove the line for none.
#  "company_url" (optional) makes the company name a link.
# ------------------------------------------------------------
experience:
  - dates: Jan – Apr 2026
    title: Software Engineer Intern
    company: StackAdapt
    company_url: https://www.stackadapt.com
    summary: Built ad campaign forecasting dashboards in React and the Rails pipeline that feeds them through GraphQL.
    stack: [TypeScript, Ruby, React, Redux, Ruby on Rails, GraphQL]

  - dates: May – Aug 2025
    title: Software Engineer Intern
    company: StackAdapt
    company_url: https://www.stackadapt.com
    summary: Built role-based access control for sharing campaigns and an interactive campaign metrics visualization tool.
    stack: [TypeScript, Ruby, React, Redux, Ruby on Rails, GraphQL]

  - dates: Sep – Dec 2024
    title: Frontend Developer Intern
    company: HVE Healthcare Assessments
    company_url: https://hvehealth.com
    summary: Built a Svelte email client that brings every employee's inbox into the company's internal CRM.
    stack: [TypeScript, SQL, Svelte, PostgreSQL]

  - dates: Jan – Apr 2024
    title: Software Engineer Intern
    company: Magna International
    company_url: https://www.magna.com
    summary: Designed a SQL Server database for 10,000+ engineers and the Python pipeline that populates it.
    stack: [Python, SQL, MS SQL Server]

  - dates: Sep – Dec 2022
    title: Full-stack Developer Intern
    company: Co-operators
    company_url: https://www.cooperators.ca
    summary: Modernized an internal IT service request platform with React, Node.js and MongoDB.
    stack: [JavaScript, React, Node.js, MongoDB]

  - dates: Jan – Apr 2022
    title: Software Engineer Intern
    company: Electrovaya
    company_url: https://electrovaya.com
    summary: Wrote a Python tool that pulls diagnostics from forklift batteries, cutting on-site service costs by 96.7% per incident.
    stack: [Python]

# ------------------------------------------------------------
#  ABOUT PAGE — EDUCATION
# ------------------------------------------------------------
education:
  - dates: 2021 – 2026
    title: BASc Engineering
    school: University of Waterloo
    summary: TODO

# ------------------------------------------------------------
#  PROJECTS PAGE (newest first)
#  "live" and "source" are optional links; delete a line to hide that link.
#  "live_label" / "source_label" (optional) change the link text.
#  "status" is optional: shipped, in progress, or archived.
# ------------------------------------------------------------
projects:
  - year: 2026
    title: EVA
    summary: A wearable suit that tracks muscle activation and movement during lifting, with a React Native app that gives real-time form feedback. Software lead.
    stack: [React Native, TypeScript]
    live: https://successful-radiator-9f3.notion.site/EVA-A-Wearable-Gym-Form-Correction-System-183c6cb96df983a9981b8121bda48eda
    live_label: Write-up # optional: changes the link text (default "Live")

  - year: 2026
    title: TODO
    summary: TODO
    stack: [TODO]
    status: in progress
    live: https://example.com
    source: https://github.com/na3th9n/TODO

# ------------------------------------------------------------
#  LABELS (rarely changed)
#  Every other bit of wording on the site.
# ------------------------------------------------------------
labels:
  nav_about: About
  nav_projects: Projects
  experience_heading: Experience
  education_heading: Education
  projects_heading: Projects
  email_prefix: My email is
  live_link: Live
  source_link: Source
  theme_dark: Dark
  theme_light: Light
  not_found_title: Not found
  not_found_link: Back to About
```

### How the code reads it (Claude Code builds this; Nathan never touches it)

- `src/lib/content.ts`: reads `content.yaml` with the **`yaml`** package at build time, validates it with **`zod`**, converts it to typed objects, and throws a readable error (file, path, problem) if anything is missing or mistyped. Optional fields default sensibly (no `stack` → no pills; no `photos` → no slideshow; `focus` → `center`). Photo `file` names resolve to `/photos/<file>`, and the loader checks each file exists in `public/photos/` (clear error if not).
- `src/lib/inline.tsx`: renders `**bold**` and `[text](url)` in strings, escaping everything else.
- Pages import only from `src/lib/content.ts`. Treat any literal user-facing string found in a component during review as a bug and move it into `content.yaml`.
- Also generate a JSON Schema for `content.yaml` from the zod schema and reference it on the first line (`# yaml-language-server: $schema=./content.schema.json`), so VS Code (with the free YAML extension) autocompletes field names and underlines mistakes while editing. Optional nicety; skip if it takes more than 15 minutes.

### Placeholder photos

Create three placeholder SVGs in `public/photos/` (flat tones labelled "PHOTO 1/2/3", deliberately different aspect ratios: portrait, landscape, square) so the fixed-frame cropping is visible in testing.

### `README.md` → a short "How to edit your site" section

Plain steps, no jargon: where `content.yaml` is, how to edit it on GitHub in the browser, how to add a job/project/photo (copy a block), how to replace the résumé, and what to do if the build fails (read the error, fix the named line, commit again).

---

## File structure

```
src/
  app/
    layout.tsx           # fonts, ThemeProvider, sidebar-state head script, shell, metadata, <Analytics />
    page.tsx             # About
    projects/page.tsx    # Projects
    not-found.tsx
    globals.css          # tokens (light + .dark), base type, focus, reduced motion, sidebar widths
  components/
    Sidebar.tsx          # "use client"; expanded/collapsed, persisted, mobile top bar
    NavLink.tsx          # "use client"; active state via usePathname, aria-current
    ThemeToggle.tsx      # "use client"; pill (expanded) or icon-only (collapsed)
    ThemeProvider.tsx    # "use client"
    PhotoSlideshow.tsx   # "use client"; fixed 300×375 frame, crossfade, pause rules
    CursorTrail.tsx      # "use client"; canvas pixel trail (desktop) + click explosion
    NameHeader.tsx       # "use client"; typed name + block cursor + font cycle, fixed-height box
    Row.tsx              # shared dates/year + content row with top rule
  lib/
    content.ts           # loads + validates content.yaml at build time (yaml + zod)
    inline.tsx           # renders **bold** and [links](url) inside content strings
content.yaml             # ← ALL site wording, photos, jobs, projects, links (Nathan edits only this)
content.schema.json      # generated; editor autocomplete for content.yaml
public/
  photos/placeholder-{1,2,3}.svg
  resume.pdf             # placeholder until Nathan adds his
  icon.svg               # "NX" monogram
DECISIONS.md             # judgment calls made during the build
README.md                # how to edit content and photos
```

---

## Phases (run straight through)

### Phase 0 — Scaffold and first deploy

1. `npx create-next-app@latest portfolio --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`
2. Install `next-themes`, `@vercel/analytics`, `yaml` and `zod`. Commit.
3. `gh repo create portfolio --public --source=. --remote=origin --push` (if the name is taken, use `nathan-portfolio`).
4. Deploy: `npx vercel link --yes` then `npx vercel --prod --yes`, and connect the Git repository (`npx vercel git connect` or the project settings) so pushes to `main` auto-deploy. Record the production URL in `README.md`.

### Phase 1 — Shell, theme, collapsible sidebar

- Fonts, tokens, ThemeProvider, ThemeToggle (no flash, no hydration warnings).
- Sidebar expanded/collapsed with persisted state, keyboard shortcut, mobile top bar; divider line; main column.

### Phase 2 — About

- `content.yaml` (exactly as specified, with all comments), `src/lib/content.ts` loader + validation, inline renderer, placeholder photos.
- Hero row with NameHeader (typing + cursor + font cycle), the fixed-frame PhotoSlideshow, experience and education rows.

### Phase 3 — Projects and cursor trail

- `/projects`, active nav, 404 page.
- `CursorTrail` as specified (canvas, desktop only, reduced-motion aware).

### Phase 4 — Polish and verify

- Metadata (title, description, Open Graph), favicon, `<Analytics />`, `README.md`, `DECISIONS.md`.
- Verify with Playwright (pre-installed in Claude Code environments, or `npx playwright`) against `npm run build && npm start`, and fix anything that fails:
  - Screenshots at 360px, 768px and 1440px in light and dark, sidebar expanded and collapsed.
  - Check that the Experience divider lines end at the same x as the intro text column, never under the photo, with the sidebar expanded and collapsed.
  - Measure the intro text block's bounding box while the slideshow cycles through all three placeholders (portrait/landscape/square): it must not move or resize by even 1px.
  - Reload with the sidebar collapsed: no width jump on first paint. Reload in dark mode: no light flash.
  - Keyboard-only pass: Tab order, visible focus, `[` shortcut, prev/next buttons.
- `npm run build` and `npm run lint` clean. Push.

### Phase 5 — Hand-off

- Confirm the production URL loads the latest commit.
- Print a short summary for Nathan: live URL, repo URL, what's left for him (fill the TODOs in `content.yaml`, add photos to `public/photos/`, add `public/resume.pdf`), and anything noted in `DECISIONS.md`.

---

## Definition of done

- [ ] Live on Vercel, auto-deploying from GitHub `main`
- [ ] Two pages (About, Projects) with sidebar nav and the vertical divider line
- [ ] Sidebar collapses to a 72px rail and back; state persists with no jump on reload
- [ ] Big `Nathan Xie` header with the photo slideshow beside it: fixed 300×375 frame, 900ms crossfade every 5s, pause on hover/focus/hidden tab, reduced-motion respected
- [ ] Changing photos (any aspect ratio) never shifts the intro text
- [ ] Light/dark toggle, defaults to system, no flash on reload
- [ ] Name types out with a blinking block cursor, deletes and retypes in the next font, with zero layout shift; fonts subset with `text=` so they add only a few KB
- [ ] Pixel explosion on click/tap that never blocks links or buttons
- [ ] Pixel cursor trail on desktop, off on touch and reduced motion, no visible grid, no performance hit
- [ ] Works at 360px, 768px, 1440px
- [ ] Every word, photo, job, project and link comes from `content.yaml`; no user-facing text in any `.ts`/`.tsx` file
- [ ] A deliberate mistake in `content.yaml` fails the build with a readable message naming the field
- [ ] `npm run build` and `npm run lint` clean
- [ ] Clean history of small, meaningful commits
