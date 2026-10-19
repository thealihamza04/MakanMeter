'use client';

import React, { useState } from 'react';
import { InteractiveValuation } from '@/components/InteractiveValuation/InteractiveValuation';
import { ModelBenchmarksDialog } from '@/components/ModelBenchmarksDialog';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [isBenchmarksOpen, setIsBenchmarksOpen] = useState(false);

  return (
    <>
      <main className="w-full bg-canvas min-h-screen flex flex-col justify-between">
        <div className="w-full">
          {/* Main Valuation Studio */}
          <InteractiveValuation
            onOpenBenchmarksModal={() => setIsBenchmarksOpen(true)}
          />
        </div>

        {/* Clean Minimal Footer */}
        <Footer onOpenBenchmarks={() => setIsBenchmarksOpen(true)} />
      </main>

      {/* Model Details & Benchmarks Dialog */}
      <ModelBenchmarksDialog
        isOpen={isBenchmarksOpen}
        onClose={() => setIsBenchmarksOpen(false)}
      />
    </>
  );
}
