import { ShaderVariant } from './index';

// Concept #1: Local Möbius lens warping a faint hyperbolic coordinate net
export const mobiusLens: ShaderVariant = {
  id: 'mobius-lens',
  name: 'Möbius Lens',
  description: 'A subtle conformal lens: local Möbius warp over a faint hyperbolic grid',
  mathStory:
    'Treat the screen as a calm patch of the Poincaré disk, where hyperbolic isometries are Möbius maps z ↦ (z−a)/(1−āz). The mouse sets a small parameter a, but we blend that isometry locally to create a gentle, conformal “lens”. The rings and rays are level sets of hyperbolic distance and angle, so interaction feels like a coordinate net bending in curved space rather than a flashy effect.',
  source: `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iScroll;

const float PI = 3.14159265358979323846;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 cmul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

vec2 cconj(vec2 z) {
  return vec2(z.x, -z.y);
}

vec2 cdiv(vec2 a, vec2 b) {
  float d = max(dot(b, b), 1e-6);
  return vec2(a.x * b.x + a.y * b.y, a.y * b.x - a.x * b.y) / d;
}

// Möbius transform: (z - a) / (1 - conj(a) * z)
vec2 mobius(vec2 z, vec2 a) {
  vec2 num = z - a;
  vec2 denom = vec2(1.0, 0.0) - cmul(cconj(a), z);
  return cdiv(num, denom);
}

float atanh_approx(float x) {
  x = clamp(x, -0.999, 0.999);
  return 0.5 * log((1.0 + x) / (1.0 - x));
}

// Hyperbolic distance to origin in the Poincaré disk model
float hypDist0(vec2 z) {
  float r = clamp(length(z), 0.0, 0.999);
  return 2.0 * atanh_approx(r);
}

float line01(float x, float w) {
  return 1.0 - smoothstep(0.0, w, x);
}

float stripe(float v, float freq, float w) {
  return line01(abs(sin(v * freq)), w);
}

vec2 clampToDisk(vec2 z, float rMax) {
  float r = length(z);
  float k = min(1.0, rMax / max(r, 1e-6));
  return z * k;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 res = iResolution.xy;
  float minRes = min(res.x, res.y);

  vec2 uv = (frag - 0.5 * res) / minRes; // roughly [-1,1]
  vec2 st = frag / res;                  // [0,1]

  // Deep, calm base color with a gentle vertical gradient
  vec3 col = vec3(0.008, 0.012, 0.020);
  col += vec3(0.006, 0.008, 0.012) * (0.35 + 0.65 * st.y);

  // Dither to reduce banding
  col += (hash(frag) - 0.5) * 0.008;

  float t = iTime;
  float scroll = iScroll;

  // Work in a soft Poincaré-disk-like patch (clamped for stability)
  vec2 p = uv * 1.10;
  p = clampToDisk(p, 0.999);

  // Mouse position mapped to the same coordinate space
  vec2 mouse = iMouse;
  if (mouse.x <= 0.0 && mouse.y <= 0.0) {
    mouse = 0.5 * res;
  }
  vec2 m = (mouse - 0.5 * res) / minRes;
  m *= 0.70; // keep the lens safely inside
  m = clampToDisk(m, 0.65);

  // A tiny conformal "lens" parameter (mouse + slow drift + scroll bias)
  vec2 drift = 0.06 * vec2(sin(t * 0.020), cos(t * 0.017));
  vec2 a = m * 0.35 + drift + vec2(0.0, (scroll - 0.5) * 0.04);
  a = clampToDisk(a, 0.65);

  // Local Möbius lens: blend identity with a disk isometry
  vec2 z = p;
  vec2 zIso = mobius(z, a);

  float d = length(z - a);
  float lens = 0.10 * exp(-6.0 * d * d);          // local influence
  lens *= 1.0 - smoothstep(0.75, 1.0, length(z)); // reduce near boundary
  z = mix(z, zIso, lens);

  float r = length(z);
  float hd = hypDist0(z);
  float ang = atan(z.y, z.x);

  // Faint hyperbolic coordinate net (distance shells + angular rays)
  float phase = t * 0.035 + scroll * 0.9;

  float rings = stripe(hd - phase * 0.55, 2.6, 0.08) * 0.7;
  float rays = stripe(ang + phase * 0.15, 7.0, 0.05) * 0.55;
  float weave = stripe(hd * 0.55 + ang - phase * 0.25, 3.0, 0.09) * 0.4;

  float grid = rings + rays + weave;

  // Fade so it stays subtle and doesn't pop at the edges
  float fade = smoothstep(0.10, 1.20, hd) * (1.0 - smoothstep(0.90, 1.03, r));
  grid *= fade;

  // Very subtle mouse emphasis (mostly expressed through warping)
  float dm = length(p - m);
  float mouseGlow = 0.06 * exp(-12.0 * dm * dm);

  vec3 gridColor = vec3(0.2, 0.8, 0.85);
  vec3 glowColor = vec3(0.15, 0.55, 0.6);

  col += grid * gridColor * 0.6;
  col += mouseGlow * glowColor * 2.0;

  // Gentle vignette
  float v = 1.0 - 0.25 * dot(uv, uv);
  col *= clamp(v, 0.0, 1.0);

  col = pow(col, vec3(0.95));
  gl_FragColor = vec4(col, 1.0);
}
`,
};
