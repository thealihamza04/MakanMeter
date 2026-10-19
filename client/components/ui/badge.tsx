import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-accent text-white shadow hover:bg-accent/80',
        secondary:
          'border-transparent bg-surface-container text-supporting-text hover:bg-surface-container-high',
        destructive:
          'border-transparent bg-rose-600 text-white shadow hover:bg-rose-700',
        outline: 'text-supporting-text border-charcoal bg-surface/80',
        success: 'border-emerald-800/50 bg-emerald-950/40 text-emerald-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
