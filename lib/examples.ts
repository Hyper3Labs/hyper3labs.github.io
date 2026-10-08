import catalog from '@/content/examples.json';

export type Example = {
  slug: string;
  name: string;
  description: string;
  question: string;
  workflow: string;
  modality: string;
  mode: 'static' | 'live';
  url: string;
  host: 'site' | 'huggingface';
  live: { space_id: string; url: string } | null;
  preview: string | null;
  source: string;
};

/** Generated from the hyperview-spaces registries by scripts/build-examples-catalog.py. */
export const EXAMPLES = catalog.examples as Example[];

export const EXAMPLE_WORKFLOWS = ['All', ...Array.from(new Set(EXAMPLES.map((e) => e.workflow)))];

export const isExternal = (url: string) => /^https?:\/\//.test(url);
