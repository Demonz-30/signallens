import {
  CompanyFundamentalData,
  EvidenceItem,
  EvidenceVerdict,
  Hypothesis,
  HypothesisStatus,
  OutlierResult,
} from "@/domain";
import { formatPercentage } from "@/utils/math";
import { logger } from "@/utils/logger";
import {
  OpenAIResponsesClient,
} from "./openaiResponsesClient";
import {
  AllowlistedToolName,
  CHALLENGE_AND_REVISE_SCHEMA,
  ChallengeAndReviseOutput,
  HYPOTHESIZE_AND_PLAN_SCHEMA,
  HypothesizeAndPlanOutput,
  isAllowlistedTool,
} from "./schemas";
import { executeAllowlistedTool } from "./toolRunner";

export interface CognitiveInvestigationResult {
  hypotheses: Hypothesis[];
  evidenceItems: EvidenceItem[];
  model: string;
  callsMade: number;
  investigationStrategy: string;
  challengeQuestions: string[];
  qualitativeRationale: string;
  remainingUncertainties: string[];
  investigationLimitations: string[];
  call1Summary: string;
  call2Summary: string;
}

export class CognitiveInvestigationLoop {
  private client: OpenAIResponsesClient;

  constructor(client?: OpenAIResponsesClient) {
    this.client = client || new OpenAIResponsesClient();
  }

  public isAvailable(): boolean {
    return this.client.isAvailable();
  }

  public getModel(): string {
    return this.client.getModel();
  }

