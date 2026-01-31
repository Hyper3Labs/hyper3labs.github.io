import { Github, ExternalLink } from 'lucide-react';

// PyPI icon (clean cube/package style)
function PyPIIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.922 13.58v3.912L20.55 19.5v-3.912zm-7.72 7.22L12.59 22.5v-3.863l3.611-1.701zm7.72-7.75L20.55 11.4v3.658l3.372 1.654zM12.83 14.772l3.372 1.654v3.863l-3.372-1.654zm7.48-3.658L16.68 9.46v3.863l3.63 1.749zM12.59 14.538V10.83l3.851 1.797-3.851 1.91zM8.478 6.595L12.11 4.89v3.862L8.478 10.46zm-4.09 5.704l3.61 1.701v3.912l-3.61-1.75zm0-.53V7.857L.777 9.51v3.912zm4.09-1.414V6.542L12.09 4.64v3.912zm7.72-.24L12.59 8.464V4.6l3.611 1.75zM8.24 14.12l3.61-1.702v3.912L8.24 18.08zm-3.85 1.94l3.61 1.654v3.912l-3.61-1.654zM.537 17.492v-3.863l3.612 1.702v3.863z"/>
    </svg>
  );
}

// npm icon (clean block letters)
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
      'Hyperbolic encoders',
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
