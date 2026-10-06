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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-700/80">
            <CheckCircle2 className="h-3.5 w-3.5" />
            SUPPORTED
          </span>
        );
      case HypothesisStatus.REJECTED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-rose-950/80 text-rose-300 border border-rose-700/80">
            <XCircle className="h-3.5 w-3.5" />
            REFUTED / FALSIFIED
          </span>
        );
      case HypothesisStatus.UNRESOLVED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-amber-950/80 text-amber-300 border border-amber-700/80">
            <HelpCircle className="h-3.5 w-3.5" />
            UNRESOLVED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-slate-900 text-slate-400 border border-white/10">
            <Clock className="h-3.5 w-3.5" />
            PENDING
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
        return "text-slate-400 border-white/10 bg-slate-900";
    }
  };

  const oneOffHyp = hypotheses.find((h) => h.category === "ONE_OFF_FINANCIAL_EVENT");

  return (
    <div className="rounded-3xl glass-panel p-6 sm:p-8 overflow-hidden shadow-2xl border border-white/10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            Cognitive Exploration & Empirical Testing
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2 mt-0.5">
            <Lightbulb className="h-4 w-4 text-violet-400" />
            Competing Hypotheses & Falsification
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400 px-3 py-1 rounded-full bg-slate-950 border border-white/10">
          Hypotheses are propositions; deterministic evidence decides truth
        </span>
      </div>

      {/* Signature Falsification Challenge Card */}
      <div className="rounded-2xl border border-violet-800/40 bg-gradient-to-r from-violet-950/30 via-slate-950/80 to-slate-950 p-5 space-y-4">
        <div className="flex items-center gap-2 text-violet-300 font-mono font-bold uppercase tracking-wider text-xs">
          <Flame className="h-4 w-4 text-violet-400" />
          <span>Forensic Falsification Challenge</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-900/80 border border-white/10 rounded-xl p-4 space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Challenge Question
            </span>
            <p className="text-slate-200 leading-relaxed font-sans">
              Could the observed peer divergence be caused by an isolated non-operating accounting gain, reporting period shift, or stub quarter?
            </p>
          </div>

          <div className="bg-slate-900/80 border border-white/10 rounded-xl p-4 space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Tested Against
            </span>
            <ul className="text-slate-300 space-y-1 font-mono text-[11px]">
              <li className="flex items-center gap-1.5">
                <FileCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Operating Earnings vs Revenue</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>YoY Quarterly Momentum</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>3-Period Consecutive CAGR</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/80 border border-white/10 rounded-xl p-4 space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Falsification Result
            </span>
            <p className="leading-relaxed font-sans">
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

      {/* Hypotheses List */}
      <div className="space-y-4">
        {hypotheses.map((h, idx) => {
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
              className="bg-slate-950/70 border border-white/10 rounded-2xl p-5 hover:border-violet-500/30 transition-all space-y-3.5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-violet-950/80 border border-violet-800/60 text-violet-300 font-bold">
                    H{idx + 1}
                  </span>
                  <h4 className="text-sm sm:text-base font-semibold text-white font-mono">
                    {h.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-white/10">
                    {h.category}
                  </span>
                </div>
                {getStatusBadge(h.status)}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {h.description}
              </p>

              {/* Plausibility & Verification Tool */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Plausibility Argument:
                  </span>
                  <p className="text-slate-300 leading-relaxed font-sans">
                    {h.whyPlausible}
                  </p>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Verification Tool Requested:
                  </span>
                  <span className="text-slate-300 font-mono block">
                    {h.requiredEvidence}
                  </span>
                </div>
              </div>

              {/* Qualitative LLM Notes if present */}
              {h.falsificationNotes && (
                <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-900/30 text-xs text-violet-300 flex items-start gap-2">
                  <BrainCircuit className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
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
                <div className="pt-2 space-y-2 border-t border-white/5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block">
                    Empirical Proof Points ({matchingLedgerEntries.length})
                  </span>
                  {matchingLedgerEntries.map((ev) => (
                    <div
                      key={ev.evidenceId}
                      className={`p-3 rounded-xl border text-xs ${getVerdictStyle(ev.verdict)}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1.5 border-b border-current/20">
                        <span className="font-semibold font-mono text-[11px]">
                          VERDICT: {ev.verdict} (Confidence: {ev.confidence})
                        </span>
                        <span className="text-[10px] opacity-75 font-mono">
                          Source: {ev.sourceDataProvenance}
                        </span>
                      </div>
                      <p className="mt-2 text-slate-200 text-xs leading-relaxed font-sans">
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
