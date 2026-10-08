# HyperView documentation

Source for [hyper3labs.github.io](https://hyper3labs.github.io): the documentation site and examples gallery for [HyperView](https://github.com/Hyper3Labs/HyperView), the open-source embedding workbench from hyper³labs.

Company news and articles live on [hyper3labs.com](https://hyper3labs.com); this site covers the tools.

## Structure

```text
app/                      Next.js routes (static export)
  page.tsx                Home
  docs/[slug]/            One page per file in content/docs/
  examples/               Examples gallery
  spaces/, blog/…         Redirects for moved URLs
content/docs/*.md         Documentation pages (frontmatter: title, description, section, order)
content/examples.json     Generated gallery data — do not edit by hand
public/spaces/<slug>/     Mounted Static Space bundles, served at /spaces/<slug>/
public/spaces/previews/   Gallery preview images
scripts/                  Mounting, catalog and preview tooling
```

## Develop

```bash
npm install
npm run dev
```

## Edit the docs

Add or edit a Markdown file in `content/docs/`. `section` is one of `Get started`, `Guides` or `Reference`; `order` sets the position in the sidebar and the previous/next links. Check commands and APIs against the current HyperView release before publishing.

## Examples gallery

The gallery is generated from the registries in [Hyper3Labs/hyperview-spaces](https://github.com/Hyper3Labs/hyperview-spaces), the single source of truth for every HyperView Space. An entry appears only when visitors can open it: a Static Space mounted here, a Static Space on Hugging Face, or a Live Space that Hugging Face reports as running.

```bash
npm run sync:spaces      # copy reviewed bundles from ../HyperView/hyperview-spaces into public/spaces/
npm run sync:examples    # regenerate content/examples.json from the registries
npm run build:combined   # both, then build
npm run preview:combined # serve out/ at http://localhost:3001
```

After re-mounting, refresh preview images with `npm run previews:capture -- --base http://localhost:3001`. The deploy workflow regenerates `content/examples.json` from the registry on every build.

## Deploy

Pushing to `main` builds the static export and deploys it to GitHub Pages.

---

© hyper³labs
