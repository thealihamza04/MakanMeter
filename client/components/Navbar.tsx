'use client';

import React, { useState, useEffect } from 'react';
import { SITE_CONFIG } from '@/config/site';
import { Icon } from '@/ui';

interface NavbarProps {
  onOpenBenchmarks?: () => void;
}

export function Navbar({ onOpenBenchmarks }: NavbarProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 left-0 right-0 w-full z-50 transition-all duration-300 h-16 bg-[#08090a]/95 backdrop-blur-xl border-b border-charcoal/80 shadow-md shadow-black/40`}
    >
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center p-1.5 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Logo.png"
                alt="Logo"
                className="w-full h-full object-contain filter brightness-100"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] sm:text-[16px] text-primary-text font-semibold tracking-tight group-hover:text-compact-highlight transition-colors leading-tight">
                {SITE_CONFIG.title}
              </span>
              <span className="text-[10px] text-emerald-400 tracking-wide uppercase font-medium">
                Valuation Studio • 2025 Dataset
              </span>
            </div>
          </a>
        </div>

        {/* Right Status Indicator & Model Benchmarks Button */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-surface border border-charcoal">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-quiet-text">
              Random Forest
            </span>
            <span className="w-1 h-1 rounded-full bg-charcoal" />
            <span className="text-[11px] tabular-nums text-emerald-400 font-semibold">
              R² 0.8722
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenBenchmarks}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all bg-surface hover:bg-surface-container text-supporting-text hover:text-primary-text border border-charcoal active:scale-95 cursor-pointer shadow-sm"
          >
            <Icon name="bar_chart" size={16} className="text-indigo-400" />
            <span>Model Benchmarks</span>
          </button>
        </div>
      </div>
    </header>
  );
}
