'use client';

import { useEffect, useRef, useState } from 'react';
import { Github, Play } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Flat grid that warps into hyperbolic space on scroll
// Monochrome theme matching main site
const warpShader = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iScroll;

#define PI 3.14159265359

float tanh_safe(float x) {
    x = clamp(x, -8.0, 8.0);
    float e2 = exp(2.0 * x);
    return (e2 - 1.0) / (e2 + 1.0);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    float s = iScroll; // 0 = flat, 1 = fully curved
    
    vec3 col = vec3(0.0);
    float r = length(uv);
    float maxR = 0.95;
    
    // THE TRANSFORMATION: Flat → Curved
    float flatR = r;
    float curvedR = r < maxR ? tanh_safe(r * (1.0 + s * 2.0)) * maxR : maxR;
    float blendR = mix(flatR, curvedR, s);
    
    vec2 curvedUV = uv * (blendR / max(r, 0.001));
    
    // Grid that shows the warping
    float gridScale = 8.0;
    vec2 gridUV = curvedUV * gridScale;
    vec2 gridFrac = fract(gridUV + 0.5);
    vec2 gridDist = abs(gridFrac - 0.5);
    
    float edgeFade = 1.0 - smoothstep(0.5, 0.95, blendR) * s;
    float lineWidth = 0.04 * edgeFade + 0.01;
    
    float gridX = smoothstep(lineWidth, 0.0, gridDist.x);
    float gridY = smoothstep(lineWidth, 0.0, gridDist.y);
    float grid = max(gridX, gridY) * edgeFade;
    
    // Grid color - monochrome gray, brightens slightly when curved
    vec3 flatColor = vec3(0.25);
    vec3 curvedColor = vec3(0.4);
    vec3 gridColor = mix(flatColor, curvedColor, s) * grid;
    
    // Boundary: Poincaré disk edge (appears with scroll)
    float boundary = smoothstep(0.92, 0.95, blendR) * s;
    vec3 boundaryColor = vec3(0.5) * boundary;
    
    float boundaryGlow = exp(-pow((blendR - 0.95) * 10.0, 2.0)) * s * 0.2;
    boundaryColor += vec3(0.3) * boundaryGlow;
    
    // Reference points that spread apart in hyperbolic space
    float points = 0.0;
    for (float i = 0.0; i < 6.0; i++) {
        float angle = i * PI / 3.0;
        float flatDist = 0.3;
        float curvedDist = tanh_safe(0.3 * (1.0 + s)) * 0.8;
        float pointDist = mix(flatDist, curvedDist, s);
        
        vec2 pointPos = pointDist * vec2(cos(angle), sin(angle));
        float d = length(curvedUV - pointPos);
        points += smoothstep(0.03, 0.01, d);
    }
    vec3 pointColor = vec3(0.7, 0.7, 0.75) * points * 0.5;
    
    col = gridColor + boundaryColor + pointColor;
    
    // Vignette
    float vignette = 1.0 - r * r * 0.2;
    col *= vignette;
    
    // Background - dark with subtle blue tint
    vec3 bg = vec3(0.04, 0.04, 0.055);
    col = max(col, bg);
    
    gl_FragColor = vec4(col, 1.0);
}
`;

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
    shaderScript.textContent = warpShader;

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
    const handleScroll = () => setScroll(Math.min(window.scrollY / (window.innerHeight * 0.8), 1));
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-[180vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
        <h1 
          className="text-4xl md:text-6xl font-semibold tracking-tight text-white transition-all duration-300"
          style={{ 
            transform: `scale(${1 - scroll * 0.08})`,
            opacity: 1 - scroll * 0.15,
          }}
        >
          Hyperbolic Space
        </h1>

        {/* Transformation label */}
        <div 
          className="mt-8 flex items-center gap-4 text-sm font-mono transition-all duration-500"
          style={{ opacity: Math.max(0.4, 1 - scroll * 0.3) }}
        >
          <span className={`transition-all duration-500 ${scroll < 0.3 ? 'text-gray-300' : 'text-gray-600'}`}>
            flat
          </span>
          <div className="w-24 h-px bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gray-300 transition-all duration-300"
              style={{ width: `${scroll * 100}%` }}
            />
          </div>
          <span className={`transition-all duration-500 ${scroll > 0.7 ? 'text-white' : 'text-gray-600'}`}>
            curved
          </span>
        </div>

        <p className="mt-4 text-gray-500 text-sm text-center max-w-md px-4" style={{ opacity: 1 - scroll * 0.5 }}>
          Watch Euclidean space transform into the Poincaré disk
        </p>

        {/* Scroll hint */}
        <div 
          className="absolute bottom-24 text-xs text-gray-600 font-mono transition-opacity duration-500 animate-bounce"
          style={{ opacity: scroll < 0.1 ? 1 : 0 }}
        >
          ↓ scroll to warp
        </div>
      </div>
    </section>
  );
}

function ExplainerContent() {
  return (
    <section className="relative py-20 px-6 bg-black/60">
      <div className="max-w-3xl mx-auto">
        {/* The Problem */}
        <div className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-4">The problem with flat space</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              When you visualize a tree in Euclidean space, you run into a fundamental limitation: 
              <span className="text-gray-200"> there isn&apos;t enough room</span>.
            </p>
            <p>
              A binary tree at depth 20 has over a million leaf nodes. But the area of a circle 
              grows as πr². Nodes grow exponentially; display area grows polynomially.
            </p>
          </div>
        </div>

        {/* Volume comparison */}
        <div className="grid md:grid-cols-2 gap-4 mb-14">
          <div className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <h3 className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Euclidean</h3>
            <p className="text-white font-mono text-lg mb-2">V(r) ~ r<sup>d</sup></p>
            <p className="text-gray-500 text-sm">Polynomial growth. Not enough room.</p>
          </div>
          <div className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <h3 className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Hyperbolic</h3>
            <p className="text-white font-mono text-lg mb-2">V(r) ~ e<sup>r</sup></p>
            <p className="text-gray-500 text-sm">Exponential growth. Room for everything.</p>
          </div>
        </div>

        {/* The Solution */}
        <div className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-4">Why hyperbolic space works</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              Hyperbolic geometry has <span className="text-gray-200">exponential volume growth</span>—exactly 
              matching tree structures.
            </p>
            <p>
              The Poincaré disk maps infinite hyperbolic space onto a finite disk. The boundary 
              represents infinity—you can fit arbitrarily many points without crowding.
            </p>
          </div>
        </div>

        {/* What you saw */}
        <div className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-4">What you just saw</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              As you scrolled, the uniform grid transformed. In the Poincaré disk, squares near the edge 
              appear smaller—but they all have <span className="text-gray-200">equal hyperbolic area</span>.
            </p>
            <p>
              This compression near the boundary gives hyperbolic space its power. 
              Navigation (Möbius transformations) brings any region smoothly to the center.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://huggingface.co/spaces/hyper3labs/HyperView"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-900 text-sm font-medium rounded-md transition-all hover:bg-gray-200"
          >
            <Play className="w-4 h-4" />
            Try HyperView
          </a>
          <a
            href="/collapse"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent text-gray-300 text-sm font-medium rounded-md border border-white/15 transition-all hover:bg-white/5"
          >
            representation collapse →
          </a>
        </div>
      </div>
    </section>
  );
}

export default function WarpExplainer() {
  return (
    <>
      <ShaderCanvas />
      <Header />
      <main className="relative z-10 min-h-screen">
        <HeroSection />
        <ExplainerContent />
        <Footer />
      </main>
    </>
  );
}
