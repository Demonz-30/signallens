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
          color: "border-violet-600/70 bg-violet-950/30 text-violet-300",
          icon: Award,
          title: "Persistent Operational Difference Confirmed",
          description:
            "Outperformance verified across multi-year audited statements; one-off accounting spike refuted by operating earnings.",
        };
      case NeutralClassification.NO_MATERIAL_OUTLIER:
        return {
          color: "border-emerald-600/70 bg-emerald-950/30 text-emerald-300",
          icon: Info,
          title: "No Material Outlier Detected",
          description:
            "Subject company metric is statistically consistent with peer cohort distribution bounds.",
        };
      case NeutralClassification.INCOMPARABLE_DATA:
        return {
          color: "border-amber-600/70 bg-amber-950/30 text-amber-300",
          icon: AlertTriangle,
          title: "Incomparable Fiscal Reporting Periods",
          description:
            "SignalLens halted analysis to prevent mathematically invalid cross-period comparisons.",
        };
      case NeutralClassification.DATA_QUALITY_RISK:
        return {
          color: "border-rose-600/70 bg-rose-950/30 text-rose-300",
          icon: ShieldAlert,
          title: "Data Quality / Restatement Risk",
          description:
            "Corrupt, null, or unverified financial statement line items encountered in historical filings.",
        };
      case NeutralClassification.INSUFFICIENT_EVIDENCE:
      default:
        return {
          color: "border-indigo-600/70 bg-indigo-950/30 text-indigo-300",
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
      <div className="pb-3.5 border-b border-slate-800 mb-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Step 5 · Neutral Audit Conclusion
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
            Deterministic Classification & Epistemic Boundaries
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-500 hidden sm:inline">
          Non-Advisory Factual Verdict
        </span>
      </div>

      {/* Top Classification Banner */}
      <div className={`p-4 sm:p-5 rounded-xl border ${banner.color} mb-5`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-current shrink-0">
              <IconComponent className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold opacity-80 block">
                Final Neutral Classification
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5 font-mono">
                {classification}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-slate-200">
              Confidence: <strong className="text-white">{confidence}</strong>
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300">
              Stop Reason: {stopReason}
            </span>
          </div>
        </div>
        <p className="text-xs mt-3 text-slate-200 leading-relaxed font-sans font-medium">
          {banner.description}
        </p>
      </div>

      {/* Rationale Section */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
          <FileSearch className="h-3.5 w-3.5 text-violet-400" />
          <span>Investigation Rationale</span>
        </h4>
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {rationale}
        </div>
      </div>

      {/* Limitations and Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Limitations */}
        <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5 font-mono">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>Empirical Audit Limitations</span>
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
            {limitations.map((lim, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold shrink-0 font-mono">-</span>
                <span>{lim}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Unresolved Questions */}
        <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5 font-mono">
            <HelpCircle className="h-3.5 w-3.5 text-violet-400" />
            <span>Remaining Unresolved Inquiries</span>
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
            {unresolvedQuestions.map((q, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-violet-400 font-bold shrink-0 font-mono">-</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
