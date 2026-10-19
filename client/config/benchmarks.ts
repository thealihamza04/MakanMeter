import { BenchmarkModel, MetricCardData, FeatureImportanceItem } from '@/types/valuation';

export const BENCHMARK_METRICS: MetricCardData[] = [
  {
    title: 'Champion Regressor',
    value: 'Random Forest',
    icon: 'account_tree',
    variant: 'default',
  },
  {
    title: 'Mean Absolute Error',
    value: '6.49M PKR',
    icon: 'straighten',
    variant: 'default',
  },
  {
    title: 'Root Mean Squared Error',
    value: '10.60M PKR',
    icon: 'multiline_chart',
    variant: 'default',
  },
  {
    title: 'R² Variance Score',
    value: '0.8722',
    icon: 'check_circle',
    variant: 'success',
  },
];

export const CANDIDATE_MODELS: BenchmarkModel[] = [
  {
    name: 'Linear Regression (Ridge Regularized)',
    mae: '8.13M',
    rmse: '12.10M',
    r2: '0.8336',
    statusText: 'Baseline Standard',
    statusBadgeVariant: 'baseline',
  },
  {
    name: 'Decision Tree Regressor (CART)',
    mae: '7.01M',
    rmse: '11.53M',
    r2: '0.8489',
    statusText: 'Non-Linear Single Tree',
    statusBadgeVariant: 'secondary',
  },
  {
    name: 'Random Forest Regressor (100 Estimators)',
    mae: '6.49M',
    rmse: '10.60M',
    r2: '0.8722',
    statusText: 'Best Performing (Active Production)',
    statusBadgeVariant: 'champion',
    isChampion: true,
  },
];

export const BENCHMARK_INFO = {
  holdoutCount: 'N=4,280',
};

export const FEATURE_IMPORTANCE: FeatureImportanceItem[] = [
  {
    name: 'Area (Marla)',
    weight: 0.892657,
    percentage: 89.27,
    category: 'primary',
    description: 'Total land / covered area in Marla. Dominant pricing determinant across all sectors.',
  },
  {
    name: 'Location Target Encoded (Avg. Area Price)',
    weight: 0.054912,
    percentage: 5.49,
    category: 'spatial',
    description: 'Historical median square-foot / marla rate baseline mapped per sector.',
  },
  {
    name: 'Bedrooms Count',
    weight: 0.011139,
    percentage: 1.11,
    category: 'structural',
    description: 'Number of dedicated sleeping suites reflecting floorplan utility.',
  },
  {
    name: 'Location Frequency (Locality Popularity)',
    weight: 0.010277,
    percentage: 1.03,
    category: 'spatial',
    description: 'Transaction liquidity and market activity density within the locality.',
  },
  {
    name: 'Property Age',
    weight: 0.008898,
    percentage: 0.89,
    category: 'structural',
    description: 'Amortized construction depreciation vs. modern architecture premium.',
  },
  {
    name: 'Kitchens',
    weight: 0.003864,
    percentage: 0.39,
    category: 'structural',
    description: 'Culinary spaces indicating single-family vs. dual-unit partition potential.',
  },
  {
    name: 'Servant Quarters',
    weight: 0.003418,
    percentage: 0.34,
    category: 'amenity',
    description: 'Dedicated domestic staff quarters with external service access.',
  },
  {
    name: 'Store Rooms',
    weight: 0.002606,
    percentage: 0.26,
    category: 'structural',
    description: 'Utility, pantry, and dedicated storage volume.',
  },
  {
    name: 'Lawn / Garden',
    weight: 0.001901,
    percentage: 0.19,
    category: 'amenity',
    description: 'Frontage green-scape, garden setback, and landscaping.',
  },
  {
    name: 'Furnished (Encoded)',
    weight: 0.001639,
    percentage: 0.16,
    category: 'amenity',
    description: 'Turnkey interior woodwork, fixtures, and designer furnishing.',
  },
  {
    name: 'Gym',
    weight: 0.001588,
    percentage: 0.16,
    category: 'amenity',
    description: 'Private in-house fitness room or wellness studio.',
  },
  {
    name: 'Swimming Pool',
    weight: 0.001567,
    percentage: 0.16,
    category: 'amenity',
    description: 'Private swimming pool or leisure water feature.',
  },
  {
    name: 'Study Room',
    weight: 0.001492,
    percentage: 0.15,
    category: 'structural',
    description: 'Quiet executive home office, study, or library.',
  },
  {
    name: 'Electricity Backup',
    weight: 0.001470,
    percentage: 0.15,
    category: 'amenity',
    description: 'Integrated solar inverter, hybrid generator, or uninterrupted backup.',
  },
  {
    name: 'Lounge / Sitting Room',
    weight: 0.001336,
    percentage: 0.13,
    category: 'structural',
    description: 'Informal daily family television and sitting hall.',
  },
  {
    name: 'Drawing Room',
    weight: 0.000755,
    percentage: 0.08,
    category: 'structural',
    description: 'Formal guest reception and entertaining parlor.',
  },
  {
    name: 'Dining Room',
    weight: 0.000482,
    percentage: 0.05,
    category: 'structural',
    description: 'Formal partitioned banquet dining room.',
  },
  {
    name: 'Property Type (House)',
    weight: 0.000000,
    percentage: 0.00,
    category: 'structural',
    description: 'Baseline residential house reference classification.',
  },
];
