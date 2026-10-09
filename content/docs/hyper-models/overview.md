---
title: Overview
description: Install hyper-models, load a hyperbolic or spherical embedding model by name, and encode images.
section: Get started
order: 1
---

hyper-models is a catalog of non-Euclidean embedding models. Each model has a short name, and `load()` returns an object that encodes images the same way whichever runtime sits underneath.

## Install

```bash
uv pip install hyper-models
```

The base install has no PyTorch dependency and runs the ONNX models, HyCoCLIP and MERU. Models that need PyTorch, such as Hyper3-CLIP and UNCHA, need the `ml` extra:

```bash
uv pip install "hyper-models[ml]"
```

## Load and encode

```python
import hyper_models
from PIL import Image

model = hyper_models.load("hycoclip-vit-s")
model.geometry   # 'hyperboloid'
model.dim        # 513

embeddings = model.encode_images([Image.open("image.jpg")])   # shape (1, 513)
```

Weights download from the Hugging Face Hub on first use and are cached.

`load()` also takes `revision`, `token`, `local_files_only`, `device` and `local_path`. Pin `revision` when new embeddings must match an index you built earlier.

## Text and images in one space

Hyper3-CLIP encodes text and images into the same 513-coordinate Lorentz space:

```python
model = hyper_models.load("hyper3-clip-v1")
images = model.encode_images([Image.open("sofa.jpg")])
texts = model.encode_texts(["a grey velvet sofa"])
```

`hyper3-clip-v1` is gated. Accept its terms on [its Hugging Face page](https://huggingface.co/hyper3labs/hyper3-clip-v1) and run `hf auth login` before the first download.

## Inspect the catalog

```python
hyper_models.list_models()
info = hyper_models.get_model_info("hycoclip-vit-s")
info.hub_id    # 'mnm-matin/hyperbolic-clip'
info.loader    # 'onnx'
info.license   # 'CC-BY-NC'
```

Check each model's licence before commercial use. The full list is on [Models](/docs/hyper-models/models/).
