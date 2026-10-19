export interface NavLink {
  label: string;
  href: string;
  isPrimary?: boolean;
}

export const SITE_CONFIG = {
  title: 'MakanMeter',
  version: 'v1.0',
  fullVersion: 'v1.4',
  navLinks: [
    { label: 'Home', href: '#' },
    { label: 'Predict Price', href: '#prediction-workspace' },
    { label: 'Model Insights', href: '#model-benchmarks' },
  ],
  hero: {
    heading: 'Estimate Your Property’s Value in Lahore',
    subheading:
      'Get an estimated market price using property features and a machine learning model trained on curated Lahore real-estate listing data. Fast, empirical, and tuned for prime residential enclaves.',
    primaryCta: 'Predict Property Price',
    secondaryCta: 'Explore Model Insights',
    statPills: [
      { icon: 'database', text: 'Trained on Lahore Listing Data', iconColor: 'text-indigo-400' },
      { icon: 'forest', text: 'Random Forest Regressor', iconColor: 'text-emerald-400' },
      { icon: 'verified', text: 'R² Score: 0.8722', iconColor: 'text-indigo-400', isBold: true },
    ],
    showcase: {
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDkrhaab5qkBQSkl2bMW_B6z4jzua4J-UQ8Bfw-s3HgHFcmzQya9UiqdWUhZfrWi0AW8f4A9WWbfz0jOESGUb1J03YfZ0H0UJtMiPvLgtHYqkzqfONA5ftgK7pG83aYNCAaf0cEUjF1E5kjElWOFN1c5Rgi-TqPeLg8zC8ymXNiAO5mK1PlsLoV-9RkocfqSmLriuJCyKxYvOO5s8Z8M2D_S5oBwAOnpU5TQ06rJuz5Y8qBPtncAtPGEw',
      alt: 'Modern luxury residential villa in DHA Lahore with geometric cantilevered concrete slabs, warm architectural up-lighting, manicured emerald lawn, high-end Pakistani suburban modernist architecture, cinematic evening lighting, ultra-clean editorial presentation',
      badge: '94.2% local confidence',
    },
  },
  disclaimer:
    'ML-generated valuation estimate based on aggregated Lahore listing data. Actual closing transaction prices may vary with physical finishes, structural age, road width, and seller negotiation.',
  legalNote:
    'Market projections are stochastic estimates and do not constitute certified statutory valuations.',
  copyright: '© 2025 MakanMeter. Built for institutional property investment analysis.',
  techStack: ['Next.js', 'FastAPI', 'scikit-learn Random Forest'],
};
