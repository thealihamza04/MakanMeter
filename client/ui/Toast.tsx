'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

export interface ToastProps {
  message: string;
  icon?: string;
  isVisible: boolean;
  onClose?: () => void;
}

export function Toast({ message, icon = 'check_circle', isVisible }: ToastProps) {
  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 transform transition-all duration-300 ease-out pointer-events-none',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      )}
    >
      <div className="bg-surface text-primary-text px-4 py-3 rounded shadow-xl flex items-center gap-3 border border-charcoal">
        <Icon name={icon} size={18} className="text-emerald-400" />
        <span className="text-[13px] font-medium">{message}</span>
      </div>
    </div>
  );
}
