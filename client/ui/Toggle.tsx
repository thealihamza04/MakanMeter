import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

export interface ToggleProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  statusText?: string;
  icon?: string;
  className?: string;
}

export function Toggle({
  id,
  checked,
  onChange,
  label,
  statusText,
  icon,
  className,
}: ToggleProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 bg-surface-container-lowest rounded border border-charcoal',
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        {icon && <Icon name={icon} size={18} className="text-quiet-text" />}
        <div>
          <span className="text-[13px] text-primary-text font-medium block">{label}</span>
          {statusText && <span className="text-[11px] text-quiet-text block">{statusText}</span>}
        </div>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 focus:outline-none',
          checked ? 'bg-accent' : 'bg-surface-container-highest'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-4 w-4 rounded-full bg-white transition duration-200',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}
