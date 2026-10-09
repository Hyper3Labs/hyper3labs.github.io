import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CopyButton from '@/components/CopyButton';
import { PROJECTS, SPACES_URL } from '@/lib/projects';

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 pb-20 pt-14 sm:px-6 lg:pt-20">
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">
          Documentation
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-400">
          Open-source tools from{' '}
          <a href="https://hyper3labs.com" className="text-gray-200 hover:text-white">
            hyper<sup className="text-[10px]">3</sup>labs
          </a>{' '}
          for working with embeddings beyond flat Euclidean space.
        </p>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <article key={project.id} className="flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
              <h2 className="text-xl font-semibold text-white">
                <a href={`/docs/${project.id}/`} className="hover:text-cyan-100">{project.name}</a>
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">{project.tagline}</p>
              <div className="mt-5 flex items-center justify-between rounded-lg border border-white/[0.1] bg-[#0d1117] px-3 py-2.5 font-mono text-xs text-gray-200">
                <span className="truncate">
                  <span className="mr-2 select-none text-cyan-400">$</span>
                  {project.install}
                </span>
                <CopyButton text={project.install} />
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <a href={`/docs/${project.id}/`} className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 font-medium text-[#0a0a0a] hover:bg-cyan-100">
                  Docs <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <a href={project.repo} className="rounded-md border border-white/[0.1] px-3 py-1.5 text-gray-300 hover:text-white">GitHub</a>
                <a href={project.registry.href} className="rounded-md border border-white/[0.1] px-3 py-1.5 text-gray-300 hover:text-white">{project.registry.label}</a>
              </div>
            </article>
          ))}
        </div>

        <a href={SPACES_URL} className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition hover:border-cyan-300/30">
          <span>
            <span className="block text-base font-semibold text-white">HyperView Spaces</span>
            <span className="mt-1 block text-sm text-gray-400">Complete HyperView workspaces you can open in the browser, with the code that built them.</span>
          </span>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-gray-400" />
        </a>
      </main>
      <Footer />
    </>
  );
}
