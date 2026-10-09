---
title: Models
description: Every model in the hyper-models catalog, with its geometry, runtime, source and licence.
section: Reference
order: 3
---

| Name | Geometry | Dim | Runtime | Weights | Licence |
| --- | --- | ---: | --- | --- | --- |
| `hyper3-clip-v1` | Hyperbolic | 513 | PyTorch (`[ml]`) | [hyper3labs/hyper3-clip-v1](https://huggingface.co/hyper3labs/hyper3-clip-v1) | OpenMDW-1.0 |
| `hycoclip-vit-s`, `hycoclip-vit-b` | Hyperbolic | 513 | ONNX | [mnm-matin/hyperbolic-clip](https://huggingface.co/mnm-matin/hyperbolic-clip) | CC-BY-NC |
| `meru-vit-s`, `meru-vit-b` | Hyperbolic | 513 | ONNX | [mnm-matin/hyperbolic-clip](https://huggingface.co/mnm-matin/hyperbolic-clip) | CC-BY-NC |
| `uncha-vit-s`, `uncha-vit-b` | Hyperbolic | 513 | PyTorch (`[ml]`) | [hayeonkim/uncha](https://huggingface.co/hayeonkim/uncha) | Not stated upstream |
| `megadescriptor` | Spherical | 1024 | timm (`[ml]`) | [BVRA/MegaDescriptor-L-384](https://huggingface.co/BVRA/MegaDescriptor-L-384) | MIT |

Hyperbolic models return points on the hyperboloid (Lorentz model): the first coordinate is the time-like one. HyperView lays them out in the Poincaré disk.

## Papers

- HyCoCLIP: [Compositional Entailment Learning for Hyperbolic Vision-Language Models](https://arxiv.org/abs/2410.06912), ICLR 2025
- MERU: [Hyperbolic Image-Text Representations](https://arxiv.org/abs/2304.09172), ICML 2023
- UNCHA: [arXiv 2603.22042](https://arxiv.org/abs/2603.22042), CVPR 2026
- Hyper3-CLIP: [code and paper](https://github.com/Hyper3Labs/hyper3-clip)

`hyper_models.list_models()` always returns the catalog of the version you have installed.