  /**
   * Runs the bounded 2-call cognitive loop:
   * Call 1: Hypothesize + Plan
   * Deterministic execution: Run allowlisted evidence tools
   * Call 2: Challenge + Revise
   *
   * Returns null if LLM is unavailable or fails, triggering instant deterministic fallback.
   */
  async runLoop(
    outlierResult: OutlierResult,
    targetData: CompanyFundamentalData,
    peersData: CompanyFundamentalData[]
  ): Promise<CognitiveInvestigationResult | null> {
    if (!this.client.isAvailable()) {
      logger.info(
        "[Cognitive Loop] OpenAI API key not present; using deterministic hypothesis engine."
      );
      return null;
    }

    // ==========================================
    // CALL 1: HYPOTHESIZE + PLAN
    // ==========================================
    const factsPayload = {
      targetSymbol: targetData.symbol,
      peerSymbols: peersData.map((p) => p.symbol),
      metricName: "Annual Revenue Growth (Computed)",
      targetValue: outlierResult.targetValue,
      formattedTargetGrowth: formatPercentage(outlierResult.targetValue),
      peerMedian: outlierResult.peerMedian,
      formattedPeerMedian: formatPercentage(outlierResult.peerMedian),
      peerMin: outlierResult.peerMin,
      peerMax: outlierResult.peerMax,
      deviationFromMedian: outlierResult.deviationFromMedian,
      formattedDeviation: formatPercentage(outlierResult.deviationFromMedian),
      hasOutlier: outlierResult.hasOutlier,
      comparability: outlierResult.comparability,
      comparabilityDetails: outlierResult.comparabilityDetails,
      historicalYearsTarget: targetData.historicalFinancials.map((h) => h.year),
    };

    const call1Instructions =
      "You are the SignalLens Senior Forensic Financial Investigation Agent. " +
      "Analyze the supplied factual financial anomaly data. " +
      "Formulate 2 to 3 competing, falsifiable hypotheses to explain or test the observed data. " +
      "For each hypothesis, request exactly one verification tool from the strict allowlist: " +
      "['verify_period_alignment', 'audit_financial_line_items', 'audit_operating_earnings', 'audit_quarterly_momentum', 'audit_multi_period_cagr', 'check_segment_disclosures']. " +
      "Identify critical challenge questions that would falsify the hypotheses. " +
      "Maintain strictly neutral, non-advisory language. Never provide investment or price advice.";

    const call1Response =
      await this.client.generateStructuredResponse<HypothesizeAndPlanOutput>({
        schemaName: "HypothesizeAndPlanResponse",
        jsonSchema: HYPOTHESIZE_AND_PLAN_SCHEMA,
        instructions: call1Instructions,
        inputContent: JSON.stringify(factsPayload, null, 2),
      });

    if (
      !call1Response.success ||
      !call1Response.data ||
      !Array.isArray(call1Response.data.hypotheses) ||
      call1Response.data.hypotheses.length === 0
    ) {
      logger.warn(
        `[Cognitive Loop] Call 1 failed or invalid; falling back to deterministic engine. Error: ${call1Response.error || "empty hypotheses"}`
      );
      return null;
    }

    const call1Data = call1Response.data;
    const call1Summary = `Formulated ${call1Data.hypotheses.length} competing hypotheses and requested ${call1Data.hypotheses.length} allowlisted evidence tools.`;

    // ==========================================
    // DETERMINISTIC EVIDENCE EXECUTION (ALLOWLIST ONLY)
    // ==========================================
    const evidenceItems: EvidenceItem[] = [];
    const initialHypotheses: Hypothesis[] = [];
    let evCounter = 1;

    for (const rawHyp of call1Data.hypotheses) {
      const validTool: AllowlistedToolName = isAllowlistedTool(
        rawHyp.targetToolExecution
      )
        ? rawHyp.targetToolExecution
        : "audit_operating_earnings";

      const evId = `EV_${String(evCounter++).padStart(3, "0")}`;

      const evidenceItem = executeAllowlistedTool({
        toolName: validTool,
        targetHypothesisId: rawHyp.id,
        targetData,
        peersData,
        outlierResult,
        evidenceId: evId,
      });

      evidenceItems.push(evidenceItem);

      // Deterministic hypothesis status binding from verified evidence verdict
      let deterministicStatus: HypothesisStatus;
      const supportingIds: string[] = [];
      const weakeningIds: string[] = [];

      if (evidenceItem.verdict === EvidenceVerdict.SUPPORTED) {
        deterministicStatus = HypothesisStatus.SUPPORTED;
        supportingIds.push(evidenceItem.id);
      } else if (evidenceItem.verdict === EvidenceVerdict.WEAKENED) {
        deterministicStatus = HypothesisStatus.REJECTED;
        weakeningIds.push(evidenceItem.id);
      } else {
        deterministicStatus = HypothesisStatus.UNRESOLVED;
      }

      initialHypotheses.push({
        id: rawHyp.id,
        category: rawHyp.category,
        title: rawHyp.title,
        description: rawHyp.description,
        whyPlausible: rawHyp.whyPlausible,
        requiredEvidence: `Tool execution [${validTool}]: ${evidenceItem.title}`,
        status: deterministicStatus,
        supportingEvidenceIds: supportingIds,
        weakeningEvidenceIds: weakeningIds,
      });
    }

    // ==========================================
    // CALL 2: CHALLENGE + REVISE
    // ==========================================
    const call2InputPayload = {
      anomalyContext: {
        targetSymbol: targetData.symbol,
        deviation: formatPercentage(outlierResult.deviationFromMedian),
        hasOutlier: outlierResult.hasOutlier,
      },
      testedHypotheses: initialHypotheses.map((h) => ({
        id: h.id,
        title: h.title,
        category: h.category,
        whyPlausible: h.whyPlausible,
        deterministicStatus: h.status,
      })),
      verifiedEvidence: evidenceItems.map((e) => ({
        id: e.id,
        targetHypothesisId: e.targetHypothesisId,
        tool: e.endpointOrTool,
        verdict: e.verdict,
        observation: e.observation,
        rationale: e.rationale,
      })),
      challengeQuestions: call1Data.challengeQuestions,
    };

    const call2Instructions =
      "You are the SignalLens Senior Forensic Financial Cross-Examiner. " +
      "Review the verified evidence items produced by the deterministic audit tools. " +
      "Cross-examine each hypothesis against the verified evidence. " +
      "Assess whether each hypothesis was supported, refuted, or remains inconclusive. " +
      "Synthesize a qualitative investigation rationale and state any remaining epistemic uncertainties. " +
      "Do NOT alter numerical facts or invent unverified evidence. Strictly neutral tone.";

    const call2Response =
      await this.client.generateStructuredResponse<ChallengeAndReviseOutput>({
        schemaName: "ChallengeAndReviseResponse",
        jsonSchema: CHALLENGE_AND_REVISE_SCHEMA,
        instructions: call2Instructions,
        inputContent: JSON.stringify(call2InputPayload, null, 2),
      });

    let qualitativeRationale =
      "Investigation completed using deterministic fundamentals analysis.";
    let remainingUncertainties: string[] = [
      "Granular segment notes require audited exchange footnotes.",
    ];
    let investigationLimitations: string[] = [
      "Analysis is strictly retrospective and based on quantitative filings.",
    ];
    let call2Summary =
      "Challenged hypotheses against verified evidence items.";

    if (call2Response.success && call2Response.data) {
      const c2 = call2Response.data;
      qualitativeRationale = c2.qualitativeInvestigationRationale;
      remainingUncertainties = c2.remainingUncertainties;
      investigationLimitations = c2.investigationLimitations;
      call2Summary = `Cross-examined ${c2.hypothesisAssessments.length} hypotheses against verified evidence records.`;

      // Attach qualitative assessment notes to hypotheses without overriding deterministic status
      for (const assessment of c2.hypothesisAssessments) {
        const matchingHyp = initialHypotheses.find(
          (h) => h.id === assessment.hypothesisId
        );
        if (matchingHyp) {
          matchingHyp.qualitativeAssessment = assessment.evidentiaryAssessment;
          matchingHyp.falsificationNotes = assessment.falsificationNotes;
        }
      }
    } else {
      logger.warn(
        `[Cognitive Loop] Call 2 failed or invalid (${call2Response.error}); proceeding with deterministic evidence synthesis.`
      );
      call2Summary =
        "Call 2 cross-examination was bypassed due to response error; evidence preserved.";
    }

    return {
      hypotheses: initialHypotheses,
      evidenceItems,
      model: this.client.getModel(),
      callsMade: call2Response.success ? 2 : 1,
      investigationStrategy: call1Data.investigationStrategy,
      challengeQuestions: call1Data.challengeQuestions,
      qualitativeRationale,
      remainingUncertainties,
      investigationLimitations,
      call1Summary,
      call2Summary,
    };
  }
}
