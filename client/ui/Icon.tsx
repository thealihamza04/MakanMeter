import React from 'react';
import { cn } from '@/lib/utils';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number | string;
  className?: string;
}

export function Icon({ name, size, className, style, ...props }: IconProps) {
  const customStyle: React.CSSProperties = {
    ...style,
    ...(size ? { fontSize: typeof size === 'number' ? `${size}px` : size } : {}),
  };

  return (
    <span
      className={cn('material-symbols-outlined select-none inline-flex items-center justify-center leading-none', className)}
      style={customStyle}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
}
