import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ReactNode } from 'react';
import CopyButton from '@/components/CopyButton';
import { slugify } from '@/lib/docs';

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return textOf((node as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="docs-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children: c }) => {
            const id = slugify(textOf(c));
            return (
              <h2 id={id} className="group scroll-mt-24">
                <a href={`#${id}`} className="no-underline">{c}</a>
              </h2>
            );
          },
          h3: ({ children: c }) => <h3 id={slugify(textOf(c))} className="scroll-mt-24">{c}</h3>,
          pre: ({ children: c }) => (
            <div className="relative">
              <pre>{c}</pre>
              <CopyButton text={textOf(c).replace(/\n$/, '')} className="absolute right-2 top-2" />
            </div>
          ),
          table: ({ children: c }) => (
            <div className="overflow-x-auto">
              <table>{c}</table>
            </div>
          ),
          a: ({ href = '', children: c }) =>
            /^https?:\/\//.test(href) ? (
              <a href={href} target="_blank" rel="noopener noreferrer">{c}</a>
            ) : (
              <a href={href}>{c}</a>
            ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
