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
  Activity,
  CheckCircle2,
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
          badgeBg: "border-violet-500/60 bg-violet-950/40 text-violet-200",
          accentColor: "text-violet-300",
          icon: Award,
          summary: "Persistent Operational Divergence Confirmed",
          subtext: "Verified across multi-year audited statements; one-off accounting spike refuted by operating earnings.",
        };
      case NeutralClassification.NO_MATERIAL_OUTLIER:
        return {
          badgeBg: "border-emerald-500/60 bg-emerald-950/40 text-emerald-200",
          accentColor: "text-emerald-300",
          icon: Info,
          summary: "No Material Outlier Detected",
          subtext: "Subject company performance tracks standard peer cohort dispersion bounds.",
        };
      case NeutralClassification.INCOMPARABLE_DATA:
        return {
          badgeBg: "border-amber-500/60 bg-amber-950/40 text-amber-200",
          accentColor: "text-amber-300",
          icon: AlertTriangle,
          summary: "Incomparable Fiscal Reporting Periods",
          subtext: "Investigation stopped to prevent mathematically invalid cross-period comparisons.",
        };
      case NeutralClassification.DATA_QUALITY_RISK:
        return {
          badgeBg: "border-rose-500/60 bg-rose-950/40 text-rose-200",
          accentColor: "text-rose-300",
          icon: ShieldAlert,
          summary: "Data Quality / Restatement Risk",
          subtext: "Incomplete or corrupt filing line items encountered in historical fundamentals.",
        };
      case NeutralClassification.INSUFFICIENT_EVIDENCE:
      default:
        return {
          badgeBg: "border-indigo-500/60 bg-indigo-950/40 text-indigo-200",
          accentColor: "text-indigo-300",
          icon: HelpCircle,
          summary: "Insufficient Discriminating Evidence",
          subtext: "Statistical dispersion observed, but public disclosures cannot isolate the exact driver.",
        };
    }
  };

  const meta = getClassificationMeta();
  const ClassificationIcon = meta.icon;

  return (
    <section className="relative rounded-3xl glass-panel p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl border border-white/10 space-y-8">
      {/* Top Hairline Indicator */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-transparent" />

      {/* 1. Investigation Progress & Provenance Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-violet-950/80 border border-violet-800/60 flex items-center justify-center text-violet-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
              Forensic Audit Synthesis
            </span>
            <h2 className="text-sm sm:text-base font-semibold text-white font-mono">
              Investigation Output & Verdict
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {sourceMode === DataSourceMode.SECTORS_REST ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-semibold">
              <Globe className="h-3.5 w-3.5" />
              Sectors REST v2
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-white/10 font-semibold">
              <Database className="h-3.5 w-3.5 text-violet-400" />
              Mock Fixtures
            </span>
          )}
          <span className="text-[11px] text-slate-400 px-2.5 py-1 rounded-full bg-slate-950 border border-white/5 hidden md:inline">
            Reason: {stopReason}
          </span>
        </div>
      </div>

      {/* 2. 5-Stage Investigation Pipeline Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
        <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">1. Data Ingestion</span>
          <span className="text-white font-semibold text-xs block">{1 + peerGroup.length} Companies</span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-2.5 w-2.5" /> Audited
          </span>
        </div>

        <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">2. Outlier Math</span>
          <span className={hasOutlier ? "text-rose-400 font-semibold text-xs block" : "text-emerald-400 font-semibold text-xs block"}>
            {hasOutlier ? "Outlier Confirmed" : "Cohort Bounds"}
          </span>
          <span className="text-[10px] text-slate-400 block font-sans truncate">Threshold: ±5.0%</span>
        </div>

        <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">3. Hypotheses</span>
          <span className="text-white font-semibold text-xs block">{hypothesesCount} Formulated</span>
          <span className="text-[10px] text-amber-400/90 block font-sans truncate">Cognitive Loop</span>
        </div>

        <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">4. Evidence</span>
          <span className="text-white font-semibold text-xs block">{evidenceCount} Verified</span>
          <span className="text-[10px] text-cyan-400 block font-sans truncate">Allowlisted Tools</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-violet-950/50 border border-violet-800/60 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] text-violet-400 block uppercase font-bold tracking-wider">5. Verdict</span>
          <span className="text-violet-200 font-bold text-xs block truncate">{classification}</span>
          <span className="text-[10px] text-violet-300/80 block font-sans truncate">Confidence: {confidence}</span>
        </div>
      </div>

      {/* 3. Core Findings Grid (Outlier Finding & Final Classification) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left (7 cols): Target vs Peer Comparison */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 uppercase tracking-wider mb-1">
              <span>Audited Subject vs Peer Benchmark</span>
              <span>·</span>
              <span className="text-violet-300 font-semibold">{metricName}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
                {targetCompany.symbol}
              </h3>
              <span className="text-base text-slate-300 font-sans font-medium">
                {targetCompany.name}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5 font-mono text-xs text-slate-400">
              <span className="text-slate-500">Benchmark Cohort ({peerGroup.length}):</span>
              {peerGroup.map((p) => (
                <span
                  key={p.symbol}
                  className="px-2 py-0.5 rounded-lg bg-slate-950 border border-white/10 text-slate-300 font-medium"
                >
                  {p.symbol}
                </span>
              ))}
            </div>
          </div>

          {/* Metric Comparison Ribbon */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950/80 border border-white/10 rounded-2xl p-4 sm:p-5">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
                Target Rate
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-violet-300 mt-1">
                {formatPercentage(targetValue)}
              </div>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Subject Return</span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
                Cohort Median
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-300 mt-1">
                {formatPercentage(peerMedian)}
              </div>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Benchmark Basis</span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
                Spread vs Median
              </span>
              <div
                className={`text-2xl sm:text-3xl font-mono font-bold mt-1 ${
                  hasOutlier ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {deviationFromMedian !== null
                  ? `${deviationFromMedian > 0 ? "+" : ""}${formatPercentage(deviationFromMedian)}`
                  : "N/A"}
              </div>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                {hasOutlier ? "Outlier Divergence" : "Normal Dispersion"}
              </span>
            </div>
          </div>
        </div>

        {/* Right (5 cols): Neutral Classification Card */}
        <div className={`lg:col-span-5 rounded-2xl border p-6 flex flex-col justify-between ${meta.badgeBg}`}>
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-current/20">
              <div className="flex items-center gap-2">
                <ClassificationIcon className="h-5 w-5 shrink-0" />
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
                  Neutral Classification
                </span>
              </div>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-black/40 border border-current/20 font-semibold">
                Confidence: {confidence}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">
                {classification}
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed font-sans">
                {meta.summary}. {meta.subtext}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-current/20 flex items-center justify-between text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 opacity-80">
              <ShieldCheck className="h-4 w-4" />
              Deterministic Ground Truth
            </span>
            <span className="opacity-75">
              {sourceMode === DataSourceMode.SECTORS_REST ? "Sectors v2" : "Mock Data"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
