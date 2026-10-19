'use client';

import React from 'react';
import { SITE_CONFIG } from '@/config/site';
import { BarChart3 } from 'lucide-react';

interface FooterProps {
  onOpenBenchmarks?: () => void;
}

export function Footer({ onOpenBenchmarks }: FooterProps = {}) {

  return (
    <footer className="w-full bg-surface-container-lowest py-6 border-t border-charcoal/60 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-3.5 text-[13px] text-quiet-text">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Logo.png"
              alt="Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0"
            />
            <span className="text-primary-text font-semibold text-[14px]">
              {SITE_CONFIG.title}
            </span>
            <span className="text-charcoal">•</span>
            <span className="text-[12px] text-quiet-text">
              Made by <a href="https://github.com/thealihamza04" target="_blank" rel="noopener noreferrer" className="text-supporting-text hover:text-white transition-colors underline underline-offset-4 font-medium">Ali Hamza</a>
            </span>
          </div>

          {/* Minimal Navigation Actions */}
          <div className="flex items-center gap-4 text-[13px]">
            <button
              type="button"
              onClick={onOpenBenchmarks}
              className="text-supporting-text hover:text-primary-text transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Model Details &amp; Weights</span>
            </button>
          </div>
        </div>

        {/* Dataset Source Attribution */}
        <div className="pt-2 border-t border-charcoal/40 text-[11px] text-quiet-text text-center sm:text-left">
          <p>
            Valuation prices are based on <strong className="text-supporting-text font-medium">Lahore House Listings from Zameen.com (2025)</strong> dataset.
          </p>
        </div>
      </div>
    </footer>
  );
}
