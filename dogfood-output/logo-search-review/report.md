# Logo Search — Read-Only Static Space Review

**Reviewer persona:** Brand / creative-asset operations lead evaluating whether this read-only gallery space proves nuanced creative-brief → exact-asset retrieval and supports archive QA.
**Space reviewed:** `http://127.0.0.1:3001/spaces/logo-search/` (served static snapshot; header label under the gallery server).
**Date:** 2026-08-29
**Method:** Browser dogfooding only (DOM snapshots, interactive-DOM walkthroughs, geometry checks, console log check, image-load check). No source/product code inspected.

---

## Target user / job / question

- **Target user:** Brand manager or creative/asset operations lead accountable for finding the correct logo (or near-exact variant) from a large archive when the ask is a *concept/brief*, not a filename.
- **Job-to-be-done:** "Given a written creative brief, reliably surface the exact intended asset on the first review screen — and let me verify/critique that result."
- **Core question the demo answers:** *Can a text-to-image retrieval model (Hyper3-CLIP) beat a standard CLIP baseline at placing the exact asset at rank #1, and does the interactive shortlist + style map let me inspect and explain why?*

---

## Core flow: PASS (with caveats)

The primary path works end-to-end in the static read-only build:

1. **Narrative + brief selection:** Four curated briefs (Barber, Floral, Construction, Hospitality) are selectable; each updates a structured "Creative brief" attribute card (category, motif, composition, palette, style) and an "Original catalog caption" `<details>` block. Selecting Brief 02 (Floral) visibly updated the model shortlist. ✔
2. **Exact-asset ranking:** Hyper3-CLIP places the exact asset at #1 for the Barber brief; OpenAI CLIP only at #30, with per-model explanation text. Clear H3-vs-CLIP contrast. ✔
3. **Shortlist ↔ Samples sync:** "Show exact target" filters the Samples panel down to the single exact asset and marks it (rank badge + pressed state). Sample selection buttons reflect the prepared result ranks. ✔
4. **Style map:** Labeled "Logo style map · Hyper3 multimodal" at the top of the Samples panel; explains families across all 160 logos. **However, it is non-interactive** (presence verified by DOM label/geometry only; no canvas/zoom/pan/lasso found — see issue below).
5. **Right-panel prominence:** The custom "Creative brief desk" walkthrough panel is **right-docked at full height by default** (x≈1050, full viewport height) — satisfies the "prominent side panel" requirement. ✔
6. **Read-only semantics:** Header reads "This Shared Space is an interactive, read-only snapshot"; **no input fields and no functional-looking text-search box** are present — backend-only controls are correctly hidden. ✔
7. **Console / network / assets:** **0 errors and 0 warnings** on reload; all 5 thumbnails load successfully (0 broken images). ✔
8. **Full-resolution inspect:** Double-clicking a sample opens a full-resolution viewer modal with a working Close button. ✔

---

## Score: **6.5 / 10**

Solid, functional read-only walkthrough that genuinely demonstrates exact-asset retrieval and brief→entrypoint selection. It loses points for a misleading, non-functional "style map" affordance (the most valuable differentiator), a benchmark table whose headline meaning is not immediately legible, no interactive scatter/map, and a couple of flat result details that undercut the "nuanced retrieval" claim.

---

## Prioritized issues

### High severity

**H1 — "Logo style map" is a misleading non-interactive affordance.**
*Evidence:* `R044` found the only SVG cluster to be 11–16px icons (y≈7–84); no canvas/scatter and no zoom/pan/lasso controls anywhere (`A026`, `A027`); body scroll height 769 (fits one viewport) so nothing is off-screen. The demo text even says "The map shows visual and style families across all 160 logos" — but no actual map is rendered or interactable.
*Impact:* For a brand lead the style map is the "aha" that proves retrieval understands visual families, not just captions. A painted title with no map reads as broken/misleading rather than premium.
*Recommendation:* Either render an actual interactive style scatter map (with pan/zoom/lasso) for the shortlist/context, or remove the "map" title + supporting sentence. If scatter is removed, the model-comparison story must carry the weight alone.

