"use client";

import React from "react";
import {
  EvidenceLedgerEntry,
  EvidenceVerdict,
  ConfidenceLevel,
} from "@/domain";
import {
  FileText,
  ShieldCheck,
  Database,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

interface EvidenceLedgerTableProps {
  ledger: EvidenceLedgerEntry[];
}

export function EvidenceLedgerTable({ ledger }: EvidenceLedgerTableProps) {
  const getVerdictBadge = (v: EvidenceVerdict) => {
    switch (v) {
      case EvidenceVerdict.SUPPORTED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-700/80">
            <CheckCircle2 className="h-3 w-3" />
            SUPPORTED
          </span>
        );
      case EvidenceVerdict.WEAKENED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-rose-950/80 text-rose-300 border border-rose-700/80">
            <XCircle className="h-3 w-3" />
            REFUTED
          </span>
        );
      case EvidenceVerdict.INCONCLUSIVE:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-amber-950/80 text-amber-300 border border-amber-700/80">
            <HelpCircle className="h-3 w-3" />
            INCONCLUSIVE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-slate-800 text-slate-300 border border-slate-700">
            UNVERIFIED
          </span>
        );
    }
  };

  const getConfidenceBadge = (c: ConfidenceLevel) => {
    switch (c) {
      case ConfidenceLevel.HIGH:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-900">
            HIGH
          </span>
        );
      case ConfidenceLevel.MEDIUM:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-950/60 text-amber-400 border border-amber-900">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
            LOW
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-slate-800 gap-2">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Step 4 · Immutable Evidence Ledger
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            <FileText className="h-4 w-4 text-violet-400" />
            Audit Trail & Proof Points
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-mono inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-violet-400" />
            Deterministic Verified Records ({ledger.length})
          </span>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase font-mono tracking-wider text-[11px]">
              <th className="py-3 px-3 w-14 text-center">Entry</th>
              <th className="py-3 px-4 min-w-[240px]">Target Hypothesis & Observation</th>
              <th className="py-3 px-4 min-w-[200px]">Data Provenance</th>
              <th className="py-3 px-3 w-32">Verdict</th>
              <th className="py-3 px-3 w-24">Confidence</th>
              <th className="py-3 px-4 min-w-[220px]">Epistemic Limitations / Uncertainty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {ledger.map((entry) => (
              <tr
                key={entry.evidenceId}
                className="hover:bg-slate-850/40 transition-colors"
              >
                {/* Entry ID */}
                <td className="py-4 px-3 font-mono font-bold text-violet-400 align-top text-center">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px]">
                    E{String(entry.stepIndex).padStart(2, "0")}
                  </span>
                </td>

                {/* Hypothesis & Observation */}
                <td className="py-4 px-4 align-top">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                      {entry.hypothesisId}
                    </span>
                    <strong className="text-white text-xs block font-mono">
                      {entry.hypothesisTitle}
                    </strong>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans">
                    {entry.observation}
                  </p>
                </td>

                {/* Provenance */}
                <td className="py-4 px-4 align-top font-mono text-[11px]">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300 space-y-1">
                    <div className="flex items-center gap-1 text-violet-400 font-bold text-[10px] uppercase">
                      <Database className="h-3 w-3" />
                      Audited Record:
                    </div>
                    <div className="text-slate-300 text-[10px] break-all leading-normal font-mono">
                      {entry.sourceDataProvenance}
                    </div>
                  </div>
                </td>

                {/* Verdict */}
                <td className="py-4 px-3 align-top whitespace-nowrap">
                  {getVerdictBadge(entry.verdict)}
                </td>

                {/* Confidence */}
                <td className="py-4 px-3 align-top whitespace-nowrap">
                  {getConfidenceBadge(entry.confidence)}
                </td>

                {/* Remaining Uncertainty */}
                <td className="py-4 px-4 align-top text-slate-400 text-xs leading-normal">
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold mb-0.5">
                      Uncertainty Bound:
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed font-sans">
                      {entry.remainingUncertainty}
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
