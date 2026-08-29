# Fashion anchor synchronization re-check

Current export: `http://127.0.0.1:3001/spaces/fashion-products/`

The reviewer-requested Ampersand tee gate was re-run on the final export. After selecting **Photo match → Ampersand tee**:

- Hyper3-CLIP anchor: `WOMEN_Graphic_Tees_id_00000044_01_4_full`
- OpenAI CLIP anchor: `WOMEN_Graphic_Tees_id_00000044_01_4_full`
- Both anchor buttons expose `aria-pressed="true"` for that same sample.
- Both panels show six case-specific results and the walkthrough remains on the Ampersand tee case.
- Browser console and page errors remain empty.

Evidence: [`anchor-sync-current.png`](anchor-sync-current.png).

Result: **PASS** — the earlier cross-panel anchor desynchronization is not present in the current export.
