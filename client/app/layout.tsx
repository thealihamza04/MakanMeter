import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MakanMeter | Lahore Real Estate Machine Learning Valuation',
  description:
    'Estimate residential property market value across Lahore prime sectors using a trained Random Forest regression model on curated listing data.',
};

import { Toaster } from '@/components/ui/sonner';
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("scroll-smooth", "dark", "tracking-normal", inter.variable, inter.className, "font-sans")}>
      <body className={cn("bg-canvas text-supporting-text antialiased selection:bg-accent selection:text-white min-h-screen", inter.className)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
