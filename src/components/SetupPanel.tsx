"use client";

import React from "react";
import {
  Compass,
  ArrowRight,
  Database,
  Globe,
  Sparkles,
} from "lucide-react";
import { DEMO_SCENARIOS, DemoScenario } from "@/fixtures";
import { GeometricLens } from "./GeometricLens";

interface SetupPanelProps {
  targetSymbol: string;
  peerSymbolsText: string;
  selectedScenarioId: string;
  isLoading: boolean;
  mode: "mock" | "live";
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
  mode,
  onTargetChange,
  onPeersChange,
  onSelectScenario,
  onSubmit,
}: SetupPanelProps) {
  return (
    <div className="relative rounded-3xl glass-panel p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl border border-white/10">
      {/* Background Accent Refraction Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Banner / Framing */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-violet-300">
          <Compass className="h-4 w-4 text-violet-400" />
          <span className="font-semibold">Autonomous Peer Investigation Console</span>
        </div>

        {/* Quick Benchmark Preset Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="h-3 w-3 text-violet-400" />
            <span>Preset Cohorts:</span>
          </span>
          {Object.values(DEMO_SCENARIOS).map((sc) => {
            const isSelected = selectedScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => onSelectScenario(sc)}
                className={`text-xs px-3 py-1.5 rounded-xl border font-mono transition-all text-left cursor-pointer ${
                  isSelected
                    ? "bg-violet-950/90 border-violet-500 text-violet-200 shadow-sm shadow-violet-950/60 ring-1 ring-violet-500/30"
                    : "bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                }`}
              >
                {sc.id === "killer_demo" && "Big Banks (Primary)"}
                {sc.id === "no_outlier" && "Consumer Staples"}
                {sc.id === "period_mismatch" && "Period Mismatch"}
                {sc.id === "data_quality" && "Data Quality"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editorial Hero Layout with 3D Lens Identity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
        {/* Left Side: Editorial Prompt & Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-800/40 text-violet-300 font-mono text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span>Retrospective Factual Audit</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-tight font-sans">
              Why does this company look different from its peers?
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-sans">
              Audit reported financial divergence with deterministic rate-of-change formulas, allowlisted verification tests, and falsification of one-off accounting spikes.
            </p>
          </div>

          {/* Investigation Parameters Setup Grid */}
          <form onSubmit={onSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              {/* 1. Target Company */}
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium mb-1.5">
                  Target Company
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={targetSymbol}
                    onChange={(e) => onTargetChange(e.target.value.toUpperCase())}
                    placeholder="e.g. BBCA"
                    disabled={isLoading}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors uppercase tracking-wider font-semibold"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-500 pointer-events-none">
                    IDX
                  </span>
                </div>
              </div>

              {/* 2. Peer Cohort */}
              <div className="sm:col-span-8">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium mb-1.5">
                  Peer Cohort (Benchmark Group)
                </label>
                <input
                  type="text"
                  value={peerSymbolsText}
                  onChange={(e) => onPeersChange(e.target.value.toUpperCase())}
                  placeholder="e.g. BBRI, BMRI, BBNI, BBTN"
                  disabled={isLoading}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors font-semibold"
                />
              </div>
            </div>

            {/* Locked Financial Context Metadata Row */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {/* Metric */}
              <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-medium">
                  Audited Metric
                </span>
                <span className="text-xs font-mono font-semibold text-slate-200 mt-1 block truncate">
                  Revenue Growth (YoY)
                </span>
              </div>

              {/* Period */}
              <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-medium">
                  Filing Period
                </span>
                <span className="text-xs font-mono font-semibold text-slate-200 mt-1 block truncate">
                  Annual Audited (FY)
                </span>
              </div>

              {/* Data Source */}
              <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-medium">
                  Data Source
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  {mode === "live" ? (
                    <>
                      <Globe className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="text-xs font-mono font-semibold text-emerald-300 truncate">
                        Sectors REST v2
                      </span>
                    </>
                  ) : (
                    <>
                      <Database className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                      <span className="text-xs font-mono font-semibold text-violet-300 truncate">
                        Mock Dataset
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Start Investigation Trigger */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !targetSymbol.trim()}
                className="w-full sm:w-auto min-w-[240px] bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-mono font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2.5 shadow-xl shadow-violet-950/50 transition-all text-sm cursor-pointer border border-violet-400/30"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Auditing Fundamental Evidence...</span>
                  </>
                ) : (
                  <>
                    <span>Start Investigation</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Prominent 3D Geometric Lens Identity (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4">
          <div className="relative">
            <GeometricLens size="hero" />
          </div>
          <div className="mt-4 font-mono text-[11px] text-slate-400 max-w-xs space-y-1">
            <span className="text-violet-300 font-semibold block uppercase tracking-wider">
              SignalLens Optic Core
            </span>
            <p className="text-slate-400 text-[10px] leading-normal font-sans">
              Refracting peer metrics through deterministic evidence to isolate operational truth from noise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
