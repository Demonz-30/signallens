"use client";

import React from "react";
import { NeutralClassification, ConfidenceLevel } from "@/domain";
import {
  Award,
  ShieldAlert,
  AlertTriangle,
  Info,
  HelpCircle,
  FileSearch,
} from "lucide-react";

interface ClassificationCardProps {
  classification: NeutralClassification;
  confidence: ConfidenceLevel;
  rationale: string;
  limitations: string[];
  unresolvedQuestions: string[];
  stopReason: string;
}

export function ClassificationCard({
  classification,
  confidence,
  rationale,
  limitations,
  unresolvedQuestions,
  stopReason,
}: ClassificationCardProps) {
  const getBannerDetails = () => {
    switch (classification) {
      case NeutralClassification.PERSISTENT_DIFFERENCE:
        return {
          color: "border-violet-500/60 bg-violet-950/40 text-violet-200",
          icon: Award,
          title: "Persistent Operational Difference Confirmed",
          description:
            "Outperformance verified across multi-year audited statements; one-off accounting spike refuted by operating earnings consistency.",
        };
      case NeutralClassification.NO_MATERIAL_OUTLIER:
        return {
          color: "border-emerald-500/60 bg-emerald-950/40 text-emerald-200",
          icon: Info,
          title: "No Material Outlier Detected",
          description:
            "Subject company metric is statistically consistent with peer cohort distribution bounds.",
        };
      case NeutralClassification.INCOMPARABLE_DATA:
        return {
          color: "border-amber-500/60 bg-amber-950/40 text-amber-200",
          icon: AlertTriangle,
          title: "Incomparable Fiscal Reporting Periods",
          description:
            "SignalLens halted analysis to prevent mathematically invalid cross-period comparisons.",
        };
      case NeutralClassification.DATA_QUALITY_RISK:
        return {
          color: "border-rose-500/60 bg-rose-950/40 text-rose-200",
          icon: ShieldAlert,
          title: "Data Quality / Restatement Risk",
          description:
            "Corrupt, null, or unverified financial statement line items encountered in historical filings.",
        };
      case NeutralClassification.INSUFFICIENT_EVIDENCE:
      default:
        return {
          color: "border-indigo-500/60 bg-indigo-950/40 text-indigo-200",
          icon: HelpCircle,
          title: "Insufficient Discriminating Evidence",
          description:
            "Statistical divergence detected but empirical disclosures are insufficient to isolate exact drivers without audited footnote notes.",
        };
    }
  };

  const banner = getBannerDetails();
  const IconComponent = banner.icon;

  return (
    <div className="rounded-3xl glass-panel p-6 sm:p-8 overflow-hidden shadow-2xl border border-white/10 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            Objective Epistemic Boundary
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white font-mono mt-0.5">
            Deterministic Classification & Epistemic Limitations
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400 hidden sm:inline px-3 py-1 rounded-full bg-slate-950 border border-white/10">
          Non-Advisory Factual Verdict
        </span>
      </div>

      {/* Main Verdict Card */}
      <div className={`p-6 rounded-2xl border ${banner.color} space-y-4`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-current/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-black/40 border border-current/30 shrink-0">
              <IconComponent className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold opacity-80 block">
                Deterministic Audit Conclusion
              </span>
              <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono mt-0.5">
                {classification}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-slate-200 font-semibold">
              Confidence: <strong className="text-white">{confidence}</strong>
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-slate-300">
              Stop: {stopReason}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium">
          {banner.description}
        </p>
      </div>

      {/* Rationale Section */}
      <div className="space-y-2">
        <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
          <FileSearch className="h-4 w-4 text-violet-400" />
          <span>Investigation Rationale</span>
        </h5>
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {rationale}
        </div>
      </div>

      {/* Limitations and Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Limitations */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
          <h6 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>Audit Limitations</span>
          </h6>
          <ul className="space-y-2 text-xs text-slate-300 font-sans">
            {limitations.map((lim, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-amber-500 font-bold shrink-0 font-mono">•</span>
                <span className="leading-relaxed">{lim}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Unresolved Questions */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
          <h6 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-violet-400" />
            <span>Unresolved Inquiries</span>
          </h6>
          <ul className="space-y-2 text-xs text-slate-300 font-sans">
            {unresolvedQuestions.map((q, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-violet-400 font-bold shrink-0 font-mono">•</span>
                <span className="leading-relaxed">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
