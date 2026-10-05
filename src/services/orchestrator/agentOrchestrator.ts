import {
  AnalysisResult,
  AuditTraceStep,
  Company,
  EvidenceItem,
  Hypothesis,
  InvestigationRequest,
} from "@/domain";
import { SectorsAdapter } from "@/adapters/sectors";
import { detectRevenueGrowthOutlier } from "@/services/analysis";
import {
  DeterministicHypothesisGenerator,
  HypothesisGenerator,
} from "@/services/hypotheses";
import {
  CognitiveInvestigationLoop,
} from "@/services/llm";
import {
  compileEvidenceLedger,
  testHypothesesWithEvidence,
} from "@/services/evidence";
import { determineClassification } from "@/services/classification";
import { logger } from "@/utils/logger";

export const STRICT_NON_ADVISORY_DISCLAIMER =
  "SignalLens provides informational retrospective data auditing only. Strictly NOT financial advice, a trading recommendation, price target, or investment signal. Never fabricate financial certainty.";

export class AgentOrchestrator {
  private adapter: SectorsAdapter;
  private hypothesisGenerator: HypothesisGenerator;
  private cognitiveLoop: CognitiveInvestigationLoop;

  constructor(
    adapter: SectorsAdapter,
    hypothesisGenerator?: HypothesisGenerator,
    cognitiveLoop?: CognitiveInvestigationLoop
  ) {
    this.adapter = adapter;
    this.hypothesisGenerator =
      hypothesisGenerator || new DeterministicHypothesisGenerator();
    this.cognitiveLoop = cognitiveLoop || new CognitiveInvestigationLoop();
  }

