'use client';

import { useState, useEffect, useRef } from 'react';
import ShaderBackground from './ShaderBackground';
import { defaultShaderId, getShaderById, shaderVariants } from '@/lib/shaders';
import { Compass, Info, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

export default function ShaderController() {
  const [shaderId, setShaderId] = useState(defaultShaderId);
  const [key, setKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Store preference in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('hyper3-shader-id');
    if (!stored) return;

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

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowStory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = shaderVariants.findIndex((s) => s.id === shaderId);
        let nextIndex: number;
        if (e.key === 'ArrowUp') {
          nextIndex = (currentIndex - 1 + shaderVariants.length) % shaderVariants.length;
        } else {
          nextIndex = (currentIndex + 1) % shaderVariants.length;
        }
        handleShaderChange(shaderVariants[nextIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shaderId]);

  const currentShader = getShaderById(shaderId) || shaderVariants[0];
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <>
      <ShaderBackground key={key} shaderId={shaderId} />
      
      {/* Floating Space Selector Card - Only visible in development mode */}
      {isDev && (
        <div 
          ref={dropdownRef}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 font-mono text-xs select-none"
        >
          {/* Main Expanded Panel */}
          {isOpen && (
            <div 
              className="
                w-72 p-4 mb-1 rounded-2xl
                bg-black/85 backdrop-blur-xl backdrop-saturate-150
                border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]
              "
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
                <span className="text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  Select Manifold
                </span>
                <button 
                  onClick={() => setShowStory(!showStory)}
                  className={`p-1 rounded-lg hover:bg-white/[0.06] transition-colors ${showStory ? 'text-cyan-400' : 'text-gray-500 hover:text-white'}`}
                  title="Toggle Mathematical Explanation"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>

              {showStory ? (
                /* Math Story Panel */
                <div className="text-gray-300 text-[11px] leading-relaxed max-h-48 overflow-y-auto pr-1 space-y-2">
                  <p className="font-semibold text-white">{currentShader.name}</p>
                  <p className="text-gray-400 italic text-[10px] mb-2">{currentShader.description}</p>
                  {currentShader.mathStory ? (
                    <div className="whitespace-pre-line text-gray-400 border-t border-white/[0.04] pt-2">
                      {currentShader.mathStory}
                    </div>
                  ) : (
                    <p className="text-gray-500">No math explanation registered.</p>
                  )}
                </div>
              ) : (
                /* Shader List */
                <div className="space-y-1.5">
                  {shaderVariants.map((variant) => {
                    const isActive = variant.id === shaderId;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => handleShaderChange(variant.id)}
                        className={`
                          w-full text-left p-2.5 rounded-xl transition-all duration-200 border
                          ${isActive 
                            ? 'bg-cyan-500/[0.08] border-cyan-500/20 text-cyan-400 font-medium' 
                            : 'bg-white/[0.02] border-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.1]'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[12px]">{variant.name}</span>
                          {isActive && <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
                        </div>
                        <p className="text-[10px] text-gray-500 font-sans leading-normal">
                          {variant.description}
                        </p>
                      </button>
                    );
                  })}
                  <div className="text-[9px] text-gray-650 text-center mt-2 pt-2 border-t border-white/[0.04]">
                    Tip: Use ↑ or ↓ arrows to cycle anywhere
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Floating Toggle Pill */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-full
              bg-black/50 hover:bg-black/75 backdrop-blur-md backdrop-saturate-150
              border border-white/[0.08] hover:border-white/[0.18]
              text-gray-300 hover:text-white transition-all duration-300
              shadow-[0_4px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.03)]
              hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98]
            `}
          >
            <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {currentShader.name}
            </span>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </>
  );
}
