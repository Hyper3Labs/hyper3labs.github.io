# Precision Regions — final product review

**Target:** `http://127.0.0.1:3001/spaces/precision-regions/`  
**Persona:** Visual-search product lead evaluating exact object-region retrieval for annotation and search operations  
**Viewport:** 1440 × 900  
**Date:** 2026-08-29

## Verdict

- **Business clarity: 9/10.** The demo answers a concrete operational question immediately: given a language description and a source scene, which candidate region is the correct object? The side-by-side ranked lists make the model comparison understandable without explaining embeddings, while the right walkthrough anchors every result to its full source scene, target crop, description, and exact rank. The three examples cover credible workflows—property inspection, shelf search, and street-asset search—and the aggregate RefCOCOg table prevents three curated examples from being mistaken for the whole evaluation.
- **Visual quality: 9/10.** The walkthrough is prominent on the right, the two model result grids receive most of the canvas, and rank/target/selection states are visually unambiguous. The full HyperView shell, GitHub and Discord links, panel chrome, settings, and right-panel toggle remain present.
- **Release assessment:** Ready. I found no must-fix issue in this final pass.

## Interaction coverage

| Check | Result |
|---|---|
| Sofa with pillows | Hyper3 target is ranked **#1**; OpenAI CLIP target is **#20**. Source scene, boxed object, target crop, description, ranked grids, and aggregate benchmark are all visible. |
| Soap bottle | Hyper3 target is ranked **#1**; OpenAI CLIP target is **#12**. Both result grids and the right-side evidence update together. |
| Double-decker bus | Hyper3 target is ranked **#1**; OpenAI CLIP target is visible at **#4**. Both result grids and rank cards update correctly. |
| Model comparison | Hyper3-CLIP and OpenAI CLIP are deliberately shown side by side rather than hidden behind a switcher; example switching updates both simultaneously. Panel titles and source labels identify the model used. |
| Media and selection | All thumbnails rendered. Clicking an individual result moved the blue selection marker to that result. Clicking the source-scene/target control selected the exact target in both model panels. |
| Walkthrough prominence | The walkthrough occupies the full right column on load. The shell toggle collapses it and restores it correctly without damaging the two result panels. |
| Tabs and shell | Panel titles are task-specific and sensible: `Hyper3-CLIP · Top 5 regions`, `OpenAI CLIP · Top 5 regions`, and `Find the exact region`. Full HyperView shell, GitHub, Discord, View menu, settings, and right-zone control are present. |
| Static semantics | No backend-only text input or live-query affordance is exposed. Case selection, sample selection, panel settings, and local layout controls work in the Shared Space. |
| Errors | `agent-browser errors` and `agent-browser console` returned no errors after loading, switching all cases, selecting media, and collapsing/restoring the walkthrough. |

## Evidence

- [`01-initial.png`](screenshots/01-initial.png) — default sofa case and complete workspace.
- [`02-soap.png`](screenshots/02-soap.png) — soap case, exact target and rank comparison.
- [`03-bus.png`](screenshots/03-bus.png) — bus case, target visible at #1 vs #4.
- [`04-selection.png`](screenshots/04-selection.png) — manual selection moved to Hyper3 result #2.
- [`06-source-selection.png`](screenshots/06-source-selection.png) — source-scene control synchronized the exact target selection across both model panels.
- [`07-right-collapsed.png`](screenshots/07-right-collapsed.png) — right walkthrough collapsed through the full shell.
- [`08-right-restored.png`](screenshots/08-right-restored.png) — walkthrough restored to its intended prominent right-side position.

## Must-fix issues

None found.
