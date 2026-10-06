"use client";

import React from "react";
import { OutlierResult, Company } from "@/domain";
import { formatPercentage } from "@/utils/math";
import { AlertCircle, CheckCircle2, TrendingUp, BarChart3, Info } from "lucide-react";

interface OutlierOverviewCardProps {
  targetCompany: Company;
  peerGroup?: Company[];
  outlierResult: OutlierResult;
}

export function OutlierOverviewCard({
  targetCompany,
  outlierResult,
}: OutlierOverviewCardProps) {
  const {
    hasOutlier,
    targetValue,
    peerValues,
    peerMedian,
    deviationFromMedian,
    comparability,
    comparabilityDetails,
    peerMin,
    peerMax,
  } = outlierResult;

  return (
    <div className="rounded-3xl glass-panel p-6 sm:p-8 overflow-hidden shadow-2xl border border-white/10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            Cohort Dispersion & Rate-of-Change
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2 mt-0.5">
            <TrendingUp className="h-4 w-4 text-violet-400" />
            Empirical Outlier Analysis
          </h3>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {hasOutlier ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800 font-semibold">
              <AlertCircle className="h-3.5 w-3.5" />
              Material Outlier
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Within Normal Dispersion
            </span>
          )}

          <span className="px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-white/10">
            {comparability}
          </span>
        </div>
      </div>

      <div className="text-xs text-slate-400 italic font-mono flex items-center gap-2">
        <Info className="h-3.5 w-3.5 text-violet-400 shrink-0" />
        <span>{comparabilityDetails}</span>
      </div>

      {/* 4 Quantitative Breakdown Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Subject Metric */}
        <div className="bg-slate-950/80 border border-violet-500/40 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-violet-500" />
          <span className="text-[10px] font-mono uppercase text-violet-300 font-semibold tracking-wider">
            Subject ({targetCompany.symbol})
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1.5">
            {formatPercentage(targetValue)}
          </div>
          <span className="text-xs text-slate-400 block mt-1 font-sans truncate">
            {targetCompany.name}
          </span>
        </div>

        {/* Peer Median */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
            Cohort Median
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-200 mt-1.5">
            {formatPercentage(peerMedian)}
          </div>
          <span className="text-xs text-slate-400 block mt-1 font-sans">
            Calculated across {peerValues.filter((p) => p.value !== null).length} peers
          </span>
        </div>

        {/* Spread vs Median */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
            Spread from Median
          </span>
          <div
            className={`text-2xl sm:text-3xl font-mono font-bold mt-1.5 ${
              deviationFromMedian && Math.abs(deviationFromMedian) > 0.05
                ? "text-rose-400"
                : "text-slate-300"
            }`}
          >
            {deviationFromMedian !== null
              ? `${deviationFromMedian > 0 ? "+" : ""}${formatPercentage(deviationFromMedian)}`
              : "N/A"}
          </div>
          <span className="text-xs text-slate-500 block mt-1 font-mono">
            Threshold: ±5.0%
          </span>
        </div>

        {/* Range Min - Max */}
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
            Cohort Range [Min – Max]
          </span>
          <div className="text-xl sm:text-2xl font-mono font-bold text-slate-300 mt-1.5">
            [{formatPercentage(peerMin)} ... {formatPercentage(peerMax)}]
          </div>
          <span className="text-xs text-slate-400 block mt-1 font-sans">
            Dispersion boundaries
          </span>
        </div>
      </div>

      {/* Cohort Peer Breakdown Bar visualization */}
      <div className="pt-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-violet-400" />
          <span>Cohort Members Distribution</span>
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {/* Target */}
          <div className="p-3 rounded-xl border border-violet-500/60 bg-violet-950/40 flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-violet-200">
              {targetCompany.symbol}*
            </span>
            <span className="font-semibold text-white">
              {formatPercentage(targetValue)}
            </span>
          </div>

          {/* Peers */}
          {peerValues.map((p) => (
            <div
              key={p.symbol}
              className="p-3 rounded-xl border border-white/10 bg-slate-950/60 flex items-center justify-between font-mono text-xs"
            >
              <span className="text-slate-400 font-medium">{p.symbol}</span>
              <span className="text-slate-200 font-semibold">
                {formatPercentage(p.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
