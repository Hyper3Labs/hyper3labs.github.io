---
title: CLI and agents
description: Drive a running HyperView workspace from the command line, so people and coding agents work on the same state.
section: Guides
order: 5
---

Everything you see in a HyperView workspace — datasets, layouts, selections, panels, jobs — is state owned by the server, not by the browser tab. The `hyperview` CLI reads and changes that same state. A coding agent that runs CLI commands is therefore working in the workspace you are looking at, and you see its changes as they happen.

## Workspaces

A workspace binds a dataset to a UI arrangement and its state.

```bash
hyperview workspace create imagenette-demo --dataset imagenette --activate
hyperview serve --workspace imagenette-demo --dataset imagenette
hyperview workspace list
```

## Control the UI

```bash
hyperview ui layout set --workspace imagenette-demo --layout-key <layout-key>
hyperview ui selection set --workspace imagenette-demo --ids sample-1,sample-8
hyperview ui panel definitions
```

## Run tools

Tools are Python functions contributed by [extensions](/docs/hyperview/extensions/). They take JSON parameters and return JSON, so they work the same from a panel, a script or an agent:

```bash
hyperview extension add .hyperview/extensions/selection-profile --workspace imagenette-demo
hyperview tools list
hyperview tools run selection_profile.summarize --workspace imagenette-demo
```

## Command groups

| Group | Purpose |
| --- | --- |
| `serve`, `status` | Run a workspace server; check what is running |
| `dataset` | Create, list and inspect datasets |
| `embeddings`, `layouts`, `jobs` | Compute spaces and layouts; follow jobs |
| `provider` | Register custom embedding providers |
| `workspace`, `ui`, `panel` | Manage workspaces and what they show |
| `extension`, `tools` | Install extensions; run their tools |
| `export`, `publish` | Package and host a workspace as a [Space](/docs/hyperview/spaces/) |
| `skill` | Install the HyperView agent skill |
| `commands` | List and run the runtime's control commands |

Add `--json` to most commands for machine-readable output. `hyperview <group> --help` lists the options.

## Set up your agent

```bash
hyperview skill install
```

The skill gives coding agents the command reference and the conventions above. Start a server, then ask your agent to, for example, "find the outliers in the hyperbolic layout and select them".
