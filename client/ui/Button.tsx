import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  isLoading?: boolean;
  icon?: string;
  iconRight?: string;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  isActive = false,
  isLoading = false,
  icon,
  iconRight,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-[12px] px-2.5 py-1 rounded gap-1.5',
    md: 'text-[14px] px-4 py-2 rounded gap-2',
    lg: 'text-[14px] px-5 py-2.5 rounded gap-2',
  }[size];

  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-accent hover:bg-indigo-500 text-white active:scale-95 shadow-sm';
      break;
    case 'secondary':
      variantStyles =
        'bg-surface border border-charcoal text-supporting-text hover:text-primary-text hover:border-slate/50 active:scale-95';
      break;
    case 'outline':
      variantStyles =
        'bg-transparent border border-charcoal text-supporting-text hover:bg-surface-container hover:text-primary-text active:scale-95';
      break;
    case 'ghost':
      variantStyles =
        'bg-transparent text-supporting-text hover:bg-surface-container hover:text-primary-text active:scale-95';
      break;
    case 'pill':
      variantStyles = isActive
        ? 'bg-accent text-white border border-accent active:scale-90 tabular-nums'
        : 'bg-surface-container text-supporting-text border border-charcoal hover:bg-surface-container-high hover:text-primary-text active:scale-90 tabular-nums';
      break;
  }

  // Active state override for standard buttons
  if (isActive && variant !== 'pill') {
    variantStyles = 'bg-accent text-white border border-accent active:scale-95';
  }

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles,
        variantStyles,
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <Icon name={icon} size={size === 'sm' ? 15 : 18} />
      )}
      <span>{children}</span>
      {!isLoading && iconRight && <Icon name={iconRight} size={size === 'sm' ? 15 : 18} />}
    </button>
  );
}
