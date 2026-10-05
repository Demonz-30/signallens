"use client";

import React from "react";
import {
  Hypothesis,
  HypothesisStatus,
  EvidenceLedgerEntry,
  EvidenceVerdict,
} from "@/domain";
import {
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Flame,
  BrainCircuit,
  FileCheck,
} from "lucide-react";

interface HypothesisPanelProps {
  hypotheses: Hypothesis[];
  ledger?: EvidenceLedgerEntry[];
}

export function HypothesisPanel({ hypotheses, ledger }: HypothesisPanelProps) {
  const getStatusBadge = (status: HypothesisStatus) => {
    switch (status) {
      case HypothesisStatus.SUPPORTED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-700/80">
            <CheckCircle2 className="h-3 w-3" />
            SUPPORTED BY EVIDENCE
          </span>
        );
      case HypothesisStatus.REJECTED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono bg-rose-950/80 text-rose-300 border border-rose-700/80">
            <XCircle className="h-3 w-3" />
            REFUTED / CONTRADICTED
          </span>
        );
      case HypothesisStatus.UNRESOLVED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono bg-amber-950/80 text-amber-300 border border-amber-700/80">
            <HelpCircle className="h-3 w-3" />
            INSUFFICIENT / UNRESOLVED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono bg-slate-850 text-slate-400 border border-slate-700">
            <Clock className="h-3 w-3" />
            PENDING EVALUATION
          </span>
        );
    }
  };

  const getVerdictStyle = (v: EvidenceVerdict) => {
    switch (v) {
      case EvidenceVerdict.SUPPORTED:
        return "text-emerald-300 border-emerald-800/80 bg-emerald-950/30";
      case EvidenceVerdict.WEAKENED:
        return "text-rose-300 border-rose-800/80 bg-rose-950/30";
      case EvidenceVerdict.INCONCLUSIVE:
        return "text-amber-300 border-amber-800/80 bg-amber-950/30";
      default:
        return "text-slate-400 border-slate-800 bg-slate-900";
    }
  };

  // Find leading hypotheses for the challenge section
  const oneOffHyp = hypotheses.find((h) => h.category === "ONE_OFF_FINANCIAL_EVENT");

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-5">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-slate-800 gap-2">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Step 3 · Competing Explanations & Empirical Falsification
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            <Lightbulb className="h-4 w-4 text-violet-400" />
            Falsifiable Hypotheses & Stress-Testing
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 font-mono">
          Axiom: Hypotheses are propositions; deterministic evidence decides truth
        </span>
      </div>

      {/* Signature Phase 7: Falsification & Challenge Banner */}
      <div className="p-4 sm:p-5 rounded-xl border border-violet-850 bg-gradient-to-r from-violet-950/30 via-slate-950 to-slate-950 text-xs">
        <div className="flex items-center gap-2 text-violet-300 font-mono font-bold uppercase tracking-wider text-[11px] mb-2">
          <Flame className="h-4 w-4 text-violet-400" />
          <span>Forensic Falsification Challenge</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {/* Challenge Thesis */}
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold mb-1">
              Challenge Question
            </span>
            <p className="text-slate-200 text-xs leading-relaxed font-sans">
              Could the observed peer divergence be caused by an isolated non-operating accounting gain, reporting period shift, or stub quarter?
            </p>
          </div>

          {/* Tested Against */}
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold mb-1">
              Tested Against
            </span>
            <ul className="text-slate-300 text-xs space-y-1 font-mono">
              <li className="flex items-center gap-1.5">
                <FileCheck className="h-3 w-3 text-cyan-400" />
                <span>Operating Earnings vs Revenue</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileCheck className="h-3 w-3 text-cyan-400" />
                <span>YoY Quarterly Momentum</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileCheck className="h-3 w-3 text-cyan-400" />
                <span>3-Period Consecutive CAGR</span>
              </li>
            </ul>
          </div>

          {/* Falsification Result */}
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold mb-1">
              Falsification Result
            </span>
            <p className="text-xs leading-relaxed font-sans">
              {oneOffHyp?.status === HypothesisStatus.REJECTED ? (
                <span className="text-emerald-300 font-medium">
                  One-off paper spike hypothesis was <strong>refuted</strong> by proportional operating earnings expansion and multi-year persistence.
                </span>
              ) : oneOffHyp?.status === HypothesisStatus.SUPPORTED ? (
                <span className="text-rose-300 font-medium">
                  Evidence confirms the anomaly was an isolated non-operating or inorganic event.
                </span>
              ) : (
                <span className="text-amber-300 font-medium">
                  Disclosures do not conclusively refute or prove non-operating items; epistemic uncertainty preserved.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Hypothesis Cards Grid */}
      <div className="space-y-3.5">
        {hypotheses.map((h, idx) => {
          // Find matching evidence ledger entries
          const matchingLedgerEntries =
            ledger?.filter(
              (e) =>
                e.hypothesisId === h.id ||
                h.supportingEvidenceIds.includes(e.evidenceId) ||
                h.weakeningEvidenceIds.includes(e.evidenceId)
            ) || [];

          return (
            <div
              key={h.id}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-850">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs px-2 py-0.5 bg-slate-800 text-violet-300 rounded font-bold">
                    H{idx + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-white tracking-tight">
                    {h.title}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {h.category}
                  </span>
                </div>
                {getStatusBadge(h.status)}
              </div>

              {/* Hypothesis statement */}
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-sans">
                {h.description}
              </p>

              {/* Plausibility & Required Audit Proof */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 font-mono">
                    Plausibility Thesis:
                  </span>
                  <span className="text-slate-300 text-xs leading-normal block font-sans">
                    {h.whyPlausible}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 font-mono">
                    Requested Verification Tool:
                  </span>
                  <span className="text-slate-300 text-xs leading-normal block font-mono">
                    {h.requiredEvidence}
                  </span>
                </div>
              </div>

              {/* Qualitative LLM Notes if present */}
              {h.falsificationNotes && (
                <div className="mt-2.5 p-2 rounded-lg bg-violet-950/20 border border-violet-900/40 text-[11px] text-violet-300 flex items-start gap-1.5 font-sans">
                  <BrainCircuit className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-violet-200">
                      Cognitive Cross-Examination:
                    </strong>{" "}
                    {h.falsificationNotes}
                  </div>
                </div>
              )}

              {/* Tested Evidence Items */}
              {matchingLedgerEntries.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-900 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                    Tested Audit Proof Points ({matchingLedgerEntries.length})
                  </span>
                  {matchingLedgerEntries.map((ev) => (
                    <div
                      key={ev.evidenceId}
                      className={`p-2.5 rounded-lg border text-xs ${getVerdictStyle(ev.verdict)}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-current/20">
                        <span className="font-semibold font-mono text-[11px]">
                          VERDICT: {ev.verdict} (Confidence: {ev.confidence})
                        </span>
                        <span className="text-[10px] opacity-75 font-mono">
                          Source: {ev.sourceDataProvenance}
                        </span>
                      </div>
                      <p className="mt-1.5 text-slate-200 text-xs leading-normal font-sans">
                        {ev.observation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
