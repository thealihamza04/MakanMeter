'use client';

import React from 'react';
import { ValuationOutput, SimulatorFormState } from '@/types/valuation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/lib/utils';
import { computeFeatureBreakdown } from '@/lib/breakdown';
import { ValuationContributionPieChart } from '@/components/valuation/ValuationContributionPieChart';
import {
  Sparkles,
  MapPin,
  Maximize2,
  Bed,
  Bath,
  Armchair,
  Trees,
  CheckCircle2,
  Layers,
  Clock,
  PieChart as PieChartIcon,
} from 'lucide-react';

export interface ResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  result: ValuationOutput | null;
  formState: SimulatorFormState;
}

export function ResultDialog({
  isOpen,
  onClose,
  result,
  formState,
}: ResultDialogProps) {
  if (!result) return null;

  const breakdown = computeFeatureBreakdown(formState, result.totalEstimatedPKR);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto border-charcoal bg-surface text-primary-text sm:rounded-2xl p-4 sm:p-5 shadow-2xl space-y-2.5">
        <DialogHeader className="space-y-0.5 pb-2 border-b border-charcoal/60">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <DialogTitle className="text-base font-semibold tracking-normal text-primary-text">
              Valuation Prediction Result
            </DialogTitle>
          </div>
          <DialogDescription className="text-[11px] text-quiet-text">
            {result.serverPredicted
              ? 'Trained Random Forest Machine Learning Model'
              : 'Empirical Baseline Engine'}
          </DialogDescription>
        </DialogHeader>

        {/* Primary Valuation Hero (Compressed) */}
        <div className="bg-surface-container-lowest/80 border border-charcoal/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-medium text-quiet-text uppercase tracking-normal">
            <span>Estimated Market Price</span>
            <span className="text-emerald-400 font-semibold tabular-nums text-[12px]">
              {result.priceFormatted || `PKR ${formatNumber(result.totalEstimatedPKR)}`}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <div className="text-2xl sm:text-3xl font-bold tracking-normal text-primary-text tabular-nums">
              PKR {result.croreFormatted} Crore
            </div>
            <span className="text-[11px] text-quiet-text tabular-nums">
              ({result.lakhsFormatted} Lakhs PKR)
            </span>
          </div>
        </div>

        {/* Breakdown Metric Tiles (Compressed) */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface-container-lowest/60 border border-charcoal rounded-lg p-2 space-y-0.5">
            <span className="text-quiet-text block text-[9px] font-medium uppercase tracking-normal">
              Rate / Marla
            </span>
            <span className="text-[12px] font-semibold text-primary-text block truncate tabular-nums">
              PKR {formatNumber(result.ratePerMarlaPKR)}
            </span>
          </div>

          <div className="bg-surface-container-lowest/60 border border-charcoal rounded-lg p-2 space-y-0.5">
            <span className="text-quiet-text block text-[9px] font-medium uppercase tracking-normal">
              5-M Pro-Rata
            </span>
            <span className="text-[12px] font-semibold text-primary-text block truncate tabular-nums">
              {result.prorata5MarlaCrore} Cr
            </span>
          </div>

          <div className="bg-surface-container-lowest/60 border border-charcoal rounded-lg p-2 space-y-0.5">
            <span className="text-quiet-text block text-[9px] font-medium uppercase tracking-normal truncate">
              Locality Status
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 block truncate">
              {result.localityDiff}
            </span>
          </div>
        </div>

        {/* Contribution Pie Chart (Compressed) */}
        <div className="space-y-1.5 pt-1 border-t border-charcoal/60">
          <div className="flex items-center gap-1.5">
            <PieChartIcon className="w-3 h-3 text-accent" />
            <span className="text-[10px] font-semibold text-quiet-text uppercase tracking-normal block">
              Value Contribution By Feature
            </span>
          </div>
          <div className="p-2.5 rounded-xl border border-charcoal/60 bg-surface-container-lowest/40">
            <ValuationContributionPieChart
              items={breakdown.items}
              totalPKR={result.totalEstimatedPKR}
              totalCrore={result.croreFormatted}
              compact
            />
          </div>
        </div>

        {/* Property Parameters Summary (Compressed) */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-semibold text-quiet-text uppercase tracking-normal block">
            Property Summary
          </span>
          <div className="flex flex-wrap gap-1">
            {formState.location && (
              <Badge
                variant="outline"
                className="bg-surface-container-lowest border-charcoal text-supporting-text text-[10px] flex items-center gap-1 py-0.5 px-2"
              >
                <MapPin className="w-2.5 h-2.5 text-indigo-400" />
                <span>{formState.location}</span>
              </Badge>
            )}

            {typeof formState.areaValue === 'number' && (
              <Badge
                variant="outline"
                className="bg-surface-container-lowest border-charcoal text-supporting-text text-[10px] flex items-center gap-1 py-0.5 px-2"
              >
                <Maximize2 className="w-2.5 h-2.5 text-quiet-text" />
                <span>
                  {formState.areaValue} {formState.unit === 'kanal' ? 'Kanal' : 'Marla'}
                </span>
              </Badge>
            )}

            {formState.bedrooms > 0 && (
              <Badge
                variant="outline"
                className="bg-surface-container-lowest border-charcoal text-supporting-text text-[10px] flex items-center gap-1 py-0.5 px-2"
              >
                <Bed className="w-2.5 h-2.5 text-quiet-text" />
                <span>{formState.bedrooms} Beds</span>
              </Badge>
            )}

            {formState.bathrooms > 0 && (
              <Badge
                variant="outline"
                className="bg-surface-container-lowest border-charcoal text-supporting-text text-[10px] flex items-center gap-1 py-0.5 px-2"
              >
                <Bath className="w-2.5 h-2.5 text-quiet-text" />
                <span>{formState.bathrooms} Baths</span>
              </Badge>
            )}

            {formState.isFurnished && (
              <Badge
                variant="outline"
                className="bg-surface-container-lowest border-charcoal text-supporting-text text-[10px] flex items-center gap-1 py-0.5 px-2"
              >
                <Armchair className="w-2.5 h-2.5 text-quiet-text" />
                <span>Furnished</span>
              </Badge>
            )}

            {formState.hasLawn && (
              <Badge
                variant="outline"
                className="bg-surface-container-lowest border-charcoal text-supporting-text text-[10px] flex items-center gap-1 py-0.5 px-2"
              >
                <Trees className="w-2.5 h-2.5 text-emerald-400" />
                <span>Front Lawn</span>
              </Badge>
            )}

            {formState.yearBuilt && (
              <Badge
                variant="outline"
                className="bg-surface-container-lowest border-charcoal text-supporting-text text-[10px] flex items-center gap-1 py-0.5 px-2"
              >
                <Clock className="w-2.5 h-2.5 text-quiet-text" />
                <span>
                  {2025 - Number(formState.yearBuilt) === 0
                    ? 'Brand New'
                    : `${2025 - Number(formState.yearBuilt)}y Age`}
                </span>
              </Badge>
            )}
          </div>
        </div>

        <DialogFooter className="pt-1">
          <Button
            variant="default"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto bg-accent hover:bg-indigo-500 text-white font-medium h-8 text-xs px-5 cursor-pointer"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
