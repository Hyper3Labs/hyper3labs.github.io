'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ArrowRight, Eye, Server } from 'lucide-react';
import {
  HYPERVIEW_SPACES,
  SPACE_WORKFLOWS,
  type HyperViewSpace,
  type SpaceWorkflow,
} from '@/lib/spaces';

type ActiveWorkflow = 'All' | SpaceWorkflow;

function SpaceCard({ space }: { space: HyperViewSpace }) {
  return (
    <article className="group relative isolate overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b0f16]/95 shadow-[0_20px_70px_rgba(0,0,0,0.32)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 focus-within:border-cyan-300/50">
      <a
        href={space.staticSpaceUrl}
        className="relative block aspect-[16/9] overflow-hidden border-b border-white/[0.08] bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-inset"
        aria-label={`Explore the ${space.name} HyperView Space`}
      >
        <Image
          src={space.preview}
          alt={`HyperView workspace preview for ${space.name}`}
          fill
          sizes="(min-width: 1536px) 31vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover object-top transition duration-500 group-hover:scale-[1.015]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b10]/70 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-[#070a0f]/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-200 backdrop-blur-xl">
          <Eye className="h-3 w-3 text-cyan-300" aria-hidden="true" /> Static Space
        </span>
      </a>
      <div className="relative p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-gray-500">
              {space.context}
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-white">{space.name}</h2>
          </div>
          <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-[9px] text-gray-400">
            {space.workflow}
          </span>
        </div>
        <p className="text-sm font-medium leading-relaxed text-gray-100">{space.question}</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">{space.description}</p>
        <div className="mt-4 border-t border-white/[0.07] pt-4">
          <span className="font-mono text-[9px] leading-relaxed text-gray-600">{space.modality}</span>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={space.staticSpaceUrl}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#080b10] transition hover:bg-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Explore Space <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            {space.liveSpaceUrl ? (
              <a
                href={space.liveSpaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.11] bg-white/[0.04] px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/[0.08] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                Live Space <Server className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export function SpacesTeaser() {
  return (
    <section id="spaces" className="scroll-mt-24 py-16">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.19em] text-cyan-300">
            HyperView Spaces
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            See the workbench answer real questions.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-400 sm:text-base">
            Browse six HyperView Spaces across retrieval, archive QA, and trust and safety
            workflows.
          </p>
        </div>
        <a
          href="/spaces/"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:self-auto"
        >
          Browse all Spaces <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {HYPERVIEW_SPACES.slice(0, 3).map((space) => (
          <a
            key={space.slug}
            href={space.staticSpaceUrl}
            className="group overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0f16]/90 transition hover:border-cyan-300/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <div className="relative aspect-[16/9] overflow-hidden border-b border-white/[0.07]">
              <Image
                src={space.preview}
                alt=""
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{space.name}</p>
                <p className="mt-1 truncate font-mono text-[9px] text-gray-600">{space.modality}</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gray-500" aria-hidden="true" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function SpacesGallery() {
  const [activeWorkflow, setActiveWorkflow] = useState<ActiveWorkflow>('All');
  const spaces = useMemo(
    () =>
      activeWorkflow === 'All'
        ? HYPERVIEW_SPACES
        : HYPERVIEW_SPACES.filter((space) => space.workflow === activeWorkflow),
    [activeWorkflow],
  );

  return (
    <main className="relative z-10 min-h-screen px-5 pb-20 pt-32 sm:px-6 sm:pt-36">
      <div className="mx-auto max-w-[1440px]">
        <header className="border-b border-white/[0.07] pb-12 sm:pb-16">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-gray-500">
            <a href="/" className="transition hover:text-white">HyperView</a>
            <span aria-hidden="true">/</span>
            <span className="text-gray-200">Spaces</span>
            <span className="ml-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-2 py-0.5 text-cyan-200">
              {HYPERVIEW_SPACES.length} Spaces
            </span>
          </div>
          <div className="mt-8 max-w-4xl">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">
              HyperView Spaces
            </p>
            <h1 className="text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Explore multimodal work through the questions it answers.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-400 sm:text-lg">
              Each Static Space is a complete HyperView workspace comparing{' '}
              <span className="text-gray-200">hyper3-clip-v0.5</span> with OpenAI CLIP
              ViT-B/32 on one retrieval workflow. Inspect samples, layouts, linked
              evidence, and purpose-built panels without a backend.
            </p>
          </div>
          <div className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-cyan-300/15 bg-cyan-300/[0.045] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Eye className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                Static Space
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                The exported bundle served as plain files: portable and inexpensive
                to host. The full viewer and its interactive evidence remain
                available.
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.09] bg-white/[0.025] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Server className="h-4 w-4 text-gray-300" aria-hidden="true" />
                Live Space
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Runtime-connected for new data, queries, model jobs, computed layouts, and
                editable workspace state.
              </p>
            </div>
          </div>
        </header>

        <section aria-labelledby="gallery-heading" className="pt-10 sm:pt-12">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 id="gallery-heading" className="text-xl font-semibold text-white">
                Browse the collection
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Filter by workflow, then open its Static Space or Live Space.
              </p>
            </div>
            <div
              className="flex max-w-full gap-1.5 overflow-x-auto rounded-xl border border-white/[0.07] bg-white/[0.025] p-1.5 sm:flex-wrap sm:overflow-visible"
              role="group"
              aria-label="Filter Spaces by workflow"
            >
              {SPACE_WORKFLOWS.map((workflow) => {
                const active = workflow === activeWorkflow;
                return (
                  <button
                    key={workflow}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveWorkflow(workflow)}
                    className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      active
                        ? 'bg-white text-[#080b10]'
                        : 'text-gray-500 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {workflow}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3" aria-live="polite">
            {spaces.map((space) => (
              <SpaceCard key={space.slug} space={space} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
