# GeoSpatial Shared Space review

- Target: `http://127.0.0.1:3001/spaces/geospatial/`
- Review date: 2026-08-29
- Persona: geospatial imagery analyst / ML lead
- Mode: static Shared Space (read-only)
- Overall score: **7/10**

## Business question

The useful question for a remote-sensing team is: **which embedding keeps the top-10 aerial neighbours in the same land-use class and operational parent, and where does each model fail?** That maps to a real decision: whether Hyper3-CLIP can reduce false positives and analyst review time compared with a familiar CLIP baseline.

The four prepared probes (aircraft, forest, storage tank, airport) make that question concrete. The page also earns credibility by showing an explicit airport regression where CLIP wins, rather than claiming Hyper3 wins everywhere.

## What worked

- Three fresh reloads consistently rendered both model panels and the right-side walkthrough.
- Hyper3-CLIP and OpenAI CLIP each showed an anchor plus ten image neighbours; all observed image/API/panel requests returned HTTP 200. No browser console errors were observed.
- AIRCRAFT, FOREST, INDUSTRIAL, and AIRPORT buttons changed both anchors, neighbour grids, and the per-case metrics. Reset restored the aircraft probe. Evidence: `screenshots/02-forest.png`, `screenshots/33-industrial.png`, `screenshots/34-airport.png`, `screenshots/23-reset.png`.
- The right-side `Aerial identity audit` panel is prominent, has a clear question, plain-language interpretation, aggregate metrics, and an explicit limitation/evaluation-scope disclosure.
- The archive-topology tabs expose real scatter maps. Drag-to-pan visibly moved the map; the UI advertises scroll zoom and Shift-drag lasso. GitHub and Discord links remain present. No text-query or live-inference control is exposed in static mode.

## Scorecard

| Dimension | Score | Notes |
| --- | ---: | --- |
| Business question | 8/10 | Concrete retrieval/QA question with a useful regression case. |
| Evidence and metrics | 7/10 | Top-10 exact/group/off-group counts and aggregate precision are useful, but provenance is incomplete. |
| Model comparison credibility | 6/10 | Side-by-side lists are strong; duplicate embedding labels in topology controls are misleading. |
| Interaction | 7/10 | Prepared probes, reset, ranked lists, scatter pan, and archive tabs work. Lasso/point feedback is opaque. |
| Walkthrough prominence | 9/10 | Correctly placed in a right-side panel and visible on first load. |
| Read-only fidelity | 9/10 | Full HyperView chrome and media remain; unsupported text search/inference is absent. |
| Visual polish | 8/10 | Clean dense dark layout; some truncation and empty-label states remain. |

## Prioritized findings

### ISSUE-001 — Duplicate embedding labels undermine model identity (medium/high)

**Evidence:** `screenshots/06-dropdown-duplicate.png` shows the first topology selector opened with two identical entries, both `openai/clip-vit-base-patch32`. The second topology selector has the same problem. The surrounding tabs say `Archive topology · Hyper3 multimodal` and `Archive topology · CLIP multimodal`, but the actual control does not identify which embedding is selected.

**Impact:** An analyst cannot verify that the plotted topology corresponds to the claimed model. This is a serious credibility problem for the comparison, even though the two maps visibly differ (`screenshots/07-dropdown-second-map.png`).

**Recommendation:** Preserve distinct human-readable labels (for example, `Hyper3-CLIP v0.5` and `OpenAI CLIP ViT-B/32`) in the exported embedding metadata and selector options, scoped to each panel.

### ISSUE-002 — Scatter map has no visible legend or point identity (medium)

**Evidence:** `screenshots/45-scatter-hover.png` shows a hover ring but no tooltip or record label. `screenshots/44-scatter-labels-fine.png` shows the map with the label setting changed to Fine but still no visible labels. Toggling the labels panel produces an empty globe state (`screenshots/47-scatter-click-labels.png`).

**Impact:** The archive topology is a field of colored dots without a key explaining class colors or a way to identify a tile. A geospatial analyst cannot connect a cluster to `airport`, `forest`, or a concrete image without leaving the map for the prepared lists.

**Recommendation:** Include a compact class legend and make hover/click expose the tile id/thumbnail/class; show a clear empty state if no labels panel content is available.

### ISSUE-003 — Evaluation provenance is not reproducible (medium)

**Evidence:** At the bottom of the walkthrough (`screenshots/27-evaluation-bottom.png`), `Evaluation scope` says the run is a bounded 60-tile RESISC45 probe and that exact model repository revisions were not captured.

**Impact:** A business or ML lead cannot reproduce the reported 33.2% vs 27.8% aggregate precision or establish which model artifacts produced it. The caveat is honest, but the demo is being used to support a model decision.

**Recommendation:** Persist model/repository revisions, dataset revision, run date, and metric definition in the static evidence. Keep the bounded-probe disclaimer, but make the run auditable.

### ISSUE-004 — Airport regression callout is shown for every probe (low/medium)

**Evidence:** `screenshots/02-forest.png` and `screenshots/33-industrial.png` both show the paragraph `Airport is the case here where OpenAI CLIP does better.` even though Forest and Industrial are selected. The dynamic per-case copy below it is otherwise correct.

**Impact:** The note reads like a stale result for the current tile and competes with the selected-case question. It can make a non-airport user wonder whether the displayed metrics are mismatched.

**Recommendation:** Label it as a cross-probe note (for example, `Known regression: airport`) or render it only in the airport case.

### ISSUE-005 — Lasso/point selection lacks downstream feedback (medium)

**Evidence:** A Shift-drag lasso changes point emphasis (`screenshots/39-lasso-fresh-before.png` → `screenshots/40-lasso-fresh-after.png`), and clicking a point produces a selection ring (`screenshots/46-scatter-click.png`), but the walkthrough remains on the same prepared tile and exposes no selected-count, tile metadata, or changed-results indicator.

**Impact:** The interaction appears to work visually but gives no confirmation of what was selected or how selection affects the business question. This is especially confusing in a read-only collaboration artifact.

**Recommendation:** Show `N selected` plus the selected tile ids/thumbnails in a small selection summary, or explicitly state that map selection is independent of the prepared retrieval audit.

### ISSUE-006 — Workspace title is an internal slug (low)

**Evidence:** The HyperView header on `screenshots/38-final-reload.png` reads `resisc45_clip_hyper3clip_curated_side_by_side`.

**Impact:** The gallery card is business-friendly, but a copied/shared URL opens with an implementation slug rather than a clear title.

**Recommendation:** Set the workspace display name to something like `GeoSpatial retrieval — Hyper3-CLIP vs CLIP` while retaining the slug as an internal id.

### ISSUE-007 — Industrial probe label truncates in the walkthrough (low)

**Evidence:** In `screenshots/33-industrial.png`, the `INDUSTRIAL` button visibly truncates `Storage tank / built environment` with an ellipsis at the available width (the accessible text is longer).

**Impact:** The selected probe is not fully legible at the default viewport and has no apparent tooltip.

**Recommendation:** Widen or stack the label, or provide a tooltip/accessible description on hover.

## Verification notes

- Static page remained on a single localhost server; no Docker was used.
- All observed `runtime.json`, dataset, embedding, collection, panel JavaScript, search-index, samples, and thumbnail requests returned 200.
- `errors` and `console` were empty after load and after prepared-probe, reset, topology, scatter-settings, map-pan, lasso, point-click, and panel-toggle interactions.
- No static text search/live inference input was present, which is correct for a read-only Shared Space.
