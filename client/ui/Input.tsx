import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  requiredIndicator?: boolean;
  topRightText?: React.ReactNode;
  unitSuffix?: string;
  hint?: string;
}

export function Input({
  label,
  requiredIndicator = false,
  topRightText,
  unitSuffix,
  hint,
  className,
  id,
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5 w-full">
      {(label || topRightText) && (
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={id} className="block text-[13px] text-supporting-text font-medium">
              {label} {requiredIndicator && <span className="text-rose-400">*</span>}
            </label>
          )}
          {topRightText && (
            <span className="tabular-nums text-[11px] text-quiet-text">{topRightText}</span>
          )}
        </div>
      )}

      <div
        className={cn(
          'relative flex rounded border border-charcoal overflow-hidden focus-within:border-accent transition-all bg-surface-container-lowest',
          className
        )}
      >
        <input
          id={id}
          className="w-full h-10 px-3 bg-transparent text-primary-text text-[14px] focus:outline-none border-0"
          {...props}
        />
        {unitSuffix && (
          <span className="inline-flex items-center px-3.5 bg-surface-container text-quiet-text tabular-nums text-[12px] font-medium select-none border-l border-charcoal">
            {unitSuffix}
          </span>
        )}
      </div>

      {hint && <p className="text-[11px] text-quiet-text">{hint}</p>}
    </div>
  );
}
