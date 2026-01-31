'use client';

import { useEffect, useRef, useCallback } from 'react';
import { getShaderById, defaultShaderId, ShaderVariant } from '@/lib/shaders';

// shader-web-background defines `shaderWebBackground` as a global binding (not always on `window`).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const shaderWebBackground: any;

function getShaderWebBackground(): unknown {
  if (typeof shaderWebBackground !== 'undefined') return shaderWebBackground;
  // @ts-expect-error - dynamic global
  return window.shaderWebBackground;
}

interface ShaderBackgroundProps {
  shaderId?: string;
}

// Track mouse position globally for shader uniforms
let mouseX = 0;
let mouseY = 0;
let scrollY = 0;
let maxScroll = 1;
let gyroX = 0; // beta: front/back tilt
let gyroY = 0; // gamma: left/right tilt
let gyroZ = 0; // alpha: compass direction

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });
  
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  }, { passive: true });
  
  // Device orientation for mobile
  window.addEventListener('deviceorientation', (e) => {
    gyroX = e.beta ?? 0;  // -180 to 180 (front/back tilt)
    gyroY = e.gamma ?? 0; // -90 to 90 (left/right tilt)
    gyroZ = e.alpha ?? 0; // 0 to 360 (compass)
  }, { passive: true });
}

export default function ShaderBackground({ shaderId = defaultShaderId }: ShaderBackgroundProps) {
  const initializedRef = useRef(false);
  const currentShaderIdRef = useRef(shaderId);

  const ensureShaderScript = useCallback((id: string, shaderSource: string) => {
    let shaderScript = document.getElementById(id) as HTMLScriptElement | null;
    if (!shaderScript) {
      shaderScript = document.createElement('script');
      shaderScript.type = 'x-shader/x-fragment';
      shaderScript.id = id;
      document.head.appendChild(shaderScript);
    }
    shaderScript.textContent = shaderSource;
  }, []);

  const initShader = useCallback((shader: ShaderVariant) => {
    const swb = getShaderWebBackground() as { shade?: (cfg: unknown) => void } | undefined;
    if (!swb || typeof swb !== 'object' || typeof swb.shade !== 'function') {
      console.warn('shaderWebBackground not available');
      document.documentElement.classList.add('shader-web-background-fallback');
      return;
    }

    // Update or create shader script element(s)
    if ('pipeline' in shader) {
      for (const [stageName, stageSource] of Object.entries(shader.pipeline.sources)) {
        ensureShaderScript(stageName, stageSource);
      }
    } else {
      ensureShaderScript('image', shader.source);
    }

    // Remove previous canvas
    const oldCanvas = document.getElementById('shader-web-background');
    if (oldCanvas) oldCanvas.remove();

    document.documentElement.classList.remove('shader-web-background-fallback');

    try {
      const commonUniforms = {
        iTime: (gl: WebGLRenderingContext, loc: WebGLUniformLocation) =>
          gl.uniform1f(loc, performance.now() / 1000),
        iResolution: (
          gl: WebGLRenderingContext,
          loc: WebGLUniformLocation,
          ctx: { width: number; height: number }
        ) => gl.uniform2f(loc, ctx.width, ctx.height),
        iMouse: (gl: WebGLRenderingContext, loc: WebGLUniformLocation, ctx: any) => {
          const toX = typeof ctx?.toShaderX === 'function' ? ctx.toShaderX.bind(ctx) : null;
          const toY = typeof ctx?.toShaderY === 'function' ? ctx.toShaderY.bind(ctx) : null;
          const mx = toX ? toX(mouseX) : mouseX;
          const my = toY ? toY(mouseY) : ctx.height - mouseY;
          gl.uniform2f(loc, mx, my);
        },
        iScroll: (gl: WebGLRenderingContext, loc: WebGLUniformLocation) =>
          gl.uniform1f(loc, scrollY / maxScroll),
        iGyroscope: (gl: WebGLRenderingContext, loc: WebGLUniformLocation) =>
          gl.uniform3f(loc, gyroX, gyroY, gyroZ),
      };

      swb.shade({
        shaders:
          'pipeline' in shader
            ? Object.fromEntries(
                Object.keys(shader.pipeline.sources).map((stageName) => {
                  const channel0 = shader.pipeline.channels?.[stageName]?.iChannel0;
                  return [
                    stageName,
                    {
                      uniforms: {
                        ...commonUniforms,
                        ...(channel0
                          ? {
                              iChannel0: (
                                gl: WebGLRenderingContext,
                                loc: WebGLUniformLocation,
                                ctx: any
                              ) => ctx.texture(loc, ctx.buffers[channel0]),
                            }
                          : {}),
                      },
                    },
                  ];
                })
              )
            : {
                image: {
                  uniforms: commonUniforms,
                },
              },
        onError: (error: Error) => {
          console.warn('Shader background failed:', error);
          document.documentElement.classList.add('shader-web-background-fallback');
        },
      });
    } catch (e) {
      console.warn('Shader initialization failed:', e);
      document.documentElement.classList.add('shader-web-background-fallback');
    }
  }, [ensureShaderScript]);

  // Handle shader changes
  useEffect(() => {
    if (currentShaderIdRef.current === shaderId && initializedRef.current) {
      // Same shader, but we need to reinit if shader changed
      const shader = getShaderById(shaderId);
      if (shader) {
        // Remove old canvas and reinit
        const oldCanvas = document.getElementById('shader-web-background');
        if (oldCanvas) oldCanvas.remove();
        
        const swb = getShaderWebBackground();
        if (swb) {
          initShader(shader);
        }
      }
      return;
    }

    currentShaderIdRef.current = shaderId;

    const shader = getShaderById(shaderId);
    if (!shader) {
      console.warn(`Shader not found: ${shaderId}`);
      return;
    }

    // If already initialized and library is loaded, just switch shader
    if (initializedRef.current && getShaderWebBackground()) {
      initShader(shader);
      return;
    }

    // First time initialization
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const start = () => {
      const shaderData = getShaderById(currentShaderIdRef.current);
      if (shaderData) {
        initShader(shaderData);
      }
    };

    // If library already loaded, start immediately
    if (getShaderWebBackground()) {
      start();
      return;
    }

    // Load the library
    let script = document.getElementById('shader-web-background-script') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'shader-web-background-script';
      script.src = 'https://xemantic.github.io/shader-web-background/dist/shader-web-background.min.js';
      script.async = true;
      document.head.appendChild(script);
    }

    script.addEventListener('load', start, { once: true });
    script.addEventListener('error', () => {
      console.warn('Failed to load shader-web-background');
      document.documentElement.classList.add('shader-web-background-fallback');
    }, { once: true });

    // Safety poll
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

    return () => {
      window.clearInterval(poll);
    };
  }, [shaderId, initShader]);

  return null;
}
