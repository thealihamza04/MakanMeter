'use client';

import React, { useState, useRef } from 'react';
import { SITE_CONFIG } from '@/config/site';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowDownRight,
  BarChart3,
  Building2,
  Maximize2,
  Database,
  Trees,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { PRIME_SECTOR_RATES, PrimeSectorRate } from '@/data/primeSectors';
import { LOCATIONS_LIST } from '@/data/locations';
import { LiveMarketTicker } from './LiveMarketTicker';

interface HeroSectionProps {
  onPrefill?: (location: string, marla: number) => void;
}

const QUICK_MARLA_PRESETS = [5, 10, 20];

export function HeroSection({ onPrefill }: HeroSectionProps) {
  const { hero } = SITE_CONFIG;

  const [activeSector, setActiveSector] = useState<PrimeSectorRate>(
    PRIME_SECTOR_RATES[0] // Default: DHA Defence
  );
  const [selectedLocation, setSelectedLocation] = useState<string>('DHA Defence');
  const [marla, setMarla] = useState<number>(10);
  const [customInput, setCustomInput] = useState<string>('10');
  const [isDockHighlighted, setIsDockHighlighted] = useState(false);

  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Find prime sector metadata if selected location is tracked
  const currentPrime = PRIME_SECTOR_RATES.find((s) => s.id === selectedLocation);

  // Rate in millions PKR per Marla (default ~4.2M if not in prime 5)
  const ratePerMarlaM = currentPrime ? currentPrime.meanRateMarla : 4.2;
  const medianRatePerMarlaM = currentPrime ? currentPrime.medianRateMarla : 4.1;

  // Ballpark calculation in Crore (1 Crore = 10 Million PKR)
  const ballparkTotalMillion = marla * ratePerMarlaM;
  const ballparkCrore = (ballparkTotalMillion / 10).toFixed(2);
  const lowRangeCrore = ((marla * Math.min(medianRatePerMarlaM, ratePerMarlaM) * 0.95) / 10).toFixed(2);
  const highRangeCrore = ((marla * Math.max(medianRatePerMarlaM, ratePerMarlaM) * 1.05) / 10).toFixed(2);

  const triggerDockHighlight = () => {
    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    setIsDockHighlighted(true);
    highlightTimeoutRef.current = setTimeout(() => {
      setIsDockHighlighted(false);
    }, 700);
  };

  const handleSectorChange = (loc: string, fromTicker = false) => {
    setSelectedLocation(loc);
    const match = PRIME_SECTOR_RATES.find((p) => p.id === loc);
    if (match) {
      setActiveSector(match);
    }
    if (fromTicker) {
      triggerDockHighlight();
    }
  };

  const handleMarlaPreset = (val: number) => {
    setMarla(val);
    setCustomInput(String(val));
    triggerDockHighlight();
  };

  const handleCustomMarlaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setCustomInput(valStr);
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 500) {
      setMarla(parsed);
    }
  };

  const handleExecuteEstimate = () => {
    if (onPrefill) {
      onPrefill(selectedLocation, marla);
    } else {
      const el = document.getElementById('prediction-workspace');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative w-full min-h-[88vh] lg:min-h-[90vh] flex flex-col justify-between overflow-hidden animate-fade-in-up">
      {/* Background Architectural Image - Single Optimized Cinematic Backdrop */}
      <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.showcase.imageUrl}
          alt="Modern residential architecture in Lahore"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-[0.70] contrast-[1.18]"
        />
        {/* High-Legibility Gradients & Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090a] via-[#08090a]/65 to-[#08090a]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090a]/90 via-[#08090a]/60 to-[#08090a]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#08090a_95%)]" />
      </div>

      {/* Top Ribbon: 2025 Sector Benchmarks (Honest, Institutional Marquee) */}
      <div className="relative z-20 pt-16 md:pt-20 w-full">
        <LiveMarketTicker
          activeSectorId={selectedLocation}
          onSelectSector={(sector) => {
            handleSectorChange(sector.id, true);
          }}
        />
      </div>

      {/* Hero Centerpiece: Focused Command Center (Tightened for 100% Above-the-Fold Fit) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-4 md:py-8 lg:py-10 flex-1 flex flex-col justify-center items-center text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/80 border border-charcoal/80 backdrop-blur-md mb-2.5 text-[11px] sm:text-[12px] text-supporting-text">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Machine Learning Property Valuation</span>
          <span className="text-quiet-text">•</span>
          <span className="text-emerald-400 font-medium">Lahore 2025 Dataset</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-5xl text-primary-text font-semibold tracking-tight leading-[1.14] max-w-4xl">
          Estimate Your Property’s Value in Lahore
        </h1>

        {/* Concise Value Subheading */}
        <p className="mt-2.5 text-[14px] sm:text-[16px] text-supporting-text max-w-2xl leading-relaxed font-normal">
          Empirical pricing intelligence trained on 7,289+ verified residential listings across prime Lahore sectors. Instant, unbiased, and locality-tuned.
        </p>

        {/* 🌟 The Star: Unified Quick-Estimator Command Dock */}
        <div
          className={`w-full max-w-3xl mt-5 rounded-2xl border bg-surface/90 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl shadow-black/80 text-left relative overflow-hidden transition-all duration-300 ${
            isDockHighlighted
              ? 'border-accent ring-2 ring-accent/60 shadow-accent/20 scale-[1.008]'
              : 'border-charcoal/90'
          }`}
        >
          {/* Subtle top accent edge */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />

          {/* Quick-Preset Chips Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-charcoal/60 text-[11px]">
            <div className="flex items-center gap-1.5 text-quiet-text flex-wrap">
              <span className="text-supporting-text font-medium uppercase tracking-wider">Quick Sectors:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {PRIME_SECTOR_RATES.map((sector) => (
                  <button
                    key={sector.id}
                    type="button"
                    onClick={() => handleSectorChange(sector.id, true)}
                    className={`px-2 py-0.5 rounded transition-all ${
                      selectedLocation === sector.id
                        ? 'bg-accent/20 text-accent font-semibold border border-accent/40'
                        : 'text-supporting-text hover:text-primary-text hover:bg-surface-container'
                    }`}
                  >
                    {sector.shortName}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-quiet-text hidden sm:block">
              Baseline: <span className="text-emerald-400 font-medium">₨ {ratePerMarlaM.toFixed(2)}M/M</span>
            </div>
          </div>

          {/* Main 3-Part Command Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            {/* Field 1: Housing Society */}
            <div className="sm:col-span-5 space-y-1.5">
              <Label className="text-[12px] font-medium text-supporting-text flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-accent" />
                Housing Society
              </Label>
              <Select
                value={selectedLocation}
                onValueChange={(val) => handleSectorChange(val)}
              >
                <SelectTrigger className="w-full h-11 border-charcoal bg-surface-container-lowest text-[13px] text-primary-text font-medium focus:ring-accent">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="border-charcoal bg-surface-container-lowest max-h-72">
                  <div className="px-2 py-1 text-[10px] text-quiet-text uppercase tracking-wider font-semibold">
                    Prime Benchmark Sectors
                  </div>
                  {PRIME_SECTOR_RATES.map((sector) => (
                    <SelectItem
                      key={sector.id}
                      value={sector.id}
                      className="text-[13px] font-medium"
                    >
                      <div className="flex items-center justify-between w-full gap-3">
                        <span>{sector.displayName}</span>
                        <span className="text-[11px] tabular-nums text-emerald-400">
                          ₨ {sector.meanRateMarla.toFixed(2)}M/M
                        </span>
                      </div>
                    </SelectItem>
                  ))}

                  <div className="px-2 py-1 mt-1 border-t border-charcoal text-[10px] text-quiet-text uppercase tracking-wider font-semibold">
                    All Lahore Locations
                  </div>
                  {LOCATIONS_LIST.filter(
                    (loc) => !PRIME_SECTOR_RATES.some((p) => p.id === loc)
                  ).map((loc) => (
                    <SelectItem key={loc} value={loc} className="text-[13px]">
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Field 2: Size in Marla (No spinners on mobile) */}
            <div className="sm:col-span-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[12px] font-medium text-supporting-text flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-accent" />
                  Property Size
                </Label>
                <div className="flex items-center gap-1">
                  {QUICK_MARLA_PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleMarlaPreset(p)}
                      className={`text-[10px] tabular-nums px-1.5 py-0.5 rounded transition-all ${
                        marla === p
                          ? 'bg-accent text-white font-medium'
                          : 'bg-surface-container text-quiet-text hover:text-supporting-text'
                      }`}
                    >
                      {p === 20 ? '1K' : `${p}M`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Input
                  type="number"
                  min={1}
                  max={500}
                  step={0.5}
                  value={customInput}
                  onChange={handleCustomMarlaChange}
                  placeholder="10"
                  className="h-11 border-charcoal bg-surface-container-lowest text-[13px] text-primary-text tabular-nums pr-14 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-3 top-3 text-[11px] text-quiet-text pointer-events-none select-none">
                  Marla
                </span>
              </div>
            </div>

            {/* Field 3: Estimate Value Button */}
            <div className="sm:col-span-3">
              <Button
                onClick={handleExecuteEstimate}
                size="lg"
                className="w-full h-11 px-4 bg-accent hover:bg-indigo-500 text-white font-medium text-[13px] shadow-lg shadow-accent/25 hover:shadow-accent/40 gap-1.5 transition-all"
              >
                <span>Estimate Value</span>
                <ArrowDownRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Integrated Live Output & Context Footer (Explicit ML Baseline vs Full Model Clarity) */}
          <div className="mt-3.5 pt-3 border-t border-charcoal/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px]">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] text-quiet-text uppercase">Ballpark:</span>
                <span className="text-xl font-bold tabular-nums text-primary-text">
                  ₨ {ballparkCrore} Crore
                </span>
                <span className="text-[11px] tabular-nums text-quiet-text">
                  (₨ {lowRangeCrore} – {highRangeCrore} Cr)
                </span>
              </div>
              <span className="text-[10px] text-quiet-text">
                Linear locality baseline • Click Estimate to factor in bedrooms, age &amp; finishings via ML
              </span>
            </div>

            <div className="text-[11px] text-supporting-text flex items-center gap-1.5 self-start sm:self-center">
              {currentPrime ? (
                <>
                  <span className="text-emerald-400 font-medium">
                    {currentPrime.shortName}:
                  </span>
                  <span className="text-quiet-text truncate max-w-[220px] md:max-w-none">
                    {currentPrime.architecturalStyle} ({currentPrime.listingCount.toLocaleString()} listings)
                  </span>
                </>
              ) : (
                <span className="text-quiet-text">Empirical baseline rate • ₨ 4.20M/Marla</span>
              )}
            </div>
          </div>
        </div>

        {/* Institutional Trust Badges Strip */}
        <div className="mt-5 flex flex-wrap justify-center items-center gap-2.5">
          <Badge
            variant="outline"
            className="bg-surface/80 backdrop-blur-md border-charcoal/80 py-1 px-3 text-[11px] text-supporting-text flex items-center gap-1.5 rounded-full font-normal"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Dataset: 2025 Lahore Listings (7,289+ records)</span>
          </Badge>

          <Badge
            variant="outline"
            className="bg-surface/80 backdrop-blur-md border-charcoal/80 py-1 px-3 text-[11px] text-supporting-text flex items-center gap-1.5 rounded-full font-normal"
          >
            <Trees className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Model: Random Forest Regressor</span>
          </Badge>

          <Badge
            variant="outline"
            className="bg-surface/80 backdrop-blur-md border-indigo-500/40 py-1 px-3 text-[11px] text-compact-highlight flex items-center gap-1.5 rounded-full font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Test R² Score: 0.8722</span>
          </Badge>

          <a
            href="#model-benchmarks"
            className="text-[11px] text-quiet-text hover:text-supporting-text transition-colors flex items-center gap-1 underline underline-offset-4 ml-1"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Model Benchmarks ↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
