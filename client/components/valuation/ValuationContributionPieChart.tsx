'use client';

import React, { CSSProperties, useId, useState, useEffect } from 'react';
import { Cell, Label, Pie, PieChart } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { formatCrore, formatNumber } from '@/lib/utils';
import { FeatureContributionItem } from '@/lib/breakdown';

export interface ValuationContributionPieChartProps {
  items: FeatureContributionItem[];
  totalPKR: number;
  totalCrore: string;
  className?: string;
  compact?: boolean;
}

interface ChartSliceData {
  source: string;
  label: string;
  amount: number;
  percentage: number;
  fill: string;
  gradientId: string;
  stopColor: string;
}

export function ValuationContributionPieChart({
  items,
  totalPKR,
  totalCrore,
  className = '',
  compact = false,
}: ValuationContributionPieChartProps) {
  const [mounted, setMounted] = useState(false);
  const chartUniqueId = useId().replace(/:/g, '');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter positive contributions to display proportional shares in the pie chart
  const positiveItems = items.filter((item) => item.impactPKR > 0);
  const positiveTotal = positiveItems.reduce((acc, curr) => acc + curr.impactPKR, 0);

  // Palette tuned to match the dark institutional theme
  const palette = [
    { color: '#4f46e5', stopColor: '#6366f1' }, // Land baseline - Indigo
    { color: '#0284c7', stopColor: '#38bdf8' }, // Rooms - Sky Blue
    { color: '#059669', stopColor: '#10b981' }, // Living / Culinary - Emerald
    { color: '#7c3aed', stopColor: '#a855f7' }, // Floorplan / Type - Violet
    { color: '#d97706', stopColor: '#f59e0b' }, // Furnishing / Lawn - Amber
    { color: '#0891b2', stopColor: '#06b6d4' }, // Extra - Cyan
  ];

  const chartData: ChartSliceData[] = positiveItems.map((item, index) => {
    const pal = palette[index % palette.length];
    const sourceKey = `slice_${index}`;
    const pct = positiveTotal > 0 ? (item.impactPKR / positiveTotal) * 100 : 0;
    return {
      source: sourceKey,
      label: item.label.split('(')[0].trim(),
      amount: item.impactPKR,
      percentage: Number(pct.toFixed(1)),
      fill: `url(#gradient-${chartUniqueId}-${sourceKey})`,
      gradientId: `gradient-${chartUniqueId}-${sourceKey}`,
      stopColor: pal.color,
    };
  });

  // Dynamic ChartConfig for ReUI/shadcn ChartContainer
  const chartConfig: ChartConfig = {
    amount: { label: 'Value' },
    ...chartData.reduce((acc, slice) => {
      acc[slice.source] = {
        label: slice.label,
        color: slice.stopColor,
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>),
  };

  const depreciationItem = items.find((i) => i.impactPKR < 0);

  if (!mounted) {
    return (
      <div className="w-full h-52 flex flex-col items-center justify-center gap-2 rounded-xl border border-charcoal/40 bg-surface-container-lowest/30 animate-pulse">
        <div className="w-28 h-28 rounded-full border-4 border-charcoal/50 border-t-accent animate-spin" />
        <span className="text-[11px] text-quiet-text">Rendering valuation breakdown...</span>
      </div>
    );
  }

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${compact ? 'space-y-1.5' : 'space-y-3'} ${className}`}>
      {/* Chart Canvas Area */}
      <div className="relative w-full flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className={`mx-auto aspect-square w-full ${
            compact
              ? 'max-w-[200px] max-h-[165px]'
              : 'max-w-[240px] max-h-[220px]'
          }`}
        >
          <PieChart accessibilityLayer>
            <defs>
              <filter
                id={`chart19-3d-${chartUniqueId}`}
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feDropShadow
                  dx="0"
                  dy={compact ? 4 : 6}
                  stdDeviation={compact ? 3 : 4}
                  floodOpacity="0.25"
                />
              </filter>

              {chartData.map((slice) => (
                <linearGradient
                  key={slice.gradientId}
                  id={slice.gradientId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={slice.stopColor} stopOpacity={1} />
                  <stop offset="100%" stopColor={slice.stopColor} stopOpacity={0.75} />
                </linearGradient>
              ))}
            </defs>

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="min-w-44 gap-2 border-charcoal/80 bg-surface/95 backdrop-blur-md p-2.5 shadow-2xl"
                  formatter={(value, name) => {
                    const matched = chartData.find((s) => s.source === name);
                    const labelText = matched?.label || (typeof name === 'string' ? name : 'Item');
                    const croreText = formatCrore(Number(value));
                    return (
                      <div className="flex w-full items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-1.5 truncate">
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: matched?.stopColor || '#4f46e5' }}
                          />
                          <span className="text-supporting-text truncate max-w-[110px]">
                            {labelText}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-primary-text font-semibold tabular-nums">
                            ₨ {croreText} Cr
                          </span>
                          {matched && (
                            <span className="text-[10px] text-quiet-text ml-1.5 tabular-nums">
                              ({matched.percentage}%)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }}
                />
              }
            />

            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="source"
              innerRadius={compact ? 42 : 54}
              outerRadius={compact ? 64 : 78}
              cornerRadius={compact ? 5 : 6}
              paddingAngle={3}
              stroke="var(--color-surface, #0f1011)"
              strokeWidth={compact ? 2.5 : 3}
              style={{ filter: `url(#chart19-3d-${chartUniqueId})` }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.source}-${index}`}
                  fill={`url(#${entry.gradientId})`}
                  className="transition-opacity hover:opacity-90 cursor-pointer outline-none"
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 3}
                          className={`fill-primary-text font-bold tabular-nums ${
                            compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
                          }`}
                        >
                          ₨ {totalCrore} Cr
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + (compact ? 13 : 16)}
                          className="fill-quiet-text text-[9px] font-medium uppercase tracking-normal"
                        >
                          Total Asset
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>

      {/* Itemized Legend Badges with Percentage Contributions */}
      <div className={`grid grid-cols-2 ${compact ? 'gap-1 pt-0.5' : 'gap-1.5 pt-1'} border-t border-charcoal/50`}>
        {chartData.map((slice) => (
          <div
            key={slice.source}
            className={`flex items-center justify-between gap-1 rounded-md bg-surface-container-lowest/70 border border-charcoal/40 ${
              compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1.5 text-[11px]'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: slice.stopColor }}
              />
              <span className="text-supporting-text truncate font-medium">
                {slice.label}
              </span>
            </div>
            <span className="text-primary-text font-semibold tabular-nums shrink-0">
              {slice.percentage}%
            </span>
          </div>
        ))}
      </div>

      {/* Depreciation Impact Callout (if older property) */}
      {depreciationItem && (
        <div className={`flex items-center justify-between rounded-md bg-rose-500/10 border border-rose-500/20 ${
          compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1.5 text-[11px]'
        }`}>
          <span className="text-rose-300 font-medium truncate">
            {depreciationItem.label}
          </span>
          <span className="text-rose-400 font-semibold tabular-nums shrink-0">
            {depreciationItem.formatted}
          </span>
        </div>
      )}
    </div>
  );
}
