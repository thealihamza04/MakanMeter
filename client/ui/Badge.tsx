import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'accent' | 'emerald' | 'indigo' | 'outline' | 'chip';
  icon?: string;
  iconColor?: string;
  isMono?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  icon,
  iconColor,
  isMono = true,
  className,
  ...props
}: BadgeProps) {
  let variantStyles = '';

  switch (variant) {
    case 'default':
      variantStyles =
        'bg-surface-container text-quiet-text border border-charcoal';
      break;
    case 'accent':
      variantStyles = 'bg-accent text-white border border-accent';
      break;
    case 'emerald':
      variantStyles = 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50';
      break;
    case 'indigo':
      variantStyles = 'bg-indigo-950/40 text-indigo-300 border border-indigo-800/50';
      break;
    case 'outline':
      variantStyles = 'bg-surface text-supporting-text border border-charcoal';
      break;
    case 'chip':
      variantStyles =
        'bg-surface-container text-supporting-text border border-charcoal text-[11px] px-2 py-0.5 rounded';
      break;
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors',
        isMono && 'tabular-nums',
        variantStyles,
        className
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={14} className={iconColor} />}
      <span>{children}</span>
    </div>
  );
}
