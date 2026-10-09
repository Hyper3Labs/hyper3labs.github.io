---
title: Google Colab
description: Run HyperView inside a Google Colab notebook.
section: Reference
order: 9
---

HyperView works in Google Colab. Colab runs on a remote machine, so `localhost` is not reachable from your browser; HyperView detects Colab and serves the workspace through Colab's proxy instead.

```python
!pip install -q hyperview
```

```python
import hyperview as hv

dataset = hv.Dataset("cifar100", persist=False)
dataset.add_from_huggingface("uoft-cs/cifar100", split="train", max_samples=500)
dataset.compute_embeddings(model="openai/clip-vit-base-patch32")
dataset.compute_visualization()

hv.launch(dataset)
```

`hv.launch` prints an **Open HyperView in a new tab** button. Click it to open the workspace. The launcher page embeds the proxied app so it keeps working when the browser blocks third-party cookies.
