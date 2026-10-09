---
title: Integrations
description: Use hyper-models from HyperView, and Hyper3-CLIP as a Haystack embedder with Lorentz retrieval.
section: Guides
order: 2
---

## HyperView

HyperView recognises hyper-models names and routes them to the `hyper-models` provider:

```python
space = dataset.compute_embeddings(model="hyper3-clip-v1")
dataset.compute_visualization(space_key=space, layout="poincare")
```

HyperView itself needs no PyTorch. Install `hyper-models[ml]` only when you pick a PyTorch-backed model. See [Embeddings and layouts](/docs/hyperview/embeddings-and-layouts/).

## Haystack

```bash
pip install "hyper-models[ml,haystack]>=0.4.0"
```

```python
from hyper_models.integrations.haystack import (
    Hyper3DocumentImageEmbedder,
    Hyper3TextEmbedder,
)
```

Both components return native 513-coordinate Lorentz embeddings and pin the released model revision by default. Authenticate with `hf auth login`, `HF_TOKEN` or `HF_API_TOKEN` first.

Store image embeddings unchanged. To rank by the Lorentz inner product with a dot-product document store, negate the first coordinate of the query only:

```python
from haystack.components.converters import OutputAdapter

lorentz_query = OutputAdapter(
    template="{{ [-embedding[0]] + embedding[1:] }}",
    output_type=list[float],
)
```

This computes `-q0*x0 + qs·xs`, so higher scores are nearer. Pass `scale_score=False` to the retriever to keep raw scores, and do not normalise the vectors. The [complete example](https://github.com/Hyper3Labs/hyper-models/blob/main/examples/haystack_lorentz_retrieval.py) indexes images and runs text queries.

When loading a saved pipeline you trust, allow the module explicitly:

```python
Pipeline.loads(yaml_text, allowed_modules=["hyper_models.integrations.haystack"])
```
