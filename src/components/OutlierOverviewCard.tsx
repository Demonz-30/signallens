"use client";

import React from "react";
import { OutlierResult, Company } from "@/domain";
import { formatPercentage } from "@/utils/math";
import { AlertCircle, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react";

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
  } = outlierResult;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-slate-800 gap-3">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Step 2 · Deterministic Rate-of-Change & Dispersion
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            <TrendingUp className="h-4 w-4 text-violet-400" />
            Historical Annual Revenue Growth Audit
          </h3>
        </div>

        {/* Outlier Badge */}
        <div className="flex items-center gap-2">
          {hasOutlier ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-rose-950/80 text-rose-300 border border-rose-800">
              <AlertCircle className="h-3.5 w-3.5" />
              Material Outlier Confirmed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Within Cohort Bounds (No Outlier)
            </span>
          )}

          <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700">
            {comparability}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-2 italic font-mono">
        {comparabilityDetails}
      </p>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {/* Subject Metric */}
        <div className="bg-slate-950/80 border border-violet-800/40 rounded-xl p-3.5 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-violet-500" />
          <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider font-mono">
            Subject ({targetCompany.symbol})
          </span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {formatPercentage(targetValue)}
          </div>
          <span className="text-xs text-slate-400 truncate block mt-0.5 font-sans">
            {targetCompany.name}
          </span>
        </div>

        {/* Peer Median */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Peer Cohort Median
          </span>
          <div className="text-2xl font-bold font-mono text-slate-200 mt-1">
            {formatPercentage(peerMedian)}
          </div>
          <span className="text-xs text-slate-400 block mt-0.5 font-sans">
            Based on {peerValues.filter((p) => p.value !== null).length} peers
          </span>
        </div>

        {/* Deviation */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Spread from Median
          </span>
          <div
            className={`text-2xl font-bold font-mono mt-1 ${
              deviationFromMedian && Math.abs(deviationFromMedian) > 0.05
                ? "text-rose-400"
                : "text-slate-300"
            }`}
          >
            {deviationFromMedian !== null
              ? `${deviationFromMedian > 0 ? "+" : ""}${formatPercentage(deviationFromMedian)}`
              : "N/A"}
          </div>
          <span className="text-xs text-slate-400 block mt-0.5 font-mono">
            Threshold: ±5.0%
          </span>
        </div>

        {/* Peerset Range */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Cohort Range [Min – Max]
          </span>
          <div className="text-lg font-bold font-mono text-slate-300 mt-1">
            [{formatPercentage(outlierResult.peerMin)} ... {formatPercentage(outlierResult.peerMax)}]
          </div>
          <span className="text-xs text-slate-400 block mt-0.5 font-sans">
            Dispersion boundaries
          </span>
        </div>
      </div>

      {/* Peer Breakdown Bar visualization */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5 font-mono flex items-center gap-1.5">
          <BarChart3 className="h-3.5 w-3.5 text-violet-400" />
          <span>Cohort Peer Breakdown</span>
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {/* Target */}
          <div className="p-2.5 rounded-lg border border-violet-700 bg-violet-950/30 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-violet-300">
              {targetCompany.symbol}*
            </span>
            <span className="font-mono text-xs font-semibold text-white">
              {formatPercentage(targetValue)}
            </span>
          </div>

          {/* Peers */}
          {peerValues.map((p) => (
            <div
              key={p.symbol}
              className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/40 flex items-center justify-between"
            >
              <span className="font-mono text-xs text-slate-400">{p.symbol}</span>
              <span className="font-mono text-xs font-medium text-slate-200">
                {formatPercentage(p.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
