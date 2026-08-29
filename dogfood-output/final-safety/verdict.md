# Visual Safety — Independent Business-Persona Review (Verdict)

**Reviewer role:** Trust & Safety Operations Lead (independent final review — no code/server changes made)
**App:** Visual Safety — http://127.0.0.1:3001/spaces/visual-safety/
**Date:** 2026-08-29
**Scope:** 4 queue cases × 2 models, real images/results/selection, miss/recall/precision benchmark, review walkthrough, shell surface, no empty/misleading controls or backend input, console/network errors.

## Overall Verdict

**SHIP WITH ONE FOLLOW-UP.** The core T&S review workflow is genuine and functional: real sample images load, per-model results render, selection updates the review card, the recall-first queue narrative and benchmark numbers are present and internally consistent, and the shell is quiet (no console/page/network errors). One control-surface item needs a follow-up before I'd call the UI fully trustworthy at scale.

| Dimension | Score | Notes |
|---|---|---|
| Queue cases & models (4 × 2) | **5 / 5** | All four cases switch correctly across both CLIP models; per-model sample sets differ. |
| Real images / results / selection | **4.5 / 5** | Real thumbnails + 640px content image; clicking loads confirmed sample. |
| Miss / recall / precision benchmark | **5 / 5** | Full metric block present and self-consistent. |
| Review walkthrough | **5 / 5** | Step-by-step review-operations text present and correct. |
| Shell surface (no empty/misleading controls) | **3.5 / 5** | Shell rich and error-free, but 6 icon buttons have no text/label. |
| Backend input | **5 / 5** | No text-input field exists on this surface (correct for the use case). |
| Console / network | **5 / 5** | No console or page errors; no HTTP ≥400 during tested interactions. |

**Composite: 4.6 / 5 — Ready to ship with one follow-up on icon-button labeling.**

## Evidence

### 1. Queue cases & models (2 model batches × 4 cases)
- Route returns HTTP 200 and renders a rich panel: dataset **openimages_visual_proxy_evidence_v3**, two batch panels **"The batch · Hyper3-CLIP"** and **"The batch · OpenAI CLIP"**, each showing Source + **7 samples**.
- Case switching across **Knife / Alcohol / Weapon / Hard case** updates the confirmed-item card and the per-model sample rows, e.g.:
  - Knife → confirmed "Kitchen and utility blades"; Hyper3-CLIP 5 exact / 2 related / 0 other / 0 manual; OpenAI 3 exact / 2 related / 0 other / 2 manual.
  - Weapon → "Handguns and related items"; Hyper3-CLIP 2 exact / 0 related / 5 other / 0 manual; OpenAI 2 exact / 1 related / 4 other / 0 manual.
  - Hard case → "A subtle wine scene" with distinct content image.
- Sample row labels differ between the two models per case (e.g., Knife rows mix "Exact label · Beer / Wine", "Other flagged item · Kitchen knife", "Check manually · …"), confirming per-model results are not a copy of one another.

### 2. Real images / results / selection
- Real image assets load: 15 thumbnail images plus a 640×426 **content** image in the review card (alt "Knife" with `/api/samples/…/content` source).
- **Selection works:** clicking a sample row triggers the selection-collection APIs (`/api/collections/selection:…/items.json`), which return **200**, and loads that sample's content image into the review card.
- Note: no selected-row highlight class is applied in the DOM on click, and there is no obvious "clear/deselect" control; state is inferred from the review card update rather than a visible selection affordance.

### 3. Miss / recall / precision benchmark
- "WHAT THE QUEUE MISSES" section present and internally consistent (n=60 harmful items):
  - False negatives (missed): **1 / 2**
  - Queue recall: **98.3% / 96.7%** (matches 1–2 of 60 missed)
  - False positives: **9 / 4**
  - Queue precision: **86.8% / 93.5%**
  - AUROC (chance 50%): **95.4% / 98.2%**
- Recall-first queue rationale ("A missed item ships harm to users; an extra queued item costs one human review") is present and matches the metrics shown.

### 4. Review walkthrough
- "Review batch walkthrough" / "REVIEW OPERATIONS" text present and correct: "One item was confirmed. What else belongs in the batch? … Compare the seven items a reviewer would inspect next."

### 5. Shell surface
- Controls present and functioning: **View** menu (working — re-renders content), **settings** menu, **right-panel toggle** (hide/restore verified via `right-hidden.png`/`right-restored.png`), **add samples**, and the per-sample row buttons.
- **26 buttons total; 6 have empty visible text.** These are icon-only buttons and were not individually meaning-labeled — see must-fix.
- No text-input controls exist on this surface (correct for a review queue; nothing to type).

### 6. Console / network
- **No console messages, no page errors, and no HTTP ≥400** during the primary and shell interaction runs.
- Two `net::ERR_ABORTED` entries on `selection:…/items.json` appeared during navigation; these are in-flight cancellation races (the same requests subsequently returned **200**), not real failures. Not counted as a defect.

## Must-Fix

1. **Label the 6 icon-only buttons.** Six of the 26 buttons render with no visible text and no confirmable accessible label. In a T&S review tool where an unlabeled control could send/confirm/clear an action, ambiguous icon buttons are a trust risk. Add a tooltip, `aria-label`, or text so every control's meaning is explicit — this is the only item blocking my full confidence in the shell surface.

## Non-blocking follow-ups (not must-fix)

- Add a visible selected-row highlight and a one-click "clear/deselect" control; selection is currently only inferable from the review card updating.
- Optionally expose a lightweight audit trail (who confirmed what, when) for accountability in a production T&S flow.

## Constraints / Method

- Independent review only — no code or server changes were made.
- Server verified up on port 3001 (page HTTP 200) before and during testing.
- Evidence from live DOM text, alt/attributes, selection-collection network behavior, console/page-error capture, and existing screenshots in `final-safety/screenshots/`. Direct pixel-level image inspection was limited in this environment (relied on DOM text, alt text, and captured screenshots).
