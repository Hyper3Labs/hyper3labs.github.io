'use client';

import { useState, useEffect } from 'react';
import ShaderBackground from './ShaderBackground';
import { defaultShaderId, getShaderById } from '@/lib/shaders';

export default function ShaderController() {
  const [shaderId, setShaderId] = useState(defaultShaderId);
  const [key, setKey] = useState(0);

  // Store preference in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('hyper3-shader-id');
    if (!stored) return;

    // If a shader was removed/renamed, fall back cleanly.
    if (getShaderById(stored)) {
      setShaderId(stored);
      return;
    }

    localStorage.removeItem('hyper3-shader-id');
  }, []);

  const handleShaderChange = (newId: string) => {
    setShaderId(newId);
    setKey((k) => k + 1); // Force remount to reinitialize shader
    localStorage.setItem('hyper3-shader-id', newId);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        // Cycle through shaders
        import('@/lib/shaders').then(({ shaderVariants }) => {
          const currentIndex = shaderVariants.findIndex((s) => s.id === shaderId);
          let nextIndex: number;
          if (e.key === 'ArrowUp') {
            nextIndex = (currentIndex - 1 + shaderVariants.length) % shaderVariants.length;
          } else {
            nextIndex = (currentIndex + 1) % shaderVariants.length;
          }
          handleShaderChange(shaderVariants[nextIndex].id);
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shaderId]);

  return <ShaderBackground key={key} shaderId={shaderId} />;
}
