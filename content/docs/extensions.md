---
title: Extensions, tools and panels
description: Add your own computations and views to HyperView with a folder of Python and JSX — no frontend fork, no build step.
section: Guides
order: 6
---

**Extensions ship things, tools compute things, panels show things.**

An extension is a folder you keep in your own repository, usually under `.hyperview/extensions/`. It contributes tools, panels or both. HyperView loads it at runtime: no frontend fork, no build step, no change to HyperView itself.

```text
.hyperview/extensions/selection-profile/
  extension.toml
  tools.py
  panel.jsx
```

## Tools

A tool is a Python function that takes JSON parameters and returns JSON:

```python
from hyperview.tools import RunContext, tool

@tool("selection_profile.summarize")
def summarize(ctx: RunContext, *, top_k: int = 10) -> dict:
    ids = list(ctx.workspace.ui.selected_ids)
    return {"selected": len(ids), "dataset": ctx.dataset.name}
```

`RunContext` gives the tool the active dataset and workspace. A tool has no UI, so it must make sense when called headlessly: from a panel, the CLI (`hyperview tools run`), a notebook or a coding agent. That makes every tool an agent tool by construction.

## Panels

A panel is a view in the workspace. Its renderer is a JSX module whose default export is a React component built from `window.HyperViewPanelSDK`:

```jsx
const { React, components, hooks } = globalThis.HyperViewPanelSDK;
const { Panel, PanelHeader } = components;
const { useSelection, useTool } = hooks;

export default function SelectionProfile({ panelId }) {
  const { selectedIds } = useSelection();
  const { runTool } = useTool();
  const [summary, setSummary] = React.useState(null);

  return (
    <Panel>
      <PanelHeader title="Selection profile" />
      <p>{selectedIds.length} selected</p>
      <button onClick={async () => setSummary(await runTool("selection_profile.summarize"))}>
        Summarize
      </button>
      {summary && <pre>{JSON.stringify(summary, null, 2)}</pre>}
    </Panel>
  );
}
```

The SDK provides hooks for selection, collections, panel state (`usePanelState`) and tools (`useTool`), and the same `Panel`, `PanelHeader` and toolbar components the built-in panels use. Panels read data through the SDK rather than raw `fetch`, which is what lets them work unchanged in a [Static Space](/docs/spaces/).

## The manifest

```toml
name = "selection-profile"
description = "Summarize the current selection"

[[tools]]
file = "tools.py"

[[panels]]
id = "selection-profile"
title = "Selection profile"
position = "right"
file = "panel.jsx"
```

A panel that cannot work without a server — because it calls a tool, for example — declares it, and a Static Space shows the reason instead of a broken panel:

```toml
static_compatible = false
static_reason = "Requires the selection_profile.summarize tool."
```

## Load an extension

```bash
hyperview extension add .hyperview/extensions/selection-profile --workspace demo --add-panels
```

or from Python, before the workspace opens:

```python
hv.launch(dataset, extensions=[".hyperview/extensions/selection-profile"])
```

HyperView ships a complete worked example, the `reference` extension: `hyperview extension add --shipped reference --workspace demo`.

## Arrange panels with a view

An extension says a panel *exists*; a view says which panels open, where, and in what state:

```python
view = hv.ui.View(
    hv.ui.Horizontal(
        hv.ui.Samples(id="results"),
        hv.ui.Scatter(id="map", title="Map", layout_key=layout_key),
    ),
    hv.ui.ExtensionPanel(
        id="profile",
        extension="selection-profile",
        panel="selection-profile",
        position="right",
    ),
)
hv.launch(dataset, view=view, extensions=[".hyperview/extensions/selection-profile"])
```

## Two rules of thumb

1. **If it computes, it is a tool.** A panel renders data it can get from the SDK; anything that needs the live dataset or a model belongs in a tool the panel calls.
2. **Precompute for sharing.** Static Spaces run panels but not tools, so put the interesting results into collections or panel state before you export.
