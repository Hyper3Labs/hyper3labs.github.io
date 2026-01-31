import { Github, ExternalLink } from 'lucide-react';

// Custom PyPI icon (Python logo simplified)
function PyPIIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.042 0c-1.112.014-2.173.093-3.103.24-2.757.437-3.254 1.35-3.254 3.037v2.223h6.511v.74H4.984c-1.891 0-3.548 1.137-4.067 3.3-.599 2.48-.625 4.027 0 6.618.464 1.93 1.572 3.3 3.463 3.3h2.24v-2.974c0-2.147 1.857-4.04 4.067-4.04h6.503c1.81 0 3.254-1.49 3.254-3.311V3.277c0-1.77-1.492-3.098-3.254-3.037-1.113.04-2.29.05-3.148.24zm-3.62 1.789a1.22 1.22 0 011.222 1.233c0 .682-.548 1.232-1.222 1.232a1.231 1.231 0 01-1.222-1.232c0-.682.547-1.233 1.222-1.233z"/>
      <path d="M18.62 6.24v2.883c0 2.242-1.903 4.13-4.066 4.13h-6.504c-1.781 0-3.254 1.525-3.254 3.311v6.207c0 1.77 1.538 2.81 3.254 3.311 2.054.6 4.023.709 6.504 0 1.65-.47 3.254-1.416 3.254-3.311v-2.483h-6.503v-.74h9.757c1.891 0 2.595-1.319 3.067-3.3.486-2.041.466-4.003 0-6.618-.335-1.883-1.176-3.3-3.067-3.3H18.62zm-3.719 13.32a1.22 1.22 0 011.222 1.233c0 .68-.549 1.232-1.222 1.232a1.231 1.231 0 01-1.222-1.232c0-.682.547-1.233 1.222-1.233z"/>
    </svg>
  );
}

// Custom npm icon
function NpmIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
    </svg>
  );
}

const projects = [
  {
    name: 'HyperView',
    tagline: 'Data curation co-pilot',
    description:
      'Dual-panel curation UI: image grid + embedding map. Euclidean ↔ Poincaré ↔ spherical.',
    features: [
      'Agentic data cleanup',
      'Multi-geometry views',
      'HuggingFace integration',
    ],
    repo: 'https://github.com/Hyper3Labs/HyperView',
    demo: 'https://hyper3labs.github.io/HyperView/',
    pypi: 'https://pypi.org/project/hyperview/',
    install: 'pip install hyperview',
    language: 'Python',
  },
  {
    name: 'hyper-scatter',
    tagline: 'WebGL scatterplot engine',
    description:
      'Pure WebGL2 scatterplot for Euclidean + Poincaré disk with Möbius-correct interactions.',
    features: [
      'Möbius pan/zoom',
      'Geodesic-aware lasso',
      '20M points @ 60 FPS',
    ],
    repo: 'https://github.com/Hyper3Labs/hyper-scatter',
    demo: 'https://hyper3labs.github.io/hyper-scatter/',
    npm: 'https://www.npmjs.com/package/hyper-scatter',
    install: 'npm i hyper-scatter',
    language: 'TypeScript',
  },
  {
    name: 'hyper-models',
    tagline: 'Embedding model zoo',
    description:
      'Non-Euclidean embedding encoders with simple API and torch-free ONNX runtime.',
    features: [
      'HyCoCLIP / MERU',
      'Torch-free ONNX',
      'Auto HF download',
    ],
    repo: 'https://github.com/Hyper3Labs/hyper-models',
    demo: 'https://huggingface.co/collections/hyperview-org/hyper-models-67900e48542fa2ea29a26684',
    pypi: 'https://pypi.org/project/hyper-models/',
    install: 'pip install hyper-models',
    language: 'Python',
  },
];

function ProjectCard({ project }: { project: typeof projects[0] }) {
  return (
    <div 
      className="
        group h-full flex flex-col p-5 rounded-2xl 
        bg-white/[0.04] 
        backdrop-blur-md backdrop-saturate-150
        border border-white/[0.08] 
        hover:border-white/[0.15] hover:bg-white/[0.06] 
        shadow-[0_4px_24px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]
        transition-all duration-300
      "
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-white group-hover:text-gray-100 transition-colors mb-1">
            {project.name}
          </h3>
          <p className="text-gray-400 text-sm">
            {project.tagline}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          {project.pypi && (
            <a
              href={project.pypi}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-500 hover:text-yellow-500 hover:bg-white/[0.08] rounded-lg transition-all"
              title="PyPI"
            >
              <PyPIIcon className="w-4 h-4" />
            </a>
          )}
          {project.npm && (
            <a
              href={project.npm}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-white/[0.08] rounded-lg transition-all"
              title="npm"
            >
              <NpmIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-3 leading-relaxed">
        {project.description}
      </p>

      {/* Features */}
      <ul className="mb-4 space-y-1.5 flex-1">
        {project.features.map((feature, i) => (
          <li key={i} className="text-gray-300 text-xs flex items-start gap-2">
            <span className="text-gray-500">→</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Footer - pushed to bottom */}
      <div className="pt-3 border-t border-white/[0.08]">
        <div className="flex items-center justify-between gap-3">
          <code className="text-xs text-gray-300 font-mono bg-white/[0.06] px-2 py-1 rounded-lg truncate">
            {project.install}
          </code>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-xs font-medium inline-flex items-center gap-1 shrink-0 px-2 py-1 hover:bg-white/[0.06] rounded-lg transition-all"
            >
              demo <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
          Projects
        </h2>
        <p className="text-gray-400 text-sm mb-10 max-w-xl">
          Open source. Code is MIT; packages on PyPI/npm. Model weights may carry upstream licenses.
        </p>

        {/* Horizontal card grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
