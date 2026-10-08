---
title: Models
description: Load hyperbolic and other non-Euclidean embedding models through hyper-models and use them in HyperView.
section: Reference
order: 8
---

[hyper-models](https://github.com/Hyper3Labs/hyper-models) is a model zoo for non-Euclidean embedding models. HyperView uses it whenever you pass one of its model names to `compute_embeddings`.

```bash
uv pip install hyper-models          # torch-free: ONNX models
uv pip install "hyper-models[ml]"    # adds torch-backed models such as Hyper3-CLIP
```

## Available models

| Name | Geometry | Runtime |
| --- | --- | --- |
| `hyper3-clip-v1` | Hyperbolic | torch (`[ml]`) |
| `hycoclip-vit-s`, `hycoclip-vit-b` | Hyperbolic | ONNX |
| `meru-vit-s`, `meru-vit-b` | Hyperbolic | ONNX |
| `uncha-vit-s`, `uncha-vit-b` | Hyperbolic | torch (`[ml]`) |
| `megadescriptor` | Spherical | timm (`[ml]`) |

`hyper_models.list_models()` returns the current list, and `hyper_models.get_model_info(name)` its source, licence and loader. Check each model's licence before commercial use.

## In HyperView

```python
space = dataset.compute_embeddings(model="hyper3-clip-v1")
dataset.compute_visualization(space_key=space, layout="poincare")
```

## On its own

```python
import hyper_models
from PIL import Image

model = hyper_models.load("hycoclip-vit-s")
model.geometry                # 'hyperboloid'
embeddings = model.encode_images([Image.open("image.jpg")])
```

Weights download from the Hugging Face Hub on first use.
