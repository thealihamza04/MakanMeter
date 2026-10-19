export interface PrimeSectorRate {
  id: string; // Exact match to LOCATIONS_LIST in @/data/locations.ts
  displayName: string;
  shortName: string;
  meanRateMarla: number; // In Millions PKR (e.g. 4.54)
  medianRateMarla: number; // In Millions PKR (e.g. 4.35)
  listingCount: number; // Count of dataset listings
  trendPct: string;
  trendDirection: 'up' | 'stable';
  architecturalStyle: string;
  architecturalDesc: string;
  image: string;
  tag: string;
}

export const PRIME_SECTOR_RATES: PrimeSectorRate[] = [
  {
    id: 'DHA Defence',
    displayName: 'DHA Defence (Phase 1-9)',
    shortName: 'DHA Defence',
    meanRateMarla: 4.54,
    medianRateMarla: 4.35,
    listingCount: 5149,
    trendPct: '+4.2% MoM',
    trendDirection: 'up',
    architecturalStyle: 'Modern Minimalist & Cantilevered',
    architecturalDesc: 'Geometric cantilevered concrete, expansive floor-to-ceiling glass, manicured lawns & warm perimeter wall grazing.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDkrhaab5qkBQSkl2bMW_B6z4jzua4J-UQ8Bfw-s3HgHFcmzQya9UiqdWUhZfrWi0AW8f4A9WWbfz0jOESGUb1J03YfZ0H0UJtMiPvLgtHYqkzqfONA5ftgK7pG83aYNCAaf0cEUjF1E5kjElWOFN1c5Rgi-TqPeLg8zC8ymXNiAO5mK1PlsLoV-9RkocfqSmLriuJCyKxYvOO5s8Z8M2D_S5oBwAOnpU5TQ06rJuz5Y8qBPtncAtPGEw',
    tag: 'Highest Volume',
  },
  {
    id: 'Gulberg',
    displayName: 'Gulberg (I - V & Main Blvd)',
    shortName: 'Gulberg',
    meanRateMarla: 5.03,
    medianRateMarla: 5.00,
    listingCount: 109,
    trendPct: '+5.4% MoM',
    trendDirection: 'up',
    architecturalStyle: 'Contemporary Urban Luxury',
    architecturalDesc: 'Multi-level brutalist & composite stone finishes, vertical timber louvers, rooftop sky gardens & central connectivity.',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80',
    tag: 'Premium Commercial/Res',
  },
  {
    id: 'Johar Town',
    displayName: 'Johar Town (Phase 1 & 2)',
    shortName: 'Johar Town',
    meanRateMarla: 5.05,
    medianRateMarla: 5.07,
    listingCount: 305,
    trendPct: '+3.1% MoM',
    trendDirection: 'up',
    architecturalStyle: 'Modern Brick & Glass Duplex',
    architecturalDesc: 'Exposed wire-cut terracotta brick accents, double-glazed panoramic windows & efficient urban family layouts.',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80',
    tag: 'Civic Hub',
  },
  {
    id: 'Cavalry Ground',
    displayName: 'Cavalry Ground (Cantt Enclave)',
    shortName: 'Cavalry Ground',
    meanRateMarla: 4.95,
    medianRateMarla: 5.00,
    listingCount: 40,
    trendPct: '+2.8% MoM',
    trendDirection: 'stable',
    architecturalStyle: 'Classic Colonial & Modern Hybrid',
    architecturalDesc: 'Sprawling low-density plots, wide avenues, classic pitched porticos blended with contemporary white stucco.',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80',
    tag: 'Exclusive Cantt',
  },
  {
    id: 'Bahria Town',
    displayName: 'Bahria Town Lahore',
    shortName: 'Bahria Town',
    meanRateMarla: 4.02,
    medianRateMarla: 3.90,
    listingCount: 1686,
    trendPct: '+3.6% MoM',
    trendDirection: 'up',
    architecturalStyle: 'Neo-Classical & Mediterranean',
    architecturalDesc: 'Grand ornamental pediments, arched French windows, roman balustrades and gated master-planned infrastructure.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
    tag: 'Master-Planned',
  },
];
