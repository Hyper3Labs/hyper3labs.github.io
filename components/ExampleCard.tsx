import { ArrowUpRight, Code2, Server } from 'lucide-react';
import { type Example, isExternal } from '@/lib/examples';

export default function ExampleCard({ example }: { example: Example }) {
  const external = isExternal(example.url);
  const target = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] transition hover:border-cyan-300/30">
      <a href={example.url} {...target} className="relative block aspect-[16/9] overflow-hidden border-b border-white/[0.07] bg-[#0d1117]" aria-label={`Open ${example.name}`}>
        {example.preview ? (
          <img
            src={example.preview}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.14),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(167,139,250,0.12),transparent_45%)]">
            <span className="font-mono text-xs text-gray-500">{example.name}</span>
          </div>
        )}
      </a>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-white/[0.09] px-2 py-0.5 font-mono text-[10px] text-gray-400">{example.workflow}</span>
          {example.host === 'huggingface' ? (
            <span className="rounded-full border border-amber-300/20 px-2 py-0.5 font-mono text-[10px] text-amber-200/80">Hugging Face</span>
          ) : null}
        </div>
        <h3 className="text-base font-semibold text-white">
          <a href={example.url} {...target} className="hover:text-cyan-100">
            {example.name}
          </a>
        </h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-gray-400">{example.description}</p>
        {example.modality ? <p className="mt-3 font-mono text-[10px] text-gray-600">{example.modality}</p> : null}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <a href={example.url} {...target} className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1.5 font-medium text-[#0a0a0a] hover:bg-cyan-100">
            Open <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          {example.live ? (
            <a href={example.live.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-white/[0.1] px-2.5 py-1.5 text-gray-300 hover:text-white">
              <Server className="h-3.5 w-3.5" /> Live Space
            </a>
          ) : null}
          <a href={example.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-white/[0.1] px-2.5 py-1.5 text-gray-300 hover:text-white">
            <Code2 className="h-3.5 w-3.5" /> Source
          </a>
        </div>
      </div>
    </article>
  );
}
