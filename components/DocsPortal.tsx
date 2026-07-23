'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  CircleDot,
  Command,
  Copy,
  Database,
  ExternalLink,
  Github,
  LayoutDashboard,
  Play,
  Radio,
  ScanSearch,
  Share2,
  Terminal,
} from 'lucide-react';
import { HYPERVIEW_SPACES, SPACE_WORKFLOWS, type HyperViewSpace, type SpaceWorkflow } from '@/lib/spaces';

type ActiveWorkflow = 'All' | SpaceWorkflow;

const concepts = [
  {
    icon: Database,
    title: 'Runtime-owned data',
    text: 'Datasets, embeddings, layouts, selections, panels, and jobs live in the workspace—not in a browser-only copy.',
  },
  {
    icon: LayoutDashboard,
    title: 'Composable panels',
    text: 'Inspect samples, maps, metrics, and purpose-built evidence together in one synchronized workspace.',
  },
  {
    icon: Bot,
    title: 'Agent-native control',
    text: 'The CLI and API expose the same state that people see, so agents can discover, compose, and verify work.',
  },
  {
    icon: Share2,
    title: 'Shareable Spaces',
    text: 'Package prepared evidence as a read-only Space, or connect a live runtime when new computation is required.',
  },
];

function CopyCommand() {
  const command = 'pip install hyperview && hyperview demo';
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.09] bg-[#070a0f] shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-gray-500">
          <Terminal className="h-3.5 w-3.5" aria-hidden="true" /> Quick start
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] text-gray-500 transition hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Copy installation command"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto px-4 py-4 font-mono text-[13px] text-gray-300">
        <span className="mr-3 text-cyan-400">$</span>{command}
      </div>
    </div>
  );
}

