import { ShaderVariant } from './index';

// Concept #3: True multipass feedback trails (portal / disk)
// Implements a dissipative advection–diffusion update in a feedback buffer.
export const feedbackPortal: ShaderVariant = {
  id: 'feedback-portal',
  name: 'Feedback Portal',
  description:
    'True feedback trails in a soft central portal; mouse injects faint dye into a slow vortex.',
  mathStory:
    'We evolve a dye field in a disk using a dissipative advection–diffusion step: the previous frame is back-traced along a gentle spiral (a stable focus) and lightly blurred to mimic diffusion, then exponentially faded. A small continuous source plus mouse injection perturbs the flow; because the buffer feeds itself (ping-pong), paths leave real temporal trails instead of redrawing “fake” streaks.',
  pipeline: {
    // Keep insertion order: feedback first (offscreen), image second (screen).
    sources: {
      feedback: `
precision mediump float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform sampler2D iChannel0;

vec2 rot90(vec2 p) { return vec2(-p.y, p.x); }

float hash12(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float portalMask(vec2 p, float radius) {
  float r = length(p);
  // 1.0 inside, 0.0 outside with a soft edge
  return smoothstep(radius, radius - 0.02, r);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / iResolution.xy;

  float minRes = min(iResolution.x, iResolution.y);
  vec2 p = (frag - 0.5 * iResolution.xy) / minRes;

  const float portalR = 0.58;
  float portal = portalMask(p, portalR);
  float r = length(p);

  // --- Velocity field (in "p" units per frame) ---
  // A stable spiral (damped rotation) + small time wobble.
  vec2 v = vec2(0.0);
  float swirl = (0.010 * exp(-2.0 * r * r) + 0.002);
  v += rot90(p) * swirl;
  v += -p * 0.006;
  v += 0.0016 * vec2(
    sin(0.35 * iTime + 6.0 * p.y),
    cos(0.30 * iTime + 6.0 * p.x)
  );

  // Mouse perturbation (very subtle): local swirl + drift.
  vec2 mP = (iMouse - 0.5 * iResolution.xy) / minRes;
  vec2 dm = p - mP;
  float md2 = dot(dm, dm);
  float mInflu = exp(-md2 / 0.010);
  v += rot90(dm) * (0.0030 * mInflu);
  v += dm * (0.0015 * mInflu);

  v *= portal;

  // Convert displacement in p-space to UV-space.
  vec2 toUv = vec2(minRes / iResolution.x, minRes / iResolution.y);
  vec2 uvBack = uv - v * toUv;

  // --- Advection + diffusion (5 taps) ---
  vec2 px = 1.0 / iResolution.xy;
  vec4 c0 = texture2D(iChannel0, uvBack);
  vec4 c1 = texture2D(iChannel0, uvBack + vec2(px.x, 0.0));
  vec4 c2 = texture2D(iChannel0, uvBack - vec2(px.x, 0.0));
  vec4 c3 = texture2D(iChannel0, uvBack + vec2(0.0, px.y));
  vec4 c4 = texture2D(iChannel0, uvBack - vec2(0.0, px.y));
  vec4 state = c0 * 0.60 + (c1 + c2 + c3 + c4) * 0.10;

  // Exponential fade (stronger outside the portal).
  float fade = mix(0.88, 0.988, portal);
  state *= fade;
  state *= portal;

  // --- Continuous faint source to keep motion visible even without mouse ---
  vec2 emitter = 0.22 * vec2(cos(0.12 * iTime), sin(0.10 * iTime));
  float eInk = exp(-dot(p - emitter, p - emitter) / (0.030 * 0.030));
  vec3 eCol = vec3(0.15, 0.3, 0.4);
  state.rgb += eCol * (0.04 * eInk) * portal;
  state.a += (0.05 * eInk) * portal;

  // Mouse dye injection (visible and persistent).
  float mInk = exp(-md2 / (0.018 * 0.018));
  vec3 mCol = vec3(0.2, 0.35, 0.5);
  state.rgb += mCol * (0.1 * mInk) * portal;
  state.a += (0.12 * mInk) * portal;

  // Visible rim to sell the "portal" boundary.
  float rim = exp(-pow((r - portalR) / 0.018, 2.0));
  state.rgb += vec3(0.1, 0.15, 0.2) * (0.02 * rim);
  state.a += 0.03 * rim;

  // Tiny dither prevents banding in slow fades.
  float d = (hash12(frag + fract(iTime)) - 0.5) * 0.002;
  state.rgb += d;

  gl_FragColor = clamp(state, 0.0, 4.0);
}
`,

      image: `
precision mediump float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform sampler2D iChannel0;

float hash12(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float portalMask(vec2 p, float radius) {
  float r = length(p);
  return smoothstep(radius, radius - 0.02, r);
}

vec3 toneMap(vec3 x) {
  // Soft filmic-ish curve using an exponential rolloff.
  x = 1.0 - exp(-2.2 * x);
  return pow(clamp(x, 0.0, 1.0), vec3(0.4545));
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / iResolution.xy;

  float minRes = min(iResolution.x, iResolution.y);
  vec2 p = (frag - 0.5 * iResolution.xy) / minRes;
  float r = length(p);

  const float portalR = 0.58;
  float portal = portalMask(p, portalR);
  float rim = exp(-pow((r - portalR) / 0.022, 2.0));

  vec4 state = texture2D(iChannel0, uv);
  vec3 dye = state.rgb;
  float dens = state.a;

  // Subtle chroma drift based on density and time.
  float h = 0.07 * iTime + 2.0 * dens;
  vec3 pal = 0.55 + 0.45 * cos(6.28318 * (h + vec3(0.0, 0.33, 0.67)));
  pal = mix(vec3(dot(pal, vec3(0.299, 0.587, 0.114))), pal, 0.65);

  vec3 glow = dye * pal * 2.5;
  glow += (dens * dens) * vec3(0.2, 0.3, 0.4);
  glow = toneMap(glow);

  // Background (dark but not too dark).
  vec3 bg = vec3(0.02, 0.03, 0.045);
  bg += 0.025 * vec3(0.0, 0.04, 0.08) * smoothstep(0.8, 0.0, r);

  // Compose: keep the effect mostly inside the portal.
  vec3 col = bg;
  col = mix(col, bg + glow, portal);

  // Rim highlight and a very soft vignette.
  col += rim * vec3(0.12, 0.18, 0.25) * 0.5;
  col *= 1.0 - 0.2 * r * r;

  // Mouse proximity brightens the rim.
  vec2 mP = (iMouse - 0.5 * iResolution.xy) / minRes;
  float md = length(p - mP);
  float mRim = exp(-md * 8.0) * rim;
  col += mRim * vec3(0.15, 0.2, 0.25) * 0.3;

  // Dither.
  col += (hash12(frag + iTime) - 0.5) * 0.003;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`,
    },
    channels: {
      // feedback reads its own previous frame (true feedback loop)
      feedback: { iChannel0: 'feedback' },
      // final image reads from feedback buffer
      image: { iChannel0: 'feedback' },
    },
  },
};