  /**
   * Executes the full, auditable SignalLens investigation lifecycle.
   */
  async runInvestigation(
    request: InvestigationRequest
  ): Promise<AnalysisResult> {
    const investigationId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const trace: AuditTraceStep[] = [];

    const recordStep = (
      stepId: string,
      stepName: string,
      status: "STARTED" | "COMPLETED" | "WARNING" | "FAILED",
      details: string,
      toolCall?: AuditTraceStep["toolCall"]
    ) => {
      trace.push({
        stepId,
        stepName,
        status,
        timestamp: new Date().toISOString(),
        details,
        toolCall,
      });
      logger.info(`[Step ${stepId}] ${stepName}: ${details}`);
    };

    recordStep(
      "STEP_01_VALIDATION",
      "Validate Investigation Parameters",
      "STARTED",
      `Validating target (${request.targetSymbol}) and ${request.peerSymbols?.length || 0} peers.`
    );

    // 1. Input Validation
    this.validateRequest(request);
    recordStep(
      "STEP_01_VALIDATION",
      "Validate Investigation Parameters",
      "COMPLETED",
      `Input validated. Metric locked to Annual Revenue Growth.`
    );

    // 2. Retrieve Fundamental Data via Sectors Adapter
    recordStep(
      "STEP_02_FETCH_DATA",
      "Retrieve Sectors Fundamentals",
      "STARTED",
      `Calling Sectors Adapter [Mode: ${this.adapter.getMode()}]`,
      {
        toolName: "fetch_company_report",
        params: {
          target: request.targetSymbol,
          peers: request.peerSymbols,
          sections: "overview,financials",
        },
        resultSummary: "Retrieving annual historical financials.",
      }
    );

    const targetData = await this.adapter.getCompanyFundamentals(
      request.targetSymbol
    );
    const peersData = await this.adapter.getPeerGroupFundamentals(
      request.peerSymbols
    );

    recordStep(
      "STEP_02_FETCH_DATA",
      "Retrieve Sectors Fundamentals",
      "COMPLETED",
      `Retrieved data for ${targetData.symbol} and ${peersData.length} peer companies.`
    );

    // 3. Deterministic Outlier & Comparability Detection
    recordStep(
      "STEP_03_OUTLIER_DETECTION",
      "Deterministic Outlier Detection",
      "STARTED",
      "Computing historical revenue growth and dispersion.",
      {
        toolName: "detect_outlier",
        params: { formula: "(Rev_t / Rev_t-1) - 1", method: "median_and_zscore" },
        resultSummary: "Running deterministic arithmetic.",
      }
    );

    const outlierResult = detectRevenueGrowthOutlier(targetData, peersData);

    recordStep(
      "STEP_03_OUTLIER_DETECTION",
      "Deterministic Outlier Detection",
      outlierResult.hasOutlier ? "COMPLETED" : "WARNING",
      outlierResult.hasOutlier
        ? `Outlier confirmed: ${targetData.symbol} deviates by ${(((outlierResult.deviationFromMedian ?? 0) * 100)).toFixed(1)}% from peer median.`
        : `No material outlier detected. Dispersion remains within cohort norms.`
    );

    // 4 & 5. Cognitive Loop (Call 1 -> Deterministic Tool Execution -> Call 2) or Deterministic Fallback
    let testedHypotheses: Hypothesis[];
    let evidenceItems: EvidenceItem[];
    let llmMetadata: AnalysisResult["llmMetadata"] | undefined = undefined;

    if (this.cognitiveLoop.isAvailable()) {
      recordStep(
        "STEP_04_COGNITIVE_LOOP",
        "Cognitive Investigation Loop (Call 1: Hypothesize & Plan)",
        "STARTED",
        `Dispatching factual anomaly payload to OpenAI Responses API [Model: ${this.cognitiveLoop.getModel()}].`,
        {
          toolName: "call_1_hypothesize_and_plan",
          params: { targetSymbol: targetData.symbol, model: this.cognitiveLoop.getModel() },
          resultSummary: "Formulating competing falsifiable hypotheses and requesting allowlisted verification tools.",
        }
      );

      const cognitiveResult = await this.cognitiveLoop.runLoop(
        outlierResult,
        targetData,
        peersData
      );

      if (cognitiveResult) {
        testedHypotheses = cognitiveResult.hypotheses;
        evidenceItems = cognitiveResult.evidenceItems;
        llmMetadata = {
          model: cognitiveResult.model,
          callsMade: cognitiveResult.callsMade,
          investigationStrategy: cognitiveResult.investigationStrategy,
          qualitativeRationale: cognitiveResult.qualitativeRationale,
          challengeQuestions: cognitiveResult.challengeQuestions,
        };

        recordStep(
          "STEP_04_COGNITIVE_LOOP",
          "Cognitive Investigation Loop (Call 1: Hypothesize & Plan)",
          "COMPLETED",
          cognitiveResult.call1Summary
        );

        recordStep(
          "STEP_05_EVIDENCE_EXECUTION_AND_CHALLENGE",
          "Deterministic Tool Execution & Cognitive Challenge (Call 2)",
          "COMPLETED",
          `${cognitiveResult.call2Summary} Executed allowlisted deterministic tools; produced ${evidenceItems.length} verified evidence items.`,
          {
            toolName: "call_2_challenge_and_revise",
            params: { evidenceCount: evidenceItems.length, model: cognitiveResult.model },
            resultSummary: "Challenged candidate hypotheses against verified deterministic evidence.",
          }
        );
      } else {
        recordStep(
          "STEP_04_COGNITIVE_LOOP",
          "Cognitive Investigation Loop",
          "WARNING",
          "OpenAI Responses API was unavailable or errored; executing graceful deterministic fallback."
        );

        const fallbackHypotheses =
          await this.hypothesisGenerator.generateHypotheses(outlierResult);
        const fallbackResult = testHypothesesWithEvidence(
          fallbackHypotheses,
          outlierResult,
          targetData,
          peersData
        );
        testedHypotheses = fallbackResult.testedHypotheses;
        evidenceItems = fallbackResult.evidenceItems;

        recordStep(
          "STEP_05_EVIDENCE_TESTING",
          "Deterministic Evidence Testing",
          "COMPLETED",
          `Tested ${testedHypotheses.length} hypotheses deterministically, produced ${evidenceItems.length} evidence records.`
        );
      }
    } else {
      recordStep(
        "STEP_04_HYPOTHESIS_GENERATION",
        "Targeted Hypothesis Generation",
        "STARTED",
        "Formulating falsifiable hypotheses grounded in observed anomaly (deterministic engine)."
      );

      const initialHypotheses =
        await this.hypothesisGenerator.generateHypotheses(outlierResult);

      recordStep(
        "STEP_04_HYPOTHESIS_GENERATION",
        "Targeted Hypothesis Generation",
        "COMPLETED",
        `Generated ${initialHypotheses.length} candidate hypotheses (strictly marked as PENDING).`
      );

      recordStep(
        "STEP_05_EVIDENCE_TESTING",
        "Evidence Testing & Falsification",
        "STARTED",
        "Testing each hypothesis against Sectors fundamentals and historical filings.",
        {
          toolName: "test_hypotheses",
          params: { count: initialHypotheses.length },
          resultSummary: "Auditing periods, earnings consistency, and line items.",
        }
      );

      const testRes = testHypothesesWithEvidence(
        initialHypotheses,
        outlierResult,
        targetData,
        peersData
      );
      testedHypotheses = testRes.testedHypotheses;
      evidenceItems = testRes.evidenceItems;

      recordStep(
        "STEP_05_EVIDENCE_TESTING",
        "Evidence Testing & Falsification",
        "COMPLETED",
        `Tested ${testedHypotheses.length} hypotheses, produced ${evidenceItems.length} evidence records.`
      );
    }

    // 6. Evidence Ledger Compilation
    recordStep(
      "STEP_06_LEDGER_COMPILATION",
      "Synthesize Evidence Ledger",
      "STARTED",
      "Compiling immutable evidence ledger with provenance and confidence scores."
    );

    const evidenceLedger = compileEvidenceLedger(
      evidenceItems,
      testedHypotheses
    );

    recordStep(
      "STEP_06_LEDGER_COMPILATION",
      "Synthesize Evidence Ledger",
      "COMPLETED",
      `Synthesized ${evidenceLedger.length} ledger entries.`
    );

    // 7. Neutral Classification
    recordStep(
      "STEP_07_CLASSIFICATION",
      "Determine Neutral Classification",
      "STARTED",
      "Mapping evidence state to locked neutral classification enum."
    );

    const decision = determineClassification(
      outlierResult,
      testedHypotheses,
      evidenceItems
    );

    recordStep(
      "STEP_07_CLASSIFICATION",
      "Determine Neutral Classification",
      "COMPLETED",
      `Final classification: ${decision.classification} (Confidence: ${decision.confidence}).`
    );

    // 8. Assemble Analysis Result
    const targetCompany: Company = {
      symbol: targetData.symbol,
      name: targetData.name,
      industry: targetData.industry,
      sector: targetData.sector,
      subSector: targetData.subSector,
    };

    const peerGroup: Company[] = peersData.map((p) => ({
      symbol: p.symbol,
      name: p.name,
      industry: p.industry,
      sector: p.sector,
      subSector: p.subSector,
    }));

    return {
      investigationId,
      targetCompany,
      peerGroup,
      metricName: "Annual Revenue Growth (Computed)",
      metricDefinition:
        "Historical annual revenue growth computed deterministically as (Revenue_t / Revenue_{t-1}) - 1 from Sectors audited financials.",
      outlierResult,
      hypotheses: testedHypotheses,
      evidenceItems,
      evidenceLedger,
      classification: decision.classification,
      confidence: decision.confidence,
      classificationRationale: decision.rationale,
      limitations: decision.limitations,
      unresolvedQuestions: decision.unresolvedQuestions,
      trace,
      sourceMode: this.adapter.getMode(),
      stopReason: decision.stopReason,
      disclaimer: STRICT_NON_ADVISORY_DISCLAIMER,
      llmMetadata,
    };
  }

  private validateRequest(request: InvestigationRequest): void {
    if (!request.targetSymbol || typeof request.targetSymbol !== "string") {
      throw new Error("Target company symbol is required.");
    }

    if (
      !request.peerSymbols ||
      !Array.isArray(request.peerSymbols) ||
      request.peerSymbols.length < 1
    ) {
      throw new Error("At least one peer company symbol is required.");
    }

    const cleanTarget = request.targetSymbol.trim().toUpperCase();
    const cleanPeers = request.peerSymbols.map((p) => p.trim().toUpperCase());

    if (cleanPeers.includes(cleanTarget)) {
      throw new Error("Target company symbol cannot also be listed in peer group.");
    }
  }
}
