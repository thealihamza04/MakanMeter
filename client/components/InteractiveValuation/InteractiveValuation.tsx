'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  DEFAULT_SIMULATOR_STATE,
  calculateValuation,
} from '@/config/valuation';
import { SimulatorFormState, ValuationOutput } from '@/types/valuation';
import { PropertyForm } from './PropertyForm';
import { LiveValuationPanel } from './LiveValuationPanel';
import { AnimatedPrice } from './AnimatedPrice';
import { ResultDialog } from './ResultDialog';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { buildPredictPayload, fetchPricePrediction } from '@/lib/api';
import { formatCrore, formatLakhs } from '@/lib/utils';
import { playSuccessChime } from '@/lib/sound';
import { Sparkles, Home, Building, Castle, ArrowUpRight } from 'lucide-react';

export interface InteractiveValuationProps {
  prefill?: {
    location?: string;
    areaValue?: number | '';
    unit?: 'marla' | 'kanal';
  } | null;
  onOpenBenchmarksModal?: () => void;
}

const ARCHETYPES: Array<{
  id: string;
  label: string;
  sublabel: string;
  state: Partial<SimulatorFormState>;
}> = [
  {
    id: 'starter-5m',
    label: '5M Starter Home',
    sublabel: '3 Bed • 3 Bath',
    state: {
      areaValue: 5,
      unit: 'marla',
      bedrooms: 3,
      bathrooms: 3,
      kitchens: 1,
      drawingRooms: 1,
      yearBuilt: 2022,
      propertyType: 'House',
      isFurnished: false,
      hasLawn: false,
    },
  },
  {
    id: 'family-10m',
    label: '10M Family Villa',
    sublabel: '4 Bed • 4 Bath • Lawn',
    state: {
      areaValue: 10,
      unit: 'marla',
      bedrooms: 4,
      bathrooms: 4,
      kitchens: 2,
      drawingRooms: 1,
      yearBuilt: 2021,
      propertyType: 'House',
      isFurnished: false,
      hasLawn: true,
    },
  },
  {
    id: 'luxury-1k',
    label: '1 Kanal Luxury Estate',
    sublabel: '5 Bed • 6 Bath • Furnished',
    state: {
      areaValue: 20,
      unit: 'marla',
      bedrooms: 5,
      bathrooms: 6,
      kitchens: 2,
      drawingRooms: 2,
      yearBuilt: 2023,
      propertyType: 'House',
      isFurnished: true,
      hasLawn: true,
    },
  },
  {
    id: 'modern-apt',
    label: 'Luxury Apartment (6M)',
    sublabel: '2 Bed • 2 Bath • Flat',
    state: {
      areaValue: 6,
      unit: 'marla',
      bedrooms: 2,
      bathrooms: 2,
      kitchens: 1,
      drawingRooms: 1,
      yearBuilt: 2023,
      propertyType: 'Flat',
      isFurnished: true,
      hasLawn: false,
    },
  },
];

function areFormStatesEqual(a: SimulatorFormState | null, b: SimulatorFormState | null): boolean {
  if (!a || !b) return false;
  return (
    a.location === b.location &&
    a.areaValue === b.areaValue &&
    a.unit === b.unit &&
    a.bedrooms === b.bedrooms &&
    a.bathrooms === b.bathrooms &&
    a.kitchens === b.kitchens &&
    a.drawingRooms === b.drawingRooms &&
    a.yearBuilt === b.yearBuilt &&
    a.propertyType === b.propertyType &&
    a.isFurnished === b.isFurnished &&
    a.hasLawn === b.hasLawn
  );
}

