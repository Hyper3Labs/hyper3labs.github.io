# ABO Catalog — Business-Persona Review Verdict

**Role:** Ecommerce catalog / search lead (business persona)
**App under review:** ABO Catalog — `http://127.0.0.1:3001/spaces/abo-catalog/`
**Model comparison shown:** Hyper3-CLIP vs CLIP product retrieval, side-by-side

## Scores

| Dimension | Score | Notes |
|-----------|-------|-------|
| Business clarity | **9 / 10** | Answer-first, plain-language story; strong for a non-technical buyer of the capability |
| Visual | **8 / 10** (bounded) | Grounded in DOM structure + screenshots; not pixel-verified visually |

## What I tested (interactions)

- **Default state:** Auto-loads an ABO Retrieval Workbench with a default anchor product (Stone & Beam metal-and-glass pendant chandelier) and two parallel result panels — Hyper3-CLIP and CLIP — each showing 10 ranked products with thumbnails and titles, plus summary scorecards.
- **Summary cards:** "Image → neighbours" default shows **Hyper3-CLIP keeps 9 of 10 in-family** vs **CLIP 3 of 10**; the winner and the drift (home bed and bath, earrings) are stated in plain words.
- **Modes:** Switched between **Text → product** and **Image → neighbours**; both update the source/refs and re-populate the result panels (state actually changes, not static controls).
- **Prepared text input:** Text→product mode loads a full shopper-ready query (grey velvet sofa with material/brass/wood/tufted attributes) chosen from preset catalog-question buttons (Lighting fixture, Chandelier-style fixture, Sandal Footwear) — no free-text/backend-only field is faked in the UI.
- **Text-mode outcome:** Tooltips/copy show **exact target rank — Hyper3-CLIP #1 vs CLIP #20** for the grey velvet target, a compelling business proof point.
- **Both models:** Both panels render and update together across modes.
- **Selection:** "Select anchor" and per-result "Select <image>.jpg" controls present on every row.
- **Maps/media:** Hyper3 map supports pan, point select, shift-lasso, wheel zoom, and settings (screenshots captured).
- **Right panel / walkthrough:** "Toggle right panel" works; right copy includes a short walkthrough line — "Search from a product photo or a detailed shopper request." (present but subtle; see must-fix).
- **Full shell:** Left rail shows Catalog browse + Hyper3-CLIP · Product results; top View menu has Samples / Scatter / Reset Layout.
- **Console:** No browser console/errors captured on load or during the tested interactions.

## Evidence

- Screenshots: `screenshots/default.png`, `screenshots/textmode-rightpanel.png`, `screenshots/text-mode*.png`, `screenshots/image-mode*.png`, `screenshots/hyper3-map*.png` (pan, point-select, lasso, zoom).
- DOM snapshots (session `ds-abo`): anchor + 10-row result panels, scorecards, mode buttons, preset query buttons, right-panel toggle.
- Companion: `report.md` (issue template, unfilled).

## Must-fix only

1. **Right-panel walkthrough is too subtle.** The explanatory line ("Search from a product photo or a detailed shopper request.") is present but not prominent, and the panel is collapsed by default. For a business-first first-run, surface a short 2–3 line "why this matters" (image search old vs new, what the rank means) instead of hiding it behind a toggle.
2. None — no functional, console, or interaction-blocking issues found; both models, both modes, maps, selection, and results all update correctly.

## Overall

Strong, business-readable demo: the product answers "does the model find the right product?" with a clear winner, plain-language family/drift explanation, and exact-rank proof (#1 vs #20). Well suited for an ecommerce catalog lead evaluating image-based retrieval. Only polish item is making the guiding copy more prominent.
