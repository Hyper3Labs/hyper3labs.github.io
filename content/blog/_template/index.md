---
title: "Post title"
date: "2026-04-14"
description: "One-sentence summary for the blog index."
# Optional cover image — used on the landing page card AND for social share
# previews (Open Graph / Twitter). Ideal aspect ratio 2:1 (e.g. 2400x1200).
# cover: "./assets/cover.png"
# coverAlt: "Short alt text describing the cover image"
# Set showCover: false to keep the cover for previews but hide the hero figure
# inside the post itself (useful when the same image already appears in the body).
# showCover: true
---

Write the post body here.

Recommended structure:

- Keep the markdown entrypoint at `content/blog/<slug>/index.md`
- Keep post-specific files in `content/blog/<slug>/assets/`
- Put draft plots, alternate figures, notes, and unused exports in `content/blog/<slug>/work/`
- Reference those assets in markdown with relative paths like `![alt text](./assets/figure.png)`
- `npm run dev` and `npm run build` copy `assets/` into the generated `public/blog/<slug>/` path automatically
- `work/` is ignored by git and never published

## Section heading

Start with the core argument or result.