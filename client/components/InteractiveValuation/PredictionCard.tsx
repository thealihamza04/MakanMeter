'use client';

import React from 'react';
import { ValuationOutput, SimulatorFormState } from '@/types/valuation';
import { SITE_CONFIG } from '@/config/site';
import { Card, Button, Badge, Icon } from '@/ui';
import { formatNumber } from '@/lib/utils';

export interface PredictionCardProps {
  result: ValuationOutput;
  formState: SimulatorFormState;
  isCalculating: boolean;
  onReset: () => void;
  onExportPdf: () => void;
  isExportingPdf: boolean;
}

export function PredictionCard({
  result,
  formState,
  isCalculating,
  onReset,
  onExportPdf,
  isExportingPdf,
}: PredictionCardProps) {
  return (
    <Card className="relative overflow-hidden space-y-4">
      {/* Price Output Display */}
      <div className="space-y-1 relative">
        <span className="text-[11px] text-quiet-text uppercase tracking-normal block font-medium">
          Estimated Market Value
        </span>

        <div className="flex items-baseline gap-2">
          <div
            className={`text-3xl md:text-4xl text-primary-text tracking-normal font-medium transition-all duration-200 ${
              isCalculating ? 'opacity-40' : 'opacity-100'
            }`}
          >
            PKR {result.croreFormatted} Crore
          </div>
        </div>

        <div
          className={`text-[13px] text-quiet-text transition-all duration-200 ${
            isCalculating ? 'opacity-40' : 'opacity-100'
          }`}
        >
          PKR {formatNumber(result.totalEstimatedPKR)} ({result.lakhsFormatted} Lakhs)
        </div>
      </div>

      {/* Rate Metrics Breakdown */}
      <div className="mt-5 pt-4 bg-surface-container-lowest rounded p-4 space-y-2.5 border border-charcoal">
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-quiet-text">Normalized Unit Rate</span>
          <span className="text-[13px] font-medium text-primary-text">
            PKR {formatNumber(result.ratePerMarlaPKR)} / Marla
          </span>
        </div>

        <div className="flex justify-between items-center text-[13px]">
          <span className="text-quiet-text">5-Marla Pro-Rata Base</span>
          <span className="tabular-nums text-[13px] font-medium text-primary-text">
            PKR {result.prorata5MarlaCrore} Crore
          </span>
        </div>

        <div className="flex justify-between items-center text-[13px]">
          <span className="text-quiet-text">{result.localityLabel}</span>
          <span
            className={`tabular-nums text-[13px] font-medium ${
              result.localityDiff.startsWith('+') ? 'text-emerald-400' : 'text-quiet-text'
            }`}
          >
            {result.localityDiff}
          </span>
        </div>
      </div>

      {/* Dynamic Selected Badges */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge variant="chip" icon="location_on" iconColor="text-indigo-400">
          {formState.location}
        </Badge>
        <Badge variant="chip" icon="square_foot" iconColor="text-quiet-text">
          {result.areaInMarla.toFixed(1)} Marla
        </Badge>
        <Badge variant="chip" icon="bed" iconColor="text-quiet-text">
          {formState.bedrooms} Bed / {formState.bathrooms} Bath
        </Badge>
        <Badge variant="chip" icon="home" iconColor="text-quiet-text">
          {formState.propertyType} ({formState.isFurnished ? 'Furnished' : 'Unfurnished'})
        </Badge>
      </div>

      {/* Realistic Disclaimer */}
      <div className="mt-4 p-3 rounded bg-surface-container-lowest border border-charcoal flex items-start gap-2">
        <Icon name="info" size={16} className="text-quiet-text mt-0.5" />
        <p className="text-[12px] text-quiet-text leading-relaxed">{SITE_CONFIG.disclaimer}</p>
      </div>

      {/* Secondary Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon="restart_alt"
          onClick={onReset}
          className="w-full"
        >
          Reset Parameters
        </Button>

        <Button
          variant="secondary"
          size="sm"
          icon={isExportingPdf ? 'hourglass_empty' : 'picture_as_pdf'}
          isLoading={isExportingPdf}
          onClick={onExportPdf}
          className="w-full"
        >
          {isExportingPdf ? 'Compiling PDF...' : 'Export PDF Comps'}
        </Button>
      </div>
    </Card>
  );
}
