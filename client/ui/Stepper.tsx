import React from 'react';
import { cn } from '@/lib/utils';

export interface StepperProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  id?: string;
  className?: string;
}

export function Stepper({
  label,
  value,
  min = 1,
  max = 10,
  onChange,
  id,
  className,
}: StepperProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={cn('space-y-1.5 w-full', className)}>
      <label htmlFor={id} className="block text-[13px] text-supporting-text font-medium">
        {label}
      </label>
      <div className="flex items-center h-10 bg-surface-container border border-charcoal rounded px-1">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center text-primary-text hover:bg-surface-container-high active:scale-90 transition-all border border-charcoal text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          -
        </button>
        <input
          id={id}
          type="number"
          readOnly
          value={value}
          className="w-full text-center bg-transparent border-0 tabular-nums text-[14px] text-primary-text font-medium focus:outline-none"
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center text-primary-text hover:bg-surface-container-high active:scale-90 transition-all border border-charcoal text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}
