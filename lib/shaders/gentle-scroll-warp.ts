import { ShaderVariant } from './index';

function makeGentleScrollWarpSource(direction: 1 | -1): string {
  return `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iScroll;

const float PI = 3.14159265358979323846;
const float TAU = 6.28318530717958647692;
const float WARP_DIR = ${direction.toFixed(1)};

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Simple scroll-driven warp: twist + radial bend
vec2 warpSpace(vec2 uv, float scroll) {
  float warpStrength = scroll * 0.8 * WARP_DIR;

  vec2 center = vec2(0.5);
  vec2 delta = uv - center;
  float dist = length(delta);
  float angle = atan(delta.y, delta.x);

  // Radial wave that bends the grid
  float radialWave = sin(dist * TAU * 1.5 - iTime * 0.08);
  float warp = 1.0 + warpStrength * 0.4 * exp(-dist * 2.0) * radialWave;

  // Twist around center
  float twist = warpStrength * 0.5 * exp(-dist * 1.2);
  angle += twist;

  vec2 warped = center + vec2(cos(angle), sin(angle)) * dist * warp;

  // Slow flowing ripples
  float slowTime = iTime * 0.05;
  warped.x += sin(uv.y * 6.0 + slowTime) * 0.012 * warpStrength;
  warped.y += cos(uv.x * 6.0 + slowTime) * 0.012 * warpStrength;

  return warped;
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float aspect = iResolution.x / iResolution.y;

  // Aspect-corrected coordinates
  vec2 uvCorrected = uv;
  uvCorrected.x *= aspect;
  uvCorrected.x -= (aspect - 1.0) * 0.5;

  // Mouse position in same space
  vec2 mouse = iMouse / iResolution.xy;
  mouse.x *= aspect;
  mouse.x -= (aspect - 1.0) * 0.5;

  float scrollRaw = clamp(iScroll, 0.0, 1.0);
  float scroll = pow(scrollRaw, 0.6);

  // Apply scroll-driven warp
  vec2 warpedUV = warpSpace(uvCorrected, scroll);

  // Mouse lens effect
  vec2 toMouse = warpedUV - mouse;
  float distToMouse = length(toMouse);
  float lensRadius = 0.28;
  float lensStrength = 0.15;
  float lensFactor = 1.0 - smoothstep(0.0, lensRadius, distToMouse);
  lensFactor = lensFactor * lensFactor;
  warpedUV -= toMouse * lensFactor * lensStrength;

  // Grid pattern
  float gridScale = 22.0;
  vec2 gridUV = warpedUV * gridScale;
  vec2 gridFract = fract(gridUV);

  float lineWidth = 0.04;
  float softness = 0.02;
  float hLine = smoothstep(lineWidth + softness, lineWidth, abs(gridFract.y - 0.5) * 2.0);
  float vLine = smoothstep(lineWidth + softness, lineWidth, abs(gridFract.x - 0.5) * 2.0);
  float gridLines = max(hLine, vLine);

  // Dots at intersections
  vec2 dotPos = abs(gridFract - 0.5) * 2.0;
  float dotDist = length(dotPos);
  float dots = smoothstep(0.18, 0.08, dotDist);

  float pattern = gridLines * 0.35 + dots * 0.55;

  // Subtle variation
  float t = iTime * 0.04;
  float variation = noise(gridUV * 0.2 + t) * 0.2 + 0.8;
  pattern *= variation;

  // Colors - muted research/product palette
  // Warm dark background, desaturated teal-gray grid
  vec3 bgColor = vec3(0.035, 0.035, 0.045);
  vec3 gridColor = vec3(0.25, 0.38, 0.42);
  vec3 highlightColor = vec3(0.4, 0.55, 0.58);

  // Mouse highlight
  gridColor = mix(gridColor, highlightColor, lensFactor * 0.5);

  // Base opacity
  float opacity = 0.5 + lensFactor * 0.25;

  vec3 color = mix(bgColor, gridColor, pattern * opacity);

  // Soft vignette
  float vignette = 1.0 - length(uv - 0.5) * 0.4;
  color *= vignette;

  // Very subtle breathing
  float breath = sin(t * 2.0) * 0.5 + 0.5;
  color += gridColor * pattern * breath * 0.015;

  gl_FragColor = vec4(color, 1.0);
}
`;
}

export const hyperbolicFlow: ShaderVariant = {
  id: 'hyperbolic-flow',
  name: 'Hyperbolic Flow',
  description: 'Curved grid with scroll-driven twist',
  source: makeGentleScrollWarpSource(1),
};
