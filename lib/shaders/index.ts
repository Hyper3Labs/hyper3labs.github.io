// Shader registry - add new shaders here
// Each shader must be GLSL ES 1.00 compatible (WebGL1)

export interface ShaderPipeline {
  // Shader sources keyed by shader-web-background stage name.
  // Note: insertion order defines the pipeline order.
  sources: Record<string, string>;
  // Optional Shadertoy-style channel wiring (sampler2D uniforms).
  // Each stage can bind iChannel0 to another stage buffer name.
  channels?: Record<string, { iChannel0?: string }>;
}

export type ShaderVariant =
  | {
      id: string;
      name: string;
      description: string;
      mathStory?: string;
      source: string;
    }
  | {
      id: string;
      name: string;
      description: string;
      mathStory?: string;
      pipeline: ShaderPipeline;
    };

// Import shader variants (curated selection)
import { hyperbolicFlow } from './gentle-scroll-warp';
import { mobiusLens } from './mobius-lens';
import { feedbackPortal } from './feedback-portal';

export const shaderVariants: ShaderVariant[] = [
  hyperbolicFlow,    // Default: gentle curved grid with scroll-driven twist
  mobiusLens,        // Local Möbius lens warping a hyperbolic grid
  feedbackPortal,    // True feedback trails (multipass)
];

export const defaultShaderId = 'hyperbolic-flow';

export function getShaderById(id: string): ShaderVariant | undefined {
  return shaderVariants.find((s) => s.id === id);
}
