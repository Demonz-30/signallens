"use client";

import React from "react";
import { Shield } from "lucide-react";

interface DisclaimerBannerProps {
  disclaimer: string;
}

export function DisclaimerBanner({ disclaimer }: DisclaimerBannerProps) {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 px-6 py-4 mt-12 text-center">
      <div className="max-w-4xl mx-auto space-y-1.5">
        <p className="text-xs font-semibold text-slate-300 tracking-wide font-mono">
          &quot;SignalLens doesn&apos;t tell you what to invest in. It tells you what the data can actually prove.&quot;
        </p>
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-sans">
          <Shield className="h-3.5 w-3.5 text-violet-400 shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-slate-400">Non-Advisory Guardrail:</strong> {disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}

