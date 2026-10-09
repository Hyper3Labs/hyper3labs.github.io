---
title: Spaces
description: Export a workspace as a bundle and share it as a Static Space that runs in any browser, or a Live Space backed by a HyperView server.
section: Guides
order: 7
---

`hyperview export` packages a workspace — samples, media, layouts, panels and the view you arranged — into one folder, the **bundle**. The bundle is what you share. It can be hosted two ways:

| | Static Space | Live Space |
| --- | --- | --- |
| Runs | Plain files on any static host | `hyperview serve --from <bundle>` in a container |
| Visitors can | Browse samples, layouts, selections, lasso, filters, precomputed neighbours and collections, static-compatible panels | Everything a Static Space does, plus typed text queries, new embeddings and layouts, Python tools |
| Cost | Free static hosting, no cold start | A running server |

Choose a Static Space unless visitors need to bring their own input and compute a new result. Every Space in the [HyperView Spaces gallery](https://spaces.hyper3labs.com/) is a Static Space.

## Export

```bash
hyperview export my-workspace --out dist/my-space
```

Add `--similarity-k 25` to precompute 25 nearest neighbours per sample, so the neighbour view works without a server. It is off by default to keep bundles small.

The bundle holds a `hyperview-static.json` manifest, the frontend, data shards, media and thumbnails, layouts, collections and panel modules. Its paths are relative, so the same folder works at a domain root or under any sub-path of another site. If the exporter reports warnings about missing media or panel sources, fix them before publishing.

For a reproducible export, build the workspace with a fresh `HYPERVIEW_HOME`.

## Publish

Always start with a dry run; it prints the plan and touches nothing:

```bash
hyperview publish dist/my-space --to hf:your-org/my-space --dry-run
```

| Target | Command |
| --- | --- |
| Hugging Face Static Space | `hyperview publish dist/my-space --to hf:your-org/my-space` |
| Hugging Face Live Space | `hyperview publish dist/my-space --to hf:your-org/my-space-live --mode live` |
| Cloudflare Workers | `hyperview publish dist/my-space --to cloudflare` |
| A folder in your own site | `hyperview publish dist/my-space --to dir:site/spaces/my-space` |

Hugging Face publishing reads `HF_TOKEN` or a prior `hf auth login`. For a Live Space that needs extra packages (pinned with `==`) or more than the free CPU:

```bash
hyperview publish dist/my-space --to hf:your-org/my-space-live --mode live \
  --extra-pip "hyper-models[ml]==0.4.0" \
  --hardware cpu-upgrade
```

The same calls are available from Python:

```python
hv.publish("dist/my-space", to="hf:your-org/my-space", mode="static")
```

## Run a bundle locally as a Live Space

```bash
hyperview serve --from dist/my-space
```

HyperView restores the dataset, embedding spaces, layouts, collections and extensions recorded in the bundle and opens exactly the exported view. `--public` serves it without a session token: visitors keep the viewer commands, while extension installs, tools and compute stay closed.

## Panels in a Static Space

Panels work in a Static Space when they only read data through the panel SDK. A panel marked `static_compatible = false` stays visible with its reason, and its code is not published. See [Extensions](/docs/hyperview/extensions/).

## Start from an example

The source of every example lives in [Hyper3Labs/hyperview-spaces](https://github.com/Hyper3Labs/hyperview-spaces). Copy a folder from `demos/`, change the constants at the top of its `demo.py` to point at your dataset and models, and export.
