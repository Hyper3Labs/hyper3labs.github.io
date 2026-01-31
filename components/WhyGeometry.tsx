export default function WhyGeometry() {
  return (
    <section id="why-geometry" className="relative py-20 px-6 bg-black/40">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
          Why geometry matters
        </h2>

        <div className="space-y-5 text-gray-400 text-base leading-relaxed">
          <p>
            Hierarchical data gets crowded in Euclidean projections. The{' '}
            <span className="text-gray-200">crowding problem</span> means there
            isn't enough room to keep fine-grained structure separated. Rare modes collapse into
            dominant clusters—
            <a href="/collapse" className="text-gray-200 hover:text-white underline decoration-gray-500/50 hover:decoration-gray-300 transition-colors">
              representation collapse
            </a>.
          </p>

          <p>
            <a href="/warp" className="text-gray-200 hover:text-white underline decoration-gray-500/50 hover:decoration-gray-300 transition-colors">
              Hyperbolic space
            </a>{' '}
            has exponential volume growth. That matches hierarchy.
          </p>

          <p>
            Correct interactions matter: Möbius pan/zoom and geodesic-aware selection.
          </p>

          {/* Simple visual comparison - clickable cards */}
          <div className="grid md:grid-cols-2 gap-4 my-10">
            <a 
              href="/warp" 
              className="
                p-5 rounded-2xl block
                bg-white/[0.04] 
                backdrop-blur-md backdrop-saturate-150
                border border-white/[0.08] 
                hover:border-white/[0.15] hover:bg-white/[0.06]
                shadow-[0_4px_24px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]
                hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]
                transition-all duration-300 group
              "
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)',
              }}
            >
              <h3 className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
                Euclidean (flat)
              </h3>
              <p className="text-white font-mono text-lg mb-2">
                V(r) ~ r<sup>d</sup>
              </p>
              <p className="text-gray-400 text-sm">
                Polynomial growth. Rare subgroups overlap.
              </p>
              <span className="text-xs text-gray-600 group-hover:text-gray-300 mt-2 inline-block transition-colors font-mono">
                see transformation →
              </span>
            </a>
            <a 
              href="/collapse" 
              className="
                p-5 rounded-2xl block
                bg-white/[0.04] 
                backdrop-blur-md backdrop-saturate-150
                border border-white/[0.08] 
                hover:border-white/[0.15] hover:bg-white/[0.06]
                shadow-[0_4px_24px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]
                hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]
                transition-all duration-300 group
              "
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)',
              }}
            >
              <h3 className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
                Hyperbolic (curved)
              </h3>
              <p className="text-white font-mono text-lg mb-2">
                V(r) ~ e<sup>r</sup>
              </p>
              <p className="text-gray-400 text-sm">
                Exponential growth. Hierarchy preserved.
              </p>
              <span className="text-xs text-gray-600 group-hover:text-gray-300 mt-2 inline-block transition-colors font-mono">
                see the difference →
              </span>
            </a>
          </div>

          <p className="text-sm text-gray-400">
            HyperView lets you toggle Euclidean ↔ hyperbolic (Poincaré disk) ↔ spherical—fast.
          </p>
        </div>
      </div>
    </section>
  );
}
