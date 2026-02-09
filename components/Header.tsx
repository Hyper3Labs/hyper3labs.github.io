'use client';

import { Menu, X } from 'lucide-react';
import { SiDiscord, SiGithub } from '@icons-pack/react-simple-icons';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 pt-4">
      <div className="max-w-4xl mx-auto">
        {/* Liquid Glass Container */}
        <div
          className={`
            relative overflow-hidden rounded-2xl transition-all duration-500
            ${isScrolled 
              ? 'bg-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]' 
              : 'bg-white/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]'
            }
            backdrop-blur-xl backdrop-saturate-150
            border border-white/[0.08]
          `}
          style={{
            // Liquid glass inner glow effect
            background: isScrolled 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.08) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)',
          }}
        >
          {/* Specular highlight - top edge shine */}
          <div 
            className="absolute inset-x-0 top-0 h-px opacity-60"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 80%, transparent 100%)',
            }}
          />
          
          {/* Navigation content */}
          <nav className="relative flex items-center justify-between h-12 px-5">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-sm font-mono text-gray-300 group-hover:text-white transition-colors duration-200">
                hyper<sup className="text-[10px]">3</sup>labs
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <a
                href="#projects"
                className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-200 font-mono"
              >
                projects
              </a>
              <a
                href="https://discord.gg/Qf2pXtY4Vf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-200 font-mono"
              >
                <SiDiscord className="w-4 h-4" />
                discord
              </a>
              <a
                href="https://github.com/Hyper3Labs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-200 font-mono"
              >
                <SiGithub className="w-4 h-4" />
                github
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </nav>

          {/* Mobile Menu - Liquid Glass style */}
          {isMobileMenuOpen && (
            <div className="md:hidden px-5 pb-4 pt-2 border-t border-white/[0.06]">
              <div className="flex flex-col gap-1">
                <a
                  href="#projects"
                  className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-200 font-mono text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  projects
                </a>
                <a
                  href="https://discord.gg/Qf2pXtY4Vf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-200 font-mono text-sm"
                >
                  <SiDiscord className="w-4 h-4" />
                  discord
                </a>
                <a
                  href="https://github.com/Hyper3Labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-200 font-mono text-sm"
                >
                  <SiGithub className="w-4 h-4" />
                  github
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
