'use client';

import { Menu, X } from 'lucide-react';
import { SiDiscord, SiGithub } from '@icons-pack/react-simple-icons';
import { useEffect, useState } from 'react';

const navigation = [
  { label: 'overview', href: '/#overview' },
  { label: 'concepts', href: '/#concepts' },
  { label: 'spaces', href: '/spaces/' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto max-w-[1440px]">
        <div className={`relative overflow-hidden rounded-2xl border border-white/[0.08] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ${isScrolled ? 'bg-[#090d14]/90 shadow-2xl' : 'bg-[#090d14]/70 shadow-lg'}`}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <nav className="relative flex h-12 items-center justify-between px-4 sm:px-5" aria-label="Primary navigation">
            <a href="/" className="group flex items-center gap-2.5">
              <img src="/brand-assets/hyper3labs-logo-primary.svg" alt="" className="h-7 w-7 transition duration-300 group-hover:rotate-6" />
              <span className="font-mono text-sm text-gray-200">hyper<sup className="text-[9px]">3</sup>labs</span>
              <span className="hidden h-4 w-px bg-white/[0.12] sm:block" />
              <span className="hidden font-mono text-[11px] text-gray-500 sm:block">docs</span>
            </a>

            <div className="hidden items-center gap-1 md:flex">
              {navigation.map((item) => <a key={item.href} href={item.href} className="rounded-lg px-3 py-1.5 font-mono text-[11px] text-gray-500 transition hover:bg-white/[0.06] hover:text-white">{item.label}</a>)}
              <div className="mx-1 h-4 w-px bg-white/[0.08]" />
              <a href="https://github.com/Hyper3Labs/HyperView" target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-gray-500 transition hover:bg-white/[0.06] hover:text-white" aria-label="HyperView on GitHub"><SiGithub className="h-4 w-4" /></a>
              <a href="https://discord.gg/Qf2pXtY4Vf" target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-gray-500 transition hover:bg-white/[0.06] hover:text-white" aria-label="Join the hyper³labs Discord"><SiDiscord className="h-4 w-4" /></a>
            </div>

            <button type="button" onClick={() => setIsMobileMenuOpen((open) => !open)} className="rounded-lg p-2 text-gray-400 transition hover:bg-white/[0.06] hover:text-white md:hidden" aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation">
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </nav>
          {isMobileMenuOpen ? (
            <div id="mobile-navigation" className="border-t border-white/[0.07] px-4 pb-4 pt-2 md:hidden">
              {navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 font-mono text-xs text-gray-300 transition hover:bg-white/[0.06] hover:text-white">{item.label}</a>)}
              <div className="mt-2 flex gap-2 border-t border-white/[0.07] pt-3">
                <a href="https://github.com/Hyper3Labs/HyperView" target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-gray-300"><SiGithub className="h-4 w-4" /> GitHub</a>
                <a href="https://discord.gg/Qf2pXtY4Vf" target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-gray-300"><SiDiscord className="h-4 w-4" /> Discord</a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
