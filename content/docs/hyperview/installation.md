---
title: Installation
description: Install HyperView as a command-line tool or a Python package, and give your coding agent the HyperView skill.
section: Get started
order: 1
---

HyperView supports Python 3.10 to 3.13. It runs locally: your datasets, embeddings and workspaces stay on your machine under `~/.hyperview`.

## As a command-line tool

```bash
uv tool install --upgrade hyperview
```

This puts the `hyperview` command on your `PATH`. Check it with `hyperview --help`.

## As a Python package

```bash
uv pip install hyperview
```

Use this when you build datasets from a notebook or script with `import hyperview as hv`. `pip install hyperview` works too.

## Non-Euclidean models

Hyperbolic and spherical models come from [hyper-models](/docs/hyper-models/models/). The base install is torch-free and covers the ONNX models; torch-backed checkpoints such as Hyper3-CLIP need the `ml` extra:

```bash
uv pip install "hyper-models[ml]"
```

## Give your coding agent the skill

HyperView ships an agent skill that teaches coding agents how to drive the CLI:

```bash
hyperview skill install
```

To install it into the current project for a specific agent:

```bash
hyperview skill install --scope project --agent github-copilot --yes
```

## Where HyperView keeps its state

Everything lives under one home directory, `~/.hyperview` by default:

| Variable | Moves |
| --- | --- |
| `HYPERVIEW_HOME` | The whole tree: datasets, media and the workspace registry |
| `HYPERVIEW_DATASETS_DIR` | Only the datasets |

For a reproducible build, point `HYPERVIEW_HOME` at a fresh directory so nothing from an earlier run leaks in.

Next: [Quickstart](/docs/hyperview/quickstart/).
