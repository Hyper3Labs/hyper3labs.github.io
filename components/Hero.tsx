import { Github, ArrowDown } from 'lucide-react';
import { SiHuggingface } from '@icons-pack/react-simple-icons';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-20 pb-16">
      <div className="max-w-4xl mx-auto w-full">
        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white mb-6 leading-[1.15]">
          Your data is hierarchical.
          <br />
          <span className="text-gray-500">Your tools should be too.</span>
        </h1>

        {/* Subheadline - the actual product description */}
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl leading-relaxed">
          <strong className="text-white font-medium">HyperView</strong> is an open-source data curation 
          co-pilot. Explore embeddings in hyperbolic space—where hierarchy has room to breathe—and 
          let agents find the issues you'd otherwise miss.
        </p>

        {/* Key differentiators - tight, scannable */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 mb-10 font-mono">
          <span>→ solves the crowding problem</span>
          <span>→ agentic data cleanup</span>
          <span>→ 10x faster (Rust + WebGL)</span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <a
            href="https://github.com/Hyper3Labs/HyperView"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-900 text-sm font-medium rounded-md transition-all hover:bg-gray-200"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
          <a
            href="https://huggingface.co/spaces/Hyper3Labs/HyperView"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent text-gray-300 text-sm font-medium rounded-md border border-white/15 transition-all hover:bg-white/5"
          >
            <SiHuggingface className="w-4 h-4" />
            Try demo
          </a>
        </div>

        {/* Quick start */}
        <div className="font-mono text-sm">
          <code className="text-gray-500">$ </code>
          <code className="text-gray-400">pip install hyperview && hyperview demo</code>
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
