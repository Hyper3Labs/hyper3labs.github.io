'use client';

import { ArrowDown, Copy, Check } from 'lucide-react';
import { SiGithub, SiHuggingface } from '@icons-pack/react-simple-icons';
import { useState } from 'react';

function CopySnippet({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div 
      className="inline-flex items-center gap-3 bg-white/[0.02] backdrop-blur-md border border-white/[0.06] hover:border-white/[0.18] hover:bg-white/[0.04] transition-all duration-300 rounded-xl px-5 py-2.5 cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.02)] select-none hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:scale-[1.01] active:scale-[0.99]"
      onClick={handleCopy}
      role="button"
    >
      <code className="text-[13px] font-mono">
        <span className="text-gray-500 mr-2">$</span>
        <span className="text-gray-300">{text}</span>
      </code>
      <div className="text-gray-500 group-hover:text-white transition-colors ml-2">
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-20 pb-16">
      <div className="max-w-4xl mx-auto w-full">
        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6 leading-[1.15]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-cyan-300">See your data in its </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 font-bold drop-shadow-[0_2px_10px_rgba(34,211,238,0.15)]">true shape.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl leading-relaxed">
          <strong className="text-white font-medium">HyperView</strong> is open-source dataset curation
          across multiple geometries. An AI copilot finds label noise, hierarchy errors, and long-tail
          issues. Multimodal native.
        </p>

        {/* Key differentiators - tight, scannable */}
        <div className="flex flex-wrap gap-3 mb-10 font-mono text-[11px]">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-md text-gray-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-green-500/30 hover:bg-white/[0.05] transition-all duration-300 select-none">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
             multi-geometry support
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-md text-gray-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-blue-500/30 hover:bg-white/[0.05] transition-all duration-300 select-none">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"/>
             AI curation copilot
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-md text-gray-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300 select-none">
             <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"/>
             multimodal native
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <a
            href="https://github.com/Hyper3Labs/HyperView"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_24px_rgba(255,255,255,0.15)] shadow-md"
          >
            <SiGithub className="w-4 h-4" />
            View on GitHub
          </a>
          <a
            href="https://huggingface.co/spaces/Hyper3Labs/HyperView"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.03] backdrop-blur-md text-gray-300 text-sm font-medium rounded-xl border border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <SiHuggingface className="w-4 h-4" />
            Try demo
          </a>
        </div>

        {/* Quick start */}
        <div className="mt-2">
          <CopySnippet text="pip install hyperview && hyperview demo" />
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <a 
          href="#why-geometry" 
          className="text-gray-600 hover:text-gray-400 transition-colors"
        >
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
