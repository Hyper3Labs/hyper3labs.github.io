# ABO Catalog — Static Export Read-Only Review

**Reviewer role:** Ecommerce catalog/search product lead (demo reviewer, not code author)
**URL:** http://127.0.0.1:3001/spaces/abo-catalog/
**Method:** Live browser dogfooding (DOM + interaction + console) — no source inspected
**Score: 3/10**

---

## Target user / job / question

**Target user:** A retail/catalog product lead or ML evaluator evaluating HyperView + Hyper3-CLIP against CLIP for product search & image-based retrieveal.

**Job-to-be-done:** Decide, quickly and credibly, whether Hyper3-CLIP gives more relevant text→product and image→neighbour retrieval than CLIP on a real product catalog (ABO).

**The question this demo must answer:** "For a shopper-style request, does the model land on the right product family — and how much better is Hyper3-CLIP than CLIP?"

---

## Executive summary

The walkthrough's **narrative, prepared cases, and scoring framework are strong and business-relevant** — the right panel is prominent on the right with clear Text→product / Image→neighbours modes and specific cases (Lighting fixture, Chandelier, Sandal), each with an in-family drift explanation and an H3 vs CLIP score. That part reads well.

However, the demo **fails its core purpose: the actual retrieved products never appear.** In both modes, the left "Product results" and "neighborhood" panels stay empty ("No samples available … Results: 0", zero images) for every prepared case. Only the separate "Catalog browse" tab shows the raw 531-sample grid. So a lead cannot see *which* products each model returned — cannot judge relevance with their own eyes, cannot compare H3 vs CLIP on the actual thumbnails. The experiment is reduced to two self-reported score numbers.

There is also non-deterministic rendering: the right walkthrough ABO RETRIEVAL WORKBENCH frequently fails to mount on load (appears as empty/`1` until a reload), making the demo unusable as a first impression.

---

## Core flow pass/fail

| Core flow | Status | Evidence |
|---|---|---|
| Initial hierarchy/question clarity (right-panel walkthrough prominent) | PASS (when rendered) | Right 400px panel top-most shows ABO RETRIEVAL WORKBENCH; left two product panels |
| Every prepared text case (Lighting/Chandelier/Sandal) sets active question | PASS | ACTIVE CATALOG QUESTION updates + scores change (e.g. Lighting 9/10 vs 3/10) |
| Results populate with retrieved product images | **FAIL (critical)** | All prepared cases leave "Product results"/neighborhood panels empty, Results: 0, 0 thumbnails |
| H3 vs CLIP comparison visible on actual products | **FAIL** | Only summary scores shown; no product images/thumbnails to compare |
| Image→neighbours anchor visibility | **FAIL** | Clicking Image→neighbours shows no anchor/neighbor set; panels stay empty |
| Catalog browse grid (dataset present) | PASS | 531 samples with real Amazon product names + thumbnails |
| Read-only semantics: no live-inference text input | PASS | No text input / backend affordance exposed; github+discord icons present |
| Walkthrough renders reliably on load | **FAIL (high)** | Intermittently blank/`1` until reload |
| Console / network errors | PASS | No console errors logged |

---

## Issues (priority order)

### ISSUE-001 — Prepared cases never show retrieved products (critical)
Clicking "Lighting fixture", "Chandelier-style fixture", or "Sandal" updates the ACTIVE CATALOG QUESTION and the H3/CLIP score text, but the left **Product results** and both **neighborhood** panels remain empty with `Results: 0` and no thumbnails. For the demo's stated job ("does the model find the right product?"), the product results are the very thing being evaluated. Without them a lead can't assess relevance visually or compare models.
- Evidence: `06-lighting-case-empty-results.png`, `08-sandal-case-empty-results.png`; left panel `imgCount=0` after case click while walkthrough anchor thumbnails render at x≈1052.
- Recommendation: whichever flow the panel is calling to populate `product results` (selection / neighborhood) is not wiring the query into the static panel state. Investigate the runtime→static selection/neighbour propagation; the "Catalog browse" panel proves the dataset + media pipeline works, so the gap is the query→results wiring.

### ISSUE-002 — Image→neighbours mode shows nothing (critical/high)
Clicking "Image → neighbours" changes the mode flag but produces no anchor image at the top of the neighbor panel and no neighbor thumbnails — same empty state. The core "image-anchor retrieve" story (which the ABO motif depends on) is not demonstrated.
- Evidence: after clicking Image→neighbours, panels still "No samples available"; no anchor img in neighborhood panel.
- Recommendation: in image mode, seed an anchor selection whose image appears at the top of the neighborhood panel and whose neighbours render below, mirroring how the browse grid renders media.

### ISSUE-003 — Right walkthrough panel nondeterministically fails to render (high)
On a fresh load the ABO RETRIEVAL WORKBENCH sometimes renders fully, sometimes only shows the tab title + `1` (no body, no case buttons). It required reload loops (often 2–3 attempts, sometimes more) to get the content. This makes first impression unreliable for the exact audience the demo targets.
- Evidence: repeated `hasProto:false` samples in review log; `screenshots/05` required reload to materialize.
- Recommendation: fix mount/loading race in the static export so the walkthrough is present on first paint; add a stable placeholder so it never appears blank.

### ISSUE-004 — Results are not visually comparable side-by-side (medium–high)
The left side splits into Hyper3-CLIP and CLIP panels, but since results never populate, the promised head-to-head on the same query never materializes as actual thumbnails. Even when scores are shown, a lead is left trusting two numbers with no product-level evidence.
- Recommendation: when results are fixed, render each model's top-N product grid in its left panel so the drift ("incl. fineearring, handbag") is visible as actual images, not just text.

### ISSUE-005 — Minor polish: duplicate/ambiguous tab group + "Results: 0" during active query (low)
The top tab group lists all six panels (Hyper3-CLIP results, Catalog browse, H3 neighborhood, CLIP results, CLIP neighborhood, Catalog questions) in one bar and the visible body always reflects Catalog browse. During a "Text→product" case the left panel still reads the raw dataset grid with "Results: 0" — a confusing mismatch between the active question and what's displayed.
- Recommendation: when a query is active, surface the results/neighborhood view (not dataset browse) and remove the contradictory "Results: 0 / No samples available" empty state.

---

## What's good
- The question-driven framing ("Does the model find the right product? Search from a photo or a detailed shopper request") is exactly the business question.
- Prepared cases map to real category-drift concerns (lighting vs jewelry; sandals vs handbags) with plain-English explanations.
- Per-case H3 vs CLIP family scores (9/10 vs 3/10) are instantly scannable and compelling — if backed by real thumbnails.
- Read-only shell is correctly minimal (github + discord icons, no fake live-inference input, no removed badge wording).
- The Catalog browse tab proves the embedded dataset (531 real Amazon products) and media pipeline are intact.

---

## Recommendation
Prioritize wiring the prepared-case → results/neighborhood state so each Text→product and Image→neighbours interaction renders the actual top-N product thumbnails per model, then re-verify the mount reliability. That single fix turns a strong narrative into a functional, persuasive demo. Score today: **3/10** (narrative strong, but the central artifact — visual retrieval results — is missing and the walkthrough is unreliable on load).
