import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  requiredIndicator?: boolean;
  options: SelectOption[];
  hint?: string;
}

export function Select({
  label,
  requiredIndicator = false,
  options,
  hint,
  className,
  id,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-[13px] text-supporting-text font-medium">
          {label} {requiredIndicator && <span className="text-rose-400">*</span>}
        </label>
      )}
      <div className="relative group">
        <select
          id={id}
          className={cn(
            'w-full h-10 pl-3 pr-10 rounded border border-charcoal bg-surface-container-lowest text-primary-text text-[14px] appearance-none transition-all focus:outline-none focus:border-accent hover:border-slate cursor-pointer',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface text-primary-text">
              {opt.label} {opt.badge ? `(${opt.badge})` : ''}
            </option>
          ))}
        </select>
        <Icon
          name="expand_more"
          size={20}
          className="absolute right-3 top-2.5 pointer-events-none text-quiet-text transition-transform group-hover:translate-y-0.5"
        />
      </div>
      {hint && <p className="text-[11px] text-quiet-text">{hint}</p>}
    </div>
  );
}
