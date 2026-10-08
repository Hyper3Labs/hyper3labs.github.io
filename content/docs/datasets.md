---
title: Datasets
description: Create persistent datasets from Hugging Face or a local folder, and understand how HyperView stores and updates them.
section: Guides
order: 3
---

A dataset is a named, persistent collection of samples: media, labels, embeddings and layouts.

```python
import hyperview as hv

dataset = hv.Dataset("my_dataset")                  # persistent (default)
scratch = hv.Dataset("scratch", persist=False)      # in memory only
```

Persistent datasets are stored as Lance tables under `~/.hyperview/datasets/` (see [Installation](/docs/installation/#where-hyperview-keeps-its-state) to move them).

## From Hugging Face

```python
dataset.add_from_huggingface(
    "uoft-cs/cifar100",
    split="train",
    image_key="img",
    label_key="fine_label",
    max_samples=1000,
)
```

- `config=` selects a named subset or configuration.
- `text_key=` loads text, or image–text pairs.
- `streaming=True` stops reading once `max_samples` rows have arrived instead of materialising the split. Combined with `shuffle=True`, sampling becomes buffer-based; tune `shuffle_buffer_size=`.

## From a folder

```python
dataset.add_images_dir("/path/to/images", label_from_folder=True)
```

With `label_from_folder=True`, each image takes the name of its parent folder as its label. JPEG, PNG and WebP files are picked up recursively.

## Adding is additive

Samples are identified by ID and never deleted implicitly:

| You do | HyperView does |
| --- | --- |
| Add samples | Inserts new ones, skips existing IDs |
| Request fewer than exist | Keeps what is there |
| Request more than exist | Adds only the difference |
| Compute embeddings | Embeds only samples without them |
| Add samples after a layout | Refits the layout |

```python
dataset.add_from_huggingface(..., max_samples=200)  # 200 samples
dataset.add_from_huggingface(..., max_samples=400)  # +200 → 400
dataset.add_from_huggingface(..., max_samples=300)  # no change
```

## Inspect and manage

```python
len(dataset)              # number of samples
dataset.labels            # unique labels
dataset[sample_id]        # one sample

hv.Dataset.list_datasets()
hv.Dataset.exists("my_dataset")
hv.Dataset.delete("my_dataset")
```

From the command line: `hyperview dataset list`, `hyperview dataset inspect <name>` and `hyperview dataset create <name> --hf-dataset … | --images-dir …`.
