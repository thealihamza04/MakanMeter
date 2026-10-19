/**
 * Types and interfaces for the Lahore Property Predictor application
 */

export type PropertyUnit = 'marla' | 'kanal';

export type PropertyClassification = 'House' | 'Flat' | 'Upper' | 'Lower';

export interface LocationConfig {
  id: string;
  name: string;
  badge?: string;
  baseRatePerMarla: number;
  indexLabel: string;
  indexDiff: string;
}

export interface PropertyTypeConfig {
  id: PropertyClassification;
  label: string;
  multiplier: number;
}

export interface SimulatorFormState {
  location: string;
  unit: PropertyUnit;
  areaValue: number | '';
  bedrooms: number | 0;
  bathrooms: number | 0;
  yearBuilt: number | '';
  kitchens: number;
  drawingRooms: number;
  isFurnished: boolean;
  hasLawn: boolean;
  propertyType: PropertyClassification;
}

/**
 * Expected request payload sent to POST /predict
 */
export interface PredictApiPayload {
  area: number;
  area_marla: number;
  area_unit: string;
  location: string;
  bedrooms: number;
  type: string;
  property_type: string;
  furnished: boolean;
  property_age: number;
  amenities: string[];
  kitchens: number;
  store_rooms: number;
  servant_quarters: number;
  gym: number;
  study_room: number;
  drawing_room: number;
  dining_room: number;
  lawn_garden: number;
  swimming_pool: number;
  electricity_backup: number;
  lounge_sitting_room: number;
}

/**
 * Response payload received from POST /predict
 */
export interface PredictApiResponse {
  success: boolean;
  predicted_price_millions_pkr: number;
  predicted_price_pkr: number;
  price_formatted: string;
  currency: string;
  unit: string;
  matched_location: string;
  location_found: boolean;
  feature_values: Record<string, number>;
}

export interface ValuationOutput {
  totalEstimatedPKR: number;
  croreFormatted: string;
  lakhsFormatted: string;
  ratePerMarlaPKR: number;
  prorata5MarlaCrore: string;
  areaInMarla: number;
  localityLabel: string;
  localityDiff: string;
  confidenceInterval: [number, number];
  latencyMs: number;
  serverPredicted?: boolean;
  priceFormatted?: string;
}

export interface BenchmarkModel {
  name: string;
  mae: string;
  rmse: string;
  r2: string;
  statusText: string;
  statusBadgeVariant: 'baseline' | 'secondary' | 'champion';
  isChampion?: boolean;
}

export interface MetricCardData {
  title: string;
  value: string;
  icon: string;
  variant?: 'default' | 'highlight' | 'success';
}

export interface FeatureImportanceItem {
  name: string;
  weight: number;
  percentage: number;
  category: 'primary' | 'spatial' | 'structural' | 'amenity';
  description: string;
}