function SpaceCard({ space }: { space: HyperViewSpace }) {
  return (
    <article className="group relative isolate overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b0f16]/95 shadow-[0_20px_70px_rgba(0,0,0,0.32)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 focus-within:border-cyan-300/50">
      <a
        href={space.viewerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-20 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-inset"
        aria-label={`Open ${space.name} read-only HyperView Space`}
      />
      <div className="relative aspect-[16/9] overflow-hidden border-b border-white/[0.08] bg-black/30">
        <Image
          src={space.preview}
          alt={`HyperView workspace preview for ${space.name}`}
          fill
          sizes="(min-width: 1280px) 38vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover object-top transition duration-500 group-hover:scale-[1.015]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b10]/70 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-[#070a0f]/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-200 backdrop-blur-xl">
          <Radio className="h-3 w-3 text-cyan-300" aria-hidden="true" /> Read-only
        </span>
      </div>
      <div className="relative p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-gray-500">{space.context}</p>
            <h3 className="text-xl font-semibold tracking-tight text-white">{space.name}</h3>
          </div>
          <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-[9px] text-gray-400">{space.workflow}</span>
        </div>
        <p className="text-sm font-medium leading-relaxed text-gray-100">{space.question}</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">{space.description}</p>
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
          <span className="font-mono text-[9px] leading-relaxed text-gray-600">{space.modality}</span>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-gray-300">
            Open <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}

function DocsSidebar() {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-28 space-y-8 pr-8 font-mono text-[11px]">
        <div>
          <p className="mb-3 uppercase tracking-[0.18em] text-gray-600">Tools</p>
          <a href="#overview" className="flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2.5 text-gray-100">
            <CircleDot className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" /> HyperView
          </a>
          <p className="px-3 pt-3 leading-relaxed text-gray-700">Future hyper³labs tools will appear here.</p>
        </div>
        <nav aria-label="On this page">
          <p className="mb-3 uppercase tracking-[0.18em] text-gray-600">On this page</p>
          <div className="space-y-1 border-l border-white/[0.08] pl-3 text-gray-500">
            <a href="#overview" className="block py-1.5 transition hover:text-white">Overview</a>
            <a href="#quickstart" className="block py-1.5 transition hover:text-white">Quick start</a>
            <a href="#concepts" className="block py-1.5 transition hover:text-white">Core concepts</a>
            <a href="#spaces" className="block py-1.5 transition hover:text-white">Spaces</a>
          </div>
        </nav>
      </div>
    </aside>
  );
}

export default function DocsPortal() {
  const [activeWorkflow, setActiveWorkflow] = useState<ActiveWorkflow>('All');
  const spaces = useMemo(
    () => activeWorkflow === 'All' ? HYPERVIEW_SPACES : HYPERVIEW_SPACES.filter((space) => space.workflow === activeWorkflow),
    [activeWorkflow],
  );

  return (
    <main className="relative z-10 min-h-screen px-5 pb-16 pt-28 sm:px-6">
      <div className="mx-auto grid max-w-[1440px] gap-10 xl:grid-cols-[190px_minmax(0,1fr)]">
        <DocsSidebar />
        <div className="min-w-0">
          <section id="overview" className="scroll-mt-28 border-b border-white/[0.07] pb-16 pt-6 sm:pt-12">
            <div className="mb-8 flex items-center gap-2 font-mono text-[10px] text-gray-500">
              <span>Tools</span><ChevronRight className="h-3 w-3" /><span className="text-gray-200">HyperView</span>
              <span className="ml-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-2 py-0.5 text-cyan-200">Open source</span>
            </div>
            <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">HyperView documentation</p>
                <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
                  Understand multimodal data as a workspace.
                </h1>
                <p className="mt-7 max-w-3xl text-base leading-relaxed text-gray-400 sm:text-lg">
                  HyperView is an agent-native workbench for inspecting datasets, comparing representations, and sharing evidence. People and coding agents operate the same runtime-owned state through the UI, CLI, and API.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#quickstart" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#080b10] transition hover:bg-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
                    Get started <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="#spaces" className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
                    <ScanSearch className="h-4 w-4" /> Explore Spaces
                  </a>
                </div>
              </div>
              <div id="quickstart" className="scroll-mt-28 space-y-3">
                <CopyCommand />
                <div className="grid grid-cols-2 gap-3">
                  <a href="https://github.com/Hyper3Labs/HyperView" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-sm text-gray-300 transition hover:bg-white/[0.06] hover:text-white">
                    <Github className="h-4 w-4" /> Source
                  </a>
                  <a href="https://huggingface.co/spaces/hyper3labs/HyperView" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-sm text-gray-300 transition hover:bg-white/[0.06] hover:text-white">
                    <Play className="h-4 w-4" /> Live demo
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section id="concepts" className="scroll-mt-28 border-b border-white/[0.07] py-16">
            <div className="mb-9 max-w-2xl">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.19em] text-gray-600">Core concepts</p>
              <h2 className="text-3xl font-semibold tracking-tight text-white">One state, many ways to work.</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">HyperView keeps the product surface, command line, and agent interface aligned around the same workspace model.</p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
              {concepts.map(({ icon: Icon, title, text }) => (
                <div key={title} className="bg-[#090d14]/95 p-5 sm:p-6">
                  <Icon className="mb-5 h-5 w-5 text-cyan-300" aria-hidden="true" />
                  <h3 className="font-medium text-gray-100">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="spaces" className="scroll-mt-24 py-16">
            <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.19em] text-cyan-300">HyperView Spaces</p>
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Explore the workbench through real questions.</h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-400 sm:text-base">Each Space is a prepared, shareable HyperView artifact—not a screenshot or stripped-down mini app. Open one to inspect the complete read-only workspace.</p>
              </div>
              <div className="flex max-w-full gap-1.5 overflow-x-auto rounded-xl border border-white/[0.07] bg-white/[0.025] p-1.5 sm:flex-wrap sm:justify-end sm:overflow-visible" role="group" aria-label="Filter Spaces by workflow">
                {SPACE_WORKFLOWS.map((workflow) => {
                  const active = workflow === activeWorkflow;
                  return (
                    <button key={workflow} type="button" aria-pressed={active} onClick={() => setActiveWorkflow(workflow)} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${active ? 'bg-white text-[#080b10]' : 'text-gray-500 hover:bg-white/[0.06] hover:text-white'}`}>
                      {workflow}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3" aria-live="polite">
              {spaces.map((space) => <SpaceCard key={space.slug} space={space} />)}
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.09] bg-white/[0.035] p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">Live runtime</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Use your own data, models, and agents.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">Static Spaces preserve prepared evidence. Connect a runtime to create datasets, run providers, recompute layouts, and keep agent actions in workspace state.</p>
            </div>
            <a href="https://github.com/Hyper3Labs/HyperView#readme" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#080b10] transition hover:bg-cyan-100 sm:mt-0">
              <Command className="h-4 w-4" /> Run HyperView <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
