---
title: Embeddings and layouts
description: Compute embeddings with any Hugging Face or non-Euclidean model and project them into Euclidean, spherical or Poincaré layouts.
section: Guides
order: 4
---

An **embedding space** holds one vector per sample for one model. A **layout** projects a space into 2D or 3D coordinates for the scatter panel. A dataset can hold several of each, so you can compare models and geometries side by side.

## Compute embeddings

```python
space = dataset.compute_embeddings(model="openai/clip-vit-base-patch32")
```

The provider is chosen from the model name:

- Hugging Face model IDs such as CLIP run through the built-in `embed-anything` provider.
- Names from [hyper-models](/docs/hyper-models/models/), such as `hycoclip-vit-s` or `hyper3-clip-v1`, produce hyperbolic embeddings.

Pass `provider=` to choose explicitly, for example `open-clip`, `siglip`, `timm-image`, `sentence-transformers`, or a hosted API such as `openai`, `cohere`, `voyageai`, `jina` or `gemini-text`. `batch_size=` fits the work to your hardware. Samples that already have embeddings for this model are skipped. `hyperview.embeddings.list_embedding_providers()` lists what is installed, and `hv.register_provider` adds your own.

## Compute a layout

```python
dataset.compute_visualization(space_key=space, layout="euclidean")
```

| `layout` | Geometry | Default dimension |
| --- | --- | --- |
| `euclidean` | Flat plane | 2D (`euclidean:3d` for 3D) |
| `poincare` | Hyperbolic Poincaré disk | 2D |
| `spherical` | Sphere | 3D |

`method="umap"` (default) or `"pca"`; UMAP takes `n_neighbors`, `min_dist` and `metric`. Pass `force=True` to recompute an existing layout.

## Why more than one geometry

Many embedding failures live in the shape of the space: collapsed classes, weak separation, a hierarchy squeezed into a flat plane, a long tail pushed to the edge. A single fixed projection hides some of these. Hyperbolic space has room for tree-like structure, so general concepts sit near the centre of the disk and specific ones near the boundary; a spherical view matches models trained with cosine similarity.

## From the command line

With a workspace being served:

```bash
hyperview embeddings compute --workspace demo --dataset cifar100 \
  --model-id hycoclip-vit-s --layout poincare

hyperview layouts compute --workspace demo --dataset cifar100 \
  --space-key <space-key> --layout spherical
```

Both run as jobs in the server; `hyperview jobs list` shows their progress.
