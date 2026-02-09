import { SiDiscord, SiGithub } from '@icons-pack/react-simple-icons';

export default function Footer() {
  return (
    <footer className="relative py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Liquid Glass Container */}
        <div
          className="
            relative overflow-hidden rounded-2xl
            bg-white/[0.04] 
            backdrop-blur-xl backdrop-saturate-150
            border border-white/[0.08]
            shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]
          "
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)',
          }}
        >
          {/* Specular highlight - top edge shine */}
          <div 
            className="absolute inset-x-0 top-0 h-px opacity-40"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 80%, transparent 100%)',
            }}
          />

          {/* Footer content */}
          <div className="relative px-6 py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-sm font-mono text-gray-300">
                  hyper<sup className="text-[10px]">3</sup>labs
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://discord.gg/Qf2pXtY4Vf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-200 text-xs font-mono"
                >
                  <SiDiscord className="w-4 h-4" />
                  discord
                </a>
                <a
                  href="https://github.com/Hyper3Labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-200 text-xs font-mono"
                >
                  <SiGithub className="w-4 h-4" />
                  github
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
