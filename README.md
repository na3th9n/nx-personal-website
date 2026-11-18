# Nathan Xie — personal site

Live: https://nx-personal-website-owhj.vercel.app/

Three pages (About, Projects, Experience), light/dark mode, a collapsible sidebar and a
photo slideshow. Built with Next.js and deployed on Vercel; every push to
`main` redeploys automatically.

---

## How to edit your site

**Everything you see on the site — every word, photo, job, project and link —
lives in one file: [`content.yaml`](./content.yaml).** You never need to open
any other file.

### Edit from anywhere (no terminal)

1. Open `content.yaml` on GitHub.
2. Click the pencil icon (✏️) in the top-right of the file.
3. Change the text.
4. Click **Commit changes**.
5. Wait about a minute. The live site updates by itself.

### Edit on your laptop

1. Open `content.yaml` in your editor and change the text.
2. Run `npm run dev` and open http://localhost:3000 to preview. It refreshes as
   you save.
3. Commit and push when you're happy.

> Tip: in VS Code, install the free **YAML** extension (by Red Hat). It will
> autocomplete field names and underline mistakes in `content.yaml` as you type.

### Common changes

- **Add a job or project:** copy an existing block in `experience:` or
  `projects:` (every line from its `- ` down to just before the next `- `),
  paste it where it should go, and change the text. Newest goes first.
- **Add or change photos:**
  1. Put the image in the `public/photos/` folder (on GitHub: open that folder
     → **Add file** → **Upload files**).
  2. In `content.yaml`, under `photos:`, change a `file:` to the image's exact
     name (for example `me-at-the-beach.jpg`) and update its `alt` and `caption`.
  Any size or shape works; photos are cropped to fit the frame. If the wrong
  part gets cropped, add a line like `focus: 50% 20%` to keep the top.
- **Replace the résumé:** upload your new PDF to the `public/` folder with the
  same name as the current one (`nathan-xie-resume.pdf`) so it replaces it. If
  you use a different name, update the Résumé `url:` in `content.yaml` to match
  and delete the old PDF.
- **Bold and links:** write `**bold**` or `[link text](https://example.com)` in
  any text.

### If the site doesn't update

A typo in `content.yaml` (wrong indentation, a missing field) stops the update,
but the live site keeps showing the last working version, so nothing breaks.

1. On GitHub, open the **Commits** list. A red ✗ next to your commit means the
   build failed.
2. Click the ✗ → **Details** to open the Vercel log, and look for a message like:
   ```
   content.yaml (line 95) → experience[2].title is missing
   ```
3. Fix that line in `content.yaml` and commit again.

Common causes: using a tab instead of two spaces, or text containing `: `
(colon + space) that isn't wrapped in double quotes.

---

## For developers

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (also validates content.yaml)
npm run lint
npm run schema   # regenerate content.schema.json after changing src/lib/schema.ts
```

- `content.yaml` is parsed and validated at build time (`src/lib/content.ts`,
  `yaml` + `zod`), so it adds no JavaScript to the page.
- Components live in `src/components/`; styles and theme tokens are in
  `src/app/globals.css`.
- Judgment calls made during the build are recorded in [`DECISIONS.md`](./DECISIONS.md).
