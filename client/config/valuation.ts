import { LocationConfig, PropertyTypeConfig, SimulatorFormState, ValuationOutput } from '@/types/valuation';
import { formatCrore, formatLakhs } from '@/lib/utils';
import { LOCATIONS_LIST } from '@/data';

export const MARLA_TO_SQFT = 225;
export const KANAL_TO_MARLA = 20;

export const VALUATION_COEFFICIENTS = {
  bedroomAdditionPKR: 1250000,
  bathroomAdditionPKR: 850000,
  kitchenAdditionPKR: 600000,
  drawingRoomAdditionPKR: 450000,
  furnishedBonusRatio: 0.08, // +8%
  lawnBonusRatio: 0.04, // +4%
  referenceYear: 2025,
  annualDepreciationRate: 0.012,
  maxDepreciationCap: 0.20,
  roundingPrecisionPKR: 50000,
  confidenceIntervalMin: 0.94,
  confidenceIntervalMax: 1.06,
  prorataUnitSize: 5,
} as const;

/**
 * Built from the hardcoded recognized locations in @/data/locations.ts
 */
export const LOCATIONS: LocationConfig[] = LOCATIONS_LIST.map((loc) => ({
  id: loc,
  name: loc,
  baseRatePerMarla: 3500000,
  indexLabel: `Locality Index (${loc})`,
  indexDiff: 'Market zone',
}));

export const PROPERTY_TYPES: PropertyTypeConfig[] = [
  { id: 'House', label: 'House', multiplier: 1.0 },
  { id: 'Flat', label: 'Flat / Apt', multiplier: 0.62 },
  { id: 'Upper', label: 'Upper Portion', multiplier: 0.72 },
  { id: 'Lower', label: 'Lower Portion', multiplier: 0.82 },
];

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6] as const;
export const BATHROOM_OPTIONS = [1, 2, 3, 4, 5, 6] as const;

export const YEAR_BUILT_RANGE = {
  min: 1980,
  max: 2025,
  default: 2021,
} as const;

export const KITCHEN_RANGE = {
  min: 1,
  max: 5,
  default: 2,
} as const;

export const DRAWING_ROOM_RANGE = {
  min: 1,
  max: 4,
  default: 1,
} as const;

export const DEFAULT_SIMULATOR_STATE: SimulatorFormState = {
  location: '',
  unit: 'marla',
  areaValue: '',
  bedrooms: 0,
  bathrooms: 0,
  yearBuilt: '',
  kitchens: 0,
  drawingRooms: 0,
  isFurnished: false,
  hasLawn: false,
  propertyType: 'House',
};

/**
 * Calculates estimated property market valuation using empirical model coefficients
 */
export function calculateValuation(state: SimulatorFormState, latencyBase = 14): ValuationOutput {
  const matchedLocation = LOCATIONS.find((loc) => loc.id === state.location) || LOCATIONS[0];
  const matchedType = PROPERTY_TYPES.find((t) => t.id === state.propertyType) || PROPERTY_TYPES[0];

  const rawArea = typeof state.areaValue === 'number' ? state.areaValue : 10;
  let areaInMarla = state.unit === 'kanal' ? rawArea * KANAL_TO_MARLA : rawArea;
  if (isNaN(areaInMarla) || areaInMarla <= 0) {
    areaInMarla = 10;
  }

  let totalVal = areaInMarla * matchedLocation.baseRatePerMarla;

  // Amenity additions
  totalVal += state.bedrooms * VALUATION_COEFFICIENTS.bedroomAdditionPKR;
  totalVal += state.bathrooms * VALUATION_COEFFICIENTS.bathroomAdditionPKR;
  totalVal += state.kitchens * VALUATION_COEFFICIENTS.kitchenAdditionPKR;
  totalVal += state.drawingRooms * VALUATION_COEFFICIENTS.drawingRoomAdditionPKR;

  // Property classification modifier
  totalVal *= matchedType.multiplier;

  // Furnished bonus
  if (state.isFurnished) {
    totalVal += totalVal * VALUATION_COEFFICIENTS.furnishedBonusRatio;
  }

  // Lawn bonus
  if (state.hasLawn) {
    totalVal += totalVal * VALUATION_COEFFICIENTS.lawnBonusRatio;
  }

  // Depreciation modifier
  const age = Math.max(0, VALUATION_COEFFICIENTS.referenceYear - (state.yearBuilt || 2021));
  const depreciation = Math.min(
    VALUATION_COEFFICIENTS.maxDepreciationCap,
    age * VALUATION_COEFFICIENTS.annualDepreciationRate
  );
  totalVal *= 1 - depreciation;

  // Round to nearest configured precision
  totalVal = Math.round(totalVal / VALUATION_COEFFICIENTS.roundingPrecisionPKR) * VALUATION_COEFFICIENTS.roundingPrecisionPKR;

  const ratePerMarla = Math.round(totalVal / areaInMarla);
  const prorata5Marla = ((totalVal / areaInMarla) * VALUATION_COEFFICIENTS.prorataUnitSize) / 10000000;

  const lowCI = Math.round(totalVal * VALUATION_COEFFICIENTS.confidenceIntervalMin);
  const highCI = Math.round(totalVal * VALUATION_COEFFICIENTS.confidenceIntervalMax);

  return {
    totalEstimatedPKR: totalVal,
    croreFormatted: formatCrore(totalVal),
    lakhsFormatted: formatLakhs(totalVal),
    ratePerMarlaPKR: ratePerMarla,
    prorata5MarlaCrore: prorata5Marla.toFixed(3),
    areaInMarla,
    localityLabel: matchedLocation.indexLabel,
    localityDiff: matchedLocation.indexDiff,
    confidenceInterval: [lowCI, highCI],
    latencyMs: latencyBase,
  };
}
