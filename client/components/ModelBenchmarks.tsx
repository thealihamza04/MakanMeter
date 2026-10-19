'use client';

import React, { useState, useEffect } from 'react';
import {
  BENCHMARK_METRICS,
  CANDIDATE_MODELS,
  BENCHMARK_INFO,
} from '@/config/benchmarks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  GitFork,
  Ruler,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  BarChart,
} from 'lucide-react';

export function ModelBenchmarks() {
  const [isChampionHighlighted, setIsChampionHighlighted] = useState(false);

  useEffect(() => {
    const handleHighlight = () => {
      setIsChampionHighlighted(true);
      setTimeout(() => {
        setIsChampionHighlighted(false);
      }, 2500);
    };

    window.addEventListener('highlight-champion-model', handleHighlight);
    return () => {
      window.removeEventListener('highlight-champion-model', handleHighlight);
    };
  }, []);

  const getMetricIcon = (iconName: string, variant?: string) => {
    const color = variant === 'success' ? 'text-emerald-400' : 'text-indigo-400';
    switch (iconName) {
      case 'account_tree':
        return <GitFork className={`w-4 h-4 ${color}`} />;
      case 'straighten':
        return <Ruler className={`w-4 h-4 ${color}`} />;
      case 'multiline_chart':
        return <TrendingUp className={`w-4 h-4 ${color}`} />;
      case 'check_circle':
        return <CheckCircle2 className={`w-4 h-4 ${color}`} />;
      default:
        return <BarChart className={`w-4 h-4 ${color}`} />;
    }
  };

  return (
    <section
      className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center max-w-7xl mx-auto px-6 py-12 md:py-20 scroll-mt-16 animate-fade-in-up delay-200"
      id="model-benchmarks"
    >
      <div className="max-w-3xl mb-6">
        <h2 className="text-2xl text-primary-text font-medium tracking-tight">
          Model Architecture &amp; Performance Benchmarks
        </h2>
      </div>

      {/* 4 Key Metric Cards using shadcn Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {BENCHMARK_METRICS.map((metric) => (
          <Card
            key={metric.title}
            className="p-5 space-y-1.5 border-charcoal bg-surface cursor-default hover:border-slate/40 transition-colors"
          >
            <div className="flex items-center justify-between text-quiet-text">
              <span className="text-[11px] uppercase tracking-wider text-quiet-text">
                {metric.title}
              </span>
              {getMetricIcon(metric.icon, metric.variant)}
            </div>
            <div
              className={`text-xl font-medium ${
                metric.variant === 'success'
                  ? 'text-compact-highlight'
                  : 'text-primary-text'
              }`}
            >
              {metric.value}
            </div>
          </Card>
        ))}
      </div>

      {/* Comparative Benchmark Table using shadcn Table */}
      <Card className="overflow-hidden border-charcoal bg-surface">
        <CardHeader className="p-4 bg-surface-container-lowest/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal">
          <CardTitle className="text-[16px] text-primary-text font-medium">
            Candidate Model Comparison Matrix
          </CardTitle>
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 py-1 px-2.5 rounded text-[12px] border-charcoal bg-surface-container text-supporting-text w-fit"
          >
            <BarChart className="w-3.5 h-3.5 text-indigo-400" />
            <span>Holdout Set: {BENCHMARK_INFO.holdoutCount}</span>
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-surface-container-lowest/50">
              <TableRow className="border-charcoal hover:bg-transparent">
                <TableHead className="py-3 px-4 text-quiet-text uppercase text-[11px] tracking-wider">
                  Candidate Algorithm
                </TableHead>
                <TableHead className="py-3 px-4 text-right text-quiet-text uppercase text-[11px] tracking-wider">
                  MAE (PKR)
                </TableHead>
                <TableHead className="py-3 px-4 text-right text-quiet-text uppercase text-[11px] tracking-wider">
                  RMSE (PKR)
                </TableHead>
                <TableHead className="py-3 px-4 text-right text-quiet-text uppercase text-[11px] tracking-wider">
                  R² Coefficient
                </TableHead>
                <TableHead className="py-3 px-4 text-center text-quiet-text uppercase text-[11px] tracking-wider">
                  Deployment Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="tabular-nums text-[13px]">
              {CANDIDATE_MODELS.map((model) => {
                if (model.isChampion) {
                  return (
                    <TableRow
                      key={model.name}
                      id="champion-model-row"
                      className={`border-charcoal border-l-4 transition-all duration-500 cursor-default ${
                        isChampionHighlighted
                          ? 'bg-accent/25 border-l-accent ring-2 ring-accent/60 shadow-lg shadow-accent/20 scale-[1.01]'
                          : 'bg-deep-navy/70 border-l-accent hover:bg-deep-navy'
                      }`}
                    >
                      <TableCell className="py-3.5 px-4 font-sans text-[14px] text-primary-text font-medium flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>{model.name}</span>
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-right text-compact-highlight font-medium">
                        {model.mae}
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-right text-compact-highlight font-medium">
                        {model.rmse}
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-right text-compact-highlight font-semibold">
                        {model.r2}
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-center">
                        <Badge
                          variant="default"
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] bg-accent text-white font-medium shadow-none hover:bg-accent"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                          <span>{model.statusText}</span>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                }

                return (
                  <TableRow
                    key={model.name}
                    className="border-charcoal hover:bg-surface-container/60 cursor-default"
                  >
                    <TableCell className="py-3.5 px-4 text-[14px] text-supporting-text">
                      {model.name}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-right text-quiet-text">
                      {model.mae}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-right text-quiet-text">
                      {model.rmse}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-right text-supporting-text">
                      {model.r2}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      <Badge
                        variant="secondary"
                        className="inline-block px-2.5 py-0.5 rounded text-[11px] bg-surface-container text-quiet-text border border-charcoal font-normal"
                      >
                        {model.statusText}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
