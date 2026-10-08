import { ArrowRight, Bot, Database, Orbit, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CopyButton from '@/components/CopyButton';
import ExampleCard from '@/components/ExampleCard';
import { EXAMPLES } from '@/lib/examples';

const INSTALL = 'uv tool install hyperview';

const features = [
  {
    icon: Database,
    title: 'Load any image collection',
    text: 'Pull from Hugging Face or a local folder into a persistent dataset with labels, media and metadata.',
    href: '/docs/datasets/',
  },
  {
    icon: Orbit,
    title: 'Compare models and geometries',
    text: 'Embed with CLIP, SigLIP or a hyperbolic model, then inspect Euclidean, spherical and Poincaré layouts side by side.',
    href: '/docs/embeddings-and-layouts/',
  },
  {
    icon: Bot,
    title: 'Work with your coding agent',
    text: 'The CLI and the UI operate on the same workspace state, so an agent can select, filter and run tools while you watch.',
    href: '/docs/cli-and-agents/',
  },
  {
    icon: Share2,
    title: 'Share it as a Space',
    text: 'Export a workspace to a bundle that runs in any browser without a backend, or serve it live.',
    href: '/docs/spaces/',
  },
];

const PYTHON = `import hyperview as hv

dataset = hv.Dataset("cifar100")
dataset.add_from_huggingface("uoft-cs/cifar100", max_samples=1000)
dataset.compute_embeddings(model="openai/clip-vit-base-patch32")
dataset.compute_visualization()

hv.launch(dataset)`;

export default function Home() {
  const featured = EXAMPLES.filter((e) => e.preview).slice(0, 3);
  const hero = EXAMPLES[0];

  return (
    <>
      <Header />
      <main>
        <section className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:pt-20">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">Open-source embedding workbench</p>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">
              See what your embedding model actually learned.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-400">
              HyperView turns an image dataset into an interactive workspace: samples, embeddings, and Euclidean,
              spherical or hyperbolic layouts, linked together. You and your coding agent explore the same state.
            </p>
            <div className="mt-8 flex max-w-md items-center justify-between rounded-lg border border-white/[0.1] bg-[#0d1117] px-4 py-3 font-mono text-sm text-gray-200">
              <span>
                <span className="mr-3 select-none text-cyan-400">$</span>
                {INSTALL}
              </span>
              <CopyButton text={INSTALL} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/docs/quickstart/" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-[#0a0a0a] hover:bg-cyan-100">
                Get started <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/examples/" className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-4 py-2.5 text-sm font-medium text-gray-200 hover:bg-white/[0.06]">
                Browse examples
              </a>
            </div>
          </div>
          {hero?.preview ? (
            <a href={hero.url} className="group block overflow-hidden rounded-xl border border-white/[0.1] shadow-2xl shadow-cyan-950/20">
              <img src={hero.preview} alt={`The ${hero.name} example open in HyperView`} className="w-full transition duration-500 group-hover:scale-[1.01]" />
            </a>
          ) : null}
        </section>

        <section className="border-y border-white/[0.07] bg-white/[0.015]">
          <div className="mx-auto grid max-w-[1400px] gap-px px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text, href }) => (
              <a key={title} href={href} className="group rounded-lg p-5 transition hover:bg-white/[0.03]">
                <Icon className="mb-4 h-5 w-5 text-cyan-300" aria-hidden="true" />
                <h2 className="font-medium text-white">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{text}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-gray-500 group-hover:text-cyan-200">
                  Read the guide <ArrowRight className="h-3 w-3" />
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1400px] items-start gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">Six lines to a workspace</h2>
            <p className="mt-3 text-gray-400">
              Load 1,000 images, embed them, project them, and open the result in your browser. Datasets and embeddings
              persist, so the next run starts where this one stopped.
            </p>
            <a href="/docs/quickstart/" className="mt-5 inline-flex items-center gap-1 text-sm text-cyan-200 hover:text-cyan-100">
              Follow the quickstart <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-white/[0.1] bg-[#0d1117]">
            <CopyButton text={PYTHON} className="absolute right-2 top-2" />
            <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-gray-300">{PYTHON}</pre>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">Examples</h2>
              <p className="mt-2 text-gray-400">Finished workspaces you can open in the browser, with the code that built them.</p>
            </div>
            <a href="/examples/" className="inline-flex items-center gap-1 text-sm text-cyan-200 hover:text-cyan-100">
              All {EXAMPLES.length} examples <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((example) => (
              <ExampleCard key={example.slug} example={example} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
