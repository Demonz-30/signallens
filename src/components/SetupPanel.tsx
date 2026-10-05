"use client";

import React from "react";
import { Play, Compass } from "lucide-react";
import { DEMO_SCENARIOS, DemoScenario } from "@/fixtures";

interface SetupPanelProps {
  targetSymbol: string;
  peerSymbolsText: string;
  selectedScenarioId: string;
  isLoading: boolean;
  onTargetChange: (sym: string) => void;
  onPeersChange: (peers: string) => void;
  onSelectScenario: (scenario: DemoScenario) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SetupPanel({
  targetSymbol,
  peerSymbolsText,
  selectedScenarioId,
  isLoading,
  onTargetChange,
  onPeersChange,
  onSelectScenario,
  onSubmit,
}: SetupPanelProps) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-950/60 border border-violet-800/40 text-violet-400">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                Investigation Scope & Benchmark Cohort
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Mission Prompt
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
              &quot;Why does this company look different from its peers? What does the audited evidence prove?&quot;
            </p>
          </div>
        </div>

        {/* Quick Scenario Preset Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {Object.values(DEMO_SCENARIOS).map((sc) => {
            const isSelected = selectedScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => onSelectScenario(sc)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-medium transition-all text-left cursor-pointer ${
                  isSelected
                    ? "bg-violet-950/90 border-violet-500 text-violet-300 ring-1 ring-violet-500/40"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-750 hover:text-slate-200"
                }`}
              >
                {sc.id === "killer_demo" && "Big Banks (Primary)"}
                {sc.id === "no_outlier" && "Consumer (Uniform)"}
                {sc.id === "period_mismatch" && "Period Mismatch"}
                {sc.id === "data_quality" && "Data Quality Issue"}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-3.5 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-3">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 font-mono">
            Target Company
          </label>
          <input
            type="text"
            value={targetSymbol}
            onChange={(e) => onTargetChange(e.target.value.toUpperCase())}
            placeholder="e.g. BBCA"
            disabled={isLoading}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
          />
        </div>

        <div className="md:col-span-5">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 font-mono">
            Peer Cohort (Comma Separated)
          </label>
          <input
            type="text"
            value={peerSymbolsText}
            onChange={(e) => onPeersChange(e.target.value.toUpperCase())}
            placeholder="e.g. BBRI, BMRI, BBNI, BBTN"
            disabled={isLoading}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 font-mono">
            Audited Metric
          </label>
          <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono flex items-center justify-between">
            <span className="truncate">Revenue Growth (YoY)</span>
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isLoading || !targetSymbol.trim()}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-violet-950/40 transition-all text-sm cursor-pointer border border-violet-500/40"
          >
            {isLoading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-white" />
            )}
            <span>Investigate</span>
          </button>
        </div>
      </form>
    </div>
  );
}
