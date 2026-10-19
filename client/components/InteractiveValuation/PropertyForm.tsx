'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  LOCATIONS,
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
  KITCHEN_RANGE,
  DRAWING_ROOM_RANGE,
  MARLA_TO_SQFT,
  KANAL_TO_MARLA,
} from '@/config/valuation';
import { SimulatorFormState, ValuationOutput } from '@/types/valuation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from '@/components/reui/autocomplete';
import {
  Sparkles,
  AlertCircle,
  Armchair,
  Trees,
  Loader2,
  Plus,
  Minus,
  Check,
} from 'lucide-react';

export interface PropertyFormProps {
  state: SimulatorFormState;
  onChange: (updates: Partial<SimulatorFormState>) => void;
  onCalculate: () => void;
  isCalculating: boolean;
  predictionResult?: ValuationOutput | null;
  serverError?: string | null;
  isDirty?: boolean;
}

interface SocietyOption {
  id: string;
  value: string;
}

const SOCIETY_OPTIONS: SocietyOption[] = LOCATIONS.map((loc) => ({
  id: loc.id,
  value: loc.name,
}));

export function PropertyForm({
  state,
  onChange,
  onCalculate,
  isCalculating,
  predictionResult,
  serverError,
  isDirty = true,
}: PropertyFormProps) {
  const referenceYear = 2025;

  const [societySearch, setSocietySearch] = useState(state.location || 'DHA Defence');

  useEffect(() => {
    if (state.location && state.location !== societySearch) {
      setSocietySearch(state.location);
    }
  }, [state.location]);

  const filteredSocieties = useMemo(() => {
    if (!societySearch.trim()) return SOCIETY_OPTIONS;
    const query = societySearch.toLowerCase();
    return SOCIETY_OPTIONS.filter((item) =>
      item.value.toLowerCase().includes(query)
    );
  }, [societySearch]);

  // Derive Property Age from yearBuilt (default: 4 years ~ 2021)
  const propertyAge =
    typeof state.yearBuilt === 'number' && state.yearBuilt > 0
      ? Math.max(0, referenceYear - state.yearBuilt)
      : 4;

  const handleAgeChange = (newAge: number) => {
    const safeAge = Math.max(0, Math.min(30, newAge));
    onChange({ yearBuilt: referenceYear - safeAge });
  };

  const handleUnitChange = (newUnit: 'marla' | 'kanal') => {
    if (newUnit === state.unit) return;

    if (typeof state.areaValue === 'number' && state.areaValue > 0) {
      if (newUnit === 'kanal') {
        const converted = Math.max(0.25, +(state.areaValue / KANAL_TO_MARLA).toFixed(2));
        onChange({ unit: 'kanal', areaValue: converted });
      } else {
        const converted = Math.round(state.areaValue * KANAL_TO_MARLA);
        onChange({ unit: 'marla', areaValue: converted });
      }
    } else {
      onChange({ unit: newUnit });
    }
  };

  // Compact conversion hint
  const areaSqft =
    typeof state.areaValue === 'number' && state.areaValue > 0
      ? Math.round(
          state.unit === 'kanal'
            ? state.areaValue * KANAL_TO_MARLA * MARLA_TO_SQFT
            : state.areaValue * MARLA_TO_SQFT
        ).toLocaleString()
      : null;

  return (
    <Card className="w-full p-4 sm:p-5 space-y-4 border-charcoal bg-surface">
      {/* ROW 1: Location & Property Size (with inline Unit Toggle) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Housing Society Autocomplete (@reui/c-autocomplete-6) */}
        <div className="space-y-1">
          <Label htmlFor="location-autocomplete" className="text-[12px] text-supporting-text font-medium">
            Housing Society <span className="text-rose-400">*</span>
          </Label>
          <Autocomplete
            value={societySearch}
            onValueChange={(val) => {
              const selected = val || '';
              setSocietySearch(selected);
              if (selected) {
                onChange({ location: selected });
              }
            }}
            items={filteredSocieties}
            itemToStringValue={(item: unknown) => (item as SocietyOption).value}
          >
            <AutocompleteInput
              id="location-autocomplete"
              placeholder="Search housing society..."
              showTrigger
              size="lg"
              className="h-9 text-[13px] border-charcoal bg-surface-container-lowest text-primary-text rounded-md focus:border-accent"
            />
            <AutocompleteContent className="border-charcoal bg-surface text-primary-text max-h-64 shadow-2xl z-50">
              <AutocompleteEmpty className="text-quiet-text text-[12px] p-3 text-center">
                No matching societies found.
              </AutocompleteEmpty>
              <AutocompleteList>
                {(item) => (
                  <AutocompleteItem
                    key={item.id}
                    value={item}
                    className="text-[13px] text-supporting-text hover:text-primary-text hover:bg-surface-container cursor-pointer py-1.5 px-2.5 rounded transition-colors"
                  >
                    {item.value}
                  </AutocompleteItem>
                )}
              </AutocompleteList>
            </AutocompleteContent>
          </Autocomplete>
        </div>

        {/* Property Size with integrated Marla/Kanal inline pill switch */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="area-input" className="text-[12px] text-supporting-text font-medium">
              Property Size <span className="text-rose-400">*</span>
            </Label>
            {areaSqft && (
              <span className="text-[11px] text-quiet-text">
                {areaSqft} sq ft
              </span>
            )}
          </div>
          <div className="flex rounded-md border border-charcoal bg-surface-container-lowest focus-within:border-accent overflow-hidden h-9">
            <Input
              id="area-input"
              type="number"
              min={0.1}
              max={500}
              step={state.unit === 'kanal' ? 0.25 : 0.5}
              placeholder="10"
              value={state.areaValue}
              onChange={(e) =>
                onChange({
                  areaValue: e.target.value === '' ? '' : parseFloat(e.target.value) || 0,
                })
              }
              className="w-full h-full px-3 bg-transparent text-[13px] text-primary-text border-0 shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center p-0.5 bg-surface-container border-l border-charcoal shrink-0">
              <button
                type="button"
                onClick={() => handleUnitChange('marla')}
                className={`px-2 py-0.5 text-[11px] font-medium rounded cursor-pointer transition-colors ${
                  state.unit === 'marla'
                    ? 'bg-surface-container-highest text-primary-text font-semibold'
                    : 'text-quiet-text hover:text-supporting-text'
                }`}
              >
                Marla
              </button>
              <button
                type="button"
                onClick={() => handleUnitChange('kanal')}
                className={`px-2 py-0.5 text-[11px] font-medium rounded cursor-pointer transition-colors ${
                  state.unit === 'kanal'
                    ? 'bg-surface-container-highest text-primary-text font-semibold'
                    : 'text-quiet-text hover:text-supporting-text'
                }`}
              >
                Kanal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Bedrooms & Bathrooms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Bedrooms */}
        <div className="space-y-1">
          <Label className="text-[12px] text-supporting-text font-medium block">
            Bedrooms ({state.bedrooms})
          </Label>
          <div className="flex items-center gap-1">
            {BEDROOM_OPTIONS.map((num) => {
              const isSelected = state.bedrooms === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onChange({ bedrooms: num })}
                  className={`flex-1 h-8 rounded text-[12px] font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-accent text-white font-semibold shadow-sm'
                      : 'bg-surface-container-lowest text-supporting-text border border-charcoal hover:bg-surface-container hover:text-primary-text'
                  }`}
                >
                  {num === 6 ? '6+' : num}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bathrooms */}
        <div className="space-y-1">
          <Label className="text-[12px] text-supporting-text font-medium block">
            Bathrooms ({state.bathrooms})
          </Label>
          <div className="flex items-center gap-1">
            {BATHROOM_OPTIONS.map((num) => {
              const isSelected = state.bathrooms === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onChange({ bathrooms: num })}
                  className={`flex-1 h-8 rounded text-[12px] font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-accent text-white font-semibold shadow-sm'
                      : 'bg-surface-container-lowest text-supporting-text border border-charcoal hover:bg-surface-container hover:text-primary-text'
                  }`}
                >
                  {num === 6 ? '6+' : num}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ROW 3: Kitchens & Drawing Rooms (Compact Steppers) */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Kitchens */}
        <div className="space-y-1">
          <Label className="text-[12px] text-supporting-text font-medium block">
            Kitchens
          </Label>
          <div className="flex items-center h-8.5 bg-surface-container-lowest border border-charcoal rounded-md px-1">
            <button
              type="button"
              disabled={state.kitchens <= 0}
              onClick={() => onChange({ kitchens: Math.max(0, state.kitchens - 1) })}
              className="w-7 h-7 rounded bg-surface-container text-supporting-text hover:text-primary-text border border-charcoal/60 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-full text-center text-[13px] font-semibold text-primary-text select-none">
              {state.kitchens}
            </span>
            <button
              type="button"
              disabled={state.kitchens >= KITCHEN_RANGE.max}
              onClick={() => onChange({ kitchens: Math.min(KITCHEN_RANGE.max, state.kitchens + 1) })}
              className="w-7 h-7 rounded bg-surface-container text-supporting-text hover:text-primary-text border border-charcoal/60 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Drawing Rooms */}
        <div className="space-y-1">
          <Label className="text-[12px] text-supporting-text font-medium block">
            Drawing Rooms
          </Label>
          <div className="flex items-center h-8.5 bg-surface-container-lowest border border-charcoal rounded-md px-1">
            <button
              type="button"
              disabled={state.drawingRooms <= 0}
              onClick={() => onChange({ drawingRooms: Math.max(0, state.drawingRooms - 1) })}
              className="w-7 h-7 rounded bg-surface-container text-supporting-text hover:text-primary-text border border-charcoal/60 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-full text-center text-[13px] font-semibold text-primary-text select-none">
              {state.drawingRooms}
            </span>
            <button
              type="button"
              disabled={state.drawingRooms >= DRAWING_ROOM_RANGE.max}
              onClick={() => onChange({ drawingRooms: Math.min(DRAWING_ROOM_RANGE.max, state.drawingRooms + 1) })}
              className="w-7 h-7 rounded bg-surface-container text-supporting-text hover:text-primary-text border border-charcoal/60 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ROW 4: Property Age Slider (Compact 2-line layout) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[12px]">
          <Label htmlFor="property-age-slider" className="text-supporting-text font-medium cursor-pointer">
            Property Age: <span className="text-primary-text font-semibold">{propertyAge === 0 ? 'Brand New' : `${propertyAge} Years Old`}</span>
          </Label>
          <span className="text-[11px] text-quiet-text">
            (Built ~{referenceYear - propertyAge})
          </span>
        </div>

        <input
          id="property-age-slider"
          type="range"
          min={0}
          max={30}
          step={1}
          value={propertyAge}
          onChange={(e) => handleAgeChange(parseInt(e.target.value, 10))}
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-accent focus:outline-none"
          style={{
            background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${(propertyAge / 30) * 100}%, #2a2d33 ${(propertyAge / 30) * 100}%, #2a2d33 100%)`,
          }}
        />

        <div className="flex justify-between items-center text-[10px] text-quiet-text">
          <span>0y (Brand New)</span>
          <span>10y</span>
          <span>20y</span>
          <span>30y+</span>
        </div>
      </div>

      {/* ROW 5: Amenities Checklist (Compact side-by-side cards) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Furnished */}
        <div
          role="checkbox"
          aria-checked={state.isFurnished}
          tabIndex={0}
          onClick={() => onChange({ isFurnished: !state.isFurnished })}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              onChange({ isFurnished: !state.isFurnished });
            }
          }}
          className={`h-11 px-3 rounded-lg border transition-all cursor-pointer select-none flex items-center justify-between gap-2 ${
            state.isFurnished
              ? 'bg-accent/15 border-accent text-primary-text ring-1 ring-accent/30'
              : 'bg-surface-container-lowest border-charcoal text-supporting-text hover:bg-surface-container/40'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Armchair className={`w-3.5 h-3.5 shrink-0 ${state.isFurnished ? 'text-accent' : 'text-quiet-text'}`} />
            <span className="text-[12px] font-medium truncate">Furnished</span>
          </div>
          <div
            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all ${
              state.isFurnished
                ? 'bg-accent border-accent text-white'
                : 'border-charcoal text-transparent'
            }`}
          >
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        </div>

        {/* Front Lawn */}
        <div
          role="checkbox"
          aria-checked={state.hasLawn}
          tabIndex={0}
          onClick={() => onChange({ hasLawn: !state.hasLawn })}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              onChange({ hasLawn: !state.hasLawn });
            }
          }}
          className={`h-11 px-3 rounded-lg border transition-all cursor-pointer select-none flex items-center justify-between gap-2 ${
            state.hasLawn
              ? 'bg-emerald-500/15 border-emerald-500 text-primary-text ring-1 ring-emerald-500/30'
              : 'bg-surface-container-lowest border-charcoal text-supporting-text hover:bg-surface-container/40'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Trees className={`w-3.5 h-3.5 shrink-0 ${state.hasLawn ? 'text-emerald-400' : 'text-quiet-text'}`} />
            <span className="text-[12px] font-medium truncate">Front Lawn</span>
          </div>
          <div
            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all ${
              state.hasLawn
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-charcoal text-transparent'
            }`}
          >
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-1 space-y-2">
        <Button
          variant="default"
          size="lg"
          disabled={isCalculating || (!isDirty && !!predictionResult)}
          onClick={onCalculate}
          className={`w-full h-11 text-[14px] font-medium transition-all flex items-center justify-center gap-2 ${
            !isDirty && !!predictionResult && !isCalculating
              ? 'bg-surface-container border border-charcoal/80 text-quiet-text cursor-not-allowed opacity-80'
              : 'bg-accent hover:bg-indigo-500 text-white shadow-md active:scale-95 cursor-pointer'
          }`}
        >
          {isCalculating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              <span>Calculating Model Price...</span>
            </>
          ) : !isDirty && !!predictionResult ? (
            <>
              <Check className="w-4 h-4 mr-1.5 text-emerald-400 stroke-[2.5]" />
              <span>Valuation Up to Date</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-1.5 text-indigo-200" />
              <span>{predictionResult ? 'Update Property Value' : 'Calculate Property Value'}</span>
            </>
          )}
        </Button>

        {/* Server Error Alert */}
        {serverError && (
          <Alert variant="destructive" className="py-2 px-3 text-[12px]">
            <AlertCircle className="w-3.5 h-3.5" />
            <AlertTitle className="text-[12px] font-medium">Notice</AlertTitle>
            <AlertDescription className="text-[11px]">{serverError}</AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
}
