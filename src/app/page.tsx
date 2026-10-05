"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Header,
  SetupPanel,
  ExecutiveSummaryHero,
  OutlierOverviewCard,
  HypothesisPanel,
  EvidenceLedgerTable,
  ClassificationCard,
  AuditTimeline,
  DisclaimerBanner,
} from "@/components";
import { AnalysisResult } from "@/domain";
import { DEMO_SCENARIOS, DemoScenario } from "@/fixtures";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Home() {
  const defaultScenario = DEMO_SCENARIOS.killer_demo;

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
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 font-sans selection:bg-violet-500 selection:text-white">
      <div>
        <Header mode={mode} onModeChange={handleModeChange} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6">
          {/* Setup / Investigation Parameters */}
          <SetupPanel
            targetSymbol={targetSymbol}
            peerSymbolsText={peerSymbolsText}
            selectedScenarioId={selectedScenarioId}
            isLoading={isLoading}
            onTargetChange={setTargetSymbol}
            onPeersChange={setPeerSymbolsText}
            onSelectScenario={handleSelectScenario}
            onSubmit={handleSubmit}
          />

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl border border-rose-800 bg-rose-950/60 text-rose-300 flex items-start gap-3 text-sm animate-fadeIn">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Investigation Halted</strong>
                <span>{error}</span>
                {mode === "live" && (
                  <p className="mt-1.5 text-xs text-rose-300/80">
                    Tip: Verify SECTORS_API_KEY in .env.local or switch to <strong>Mock Mode</strong> in the header.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-10 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
              <RefreshCw className="h-7 w-7 text-violet-400 animate-spin mx-auto mb-2.5" />
              <h3 className="text-sm sm:text-base font-semibold text-white">
                Auditing Peer Cohort with Sectors Fundamentals...
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Historical rate of change · Hypothesis generation · Empirical evidence falsification
              </p>
            </div>
          )}

          {/* Active Investigation Results */}
          {result && !isLoading && (
            <div ref={resultsRef} className="space-y-6 animate-fadeIn">
              {/* First Viewport Focal Point: Executive Summary Hero */}
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

              {/* Step 2: Outlier Overview & Cohort Dispersion */}
              <OutlierOverviewCard
                targetCompany={result.targetCompany}
                peerGroup={result.peerGroup}
                outlierResult={result.outlierResult}
              />

              {/* Step 3: Hypotheses Falsification Matrix */}
              <HypothesisPanel
                hypotheses={result.hypotheses}
                ledger={result.evidenceLedger}
              />

              {/* Step 4: Immutable Evidence Ledger */}
              <EvidenceLedgerTable ledger={result.evidenceLedger} />

              {/* Step 5: Neutral Classification & Limitations */}
              <ClassificationCard
                classification={result.classification}
                confidence={result.confidence}
                rationale={result.classificationRationale}
                limitations={result.limitations}
                unresolvedQuestions={result.unresolvedQuestions}
                stopReason={result.stopReason}
              />

              {/* Step 6: Step-by-Step Agent Execution Audit Timeline */}
              <AuditTimeline trace={result.trace} />
            </div>
          )}
        </main>
      </div>

      <DisclaimerBanner
        disclaimer={
          result?.disclaimer ||
          "SignalLens provides informational retrospective data auditing only. Strictly NOT financial advice or an investment recommendation."
        }
      />
    </div>
  );
}
