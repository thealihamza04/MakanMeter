'use client';

import React from 'react';
import { PRIME_SECTOR_RATES, PrimeSectorRate } from '@/data/primeSectors';
import { TrendingUp, Activity, Sparkles } from 'lucide-react';

interface LiveMarketTickerProps {
  activeSectorId?: string;
  onSelectSector?: (sector: PrimeSectorRate) => void;
}

export function LiveMarketTicker({
  activeSectorId,
  onSelectSector,
}: LiveMarketTickerProps) {
  // We duplicate the array to guarantee a seamless 100% infinite marquee loop
  const tickerItems = [...PRIME_SECTOR_RATES, ...PRIME_SECTOR_RATES];

  return (
    <div className="w-full relative py-2 overflow-hidden border-y border-charcoal/60 bg-surface-container-lowest/80 backdrop-blur-md">
      {/* Edge Vignette Fades */}
      <div className="absolute left-0 inset-y-0 w-12 md:w-24 bg-gradient-to-r from-[#08090a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-12 md:w-24 bg-gradient-to-l from-[#08090a] to-transparent z-10 pointer-events-none" />

      <div className="flex items-center">
        {/* Static Prefix Indicator */}
        <div className="shrink-0 z-20 pl-4 pr-3 flex items-center gap-2 border-r border-charcoal/80 bg-surface-container-lowest/95 py-1">
          <span className="h-2 w-2 rounded-full bg-indigo-400 shrink-0" />
          <span className="text-[11px] tracking-wider font-semibold uppercase text-supporting-text hidden sm:inline-flex items-center gap-1.5">
            2025 Sector Benchmarks
          </span>
          <span className="text-[10px] text-quiet-text bg-surface-container px-1.5 py-0.5 rounded border border-charcoal">
            PKR/Marla
          </span>
        </div>

        {/* Continuous Marquee Ticker Track */}
        <div className="overflow-hidden flex-1 select-none">
          <div className="animate-ticker flex items-center gap-4 py-1">
            {tickerItems.map((sector, idx) => {
              const isSelected = activeSectorId === sector.id;
              return (
                <button
                  type="button"
                  key={`${sector.id}-${idx}`}
                  onClick={() => onSelectSector?.(sector)}
                  className={`inline-flex items-center gap-2.5 px-3 py-1 rounded-full text-left transition-all duration-200 border cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-accent/20 border-accent/60 shadow-sm shadow-accent/30'
                      : 'bg-surface/80 hover:bg-surface-container border-charcoal/70 hover:border-supporting-text/40'
                  }`}
                  title={`Click to preview ${sector.displayName}`}
                >
                  <span className="text-[12px] font-medium text-primary-text flex items-center gap-1">
                    {sector.shortName}
                  </span>

                  <span className="text-[12px] tabular-nums font-semibold text-emerald-400">
                    ₨ {sector.meanRateMarla.toFixed(2)}M
                  </span>

                  <span className="text-[10px] tabular-nums text-quiet-text hidden md:inline">
                    med: {sector.medianRateMarla.toFixed(2)}M
                  </span>

                  <span className="text-[10px] tabular-nums px-1.5 py-0.2 rounded bg-surface-container text-supporting-text border border-charcoal/50">
                    {sector.listingCount.toLocaleString()} units
                  </span>

                  <span className="text-[10px] font-medium text-emerald-400/90 flex items-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5" />
                    {sector.trendPct}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
