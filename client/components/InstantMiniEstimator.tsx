'use client';

import React, { useState, useEffect } from 'react';
import { PRIME_SECTOR_RATES, PrimeSectorRate } from '@/data/primeSectors';
import { LOCATIONS_LIST } from '@/data/locations';
import { Button } from '@/components/ui/button';
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
  Sparkles,
  ArrowDownRight,
  TrendingUp,
  Building2,
  Maximize2,
  Check,
} from 'lucide-react';

interface InstantMiniEstimatorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  onPrefillAndScroll: (location: string, marla: number) => void;
}

const QUICK_MARLA_OPTIONS = [5, 10, 20];

export function InstantMiniEstimator({
  selectedLocation,
  onLocationChange,
  onPrefillAndScroll,
}: InstantMiniEstimatorProps) {
  const [marla, setMarla] = useState<number>(10);
  const [customInput, setCustomInput] = useState<string>('10');

  // Find prime rate if selected location is in prime sectors
  const currentPrime = PRIME_SECTOR_RATES.find((s) => s.id === selectedLocation);

  // Rate in millions PKR per Marla (default ~4.2M if not in prime 5)
  const ratePerMarlaM = currentPrime ? currentPrime.meanRateMarla : 4.2;
  const medianRatePerMarlaM = currentPrime ? currentPrime.medianRateMarla : 4.1;

  // Ballpark calculation in Crore (1 Crore = 10 Million PKR)
  const ballparkTotalMillion = marla * ratePerMarlaM;
  const ballparkCrore = (ballparkTotalMillion / 10).toFixed(2);

  // Ballpark range (using median and variance)
  const lowRangeCrore = ((marla * Math.min(medianRatePerMarlaM, ratePerMarlaM) * 0.95) / 10).toFixed(2);
  const highRangeCrore = ((marla * Math.max(medianRatePerMarlaM, ratePerMarlaM) * 1.05) / 10).toFixed(2);

  const handleMarlaSelect = (val: number) => {
    setMarla(val);
    setCustomInput(String(val));
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setCustomInput(valStr);
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 500) {
      setMarla(parsed);
    }
  };

  const handleAction = () => {
    onPrefillAndScroll(selectedLocation, marla);
  };

  return (
    <div className="w-full max-w-xl rounded-2xl border border-charcoal/80 bg-surface/85 backdrop-blur-xl p-5 md:p-6 shadow-2xl shadow-black/60 relative overflow-hidden">
      {/* Decorative subtle ambient radial highlight */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-charcoal/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[15px] font-medium text-primary-text tracking-tight flex items-center gap-2">
              Instant Mini-Estimator
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-normal">
                Real-Time Benchmark
              </span>
            </h3>
            <p className="text-[12px] text-supporting-text">
              Select sector &amp; size for an immediate ballpark range
            </p>
          </div>
        </div>
      </div>

      {/* 2-Field Teaser Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Field 1: Housing Society */}
        <div className="space-y-1.5">
          <Label className="text-[12px] font-medium text-supporting-text flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-accent" />
            1. Society / Enclave
          </Label>
          <Select
            value={selectedLocation}
            onValueChange={(val) => onLocationChange(val)}
          >
            <SelectTrigger className="w-full h-10 border-charcoal bg-surface-container-lowest text-[13px] text-primary-text focus:ring-accent">
              <SelectValue placeholder="Choose society" />
            </SelectTrigger>
            <SelectContent className="border-charcoal bg-surface-container-lowest max-h-72">
              {/* Highlight Prime 5 first */}
              <div className="px-2 py-1.5 text-[11px] text-quiet-text uppercase tracking-wider font-semibold">
                Prime Tracked Sectors
              </div>
              {PRIME_SECTOR_RATES.map((sector) => (
                <SelectItem
                  key={sector.id}
                  value={sector.id}
                  className="text-[13px] font-medium"
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <span>{sector.shortName}</span>
                    <span className="text-[11px] tabular-nums text-emerald-400 font-normal">
                      ₨ {sector.meanRateMarla.toFixed(2)}M/M
                    </span>
                  </div>
                </SelectItem>
              ))}

              <div className="px-2 py-1.5 mt-2 border-t border-charcoal text-[11px] text-quiet-text uppercase tracking-wider font-semibold">
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

        {/* Field 2: Property Size (Marla) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[12px] font-medium text-supporting-text flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-accent" />
              2. Size in Marla
            </Label>
            <span className="text-[11px] tabular-nums text-quiet-text">
              {marla >= 20 ? `${(marla / 20).toFixed(1)} Kanal` : `${marla} Marla`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                type="number"
                min={1}
                max={500}
                step={0.5}
                value={customInput}
                onChange={handleCustomChange}
                placeholder="10"
                className="h-10 border-charcoal bg-surface-container-lowest text-[13px] text-primary-text pr-14"
              />
              <span className="absolute right-2.5 top-2.5 text-[11px] text-quiet-text pointer-events-none">
                Marla
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Select Chips */}
      <div className="flex items-center gap-2 mt-2.5">
        <span className="text-[11px] text-quiet-text">Quick:</span>
        {QUICK_MARLA_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleMarlaSelect(opt)}
            className={`px-2.5 py-1 text-[11px] tabular-nums rounded-md border transition-all ${
              marla === opt
                ? 'bg-accent/20 border-accent text-primary-text font-semibold'
                : 'bg-surface-container-lowest/80 border-charcoal text-supporting-text hover:border-supporting-text/40'
            }`}
          >
            {opt === 20 ? '1 Kanal (20M)' : `${opt} Marla`}
          </button>
        ))}
      </div>

      {/* Ball-park Display Card */}
      <div className="mt-4 p-3.5 rounded-xl border border-charcoal/80 bg-surface-container-lowest/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-quiet-text flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            Estimated Ballpark Value
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-bold tabular-nums text-primary-text tracking-tight">
              ₨ {ballparkCrore}
            </span>
            <span className="text-sm font-semibold text-supporting-text">
              Crore
            </span>
            <span className="text-[11px] tabular-nums text-quiet-text">
              (₨ {lowRangeCrore} – {highRangeCrore} Cr)
            </span>
          </div>
          <div className="text-[11px] text-supporting-text mt-0.5">
            {currentPrime ? (
              <>
                <span className="text-emerald-400 tabular-nums font-medium">
                  ₨ {currentPrime.meanRateMarla.toFixed(2)}M/Marla
                </span>{' '}
                • {currentPrime.listingCount.toLocaleString()} listings analyzed
              </>
            ) : (
              <span>Empirical baseline rate • ~₨ 4.2M/Marla</span>
            )}
          </div>
        </div>

        {/* Action Button: Smooth Scrolls & Pre-fills */}
        <Button
          onClick={handleAction}
          className="w-full sm:w-auto h-10 px-4 bg-accent hover:bg-indigo-500 text-white font-medium text-[13px] shadow-lg shadow-accent/25 hover:shadow-accent/40 shrink-0 gap-1.5"
        >
          <span>Tune Details &amp; Predict</span>
          <ArrowDownRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