export function InteractiveValuation({
  prefill,
  onOpenBenchmarksModal,
}: InteractiveValuationProps = {}) {
  const [formState, setFormState] = useState<SimulatorFormState>({
    ...DEFAULT_SIMULATOR_STATE,
    location: 'DHA Defence',
    areaValue: 10,
    bedrooms: 4,
    bathrooms: 4,
    yearBuilt: 2021,
  });

  // Track the form state that was last submitted/calculated
  const [lastSubmittedState, setLastSubmittedState] = useState<SimulatorFormState | null>(null);

  // Form is considered dirty (eligible for submission) when fields differ from last calculated values
  const isDirty = useMemo(() => {
    if (!lastSubmittedState) return true;
    return !areFormStatesEqual(formState, lastSubmittedState);
  }, [formState, lastSubmittedState]);

  // Result starts as null, populated upon first calculation
  const [result, setResult] = useState<ValuationOutput | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const syncUrlParams = useCallback((state: SimulatorFormState) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (state.location) params.set('loc', state.location);
    if (state.areaValue) params.set('area', String(state.areaValue));
    if (state.unit) params.set('unit', state.unit);
    if (state.bedrooms) params.set('beds', String(state.bedrooms));
    if (state.bathrooms) params.set('baths', String(state.bathrooms));
    if (state.yearBuilt) params.set('year', String(state.yearBuilt));
    if (state.propertyType) params.set('type', state.propertyType);
    if (state.isFurnished) params.set('furn', '1');
    if (state.hasLawn) params.set('lawn', '1');

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  }, []);

  const handleCalculate = async (
    customState?: SimulatorFormState,
    options?: { silent?: boolean }
  ) => {
    const stateToPredict = customState || formState;
    setIsCalculating(true);
    setServerError(null);

    const payload = buildPredictPayload(stateToPredict);
    syncUrlParams(stateToPredict);

    try {
      const response = await fetchPricePrediction(payload);

      if (response && response.success) {
        const pkr = response.predicted_price_pkr;
        const areaInMarla = payload.area_marla || 10;
        const ratePerMarla = Math.round(pkr / areaInMarla);
        const prorata5Crore = (((pkr / areaInMarla) * 5) / 10000000).toFixed(3);

        const newResult: ValuationOutput = {
          totalEstimatedPKR: pkr,
          croreFormatted: formatCrore(pkr),
          lakhsFormatted: formatLakhs(pkr),
          ratePerMarlaPKR: ratePerMarla,
          prorata5MarlaCrore: prorata5Crore,
          areaInMarla,
          localityLabel: `Locality (${response.matched_location || stateToPredict.location || 'Lahore'})`,
          localityDiff: response.location_found ? 'Trained model verified' : 'Baseline estimated',
          confidenceInterval: [Math.round(pkr * 0.94), Math.round(pkr * 1.06)],
          latencyMs: 38,
          serverPredicted: true,
          priceFormatted: response.price_formatted,
        };

        setResult(newResult);
        setLastSubmittedState({ ...stateToPredict });

        if (!options?.silent) {
          playSuccessChime();
          toast.success(`Valuation Calculated: ${response.price_formatted}`);

          // In mobile, automatically scroll to the valuation result card
          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setTimeout(() => {
              const el = document.getElementById('live-valuation-panel');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }
        }
      } else {
        throw new Error('Unsuccessful response received from server.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reach prediction server.';
      setServerError(errorMessage);
      toast.error('Prediction failed. Please verify server connection.');
    } finally {
      setIsCalculating(false);
    }
  };

  // Auto-submit initial filled values automatically on page load
  const hasAutoSubmittedRef = useRef(false);
  useEffect(() => {
    if (!hasAutoSubmittedRef.current) {
      hasAutoSubmittedRef.current = true;
      let initialState = formState;

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const loc = params.get('loc');
        const area = params.get('area');
        const unit = params.get('unit') as 'marla' | 'kanal' | null;
        const beds = params.get('beds');
        const baths = params.get('baths');
        const year = params.get('year');
        const type = params.get('type');
        const furn = params.get('furn');
        const lawn = params.get('lawn');

        if (loc || area) {
          initialState = {
            ...formState,
            location: loc || formState.location || 'DHA Defence',
            areaValue: area ? parseFloat(area) || 10 : 10,
            unit: unit === 'kanal' ? 'kanal' : 'marla',
            bedrooms: beds ? parseInt(beds, 10) || 4 : 4,
            bathrooms: baths ? parseInt(baths, 10) || 4 : 4,
            yearBuilt: year ? parseInt(year, 10) || 2021 : 2021,
            propertyType: (type as any) || 'House',
            isFurnished: furn === '1' || furn === 'true',
            hasLawn: lawn === '1' || lawn === 'true',
          };
          setFormState(initialState);
        }
      }

      handleCalculate(initialState, { silent: true });
    }
  }, []);

  useEffect(() => {
    if (prefill) {
      const nextState: SimulatorFormState = {
        ...formState,
        ...(prefill.location ? { location: prefill.location } : {}),
        ...(prefill.areaValue !== undefined ? { areaValue: prefill.areaValue } : {}),
        ...(prefill.unit ? { unit: prefill.unit } : { unit: 'marla' }),
      };
      setFormState(nextState);
      syncUrlParams(nextState);
      // Auto-calculate prefill
      handleCalculate(nextState);

      toast.info(
        `Pre-filled: ${prefill.location || 'Society'} (${prefill.areaValue || 10} Marla)`
      );
    }
  }, [prefill]);

  const handleFormChange = (updates: Partial<SimulatorFormState>) => {
    const nextState = { ...formState, ...updates };
    setFormState(nextState);
    syncUrlParams(nextState);
    // CRITICAL: DO NOT clear or remove the output box (result).
    // The previous output box stays visible, and updates seamlessly via animation when user clicks submit.
    setServerError(null);
  };

  const handleApplyArchetype = (archetypeState: Partial<SimulatorFormState>, label: string) => {
    handleFormChange(archetypeState);
    toast.info(`Preset loaded: ${label}. Click Calculate to value.`);
  };

  const handleCopyShareLink = () => {
    syncUrlParams(formState);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Shareable valuation link copied to clipboard!');
    }
  };

  useEffect(() => {
    const handleStudioSelect = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.location) {
        handleFormChange({ location: detail.location });
        toast.info(`Sector switched to ${detail.location}`);
      }
    };

    window.addEventListener('studio-select-sector', handleStudioSelect);
    return () => {
      window.removeEventListener('studio-select-sector', handleStudioSelect);
    };
  }, [handleFormChange]);

  const numericCrore = result?.totalEstimatedPKR
    ? +(result.totalEstimatedPKR / 10000000).toFixed(2)
    : 4.54;

  return (
    <section
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8 pb-24 lg:pb-8 scroll-mt-16 animate-fade-in-up"
      id="prediction-workspace"
    >
      {/* Studio Header Ribbon */}
      <div className="mb-4 sm:mb-6 border-b border-charcoal/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl text-primary-text font-semibold tracking-tight">
            MakanMeter Valuation Studio
          </h1>
          <p className="text-[13px] text-supporting-text mt-0.5">
            Select housing society and property specifications to estimate market price.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenBenchmarksModal}
          className="text-[12px] text-quiet-text hover:text-supporting-text transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer underline underline-offset-4"
        >
          Model Methodology &amp; Benchmarks →
        </button>
      </div>

      {/* Dual-Pane Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Pane: Interactive Property Parameters Form */}
        <div className="lg:col-span-7 space-y-2.5">
          {/* Quick-Start Archetype Preset Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pb-0.5">
            <span className="text-[11px] font-medium text-quiet-text uppercase tracking-normal mr-0.5">
              Presets:
            </span>
            <div className="flex flex-wrap gap-1">
              {ARCHETYPES.map((arch) => (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => handleApplyArchetype(arch.state, arch.label)}
                  className="px-2.5 py-1 rounded text-[11px] border border-charcoal/70 bg-surface-container/50 hover:bg-surface-container text-supporting-text hover:text-primary-text transition-all active:scale-95 cursor-pointer"
                  title={arch.sublabel}
                >
                  {arch.label}
                </button>
              ))}
            </div>
          </div>

          <PropertyForm
            state={formState}
            onChange={handleFormChange}
            onCalculate={() => handleCalculate()}
            isCalculating={isCalculating}
            predictionResult={result}
            serverError={serverError}
            isDirty={isDirty}
          />
        </div>

        {/* Right Pane: Sticky Persistent Live Valuation Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-4">
          <LiveValuationPanel
            result={result}
            formState={formState}
            isCalculating={isCalculating}
            onOpenDetailedModal={() => setIsDialogOpen(true)}
            onCopyShareLink={handleCopyShareLink}
            onOpenBenchmarksModal={onOpenBenchmarksModal}
            onTriggerCalculate={() => handleCalculate()}
          />
        </div>
      </div>

      {/* Result Dialog Modal (Available for Full Comps & Print Inspection) */}
      <ResultDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        result={result}
        formState={formState}
      />
    </section>
  );
}
