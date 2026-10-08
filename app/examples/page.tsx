import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExamplesGallery from '@/components/ExamplesGallery';

export const metadata: Metadata = {
  title: 'Examples',
  description: 'HyperView workspaces you can open in the browser: product search, region retrieval, remote sensing, trust and safety, and more.',
  alternates: { canonical: '/examples/' },
};

export default function ExamplesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 pb-20 pt-12 sm:px-6">
        <div className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">Examples</h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-400">
            Each example is a complete HyperView workspace, exported as a{' '}
            <a href="/docs/spaces/" className="text-gray-200 underline decoration-gray-600 hover:decoration-gray-300">Static Space</a>{' '}
            that runs in your browser with no install and no backend. Most compare a hyperbolic model,
            Hyper3-CLIP, with OpenAI CLIP on the same task, including the cases CLIP wins. Every example links to the code
            that built it, so you can point it at your own data.
          </p>
        </div>
        <ExamplesGallery />
        <div className="mt-14 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
          <h2 className="text-lg font-semibold text-white">Build your own</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">
            Copy a folder from{' '}
            <a href="https://github.com/Hyper3Labs/hyperview-spaces" className="text-gray-200 underline decoration-gray-600 hover:decoration-gray-300">hyperview-spaces</a>,
            change the dataset and models at the top of its <code className="text-gray-300">demo.py</code>, then export and
            publish it. The <a href="/docs/spaces/" className="text-gray-200 underline decoration-gray-600 hover:decoration-gray-300">Spaces guide</a> covers each step.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
