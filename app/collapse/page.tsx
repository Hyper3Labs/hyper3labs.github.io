'use client';

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Shows representation collapse in Euclidean vs separation in Hyperbolic
// Monochrome theme matching main site
const collapseShader = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iScroll;

#define PI 3.14159265359

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    float t = iTime;
    float s = iScroll; // 0 = collapsed, 1 = expanded
    
    vec3 col = vec3(0.0);
    float r = length(uv);
    
    // Boundary of the disk (fades in with scroll)
    float boundaryLine = smoothstep(0.96, 0.94, r) * smoothstep(0.92, 0.94, r) * s;
    col += vec3(0.35) * boundaryLine;
    
    // HIERARCHICAL POINTS: Tree structure
    float points = 0.0;
    
    // Root (center)
    float rootDist = length(uv);
    points += smoothstep(0.05, 0.025, rootDist) * 0.8;
    
    // Level 1: 3 children
    for (float i = 0.0; i < 3.0; i++) {
        float angle = i * 2.0 * PI / 3.0 - PI / 2.0 + t * 0.015;
        
        float euclideanR = 0.12;
        float hyperbolicR = 0.4;
        float childR = mix(euclideanR, hyperbolicR, s);
        vec2 child = childR * vec2(cos(angle), sin(angle));
        
        float childDist = length(uv - child);
        float childSize = mix(0.04, 0.035, s);
        points += smoothstep(childSize + 0.01, childSize, childDist) * 0.7;
        
        // Level 2: grandchildren
        for (float j = 0.0; j < 2.0; j++) {
            float subAngle = angle + (j - 0.5) * 0.7 + t * 0.01;
            
            float eucSubR = 0.18;
            float hypSubR = 0.7;
            float subR = mix(eucSubR, hypSubR, s);
            vec2 grandchild = subR * vec2(cos(subAngle), sin(subAngle));
            
            float gcDist = length(uv - grandchild);
            float gcSize = mix(0.035, 0.028, s);
            points += smoothstep(gcSize + 0.01, gcSize, gcDist) * 0.5;
            
            // Level 3: leaves
            if (s > 0.2) {
                for (float k = 0.0; k < 2.0; k++) {
                    float leafAngle = subAngle + (k - 0.5) * 0.4;
                    float leafR = mix(0.22, 0.88, s);
                    vec2 leaf = leafR * vec2(cos(leafAngle), sin(leafAngle));
                    
                    float leafDist = length(uv - leaf);
                    points += smoothstep(0.025, 0.015, leafDist) * 0.3 * smoothstep(0.2, 0.4, s);
                }
            }
        }
    }
    
    // Color by depth - monochrome with subtle warmth at center
    float depth = length(uv);
    vec3 centerColor = vec3(0.6, 0.55, 0.5);
    vec3 edgeColor = vec3(0.5, 0.5, 0.55);
    vec3 pointColor = mix(centerColor, edgeColor, depth * (1.0 + s)) * points;
    
    col += pointColor;
    
    // Connection lines
    for (float i = 0.0; i < 3.0; i++) {
        float angle = i * 2.0 * PI / 3.0 - PI / 2.0 + t * 0.015;
        float childR = mix(0.12, 0.4, s);
        vec2 child = childR * vec2(cos(angle), sin(angle));
        
        vec2 dir = normalize(child);
        float proj = dot(uv, dir);
        float perp = length(uv - dir * clamp(proj, 0.0, childR));
        col += vec3(0.3) * smoothstep(0.006, 0.002, perp) * 
               smoothstep(0.0, 0.05, proj) * smoothstep(childR + 0.02, childR - 0.02, proj) * 0.5;
    }
    
    // Subtle grid
    float gridScale = 10.0 / (1.0 + s);
    vec2 gridUV = uv * gridScale;
    vec2 gridFrac = fract(gridUV);
    vec2 gridDist = min(gridFrac, 1.0 - gridFrac);
    float grid = smoothstep(0.03, 0.0, min(gridDist.x, gridDist.y)) * 0.06 * (1.0 - s * 0.6);
    col += vec3(0.2) * grid;
    
    // Vignette  
    float vignette = 1.0 - r * r * 0.25;
    col *= vignette;
    
    // Background
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
    shaderScript.textContent = collapseShader;

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

  const stateLabel = scroll < 0.3 ? 'collapsed' : scroll > 0.7 ? 'preserved' : 'expanding';
  const stateColor = scroll < 0.3 ? 'text-gray-400' : scroll > 0.7 ? 'text-white' : 'text-gray-500';

  return (
    <section className="relative min-h-[180vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
        <h1 
          className="text-4xl md:text-6xl font-semibold tracking-tight text-white text-center transition-all duration-300"
          style={{ 
            transform: `scale(${1 - scroll * 0.06})`,
          }}
        >
          Representation Collapse
        </h1>

        {/* State indicator */}
        <div className="mt-6 text-center">
          <div className="text-xs text-gray-600 font-mono mb-1">hierarchy</div>
          <div className={`text-lg font-mono transition-colors duration-500 ${stateColor}`}>
            {stateLabel}
          </div>
        </div>

        {/* Visual legend */}
        <div 
          className="mt-8 flex gap-6 text-xs font-mono transition-opacity duration-500"
          style={{ opacity: 0.5 + scroll * 0.5 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-gray-500">root</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            <span className="text-gray-500">leaves</span>
          </div>
        </div>

        {/* Scroll hint */}
        <div 
          className="absolute bottom-24 text-xs text-gray-600 font-mono transition-opacity duration-500 animate-bounce"
          style={{ opacity: scroll < 0.1 ? 1 : 0 }}
        >
          ↓ scroll to expand
        </div>
      </div>
    </section>
  );
}

function ExplainerContent() {
  return (
    <section className="relative py-20 px-6 bg-black/60">
      <div className="max-w-3xl mx-auto">
        {/* What you saw */}
        <div className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-4">What you just saw</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              At the top, all tree nodes were <span className="text-gray-200">clustered together</span>—children 
              overlapping parents, grandchildren invisible. This is representation collapse.
            </p>
            <p>
              As you scrolled, the same tree expanded into hyperbolic space. Every node got its own room. 
              The hierarchy became visible and navigable.
            </p>
          </div>
        </div>

        {/* Visual example */}
        <div className="grid md:grid-cols-2 gap-4 mb-14">
          <div className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <h3 className="text-xs font-mono text-gray-500 mb-3 uppercase tracking-wider">Collapsed</h3>
            <div className="space-y-1 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <span>Parent node</span>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                <span>Child overlaps</span>
              </div>
              <div className="flex items-center gap-2 ml-5">
                <div className="w-1 h-1 rounded-full bg-gray-600" />
                <span>Grandchild invisible</span>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <h3 className="text-xs font-mono text-gray-500 mb-3 uppercase tracking-wider">Preserved</h3>
            <div className="space-y-1 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <span>Parent at center</span>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <span>Children spread out</span>
              </div>
              <div className="flex items-center gap-2 ml-5">
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <span>Grandchildren visible</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why */}
        <div className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-4">Why does this happen?</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              Trees have exponentially many nodes at each depth. A tree with branching factor 3 has 
              3 nodes at depth 1, 9 at depth 2, 27 at depth 3...
            </p>
            <p>
              But Euclidean space has polynomial volume growth. You <span className="text-gray-200">run out of room</span>. 
              Embedding algorithms sacrifice rare relationships to preserve common ones.
            </p>
            <p>
              Hyperbolic space has <span className="text-gray-200">exponential volume growth</span>—matching 
              the tree. There&apos;s always room for more nodes at the boundary.
            </p>
          </div>
        </div>

        {/* Real world */}
        <div className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-4">Real-world impact</h2>
          <div className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-3 text-gray-400 text-sm">
            <p><span className="text-gray-300">Single-cell biology:</span> Rare cell types become visible instead of being absorbed into dominant clusters.</p>
            <p><span className="text-gray-300">NLP:</span> Word hierarchies embed naturally with preserved relationships.</p>
            <p><span className="text-gray-300">Networks:</span> Social graphs and phylogenies maintain their hierarchical structure.</p>
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
            href="/warp"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent text-gray-300 text-sm font-medium rounded-md border border-white/15 transition-all hover:bg-white/5"
          >
            hyperbolic space →
          </a>
        </div>
      </div>
    </section>
  );
}

export default function CollapseExplainer() {
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
