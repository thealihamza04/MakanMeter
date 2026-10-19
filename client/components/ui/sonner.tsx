'use client';

import { Toaster as Sonner, ToasterProps } from 'sonner';

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      richColors
      closeButton
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-surface group-[.toaster]:text-primary-text group-[.toaster]:border-charcoal group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl font-sans text-[13px] border',
          description: 'group-[.toast]:text-quiet-text text-[12px]',
          actionButton:
            'group-[.toast]:bg-accent group-[.toast]:text-white font-medium text-[12px]',
          cancelButton:
            'group-[.toast]:bg-surface-container group-[.toast]:text-supporting-text text-[12px]',
        },
      }}
      {...props}
    />
  );
};
