'use client';

import React, { useState } from 'react';
import {
  BENCHMARK_METRICS,
  CANDIDATE_MODELS,
  BENCHMARK_INFO,
  FEATURE_IMPORTANCE,
} from '@/config/benchmarks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  GitFork,
  Ruler,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  BarChart3,
  SlidersHorizontal,
  Layers,
  ArrowUpRight,
  Info,
} from 'lucide-react';

interface ModelBenchmarksDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModelBenchmarksDialog({
  isOpen,
  onClose,
}: ModelBenchmarksDialogProps) {
  const [activeTab, setActiveTab] = useState<'importance' | 'models'>('importance');
  const [filterCategory, setFilterCategory] = useState<'all' | 'primary' | 'spatial' | 'structural' | 'amenity'>('all');

  const getMetricIcon = (iconName: string, variant?: string) => {
    const isSuccess = variant === 'success';
    switch (iconName) {
      case 'account_tree':
        return <GitFork className="w-3.5 h-3.5 text-indigo-400" />;
      case 'straighten':
        return <Ruler className="w-3.5 h-3.5 text-indigo-400" />;
      case 'multiline_chart':
        return <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />;
      case 'check_circle':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <BarChart3 className={`w-3.5 h-3.5 ${isSuccess ? 'text-emerald-400' : 'text-indigo-400'}`} />;
    }
  };

  const getMetricSubtitle = (title: string) => {
    switch (title.toLowerCase()) {
      case 'champion regressor':
        return '100 trees ensemble';
      case 'mean absolute error':
        return 'Avg. absolute deviation';
      case 'root mean squared error':
        return 'Residual std deviation';
      case 'r² variance score':
        return 'Holdout accuracy';
      default:
        return 'Cross-validated';
    }
  };

  const filteredFeatures = FEATURE_IMPORTANCE.filter((f) => {
    if (filterCategory === 'all') return true;
    return f.category === filterCategory;
  });

  const categoryCounts = {
    all: FEATURE_IMPORTANCE.length,
    primary: FEATURE_IMPORTANCE.filter((f) => f.category === 'primary').length,
    spatial: FEATURE_IMPORTANCE.filter((f) => f.category === 'spatial').length,
    structural: FEATURE_IMPORTANCE.filter((f) => f.category === 'structural').length,
    amenity: FEATURE_IMPORTANCE.filter((f) => f.category === 'amenity').length,
  };

  const getCategoryDot = (category: string) => {
    switch (category) {
      case 'primary':
        return <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Primary Driver" />;
      case 'spatial':
        return <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" title="Location Geospatial" />;
      case 'structural':
        return <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Structural Layout" />;
      case 'amenity':
        return <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" title="Amenity / Finish" />;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'primary':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            Primary Driver
          </span>
        );
      case 'spatial':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
            Location Geospatial
          </span>
        );
      case 'structural':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/25">
            Structural Layout
          </span>
        );
      case 'amenity':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/25">
            Amenity / Finish
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="w-[calc(100vw-1.25rem)] max-w-[calc(100vw-1.25rem)] sm:max-w-3xl max-h-[92vh] overflow-y-auto p-0 bg-[#0c0d10] border border-[#23262f] text-neutral-100 shadow-[0_30px_70px_rgba(0,0,0,0.85)] rounded-xl sm:rounded-2xl overflow-x-hidden">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-32 bg-indigo-600/15 blur-3xl rounded-full" />

        {/* Modal Header */}
        <div className="p-3 sm:px-4.5 sm:pt-4 sm:pb-3 border-b border-[#1c1f26] relative z-10 pr-10 sm:pr-12">
          <DialogHeader className="text-left space-y-0.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <DialogTitle className="text-sm sm:text-base font-semibold tracking-normal text-white">
                    Model Architecture &amp; Weights
                  </DialogTitle>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Holdout 2025
                  </span>
                </div>
                <DialogDescription className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 leading-tight">
                  Random Forest Regressor (100 estimators) across 1,248+ holdout listings.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* 4 Compact Metric Cards (Small and tight for mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mt-2 sm:mt-3">
            {BENCHMARK_METRICS.map((metric) => {
              const isSuccess = metric.variant === 'success';
              return (
                <div
                  key={metric.title}
                  className="group relative p-1.5 sm:p-2 rounded-lg bg-gradient-to-b from-[#15171d] to-[#0f1115] border border-[#23262f] hover:border-[#333742] transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-neutral-400 truncate pr-1">
                      {metric.title}
                    </span>
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-white/[0.04] flex items-center justify-center shrink-0">
                      {getMetricIcon(metric.icon, metric.variant)}
                    </div>
                  </div>
                  <div
                    className={`text-[12px] sm:text-[15px] font-bold tracking-tight tabular-nums truncate leading-none py-0.5 ${
                      isSuccess ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {metric.value}
                  </div>
                  <div className="text-[8px] sm:text-[9px] text-neutral-400 mt-0.5 truncate leading-tight">
                    {getMetricSubtitle(metric.title)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-2.5 sm:p-4 space-y-2.5 sm:space-y-3.5 relative z-10">
          {/* Segmented Tab Navigation & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
            {/* Tab Switcher */}
            <div className="inline-flex items-center p-0.5 rounded-lg bg-[#131519] border border-[#22252c] self-start w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('importance')}
                className={`flex-1 sm:flex-initial justify-center px-2 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-medium transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                  activeTab === 'importance'
                    ? 'bg-[#232731] text-white shadow-xs border border-white/10'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3 h-3 text-indigo-400" />
                <span>Feature Weights</span>
                <span className="ml-0.5 px-1 py-0.2 rounded text-[8.5px] bg-white/10 text-neutral-300">
                  18
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('models')}
                className={`flex-1 sm:flex-initial justify-center px-2 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-medium transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                  activeTab === 'models'
                    ? 'bg-[#232731] text-white shadow-xs border border-white/10'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3 text-indigo-400" />
                <span>Algorithm Matrix</span>
              </button>
            </div>

            {/* Category Filter Pills (When on Importance Tab) */}
            {activeTab === 'importance' && (
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#131519] border border-[#22252c] text-[9px] sm:text-[10px] overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
                <span className="text-neutral-400 font-medium uppercase px-1 shrink-0 text-[8.5px]">
                  Filter:
                </span>
                {(['all', 'primary', 'spatial', 'structural', 'amenity'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilterCategory(cat)}
                    className={`px-1.5 sm:px-2 py-0.5 rounded capitalize font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      filterCategory === cat
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cat}
                    <span className="ml-0.5 opacity-70 text-[8px] sm:text-[9px]">
                      ({categoryCounts[cat]})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* TAB 1: FEATURE IMPORTANCE (COMPRESSED DENSE LAYOUT) */}
          {activeTab === 'importance' && (
            <div className="space-y-2.5">
              {/* Clean Macro Drivers Insight Banner */}
              <div className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-indigo-950/30 via-[#131620] to-[#0f1117] border border-indigo-500/20 flex items-center gap-2 text-[10px] sm:text-[11px] text-neutral-300">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400 shrink-0" />
                <p className="leading-tight sm:leading-snug">
                  <strong className="text-white">Macro Drivers:</strong> Land Area (89.27%) &amp; Location Rate (5.49%) anchor 94.76% of price.
                </p>
              </div>

              {/* Compressed 2-Column Grid */}
              <div className="rounded-xl border border-[#23262f] bg-[#0e1014] overflow-hidden shadow-inner">
                {/* Header */}
                <div className="px-3 py-1.5 bg-[#14161b] border-b border-[#23262f] flex items-center justify-between text-[10px] sm:text-[11px]">
                  <span className="font-semibold uppercase tracking-wider text-neutral-300">
                    Feature Weights (Ranked)
                  </span>
                  <span className="text-neutral-400 text-[9px] sm:text-[10px]">
                    18 features
                  </span>
                </div>

                {/* Dense Items */}
                <div className="p-1.5 sm:p-2 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5">
                  {filteredFeatures.map((item, idx) => {
                    const barWidth = Math.max(item.percentage, item.percentage > 0 ? 1.5 : 0);
                    const rankNum = idx + 1;
                    const isRank1 = rankNum === 1;
                    const isRank2 = rankNum === 2;

                    return (
                      <div
                        key={item.name}
                        title={`${item.name}: ${item.description}\nCategory: ${item.category} • Weight: ${item.weight.toFixed(6)}`}
                        className="flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg bg-[#121419] border border-[#1f2229] hover:border-[#30343e] hover:bg-[#161820] transition-colors group cursor-default"
                      >
                        {/* Left: Rank, Category Dot, Name */}
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span
                            className={`text-[8.5px] tabular-nums font-semibold px-1 py-0.2 rounded shrink-0 ${
                              isRank1
                                ? 'bg-amber-500/20 text-amber-300'
                                : isRank2
                                ? 'bg-indigo-500/20 text-indigo-300'
                                : 'bg-white/5 text-neutral-400'
                            }`}
                          >
                            #{String(rankNum).padStart(2, '0')}
                          </span>
                          {getCategoryDot(item.category)}
                          <span className="text-[11px] sm:text-[12px] font-medium text-neutral-200 truncate group-hover:text-white transition-colors">
                            {item.name}
                          </span>
                        </div>

                        {/* Right: Compressed Bar + Percentage */}
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                          <div className="w-10 sm:w-16 h-1 sm:h-1.5 rounded-full bg-[#1b1e25] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isRank1
                                  ? 'bg-gradient-to-r from-emerald-400 to-indigo-500'
                                  : isRank2
                                  ? 'bg-gradient-to-r from-indigo-400 to-purple-500'
                                  : item.percentage > 0.5
                                  ? 'bg-indigo-400/90'
                                  : 'bg-neutral-600'
                              }`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                          <span className="text-[10px] sm:text-[11px] font-semibold text-white tabular-nums w-10 sm:w-12 text-right">
                            {item.percentage.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Badges Legend Bar */}
                <div className="px-3 py-1.5 sm:py-2 bg-[#121418] border-t border-[#23262f] flex flex-wrap items-center justify-between gap-1.5 text-[9px] sm:text-[10px] text-neutral-400">
                  <span className="tabular-nums">
                    Showing {filteredFeatures.length} of {FEATURE_IMPORTANCE.length}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Primary
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Spatial
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Structural
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Amenity
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CANDIDATE MODEL BENCHMARKS */}
          {activeTab === 'models' && (
            <div className="space-y-2.5 sm:space-y-4">
              {/* Desktop / Tablet Table View (hidden on mobile) */}
              <div className="hidden sm:block rounded-xl border border-[#23262f] bg-[#0e1014] overflow-hidden">
                {/* Table Header */}
                <div className="px-4 py-2 bg-[#14161b] border-b border-[#1c1f26] flex items-center justify-between text-[11px]">
                  <span className="font-semibold uppercase tracking-wider text-neutral-300">
                    Candidate Algorithm Cross-Validation Matrix
                  </span>
                  <span className="text-neutral-400 tabular-nums text-[10px]">
                    Holdout: {BENCHMARK_INFO.holdoutCount}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-none">
                    <thead className="bg-[#121418] border-b border-[#1c1f26] text-[9px] font-semibold uppercase tracking-wider text-neutral-400">
                      <tr>
                        <th className="py-2 px-3">Algorithm Candidate</th>
                        <th className="py-2 px-3 text-right">MAE (PKR)</th>
                        <th className="py-2 px-3 text-right">RMSE (PKR)</th>
                        <th className="py-2 px-3 text-right">R² Variance</th>
                        <th className="py-2 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1b1e25]">
                      {CANDIDATE_MODELS.map((model) => (
                        <tr
                          key={model.name}
                          className={`transition-colors ${
                            model.isChampion
                              ? 'bg-indigo-950/20 border-l-4 border-l-indigo-500'
                              : 'hover:bg-white/[0.02]'
                          }`}
                        >
                          <td className="py-2 px-3 font-medium text-white flex items-center gap-1.5 whitespace-nowrap">
                            {model.isChampion && (
                              <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                            )}
                            <span>{model.name}</span>
                          </td>
                          <td className="py-2 px-3 text-right text-neutral-300 tabular-nums whitespace-nowrap">
                            {model.mae}
                          </td>
                          <td className="py-2 px-3 text-right text-neutral-300 tabular-nums whitespace-nowrap">
                            {model.rmse}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums font-semibold text-emerald-400 whitespace-nowrap">
                            {model.r2}
                          </td>
                          <td className="py-2 px-3 text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium ${
                                model.isChampion
                                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25'
                                  : 'bg-white/5 text-neutral-400 border border-white/5'
                              }`}
                            >
                              {model.statusText}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View (Zero Horizontal Overflow) */}
              <div className="sm:hidden space-y-2">
                <div className="flex items-center justify-between text-[10px] text-neutral-400 px-0.5">
                  <span className="uppercase tracking-wider font-semibold text-neutral-300">Algorithm Matrix</span>
                  <span>Holdout: {BENCHMARK_INFO.holdoutCount}</span>
                </div>

                <div className="space-y-1.5">
                  {CANDIDATE_MODELS.map((model) => (
                    <div
                      key={model.name}
                      className={`p-2 rounded-lg border transition-colors ${
                        model.isChampion
                          ? 'bg-indigo-950/25 border-indigo-500/40 shadow-xs'
                          : 'bg-[#111317] border-[#22252d]'
                      }`}
                    >
                      {/* Top Row: Name + Status */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-1 min-w-0">
                          {model.isChampion && (
                            <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                          )}
                          <span className="text-[11px] font-semibold text-white truncate">
                            {model.name}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.2 rounded text-[8.5px] font-medium shrink-0 ${
                            model.isChampion
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-white/5 text-neutral-400 border border-white/5'
                          }`}
                        >
                          {model.statusText}
                        </span>
                      </div>

                      {/* 3 Metric Pills */}
                      <div className="grid grid-cols-3 gap-1 text-[9px] pt-1 border-t border-white/[0.04]">
                        <div className="bg-black/30 p-1 rounded">
                          <span className="text-neutral-400 block text-[7.5px] uppercase">MAE</span>
                          <span className="text-neutral-200 font-medium tabular-nums">{model.mae}</span>
                        </div>
                        <div className="bg-black/30 p-1 rounded">
                          <span className="text-neutral-400 block text-[7.5px] uppercase">RMSE</span>
                          <span className="text-neutral-200 font-medium tabular-nums">{model.rmse}</span>
                        </div>
                        <div className="bg-black/30 p-1 rounded">
                          <span className="text-neutral-400 block text-[7.5px] uppercase">R² Score</span>
                          <span className="text-emerald-400 font-semibold tabular-nums">{model.r2}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footnote */}
              <div className="p-2.5 rounded-xl bg-[#111317] border border-[#23262f] text-[9.5px] sm:text-[10px] text-neutral-400 leading-relaxed flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Evaluation Methodology:</strong> Cross-validated on a stratified 20% holdout split drawn from 7,289+ curated 2025 Lahore listings. The Random Forest Regressor minimizes deviation across non-linear spatial interactions.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
