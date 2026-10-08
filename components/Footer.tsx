import { GITHUB_URL, DISCORD_URL } from '@/components/Header';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          HyperView is open source under the MIT licence, built by{' '}
          <a href="https://hyper3labs.com" className="text-gray-300 hover:text-white">
            hyper<sup className="text-[9px]">3</sup>labs
          </a>
          .
        </p>
        <div className="flex gap-5">
          <a href={GITHUB_URL} className="hover:text-white">GitHub</a>
          <a href="https://pypi.org/project/hyperview/" className="hover:text-white">PyPI</a>
          <a href="https://huggingface.co/hyper3labs" className="hover:text-white">Hugging Face</a>
          <a href={DISCORD_URL} className="hover:text-white">Discord</a>
        </div>
      </div>
    </footer>
  );
}
