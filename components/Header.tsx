'use client';

import { ArrowUpRight, Menu, X } from 'lucide-react';
import { SiDiscord, SiGithub } from '@icons-pack/react-simple-icons';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { PROJECTS, SPACES_URL } from '@/lib/projects';

const navigation = PROJECTS.map((project) => ({
  label: project.name,
  href: `/docs/${project.id}/`,
  match: `/docs/${project.id}/`,
}));

export const GITHUB_URL = 'https://github.com/Hyper3Labs';
export const DISCORD_URL = 'https://discord.gg/Za3rBkTPSf';

export default function Header() {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#0a0a0a]/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6" aria-label="Primary">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold tracking-tight text-white">
              hyper<sup className="text-[9px]">3</sup>labs
            </span>
            <span className="text-sm text-gray-500">docs</span>
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const active = pathname.startsWith(item.match);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${active ? 'bg-white/[0.07] text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {item.label}
                </a>
              );
            })}
            <a href={SPACES_URL} className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-gray-400 transition hover:text-white">
              Spaces <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <a href="https://hyper3labs.com" className="mr-2 text-xs text-gray-500 transition hover:text-gray-200">
            hyper3labs.com
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="rounded-md p-2 text-gray-400 transition hover:bg-white/[0.06] hover:text-white" aria-label="hyper³labs on GitHub">
            <SiGithub className="h-4 w-4" />
          </a>
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="rounded-md p-2 text-gray-400 transition hover:bg-white/[0.06] hover:text-white" aria-label="Discord">
            <SiDiscord className="h-4 w-4" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-gray-400 hover:bg-white/[0.06] hover:text-white md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open ? (
        <div id="mobile-nav" className="border-t border-white/[0.07] px-4 pb-4 pt-2 md:hidden">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="block rounded-md px-3 py-2.5 text-sm text-gray-200 hover:bg-white/[0.06]">
              {item.label}
            </a>
          ))}
          <a href={SPACES_URL} className="block rounded-md px-3 py-2.5 text-sm text-gray-200 hover:bg-white/[0.06]">Spaces</a>
          <a href={GITHUB_URL} className="block rounded-md px-3 py-2.5 text-sm text-gray-200 hover:bg-white/[0.06]">GitHub</a>
          <a href={DISCORD_URL} className="block rounded-md px-3 py-2.5 text-sm text-gray-200 hover:bg-white/[0.06]">Discord</a>
        </div>
      ) : null}
    </header>
  );
}
