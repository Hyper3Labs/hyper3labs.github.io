'use client';

import { useMemo, useState } from 'react';
import ExampleCard from '@/components/ExampleCard';
import { EXAMPLES, EXAMPLE_WORKFLOWS } from '@/lib/examples';

export default function ExamplesGallery() {
  const [workflow, setWorkflow] = useState('All');
  const shown = useMemo(
    () => (workflow === 'All' ? EXAMPLES : EXAMPLES.filter((e) => e.workflow === workflow)),
    [workflow],
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter examples">
        {EXAMPLE_WORKFLOWS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setWorkflow(name)}
            aria-pressed={workflow === name}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              workflow === name ? 'border-cyan-300/40 bg-cyan-300/[0.1] text-cyan-100' : 'border-white/[0.09] text-gray-400 hover:text-white'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((example) => (
          <ExampleCard key={example.slug} example={example} />
        ))}
      </div>
    </>
  );
}
