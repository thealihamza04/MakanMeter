import { SimulatorFormState } from '@/types/valuation';
import {
  LOCATIONS,
  PROPERTY_TYPES,
  VALUATION_COEFFICIENTS,
  KANAL_TO_MARLA,
} from '@/config/valuation';
import { formatCrore } from './utils';

export interface FeatureContributionItem {
  id: string;
  label: string;
  description: string;
  impactPKR: number;
  formatted: string;
  isPositive: boolean;
  isBaseline?: boolean;
}

export function computeFeatureBreakdown(
  state: SimulatorFormState,
  finalTotalPKR?: number
): {
  baseLocalityTotal: number;
  items: FeatureContributionItem[];
} {
  const matchedLocation = LOCATIONS.find((loc) => loc.id === state.location) || LOCATIONS[0];
  const matchedType = PROPERTY_TYPES.find((t) => t.id === state.propertyType) || PROPERTY_TYPES[0];

  const rawArea = typeof state.areaValue === 'number' ? state.areaValue : 10;
  const areaInMarla = state.unit === 'kanal' ? rawArea * KANAL_TO_MARLA : rawArea;
  const safeArea = isNaN(areaInMarla) || areaInMarla <= 0 ? 10 : areaInMarla;

  // 1. Locality Land Baseline
  const baseLandPKR = safeArea * matchedLocation.baseRatePerMarla;

  // 2. Room & Specifications Additions
  const bedImpact = state.bedrooms * VALUATION_COEFFICIENTS.bedroomAdditionPKR;
  const bathImpact = state.bathrooms * VALUATION_COEFFICIENTS.bathroomAdditionPKR;
  const kitchenImpact = state.kitchens * VALUATION_COEFFICIENTS.kitchenAdditionPKR;
  const drawingImpact = state.drawingRooms * VALUATION_COEFFICIENTS.drawingRoomAdditionPKR;

  // 3. Property Classification Impact
  const unadjustedTotal = baseLandPKR + bedImpact + bathImpact + kitchenImpact + drawingImpact;
  const typeImpact = unadjustedTotal * (matchedType.multiplier - 1.0);

  // 4. Furnished & Lawn Premiums
  const afterTypeTotal = unadjustedTotal + typeImpact;
  const furnishedImpact = state.isFurnished
    ? afterTypeTotal * VALUATION_COEFFICIENTS.furnishedBonusRatio
    : 0;
  const lawnImpact = state.hasLawn
    ? afterTypeTotal * VALUATION_COEFFICIENTS.lawnBonusRatio
    : 0;

  // 5. Age & Depreciation Impact
  const age = Math.max(0, VALUATION_COEFFICIENTS.referenceYear - (Number(state.yearBuilt) || 2021));
  const depreciationRate = Math.min(
    VALUATION_COEFFICIENTS.maxDepreciationCap,
    age * VALUATION_COEFFICIENTS.annualDepreciationRate
  );
  const depreciationImpact = -(afterTypeTotal + furnishedImpact + lawnImpact) * depreciationRate;

  const items: FeatureContributionItem[] = [
    {
      id: 'base-land',
      label: `Base Locality Rate (${state.location || 'Lahore'})`,
      description: `${safeArea} Marla @ ₨ ${(matchedLocation.baseRatePerMarla / 1000000).toFixed(2)}M/M`,
      impactPKR: baseLandPKR,
      formatted: `₨ ${formatCrore(baseLandPKR)} Cr`,
      isPositive: true,
      isBaseline: true,
    },
    {
      id: 'bed-bath',
      label: 'Bedrooms & Bathrooms',
      description: `${state.bedrooms || 0} Beds, ${state.bathrooms || 0} En-suite Baths`,
      impactPKR: bedImpact + bathImpact,
      formatted: `+₨ ${formatCrore(bedImpact + bathImpact)} Cr`,
      isPositive: true,
    },
    {
      id: 'kitchen-drawing',
      label: 'Living & Culinary Spaces',
      description: `${state.kitchens || 0} Kitchens, ${state.drawingRooms || 0} Drawing Rooms`,
      impactPKR: kitchenImpact + drawingImpact,
      formatted: `+₨ ${formatCrore(kitchenImpact + drawingImpact)} Cr`,
      isPositive: true,
    },
  ];

  if (typeImpact !== 0) {
    items.push({
      id: 'property-type',
      label: `Type Modifier (${state.propertyType})`,
      description: `${(matchedType.multiplier * 100).toFixed(0)}% benchmark index`,
      impactPKR: typeImpact,
      formatted: `${typeImpact >= 0 ? '+' : ''}₨ ${formatCrore(Math.abs(typeImpact))} Cr`,
      isPositive: typeImpact >= 0,
    });
  }

  if (furnishedImpact > 0) {
    items.push({
      id: 'furnished',
      label: 'Turnkey Furnished Premium',
      description: '+8% fitted interior woodwork & cabinetry',
      impactPKR: furnishedImpact,
      formatted: `+₨ ${formatCrore(furnishedImpact)} Cr`,
      isPositive: true,
    });
  }

  if (lawnImpact > 0) {
    items.push({
      id: 'lawn',
      label: 'Front Lawn & Green Scape',
      description: '+4% frontage aesthetic bonus',
      impactPKR: lawnImpact,
      formatted: `+₨ ${formatCrore(lawnImpact)} Cr`,
      isPositive: true,
    });
  }

  if (depreciationImpact < 0) {
    items.push({
      id: 'age-depreciation',
      label: `Property Age (${age} Years Old)`,
      description: `${age} yrs structural amortization (-${(depreciationRate * 100).toFixed(1)}%)`,
      impactPKR: depreciationImpact,
      formatted: `-₨ ${formatCrore(Math.abs(depreciationImpact))} Cr`,
      isPositive: false,
    });
  }

  return {
    baseLocalityTotal: baseLandPKR,
    items,
  };
}
