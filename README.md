# hyper³labs docs

Source for [hyper3labs.github.io](https://hyper3labs.github.io): documentation for the hyper³labs open-source projects [HyperView](https://github.com/Hyper3Labs/HyperView), [hyper-models](https://github.com/Hyper3Labs/hyper-models) and [hyper-scatter](https://github.com/Hyper3Labs/hyper-scatter).

The HyperView Spaces gallery lives at [spaces.hyper3labs.com](https://spaces.hyper3labs.com) (source: [hyperview-spaces](https://github.com/Hyper3Labs/hyperview-spaces)). Company news and articles live on [hyper3labs.com](https://hyper3labs.com).

## Structure

```text
app/                         Next.js routes (static export)
  page.tsx                   Home: one card per project
  docs/[project]/[slug]/     One page per file in content/docs/<project>/
  blog/the-geometry-mistake/ Redirect to the article on hyper3labs.com
content/docs/<project>/*.md  Documentation pages (frontmatter: title, description, section, order)
lib/projects.ts              The projects, their install commands and links
```

## Develop

```bash
npm install
npm run dev
```

## Edit the docs

Add or edit a Markdown file in `content/docs/<project>/`. `section` is one of `Get started`, `Guides` or `Reference`; `order` sets the position in the sidebar and the previous/next links. To add a project, add it to `lib/projects.ts` and create its folder. Check commands and APIs against the current release before publishing.

## Deploy

Pushing to `main` builds the static export and deploys it to GitHub Pages.

---

© hyper³labs
