"use client";

import React from "react";
import { Shield } from "lucide-react";

interface DisclaimerBannerProps {
  disclaimer: string;
}

export function DisclaimerBanner({ disclaimer }: DisclaimerBannerProps) {
  return (
    <footer className="border-t border-white/10 glass-panel px-6 py-6 mt-16 text-center">
      <div className="max-w-4xl mx-auto space-y-2">
        <p className="text-xs font-semibold text-slate-300 tracking-wide font-mono">
          &quot;SignalLens doesn&apos;t tell you what to invest in. It tells you what the data can actually prove.&quot;
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-sans">
          <Shield className="h-4 w-4 text-violet-400 shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-slate-300">Non-Advisory Guardrail:</strong> {disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
