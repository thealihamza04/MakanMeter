/**
 * Lahore Property Predictor - Design System Tokens
 * Defines core design tokens for colors, typography, spacing, radii, and shadows.
 * All UI components reference these tokens to prevent hardcoded style values.
 */

export const colors = {
  canvas: '#08090a',
  surface: '#0f1011',
  surfaceContainer: '#1f2021',
  surfaceContainerHigh: '#292a2b',
  surfaceContainerHighest: '#343536',
  surfaceContainerLow: '#1b1c1d',
  surfaceContainerLowest: '#0d0e0f',
  charcoal: '#2a2d33',
  primaryText: '#f7f8f8',
  supportingText: '#d0d6e0',
  quietText: '#8a8f98',
  compactHighlight: '#e5e5e6',
  accent: '#4f46e5',
  accentHover: '#6366f1',
  primaryContainer: '#4f46e5',
  deepNavy: '#0f172a',
  slate: '#5c6370',
  outline: '#2a2d33',
  outlineVariant: '#2a2d33',
  success: '#10b981',
  successLight: '#34d399',
  warning: '#f59e0b',
  danger: '#f43f5e',
  dangerLight: '#fb7185',
} as const;

export const fonts = {
  sans: 'var(--font-inter), "Inter", sans-serif',
  mono: 'var(--font-inter), "Inter", sans-serif',
} as const;

export const radii = {
  sm: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  full: '9999px',
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
  normal: '250ms cubic-bezier(0.16, 1, 0.3, 1)',
  slow: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -2px rgba(0, 0, 0, 0.6)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -4px rgba(0, 0, 0, 0.7)',
  glow: '0 0 20px -3px rgba(79, 70, 229, 0.25)',
} as const;

export type ColorToken = keyof typeof colors;
export type RadiiToken = keyof typeof radii;
