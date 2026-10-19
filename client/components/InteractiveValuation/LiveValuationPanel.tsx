'use client';

import React, { useState } from 'react';
import { ValuationOutput, SimulatorFormState } from '@/types/valuation';
import { computeFeatureBreakdown } from '@/lib/breakdown';
import { formatNumber } from '@/lib/utils';
import { AnimatedPrice } from './AnimatedPrice';
import { ValuationContributionPieChart } from '@/components/valuation/ValuationContributionPieChart';
import { Button } from '@/components/ui/button';
import {
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Calculator,
  Loader2,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Maximize2,
  Bed,
  Clock,
  PieChart as PieChartIcon,
  ListFilter,
} from 'lucide-react';

export interface LiveValuationPanelProps {
  result: ValuationOutput | null;
  formState: SimulatorFormState;
  isCalculating: boolean;
  onOpenDetailedModal: () => void;
  onCopyShareLink: () => void;
  onOpenBenchmarksModal?: () => void;
  onTriggerCalculate?: () => void;
}

export function LiveValuationPanel({
  result,
  formState,
  isCalculating,
  onOpenDetailedModal,
  onCopyShareLink,
  onOpenBenchmarksModal,
  onTriggerCalculate,
}: LiveValuationPanelProps) {
  const [showCalculationDetail, setShowCalculationDetail] = useState(false);
  const [breakdownView, setBreakdownView] = useState<'chart' | 'list'>('chart');
  const [copied, setCopied] = useState(false);

  // Compute itemized feature breakdown when result exists
  const breakdown = computeFeatureBreakdown(formState, result?.totalEstimatedPKR);

  // Numeric crore for smooth animated counting
  const numericCrore = result?.totalEstimatedPKR
    ? +(result.totalEstimatedPKR / 10000000).toFixed(2)
    : 0;

  const lowCrore = result?.confidenceInterval
    ? (result.confidenceInterval[0] / 10000000).toFixed(2)
    : '0.00';
  const highCrore = result?.confidenceInterval
    ? (result.confidenceInterval[1] / 10000000).toFixed(2)
    : '0.00';

  const handleShare = () => {
    onCopyShareLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  // Derive Property Age for display
  const propertyAge =
    typeof formState.yearBuilt === 'number' && formState.yearBuilt > 0
      ? Math.max(0, 2025 - formState.yearBuilt)
      : 4;

  return (
    <div
      id="live-valuation-panel"
      className="w-full rounded-2xl border border-charcoal/70 bg-surface/95 p-5 md:p-6 shadow-xl space-y-4"
    >
      {/* Header Status Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-charcoal/60">
        <span className="text-[12px] font-medium text-quiet-text uppercase tracking-normal">
          Valuation Summary
        </span>

        {isCalculating ? (
          <span className="text-[11px] text-indigo-400 flex items-center gap-1.5 font-medium">
            <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
            {result ? 'Updating Valuation...' : 'Querying Model...'}
          </span>
        ) : result?.serverPredicted ? (
          <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Verified Model Output
          </span>
        ) : (
          <span className="text-[11px] text-quiet-text flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-charcoal" />
            Awaiting Submission
          </span>
        )}
      </div>

      {/* STATE 1: Calculating State (Only shown if NO previous result exists) */}
      {isCalculating && !result && (
        <div className="py-10 px-4 flex flex-col items-center justify-center text-center space-y-4 rounded-xl border border-charcoal/70 bg-surface-container-lowest/50 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[15px] font-medium text-primary-text">
              Estimating Property Value...
            </h4>
            <p className="text-[12px] text-quiet-text max-w-xs">
              Running 100-estimator Random Forest model across {formState.location || 'Lahore'} listings.
            </p>
          </div>
          <div className="w-48 h-2 rounded-full bg-surface-container overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-accent to-indigo-400 animate-pulse" />
          </div>
        </div>
      )}

      {/* STATE 2: Awaiting Submission (No Result Yet) */}
      {!isCalculating && !result && (
        <div className="py-6 px-4 flex flex-col items-center justify-center text-center space-y-3.5 rounded-xl border border-dashed border-charcoal/80 bg-surface-container-lowest/40">
          <div className="w-10 h-10 rounded-xl bg-surface-container border border-charcoal flex items-center justify-center text-quiet-text">
            <Calculator className="w-5 h-5 text-accent" />
          </div>

          <div className="space-y-1 max-w-xs">
            <h4 className="text-[14px] font-medium text-primary-text">
              Awaiting Submission
            </h4>
            <p className="text-[12px] text-quiet-text leading-relaxed">
              Click <span className="text-primary-text font-medium">"Calculate Property Value"</span> on the left to run the ML valuation.
            </p>
          </div>

          {/* Active Config Summary Pill */}
          <div className="py-2 px-3.5 rounded-lg bg-surface-container/90 border border-charcoal/80 text-[12px] text-supporting-text flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-primary-text font-medium">
              <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>{formState.location || 'Society'}</span>
            </span>
            <span className="text-charcoal/80">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{formState.areaValue || 10} {formState.unit}</span>
            </span>
            <span className="text-charcoal/80">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{formState.bedrooms} Beds</span>
            </span>
            <span className="text-charcoal/80">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{propertyAge}y Age</span>
            </span>
          </div>

          {onTriggerCalculate && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onTriggerCalculate}
              className="text-[12px] h-8 border-accent/40 bg-accent/10 hover:bg-accent hover:text-white text-accent transition-colors gap-1.5 cursor-pointer"
            >
              <span>Submit &amp; Value Property</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}

          <div className="pt-1 text-[11px] text-quiet-text flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>FastAPI Server Connected</span>
          </div>
        </div>
      )}

      {/* STATE 3: Verified Backend Output Responded OK */}
      {result && (
        <div className={`space-y-4 transition-opacity duration-300 ${isCalculating ? 'opacity-80' : 'opacity-100'}`}>
          {/* Hero Price & Key Valuation Figures */}
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-primary-text tracking-normal">
              <AnimatedPrice value={numericCrore} prefix="₨ " suffix=" Crore" />
            </div>

            {/* Single clean range & rate info line */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-quiet-text">
              <span>
                Range: <strong className="text-primary-text font-medium">₨ {lowCrore} Cr – ₨ {highCrore} Cr</strong>
              </span>
              <span>•</span>
              <span>
                Rate: <strong className="text-primary-text font-medium">₨ {formatNumber(result.ratePerMarlaPKR)} / Marla</strong>
              </span>
            </div>
          </div>

          {/* Collapsible "How we calculated this" */}
          <div className="pt-2 border-t border-charcoal/50">
            <button
              type="button"
              onClick={() => setShowCalculationDetail(!showCalculationDetail)}
              className="w-full flex items-center justify-between text-[12px] text-supporting-text hover:text-primary-text py-1 transition-colors cursor-pointer select-none"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                How we calculated this
              </span>
              <span className="text-[11px] text-quiet-text flex items-center gap-0.5">
                {showCalculationDetail ? 'Hide' : 'Show details'}
                {showCalculationDetail ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </span>
            </button>

            {showCalculationDetail && (
              <div className="mt-3 space-y-3 pt-1 border-t border-charcoal/40">
                {/* Segmented View Switcher */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-quiet-text uppercase tracking-normal">
                    Value Attribution
                  </span>
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-surface-container-lowest border border-charcoal/70">
                    <button
                      type="button"
                      onClick={() => setBreakdownView('chart')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                        breakdownView === 'chart'
                          ? 'bg-accent text-white shadow-xs'
                          : 'text-quiet-text hover:text-supporting-text'
                      }`}
                    >
                      <PieChartIcon className="w-3 h-3" />
                      <span>Pie Chart</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBreakdownView('list')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                        breakdownView === 'list'
                          ? 'bg-accent text-white shadow-xs'
                          : 'text-quiet-text hover:text-supporting-text'
                      }`}
                    >
                      <ListFilter className="w-3 h-3" />
                      <span>List</span>
                    </button>
                  </div>
                </div>

                {/* Conditional View: Pie Chart (reui c-chart-19) vs List */}
                {breakdownView === 'chart' ? (
                  <ValuationContributionPieChart
                    items={breakdown.items}
                    totalPKR={result.totalEstimatedPKR}
                    totalCrore={result.croreFormatted}
                  />
                ) : (
                  <div className="space-y-1.5">
                    {breakdown.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 rounded-lg bg-surface-container-lowest/70 flex items-center justify-between text-[12px]"
                      >
                        <div>
                          <div className="text-primary-text font-medium text-[12px]">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-quiet-text">
                            {item.description}
                          </div>
                        </div>
                        <div
                          className={`text-[12px] font-semibold shrink-0 ml-2 tabular-nums ${
                            item.isBaseline
                              ? 'text-primary-text'
                              : item.isPositive
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {item.formatted}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleShare}
              className="w-full h-10 border-charcoal bg-surface-container-lowest text-supporting-text hover:text-primary-text text-[13px] gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Valuation Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-quiet-text" />
                  <span>Share Valuation</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
