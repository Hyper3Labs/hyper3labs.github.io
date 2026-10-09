export type Project = {
  id: string;
  name: string;
  tagline: string;
  install: string;
  repo: string;
  registry: { label: string; href: string };
};

// One entry per open-source project with docs on this site, in nav order.
export const PROJECTS: Project[] = [
  {
    id: 'hyperview',
    name: 'HyperView',
    tagline:
      'Explore image datasets and embedding spaces in Euclidean, spherical and hyperbolic geometry, from Python, the CLI or a coding agent.',
    install: 'uv tool install hyperview',
    repo: 'https://github.com/Hyper3Labs/HyperView',
    registry: { label: 'PyPI', href: 'https://pypi.org/project/hyperview/' },
  },
  {
    id: 'hyper-models',
    name: 'hyper-models',
    tagline:
      'A model zoo for hyperbolic and spherical embedding models behind one load-and-encode API, including Hyper3-CLIP.',
    install: 'uv pip install hyper-models',
    repo: 'https://github.com/Hyper3Labs/hyper-models',
    registry: { label: 'PyPI', href: 'https://pypi.org/project/hyper-models/' },
  },
  {
    id: 'hyper-scatter',
    name: 'hyper-scatter',
    tagline:
      'WebGL2 scatterplots for large embedding datasets in Euclidean, Poincaré disk, 3D and spherical views, with hit testing and lasso.',
    install: 'npm install hyper-scatter',
    repo: 'https://github.com/Hyper3Labs/hyper-scatter',
    registry: { label: 'npm', href: 'https://www.npmjs.com/package/hyper-scatter' },
  },
];

export const SPACES_URL = 'https://spaces.hyper3labs.com/';

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((project) => project.id === id);
}
