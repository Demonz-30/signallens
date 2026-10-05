"use client";

import React from "react";
import {
  Company,
  OutlierResult,
  NeutralClassification,
  ConfidenceLevel,
  DataSourceMode,
} from "@/domain";
import { formatPercentage } from "@/utils/math";
import {
  ShieldCheck,
  Award,
  Info,
  AlertTriangle,
  ShieldAlert,
  HelpCircle,
  Database,
  Globe,
  Terminal,
} from "lucide-react";

interface ExecutiveSummaryHeroProps {
  targetCompany: Company;
  peerGroup: Company[];
  metricName: string;
  outlierResult: OutlierResult;
  classification: NeutralClassification;
  confidence: ConfidenceLevel;
  stopReason: string;
  sourceMode: DataSourceMode;
  hypothesesCount: number;
  evidenceCount: number;
}

export function ExecutiveSummaryHero({
  targetCompany,
  peerGroup,
  metricName,
  outlierResult,
  classification,
  confidence,
  stopReason,
  sourceMode,
  hypothesesCount,
  evidenceCount,
}: ExecutiveSummaryHeroProps) {
  const { hasOutlier, targetValue, peerMedian, deviationFromMedian } = outlierResult;

  const getClassificationMeta = () => {
    switch (classification) {
      case NeutralClassification.PERSISTENT_DIFFERENCE:
        return {
          badgeBg: "bg-violet-950/40 text-violet-300 border-violet-500/70",
          icon: Award,
          summary: "Persistent Operational Divergence Confirmed",
          subtext: "Verified across multi-year audited statements; one-off accounting spike refuted.",
        };
      case NeutralClassification.NO_MATERIAL_OUTLIER:
        return {
          badgeBg: "bg-emerald-950/40 text-emerald-300 border-emerald-600/70",
          icon: Info,
          summary: "No Material Outlier Detected",
          subtext: "Subject company performance tracks standard peer cohort dispersion bounds.",
        };
      case NeutralClassification.INCOMPARABLE_DATA:
        return {
          badgeBg: "bg-amber-950/40 text-amber-300 border-amber-600/70",
          icon: AlertTriangle,
          summary: "Incomparable Fiscal Reporting Periods",
          subtext: "Investigation stopped to prevent mathematically invalid cross-period comparisons.",
        };
      case NeutralClassification.DATA_QUALITY_RISK:
        return {
          badgeBg: "bg-rose-950/40 text-rose-300 border-rose-600/70",
          icon: ShieldAlert,
          summary: "Data Quality / Restatement Risk",
          subtext: "Incomplete or corrupt filing line items encountered in fundamental data.",
        };
      case NeutralClassification.INSUFFICIENT_EVIDENCE:
      default:
        return {
          badgeBg: "bg-indigo-950/40 text-indigo-300 border-indigo-600/70",
          icon: HelpCircle,
          summary: "Insufficient Discriminating Evidence",
          subtext: "Statistical dispersion observed, but public disclosures cannot isolate the exact driver.",
        };
    }
  };

  const meta = getClassificationMeta();
  const ClassificationIcon = meta.icon;

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
      {/* Subtle top indicator bar in restrained violet */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-slate-700" />

      {/* 5-Stage Visual Workflow Stepper */}
      <div className="mb-5 pb-4 border-b border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Deterministic Investigation Pipeline
            </span>
          </div>
          <div className="flex items-center gap-2">
            {sourceMode === DataSourceMode.SECTORS_REST ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                <Globe className="h-3 w-3" />
                Live Sectors REST v2
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                <Database className="h-3 w-3" />
                Mock Fixture Dataset
              </span>
            )}
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              Stop: {stopReason}
            </span>
          </div>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 font-mono text-[11px]">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">1. DATA</span>
            <span className="font-semibold text-slate-200">
              {1 + peerGroup.length} Companies
            </span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">2. OUTLIER</span>
            <span className={hasOutlier ? "font-semibold text-rose-400" : "font-semibold text-emerald-400"}>
              {hasOutlier ? "Outlier Confirmed" : "In Cohort Norms"}
            </span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">3. HYPOTHESES</span>
            <span className="font-semibold text-slate-200">
              {hypothesesCount} Formulated
            </span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">4. EVIDENCE</span>
            <span className="font-semibold text-slate-200">
              {evidenceCount} Verified
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-violet-950/40 border border-violet-800/60 rounded-lg p-2.5">
            <span className="text-violet-400 block text-[10px] uppercase font-bold">5. CONCLUSION</span>
            <span className="font-semibold text-violet-200 truncate block">
              {classification}
            </span>
          </div>
        </div>
      </div>

      {/* Main Focal Point: First Viewport Executive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Scope & Outlier Status (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Audited Subject & Cohort
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {metricName}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                {targetCompany.symbol}
              </h2>
              <span className="text-sm sm:text-base text-slate-300 font-medium font-sans">
                {targetCompany.name}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-400 font-mono">
              <span className="text-slate-500">Benchmark Cohort ({peerGroup.length}):</span>
              {peerGroup.map((peer) => (
                <span
                  key={peer.symbol}
                  className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                >
                  {peer.symbol}
                </span>
              ))}
            </div>
          </div>

          {/* Metric Comparison Ribbon */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
                Target Rate
              </span>
              <div className="text-lg sm:text-2xl font-bold font-mono text-violet-300 mt-0.5">
                {formatPercentage(targetValue)}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
                Cohort Median
              </span>
              <div className="text-lg sm:text-2xl font-bold font-mono text-slate-300 mt-0.5">
                {formatPercentage(peerMedian)}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
                Spread vs Median
              </span>
              <div
                className={`text-lg sm:text-2xl font-bold font-mono mt-0.5 ${
                  hasOutlier ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {deviationFromMedian !== null
                  ? `${deviationFromMedian > 0 ? "+" : ""}${formatPercentage(
                      deviationFromMedian
                    )}`
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Final Neutral Classification Card (5 cols) */}
        <div className={`lg:col-span-5 rounded-xl border p-4 sm:p-5 flex flex-col justify-between ${meta.badgeBg}`}>
          <div>
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-current/20">
              <div className="flex items-center gap-2">
                <ClassificationIcon className="h-5 w-5 shrink-0" />
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
                  Audit Verdict
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="opacity-75">Confidence:</span>
                <span className="font-bold underline decoration-2">{confidence}</span>
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug font-mono">
                {classification}
              </h3>
              <p className="text-xs mt-1.5 opacity-90 leading-relaxed font-sans">
                {meta.summary}. {meta.subtext}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-current/20 flex items-center justify-between text-[11px] font-mono">
            <span className="inline-flex items-center gap-1 opacity-80">
              <ShieldCheck className="h-3.5 w-3.5" />
              Non-Advisory Factual Audit
            </span>
            <span className="opacity-70">
              {sourceMode === DataSourceMode.SECTORS_REST
                ? "Sectors v2 Verified"
                : "Mock Verified"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
