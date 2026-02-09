'use client';

import { useEffect, useRef, useState } from 'react';
import { Github, Play } from 'lucide-react';

// Resonance Field: interference shells that densify as curvature increases
const resonanceShader = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iScroll;

#define PI 3.14159265359
#define TAU 6.28318530718

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float band(float v, float w) {
    return smoothstep(w, 0.0, abs(v));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    float t = iTime;
    float s = clamp(iScroll, 0.0, 1.0);

    vec2 mouse = (iMouse - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    float md = length(uv - mouse);
    float lens = exp(-md * md * 6.0) * (0.15 + 0.18 * s);
    vec2 warped = uv + (uv - mouse) * lens;

    float r = length(warped);
    float a = atan(warped.y, warped.x);

    float spiralFreq = mix(2.0, 4.0, s);
    float radialFreq = mix(8.0, 15.0, s);

    float spiral = a * (6.0 + 2.0 * s) + log(r + 0.03) * radialFreq - t * 0.35;
    float spiralLine = band(sin(spiral), 0.18);

    float shells = band(sin(r * radialFreq - t * 0.45 + sin(a * spiralFreq + t * 0.1) * 0.6), 0.2);

    float interference = spiralLine * 0.8 + shells * 0.7;
    float rim = smoothstep(0.7, 0.98, r) * smoothstep(1.05, 0.92, r);

    vec3 base = mix(vec3(0.01, 0.015, 0.025), vec3(0.02, 0.03, 0.045), s);
    vec3 cool = vec3(0.16, 0.75, 0.9);
    vec3 warm = vec3(0.75, 0.4, 0.8);
    vec3 tint = mix(cool, warm, smoothstep(0.0, 1.0, r + s * 0.2));

    vec3 col = base + tint * interference * (0.5 + 0.4 * s);
    col += rim * vec3(0.1, 0.25, 0.35);
    col += lens * vec3(0.2, 0.8, 0.8) * 0.5;

    float vignette = 1.0 - r * r * 0.35;
    col *= vignette;

    col += (hash(gl_FragCoord.xy + t) - 0.5) * 0.012;

    gl_FragColor = vec4(col, 1.0);
}
`;

// Shader setup
declare const shaderWebBackground: any;

function getShaderWebBackground(): unknown {
  if (typeof shaderWebBackground !== 'undefined') return shaderWebBackground;
  // @ts-expect-error - dynamic global
  return window.shaderWebBackground;
}

let mouseX = 0, mouseY = 0, scrollY = 0, maxScroll = 1;

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  }, { passive: true });
}

function ShaderCanvas() {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let shaderScript = document.getElementById('image') as HTMLScriptElement | null;
    if (!shaderScript) {
      shaderScript = document.createElement('script');
      shaderScript.type = 'x-shader/x-fragment';
      shaderScript.id = 'image';
      document.head.appendChild(shaderScript);
    }
    shaderScript.textContent = resonanceShader;

    const start = () => {
      const swb = getShaderWebBackground() as any;
      if (!swb?.shade) return;

      const oldCanvas = document.getElementById('shader-web-background');
      if (oldCanvas) oldCanvas.remove();

      document.documentElement.classList.remove('shader-web-background-fallback');

      swb.shade({
        shaders: {
          image: {
            uniforms: {
              iTime: (gl: WebGLRenderingContext, loc: WebGLUniformLocation) =>
                gl.uniform1f(loc, performance.now() / 1000),
              iResolution: (gl: WebGLRenderingContext, loc: WebGLUniformLocation, ctx: any) =>
                gl.uniform2f(loc, ctx.width, ctx.height),
              iMouse: (gl: WebGLRenderingContext, loc: WebGLUniformLocation, ctx: any) =>
                gl.uniform2f(loc, ctx.toShaderX?.(mouseX) ?? mouseX, ctx.toShaderY?.(mouseY) ?? ctx.height - mouseY),
              iScroll: (gl: WebGLRenderingContext, loc: WebGLUniformLocation) =>
                gl.uniform1f(loc, Math.min(scrollY / maxScroll, 1.0)),
            },
          },
        },
        onError: () => document.documentElement.classList.add('shader-web-background-fallback'),
      });
    };

    if (getShaderWebBackground()) { start(); return; }

    let script = document.getElementById('shader-web-background-script') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'shader-web-background-script';
      script.src = 'https://xemantic.github.io/shader-web-background/dist/shader-web-background.min.js';
      script.async = true;
      document.head.appendChild(script);
    }

    script.addEventListener('load', start, { once: true });

    let tries = 0;
    const poll = window.setInterval(() => {
      tries += 1;
      if (getShaderWebBackground()) {
        window.clearInterval(poll);
        start();
      } else if (tries > 80) {
        window.clearInterval(poll);
        document.documentElement.classList.add('shader-web-background-fallback');
      }
    }, 50);

    return () => { window.clearInterval(poll); };
  }, []);

  return null;
}

function HeroSection() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScroll(Math.min(window.scrollY / (window.innerHeight * 0.9), 1));
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const phaseLabel = scroll < 0.3 ? 'quiet' : scroll > 0.75 ? 'resonant' : 'tuning';
  const phaseColor = scroll < 0.3 ? 'text-slate-400' : scroll > 0.75 ? 'text-violet-300' : 'text-cyan-300';

  return (
    <section className="relative min-h-[200vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
        <h1
          className="text-6xl md:text-8xl font-black tracking-tight text-white/90 transition-all duration-300"
          style={{
            transform: `scale(${1 - scroll * 0.12})`,
            opacity: 1 - scroll * 0.25,
          }}
        >
          hyper<sub className="text-4xl md:text-5xl text-emerald-400/80">3</sub>labs
        </h1>

        <div className="mt-6 text-center">
          <div className="text-sm text-gray-500 mb-1">concept</div>
          <div className="text-2xl md:text-3xl font-semibold text-white">Resonance Field</div>
        </div>

        <div className="mt-8 flex items-center gap-4 text-lg md:text-xl">
          <span className="text-gray-400">low</span>
          <div className="w-28 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-slate-400 via-cyan-400 to-violet-400 transition-all duration-300"
              style={{ width: `${scroll * 100}%` }}
            />
          </div>
          <span className={`transition-colors duration-500 ${phaseColor}`}>
            {phaseLabel}
          </span>
        </div>

        <div
          className="absolute bottom-20 text-sm text-gray-500 transition-opacity duration-500"
          style={{ opacity: scroll < 0.1 ? 1 : 0 }}
        >
          scroll to tune the spectrum
        </div>
      </div>
    </section>
  );
}

function ContentSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-3xl text-center space-y-10">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Curvature becomes a spectrum
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            In curved space, waves crowd toward the boundary. As you scroll, the resonance
            tightens and the shells fold into interference bands. The cursor shifts phase
            locally so you can feel the geometry respond.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <div className="text-sm font-mono text-cyan-300 mb-2">phase</div>
            <p className="text-sm text-gray-400">Mouse nudges the wavefronts.</p>
          </div>
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <div className="text-sm font-mono text-violet-300 mb-2">spectrum</div>
            <p className="text-sm text-gray-400">Scroll sweeps low → high frequency.</p>
          </div>
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <div className="text-sm font-mono text-emerald-300 mb-2">gain</div>
            <p className="text-sm text-gray-400">Edge regions amplify the pattern.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a
            href="https://huggingface.co/spaces/hyper3labs/HyperView"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-all hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Explore HyperView
          </a>
          <a
            href="https://github.com/Hyper3Labs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-all"
          >
            <Github className="w-5 h-5" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto flex items-center justify-between text-sm text-gray-600">
        <span>© 2025 Hyper3Labs</span>
        <div className="flex gap-4">
          <a href="/" className="hover:text-white transition-colors">Main</a>
          <a href="/warp" className="hover:text-white transition-colors">Warp</a>
          <a href="/collapse" className="hover:text-white transition-colors">Collapse</a>
        </div>
      </div>
    </footer>
  );
}

export default function ResonanceConcept() {
  return (
    <>
      <ShaderCanvas />
      <main className="relative z-10">
        <HeroSection />
        <ContentSection />
        <Footer />
      </main>
    </>
  );
}
