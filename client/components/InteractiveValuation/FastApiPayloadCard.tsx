'use client';

import React, { useState } from 'react';
import { PredictApiPayload } from '@/types/valuation';
import { Card } from '@/components/ui/card';
import { Terminal, Check, Copy } from 'lucide-react';

export interface FastApiPayloadCardProps {
  payload: PredictApiPayload;
  onCopySuccess?: () => void;
}

export function FastApiPayloadCard({ payload, onCopySuccess }: FastApiPayloadCardProps) {
  const [copied, setCopied] = useState(false);

  const formattedJson = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson).then(() => {
      setCopied(true);
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card id="fastapi-section" className="p-4 relative scroll-mt-20">
      <div className="flex items-center justify-between pb-2 border-b border-charcoal mb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span className="text-[12px] text-primary-text font-medium">
            FastAPI JSON Schema Payload
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-quiet-text hover:text-primary-text bg-surface-container hover:bg-surface-container-high border border-charcoal px-2 py-0.5 rounded transition-colors active:scale-95 cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
        </button>
      </div>

      <pre className="bg-surface-container-lowest p-3 rounded tabular-nums text-[11px] text-supporting-text overflow-x-auto leading-relaxed border border-charcoal">
        <code>{formattedJson}</code>
      </pre>
    </Card>
  );
}
