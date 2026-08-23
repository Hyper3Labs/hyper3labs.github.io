# HyperView Spaces gallery implementation

Updated 2026-07-23.

## Information architecture

The site is a documentation hub for tools built by hyper³labs. HyperView is
the first tool. Its overview remains on the documentation home page, while
`/spaces/` is a dedicated browse page for complete, read-only HyperView
artifacts. Each card leads to a full viewer at `/spaces/<slug>/` on the same
origin.

The collection is defined in `lib/spaces.ts`, so adding a Space requires one
data entry and one reviewed static export. Cards communicate the workflow,
modality, business question, and static/read-only status without presenting
the artifacts as screenshots or separate mini applications.

## Build and mount

`npm run build:combined` first builds the Next.js static export, then runs
`scripts/mount-hyperview-spaces.py`. The script validates and copies the six
reviewed bundles from `../HyperView/dist/landing-demos/` into
`out/spaces/<slug>/`.

HyperView's static export contract supports an explicit `mount_path`. The
copier preserves exported datasets and custom panels, overlays the current
packaged viewer shell, scopes shell/API/media URLs to the mount, and records
the deployment path in each manifest. This makes direct links and multiple
open Spaces independent on an ordinary static host.

## Files

- `app/spaces/page.tsx`: dedicated gallery route.
- `components/SpacesGallery.tsx`: gallery and compact home-page collection.
- `lib/spaces.ts`: extensible Space metadata and stable paths.
- `components/Header.tsx` and `components/DocsPortal.tsx`: navigation and
  documentation-home integration.
- `scripts/mount-hyperview-spaces.py`: deterministic combined-output builder.
- `package.json`: combined build and preview commands.

The HyperView repository contains the corresponding exporter, CLI, API,
frontend URL-resolution, tests, and static-hosting documentation changes.

## Verification

- `npm run build:combined`: passed; six bundles mounted.
- Next.js production build and TypeScript checks: passed.
- HyperView frontend ESLint and production build: passed.
- Focused HyperView tests: 53 passed.
- Desktop, tablet/mobile gallery and mobile viewer browser smoke tests:
  passed.
- Direct loads for all six viewer paths: passed.
- Multi-tab ABO Catalog and Precision Regions isolation: passed.
- Prepared-case interactions, Samples, and Scatter shells across all six
  viewers: passed.
- Browser console errors, failed network requests, and requests to legacy
  ports: none.

Screenshots and the local QA report are under
`dogfood-output/single-origin-gallery/`.

## Broader landing-page overhaul

The docs home should remain the stable tool index. Future tools can add their
own overview and artifact collections without crowding HyperView's route.
When the repository is published, the same combined static output can be
served by GitHub Pages; no per-Space service or runtime routing is required.
