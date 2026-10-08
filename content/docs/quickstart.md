---
title: Quickstart
description: Load an image dataset, compute embeddings, and open it as a HyperView workspace in a few lines.
section: Get started
order: 2
---

This walkthrough loads 1,000 CIFAR-100 images, embeds them with CLIP, and opens the result in your browser.

## From Python

```python
import hyperview as hv

dataset = hv.Dataset("cifar100")
dataset.add_from_huggingface("uoft-cs/cifar100", split="train", max_samples=1000)
dataset.compute_embeddings(model="openai/clip-vit-base-patch32")
dataset.compute_visualization()

hv.launch(dataset)
```

`hv.launch` starts a local server on port 6262 and opens the workspace. You see a sample grid and a scatter plot of the embedding layout; selecting points in one selects the same samples in the other.

The dataset is persistent. Run the script again and HyperView reuses the stored samples and embeddings instead of recomputing them.

## Add a non-Euclidean view

Hyperbolic models place general concepts near the centre of the Poincaré disk and specific ones towards the edge, which makes hierarchy visible:

```python
space = dataset.compute_embeddings(model="hycoclip-vit-s")
dataset.compute_visualization(space_key=space, layout="poincare")
```

See [Embeddings and layouts](/docs/embeddings-and-layouts/).

## From the command line

The same workspace can be created and served without writing Python:

```bash
hyperview dataset create cifar100 --hf-dataset uoft-cs/cifar100 --samples 1000
hyperview workspace create cifar-demo --dataset cifar100 --activate
hyperview serve --workspace cifar-demo --dataset cifar100
```

With the server running, compute embeddings and a layout into the live workspace:

```bash
hyperview embeddings compute --workspace cifar-demo --dataset cifar100 \
  --model-id openai/clip-vit-base-patch32 --layout euclidean
```

## Next steps

- Bring your own images: [Datasets](/docs/datasets/)
- Let an agent drive the workspace: [CLI and agents](/docs/cli-and-agents/)
- Share what you found: [Spaces](/docs/spaces/)
- See finished workspaces: [Examples](/examples/)
