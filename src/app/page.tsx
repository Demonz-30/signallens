"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  DesktopSidebar,
  MobileHeader,
  NavTab,
  SetupPanel,
  ExecutiveSummaryHero,
  OutlierOverviewCard,
  HypothesisPanel,
  EvidenceLedgerView,
  ClassificationCard,
  AuditTimeline,
  DisclaimerBanner,
  MethodologyView,
} from "@/components";
import { AnalysisResult } from "@/domain";
import { DEMO_SCENARIOS, DemoScenario } from "@/fixtures";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Home() {
  const defaultScenario = DEMO_SCENARIOS.killer_demo;

  // Active navigation tab: exactly 3 destinations: "investigate" | "evidence" | "methodology"
  const [activeTab, setActiveTab] = useState<NavTab>("investigate");

  // Operational mode: mock fixtures or live Sectors REST v2
  const [mode, setMode] = useState<"mock" | "live">("mock");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    defaultScenario.id
  );
  const [targetSymbol, setTargetSymbol] = useState<string>(
    defaultScenario.targetSymbol
  );
  const [peerSymbolsText, setPeerSymbolsText] = useState<string>(
    defaultScenario.peerSymbols.join(", ")
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const runInvestigation = useCallback(
    async (target: string, peersStr: string, activeMode: "mock" | "live") => {
      setIsLoading(true);
      setError(null);

      const peers = peersStr
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter((s) => s.length > 0);

      try {
        const response = await fetch("/api/investigate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetSymbol: target.trim().toUpperCase(),
            peerSymbols: peers,
            mode: activeMode,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Investigation failed to execute.");
        }

        setResult(data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while running investigation.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Auto-run primary scenario on initial load
  useEffect(() => {
    runInvestigation(
      defaultScenario.targetSymbol,
      defaultScenario.peerSymbols.join(", "),
      "mock"
    );
  }, [defaultScenario, runInvestigation]);

  const handleSelectScenario = (sc: DemoScenario) => {
    setSelectedScenarioId(sc.id);
    setTargetSymbol(sc.targetSymbol);
    const peersStr = sc.peerSymbols.join(", ");
    setPeerSymbolsText(peersStr);
    runInvestigation(sc.targetSymbol, peersStr, mode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runInvestigation(targetSymbol, peerSymbolsText, mode);
  };

  const handleModeChange = (newMode: "mock" | "live") => {
    setMode(newMode);
    runInvestigation(targetSymbol, peerSymbolsText, newMode);
  };

  return (
    <div className="min-h-screen bg-[#07090e] bg-radial-lens text-slate-100 font-sans selection:bg-violet-500 selection:text-white flex flex-col lg:flex-row">
      {/* 1. Desktop Persistent Sidebar */}
      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mode={mode}
        onModeChange={handleModeChange}
      />

      {/* Main App Container (Natural Page Scrolling, No Nested Scroll Traps) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* 2. Mobile Compact Top Header with Hamburger */}
        <MobileHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          mode={mode}
          onModeChange={handleModeChange}
        />

        {/* 3. Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
          {/* TAB 1: INVESTIGATE (Primary Application Screen: Setup + Results) */}
          {activeTab === "investigate" && (
            <div className="space-y-8">
              {/* Setup Panel with 3D Geometric Lens */}
              <SetupPanel
                targetSymbol={targetSymbol}
                peerSymbolsText={peerSymbolsText}
                selectedScenarioId={selectedScenarioId}
                isLoading={isLoading}
                mode={mode}
                onTargetChange={setTargetSymbol}
                onPeersChange={setPeerSymbolsText}
                onSelectScenario={handleSelectScenario}
                onSubmit={handleSubmit}
              />

              {/* Error Banner */}
              {error && (
                <div className="p-5 rounded-2xl border border-rose-800/80 bg-rose-950/70 text-rose-300 flex items-start gap-3.5 text-sm animate-fadeIn">
                  <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Investigation Halted</strong>
                    <span>{error}</span>
                    {mode === "live" && (
                      <p className="mt-1.5 text-xs text-rose-300/80">
                        Tip: Verify SECTORS_API_KEY in .env.local or switch to <strong>Mock Mode</strong>.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="p-12 text-center rounded-3xl glass-panel border border-white/10 space-y-3">
                  <RefreshCw className="h-8 w-8 text-violet-400 animate-spin mx-auto" />
                  <h3 className="text-base sm:text-lg font-semibold text-white font-mono">
                    Auditing Peer Cohort with Sectors Fundamentals...
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Historical rate of change · Hypothesis generation · Empirical evidence falsification
                  </p>
                </div>
              )}

              {/* Real Existing Investigation Results */}
              {result && !isLoading && (
                <div ref={resultsRef} className="space-y-8 animate-fadeIn">
                  {/* Executive Summary Hero (Outlier summary, target, median, spread, classification) */}
                  <ExecutiveSummaryHero
                    targetCompany={result.targetCompany}
                    peerGroup={result.peerGroup}
                    metricName={result.metricName}
                    outlierResult={result.outlierResult}
                    classification={result.classification}
                    confidence={result.confidence}
                    stopReason={result.stopReason}
                    sourceMode={result.sourceMode}
                    hypothesesCount={result.hypotheses.length}
                    evidenceCount={result.evidenceLedger.length}
                  />

                  {/* Outlier Overview & Cohort Dispersion */}
                  <OutlierOverviewCard
                    targetCompany={result.targetCompany}
                    peerGroup={result.peerGroup}
                    outlierResult={result.outlierResult}
                  />

                  {/* Hypotheses Testing & Falsification Matrix */}
                  <HypothesisPanel
                    hypotheses={result.hypotheses}
                    ledger={result.evidenceLedger}
                  />

                  {/* Evidence Ledger Summary on Investigate screen */}
                  <EvidenceLedgerView ledger={result.evidenceLedger} />

                  {/* Final Deterministic Classification & Epistemic Boundaries */}
                  <ClassificationCard
                    classification={result.classification}
                    confidence={result.confidence}
                    rationale={result.classificationRationale}
                    limitations={result.limitations}
                    unresolvedQuestions={result.unresolvedQuestions}
                    stopReason={result.stopReason}
                  />

                  {/* Step-by-Step Agent Execution Audit Timeline */}
                  <AuditTimeline trace={result.trace} />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EVIDENCE LEDGER (Full Research Ledger Page) */}
          {activeTab === "evidence" && (
            <div className="space-y-8">
              {result ? (
                <EvidenceLedgerView ledger={result.evidenceLedger} />
              ) : (
                <div className="rounded-3xl glass-panel p-10 text-center text-slate-400 font-mono text-xs border border-white/10">
                  No active investigation data yet. Run an investigation from the Investigate tab.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: METHODOLOGY (7-Stage Pipeline & Epistemic Boundaries) */}
          {activeTab === "methodology" && <MethodologyView />}
        </main>

        {/* Global Footer Disclaimer */}
        <DisclaimerBanner
          disclaimer={
            result?.disclaimer ||
            "SignalLens provides informational retrospective data auditing only. Strictly NOT financial advice or an investment recommendation."
          }
        />
      </div>
    </div>
  );
}
