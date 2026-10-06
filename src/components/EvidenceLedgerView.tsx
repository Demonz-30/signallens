"use client";

import React, { useState } from "react";
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
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Lock,
} from "lucide-react";

interface EvidenceLedgerViewProps {
  ledger: EvidenceLedgerEntry[];
}

type EvidenceFilter = "ALL" | "DETERMINISTIC" | "TOOL" | "LLM";

export function EvidenceLedgerView({ ledger }: EvidenceLedgerViewProps) {
  const [filter, setFilter] = useState<EvidenceFilter>("ALL");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getEvidenceCategory = (entry: EvidenceLedgerEntry): "DETERMINISTIC" | "TOOL" | "LLM" => {
    const prov = entry.sourceDataProvenance.toLowerCase();
    const obs = entry.observation.toLowerCase();
    if (prov.includes("deterministic") || prov.includes("arithmetic") || prov.includes("yoy") || prov.includes("median")) {
      return "DETERMINISTIC";
    }
    if (prov.includes("tool") || prov.includes("verify_") || prov.includes("audit_") || prov.includes("adapter") || prov.includes("filing")) {
      return "TOOL";
    }
    if (obs.includes("hypothesis") || obs.includes("cognitive") || obs.includes("qualitative") || obs.includes("llm")) {
      return "LLM";
    }
    return "DETERMINISTIC";
  };

  const filteredLedger = ledger.filter((entry) => {
    if (filter === "ALL") return true;
    const cat = getEvidenceCategory(entry);
    return cat === filter;
  });

  const getVerdictBadge = (v: EvidenceVerdict) => {
    switch (v) {
      case EvidenceVerdict.SUPPORTED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-700/80">
            <CheckCircle2 className="h-3.5 w-3.5" />
            SUPPORTED
          </span>
        );
      case EvidenceVerdict.WEAKENED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-rose-950/80 text-rose-300 border border-rose-700/80">
            <XCircle className="h-3.5 w-3.5" />
            REFUTED
          </span>
        );
      case EvidenceVerdict.INCONCLUSIVE:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-amber-950/80 text-amber-300 border border-amber-700/80">
            <HelpCircle className="h-3.5 w-3.5" />
            INCONCLUSIVE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-slate-800 text-slate-300 border border-white/10">
            UNVERIFIED
          </span>
        );
    }
  };

  const getConfidenceBadge = (c: ConfidenceLevel) => {
    switch (c) {
      case ConfidenceLevel.HIGH:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-900">
            HIGH CONFIDENCE
          </span>
        );
      case ConfidenceLevel.MEDIUM:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-950/60 text-amber-400 border border-amber-900">
            MEDIUM CONFIDENCE
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-400 border border-white/10">
            LOW CONFIDENCE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Editorial Research Header & Method Filter */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 overflow-hidden shadow-2xl border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-violet-300 mb-1">
              <Lock className="h-4 w-4 text-violet-400" />
              <span>Audit-Grade Evidence Records</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-2.5">
              <FileText className="h-6 w-6 text-violet-400" />
              Evidence Ledger
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-sans">
              Verified empirical findings with strict source provenance, falsification notes, and uncertainty bounds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 bg-slate-950 px-3.5 py-2 rounded-xl border border-white/10 font-mono inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-violet-400" />
              <span>{ledger.length} Evidence Records</span>
            </span>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 mr-1" />
            <span className="text-slate-400 text-xs uppercase tracking-wider mr-1">Verification Method:</span>
            {(["ALL", "DETERMINISTIC", "TOOL", "LLM"] as EvidenceFilter[]).map((f) => {
              const count = f === "ALL" ? ledger.length : ledger.filter((e) => getEvidenceCategory(e) === f).length;
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                    isActive
                      ? "bg-violet-950 border-violet-500 text-violet-200 font-semibold shadow-sm ring-1 ring-violet-500/30"
                      : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
                  }`}
                >
                  {f} <span className="opacity-60 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Displaying {filteredLedger.length} of {ledger.length} items
          </div>
        </div>
      </div>

      {/* Desktop Audit Table (Hidden on Mobile) */}
      <div className="hidden md:block rounded-3xl glass-panel p-6 sm:p-8 overflow-hidden shadow-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/70 text-slate-400 uppercase font-mono tracking-wider text-[11px]">
                <th className="py-3.5 px-3 w-16 text-center">Entry</th>
                <th className="py-3.5 px-4 min-w-[260px]">Target Hypothesis & Empirical Finding</th>
                <th className="py-3.5 px-4 min-w-[220px]">Source Provenance</th>
                <th className="py-3.5 px-3 w-36">Verdict</th>
                <th className="py-3.5 px-3 w-36">Confidence</th>
                <th className="py-3.5 px-4 min-w-[240px]">Epistemic Uncertainty / Bound</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLedger.map((entry) => (
                <tr
                  key={entry.evidenceId}
                  className="hover:bg-slate-900/40 transition-colors"
                >
                  <td className="py-5 px-3 font-mono font-bold text-violet-400 align-top text-center">
                    <span className="inline-block px-2 py-1 rounded-lg bg-slate-950 border border-white/10 text-xs">
                      E{String(entry.stepIndex).padStart(2, "0")}
                    </span>
                  </td>

                  <td className="py-5 px-4 align-top space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-violet-950/60 border border-violet-800/40 text-violet-300 font-bold">
                        {entry.hypothesisId}
                      </span>
                      <strong className="text-white text-xs font-mono font-semibold">
                        {entry.hypothesisTitle}
                      </strong>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed font-sans">
                      {entry.observation}
                    </p>
                  </td>

                  <td className="py-5 px-4 align-top font-mono text-xs">
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-white/10 text-slate-300 space-y-1">
                      <div className="flex items-center gap-1 text-violet-400 font-bold text-[10px] uppercase">
                        <Database className="h-3.5 w-3.5" />
                        Provenance:
                      </div>
                      <div className="text-slate-300 text-[11px] break-all leading-normal">
                        {entry.sourceDataProvenance}
                      </div>
                    </div>
                  </td>

                  <td className="py-5 px-3 align-top whitespace-nowrap">
                    {getVerdictBadge(entry.verdict)}
                  </td>

                  <td className="py-5 px-3 align-top whitespace-nowrap">
                    {getConfidenceBadge(entry.confidence)}
                  </td>

                  <td className="py-5 px-4 align-top text-slate-400 text-xs leading-normal">
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
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

      {/* Mobile Stacked Research Cards (Clean editorial stack, no squeezing) */}
      <div className="md:hidden space-y-4">
        {filteredLedger.map((entry) => {
          const isExpanded = !!expandedIds[entry.evidenceId];
          return (
            <div
              key={entry.evidenceId}
              className="rounded-2xl glass-panel p-5 shadow-xl border border-white/10 space-y-4"
            >
              {/* Top Row: Entry, Hypothesis, Verdict */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-white/10 text-xs font-mono font-bold text-violet-400">
                    E{String(entry.stepIndex).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-violet-950/60 border border-violet-800/40 text-violet-300 font-semibold">
                    {entry.hypothesisId}
                  </span>
                </div>
                <div>{getVerdictBadge(entry.verdict)}</div>
              </div>

              {/* Title & Observation */}
              <div>
                <h4 className="text-sm font-semibold text-white font-mono leading-tight">
                  {entry.hypothesisTitle}
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
                  {entry.observation}
                </p>
              </div>

              {/* Confidence Badge */}
              <div>{getConfidenceBadge(entry.confidence)}</div>

              {/* Provenance Box */}
              <div className="bg-slate-950 p-3 rounded-xl border border-white/10 text-xs">
                <div className="flex items-center gap-1.5 text-violet-400 font-bold text-[10px] uppercase font-mono">
                  <Database className="h-3.5 w-3.5" />
                  Source Provenance
                </div>
                <div className="text-slate-300 text-xs break-all mt-1 font-mono">
                  {entry.sourceDataProvenance}
                </div>
              </div>

              {/* Expandable Uncertainty / Limitations */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleExpand(entry.evidenceId)}
                  className="w-full flex items-center justify-between py-2 text-xs text-slate-400 hover:text-slate-200 font-mono transition-colors border-t border-white/10 pt-2.5"
                >
                  <span>Epistemic Uncertainty Bound</span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {isExpanded && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-slate-300 leading-relaxed font-sans animate-fadeIn">
                    {entry.remainingUncertainty}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
