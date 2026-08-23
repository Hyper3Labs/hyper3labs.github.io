import { ExternalLink, Star } from 'lucide-react';
import { SiGithub, SiPypi, SiNpm, SiHuggingface } from '@icons-pack/react-simple-icons';

const projects = [
  {
    name: 'HyperView',
    tagline: 'Data curation co-pilot',
    description:
      'Multi-panel curation UI: image grid + embedding map. Euclidean ↔ Poincaré disk.',
    features: [
      'Agentic data cleanup',
      'Multi-geometry views',
      'HuggingFace integration',
    ],
    repo: 'https://github.com/Hyper3Labs/HyperView',
    demo: 'https://huggingface.co/spaces/hyper3labs/HyperView',
    hfSpaces: 'https://huggingface.co/spaces/hyper3labs/HyperView',
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
    demo: 'https://huggingface.co/mnm-matin/hyperbolic-clip',
    hfCollection: 'https://huggingface.co/mnm-matin/hyperbolic-clip',
    pypi: 'https://pypi.org/project/hyper-models/',
    install: 'pip install hyper-models',
    language: 'Python',
  },
];

function ProjectCard({ project }: { project: typeof projects[0] & { stars?: number } }) {
  return (
    <div 
      className="
        group h-full flex flex-col p-6 rounded-2xl 
        bg-white/[0.02] backdrop-blur-md
        border border-white/[0.05] 
        shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
        hover:border-white/[0.1] hover:bg-white/[0.04]
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]
        transition-all duration-500 hover:-translate-y-1
        relative overflow-hidden
      "
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors">
              {project.name}
            </h3>
          </div>
          <p className="text-gray-400 text-sm font-medium">
            {project.tagline}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {project.stars !== undefined && (
            <span className="flex items-center gap-1 text-xs font-mono text-gray-400">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              {project.stars}
            </span>
          )}
          {project.language === 'Python' ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-blue-400/80 bg-blue-400/10 px-2 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              {project.language}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-medium text-yellow-400/80 bg-yellow-400/10 px-2 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
              {project.language}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400/80 text-sm mb-5 leading-relaxed relative z-10 flex-1">
        {project.description}
      </p>

      {/* Features as pills */}
      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        {project.features.map((feature, i) => (
          <span 
            key={i} 
            className="text-[11px] font-medium text-gray-400 bg-white/[0.03] border border-white/[0.05] px-2.5 py-1 rounded-full"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* Footer / Actions */}
      <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-1">
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/[0.1] rounded-md transition-all"
            title="GitHub"
          >
            <SiGithub className="w-4 h-4" />
          </a>
          {project.pypi && (
            <a
              href={project.pypi}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-all"
              title="PyPI"
            >
              <SiPypi className="w-4 h-4" />
            </a>
          )}
          {project.npm && (
            <a
              href={project.npm}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
              title="npm"
            >
              <SiNpm className="w-4 h-4" />
            </a>
          )}
          {(project.hfSpaces || project.hfCollection) && (
            <a
              href={project.hfSpaces || project.hfCollection}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-md transition-all"
              title={project.hfSpaces ? 'Hugging Face Spaces' : 'Hugging Face'}
            >
              <SiHuggingface className="w-4 h-4" />
            </a>
          )}
        </div>

        {project.demo ? (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-gray-300 hover:text-white inline-flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/[0.1] rounded-md transition-all"
          >
            Demo <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <code className="text-[10px] text-gray-500 font-mono bg-white/[0.03] px-2 py-1 rounded truncate max-w-[120px]">
            {project.install}
          </code>
        )}
      </div>
    </div>
  );
}

// Fetch GitHub stars (revalidates every hour so we don't break rate limits on static export / SSR)
async function getGithubStars(repo: string): Promise<number | undefined> {
  const repoPath = repo.replace('https://github.com/', '');
  try {
    const res = await fetch(`https://api.github.com/repos/${repoPath}`, {
      next: { revalidate: 3600 } 
    });
    if (!res.ok) return undefined;
    const data = await res.json();
    return data.stargazers_count;
  } catch (e) {
    return undefined;
  }
}

export default async function Projects() {
  const projectWithStars = await Promise.all(
    projects.map(async (p) => {
      const stars = await getGithubStars(p.repo);
      return { ...p, stars };
    })
  );

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
          {projectWithStars.map((project) => (
            <ProjectCard key={project.name} project={project as any} />
          ))}
        </div>
      </div>
    </section>
  );
}
