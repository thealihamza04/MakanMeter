import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'lowest' | 'container' | 'navy';
  noPadding?: boolean;
}

export function Card({
  children,
  variant = 'default',
  noPadding = false,
  className,
  ...props
}: CardProps) {
  let variantStyles = 'bg-surface border-charcoal';

  switch (variant) {
    case 'lowest':
      variantStyles = 'bg-surface-container-lowest border-charcoal';
      break;
    case 'container':
      variantStyles = 'bg-surface-container border-charcoal';
      break;
    case 'navy':
      variantStyles = 'bg-deep-navy/70 border-accent/40';
      break;
  }

  return (
    <div
      className={cn(
        'rounded border transition-colors',
        variantStyles,
        !noPadding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