**H2 — Benchmark table meaning not immediately legible.**
*Evidence:* `R079`/body text: "FULL BENCHMARK / Across all 160 logo briefs / Exact logo found — Hyper3 / CLIP — Ranked first 35.6% (57) / Within top five 73.1% (117)". `A` noted headline text ("Hit@1 · 160 captions / H3 35.6% · CLIP 16.3%") had been moved to a table at the bottom.
*Impact:* A busy creative-asset lead skimming the state sees percentages without instantly grasping "H3 finds the exact logo first 2.2x more often." The synthetic/curated probe disclaimer is only at the very bottom.
*Recommendation:* Lead with a single headline delta ("Hyper3 finds the exact logo first 2.2× more often than CLIP"), then the table as supporting detail; keep the disclaimer near the headline, not buried.

### Medium severity

**M1 — "Open copy to the right" has no observable effect when the panel is already right-docked.**
*Evidence:* `R065` — toggling the right panel moved the desk from x≈1058 to x≈8 (works); but the in-panel "Open copy to the right" button produced no geometry change.
*Impact:* A visible button that does nothing looks broken.
*Recommendation:* Make the in-panel button meaningful (e.g. opens the walkthrough in a new full window/tab "copy"), or remove it from the read-only panel.

**M2 — Sample-panel settings menu expands but its options were not visible in the captured DOM.**
*Evidence:* `C068`/`A047` — the settings button expanded (`[expanded]`) but no thumbnail-size options appeared in the interactive DOM snapshot; subsequent visible-DOM reads returned empty until reload, hinting at an overlay/modal state.
*Recommendation:* Verify the settings popover renders its options (thumbnail sizes) reliably in the read-only build; if it's a full-screen overlay, cap/rein in its geometry.

**M3 — Result-detail narrative is thin for the non-exact models.**
*Evidence:* OpenAI CLIP row: "Category is right, but the flower-ring and leaf-arch composition are absent; exact asset first appears at #30." `R053` — showing a #30 result depends on this explanation; a brand lead can't see *what* the model actually returned at #30 without browsing.
*Recommendation:* Let each model row's "Show exact target"-style interaction reveal that model's own returned set (or its attributed match), so the failure case is visible, not just narrated.

### Low severity

**L1 — Body text has mild marketing phrasing.**
*Evidence:* `08-final-bodytext.txt` — "Each brief searches the same 160-logo catalog. Mean reciprocal rank improves by +0.207." and "Four curated wins illustrate retrieval behavior"; the table is labeled "Full benchmark" over "Across all 160 logo briefs" but is a synthetic/curated probe.
*Recommendation:* Keep it factual ("synthetic/curated probe, aggregated over 160 paired captions"); avoid implying an independent production benchmark.

---

## Right-panel prominence & layout: PASS

Custom walkthrough panel is right-docked at full height by default; right-panel toggle relocates it to the left; bottom-panel toggle had no visible effect (not a blocker for the walkthrough goal). Body fits one viewport with no page scroll — good for a demo.

## Read-only / backend-only control hygiene: PASS

- 0 `<input>` fields found.
- No functional-looking text-query search box (static capability correctly hides inference search). ✔
- GitHub + Discord icons remain in the shell (intended — this is just read-only HyperView, not a stripped site). ✔

---

## Recommendations summary

1. **Render a real interactive Logo style map** (with zoom/pan/lasso) or remove the map title/sentence — do not leave a dead affordance. (Highest impact.)
2. **Lead the benchmark with the headline delta**, move the table under it, and surface the curated/synthetic disclaimer near the top.
3. **Fix/remove the inert "Open copy to the right"** control in the read-only panel.
4. **Make each model's failure case inspectable** (show that model's own returned shortlist), not just narrated.
5. **Verify the sample-panel settings popover** renders its options reliably.
6. Keep the right-docked walkthrough panel and the clean read-only shell (no search box) — both are working as intended.

---

## Navigation / evidence record

- `current.png`, `initial.png`, `initial-full.png` — initial state
- `right-open.png`, `right-loaded.png`, `right-loaded-13s.png` — right-panel prominence
- `brief-tab-click.png`, `brief-tab-dispatch.png` — brief switching
- `screenshots/02-brief2-floral.png` — Floral brief state
- `screenshots/03-browse-all-full.png` — Browse all 160 logos
- `screenshots/04-exact-target.png` — Show exact target
- `screenshots/05-openai-model.png` — OpenAI CLIP result + benchmark
- `screenshots/06-settings-or-overlay.png` — settings popover state
- `screenshots/07-dblclick-inspect.png` — full-res viewer modal
- `screenshots/08-final-default.png` — final clean default state
