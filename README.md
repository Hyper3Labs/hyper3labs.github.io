# hyper³labs Tool Documentation

The public documentation hub for tools created by hyper³labs. HyperView is the first documented tool; the home page combines its product documentation, quick start, core concepts, and a browsable collection of HyperView Spaces.

The site is intentionally structured to add more tools later without turning the documentation into a company marketing page.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

To build the docs site together with the six HyperView Static Spaces, using
one origin and stable `/spaces/<slug>/` paths:

```bash
npm run build:combined
npm run preview:combined
```

Open [http://localhost:3001/spaces/](http://localhost:3001/spaces/). The
mounting step copies the reviewed Space bundles from the sibling HyperView
repository and rebases them for their final paths.

With that preview server running, `npm run previews:capture -- --base
http://localhost:3001` rescreenshots the six Space preview cards in
`public/spaces/previews/` (`scripts/capture-space-previews.mjs`; it borrows
Playwright from the sibling HyperView checkout).

## Build & Deploy

```bash
npm run build
```

The site is deployed automatically via GitHub Pages on push to `main`.

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Graphics**: Custom WebGL shaders (hyperbolic geometry, Möbius transforms)

## Blog Authoring

Blog posts now use a per-post folder layout so each article has a stable slug and a clear place for its content.

```text
content/blog/
	_template/
		index.md
	my-post-slug/
		index.md
		assets/
			figure-1.png
			figure-2.png
		work/
			draft-plot.png
			notes.txt

public/blog/
	my-post-slug/
		assets/
			figure-1.png
			figure-2.png
```

Use `content/blog/<slug>/index.md` as the source of truth. Put published post files in `content/blog/<slug>/assets/` and reference them in markdown with relative paths like `./assets/figure-1.png`. Put draft plots, alternate exports, and scratch files in `content/blog/<slug>/work/`. The `sync:blog-assets` script runs before `dev` and `build` and copies only the published files into the generated `public/blog/<slug>/` path. The generated `public/blog/` directory is gitignored, and `work/` is gitignored too.

If you add or rename post assets while the dev server is already running, rerun `npm run sync:blog-assets` once.

## Untracked File Rules

- Commit source content and source assets under `content/blog/<slug>/...`
- Commit real app assets like `app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico`, and manifest icon PNGs in `public/`
- Do not commit generated `public/blog/` output

---

© hyper³labs
