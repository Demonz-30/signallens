import {
  ConfidenceLevel,
  EvidenceItem,
  EvidenceVerdict,
  Hypothesis,
  HypothesisStatus,
  NeutralClassification,
  OutlierResult,
  ComparabilityStatus,
} from "@/domain";
import { formatPercentage } from "@/utils/math";

export interface ClassificationDecision {
  classification: NeutralClassification;
  confidence: ConfidenceLevel;
  rationale: string;
  limitations: string[];
  unresolvedQuestions: string[];
  stopReason: string;
}

/**
 * Deterministic Classification Engine.
 * Evaluates the investigation state and maps evidence strictly to one of the 5 allowed
 * neutral classifications. The LLM is completely prohibited from altering this enum.
 */
export function determineClassification(
  outlierResult: OutlierResult,
  hypotheses: Hypothesis[],
  evidenceItems: EvidenceItem[]
): ClassificationDecision {
  const sym = outlierResult.targetSymbol;

  // Path 1: DATA_QUALITY_RISK
  if (
    outlierResult.comparability === ComparabilityStatus.MISSING_DATA ||
    outlierResult.targetValue === null ||
    evidenceItems.some(
      (e) => e.targetHypothesisId === "HYP_DATA_QUALITY" && e.verdict === EvidenceVerdict.SUPPORTED
    )
  ) {
    return {
      classification: NeutralClassification.DATA_QUALITY_RISK,
      confidence: ConfidenceLevel.HIGH,
      rationale: `Investigation halted due to unverified, missing, or null financial line items for ${sym}. Computing rate of change would require non-deterministic imputation.`,
      limitations: [
        "Historical financial records contain missing or non-numerical revenue entries.",
        "Cannot verify accounting standards consistency across reporting intervals.",
      ],
      unresolvedQuestions: [
        "Did the issuer file restated financial statements for the affected periods?",
        "Are missing values available in physical PDF disclosures rather than REST summary?",
      ],
      stopReason: "data_quality_compromised",
    };
  }

  // Path 2: INCOMPARABLE_DATA
  if (
    outlierResult.comparability === ComparabilityStatus.MISMATCHED_PERIODS ||
    outlierResult.comparability === ComparabilityStatus.INSUFFICIENT_HISTORY ||
    evidenceItems.some(
      (e) => e.targetHypothesisId === "HYP_PERIOD_MISMATCH" && e.verdict === EvidenceVerdict.SUPPORTED
    )
  ) {
    return {
      classification: NeutralClassification.INCOMPARABLE_DATA,
      confidence: ConfidenceLevel.HIGH,
      rationale: `Fiscal reporting periods between ${sym} and the peer cohort do not align. Directly comparing different annual periods produces invalid conclusions.`,
      limitations: [
        "Peer companies report on differing fiscal timelines or lack synchronized 12-month statements.",
        "SignalLens strictly forbids forced comparison across asymmetric reporting years.",
      ],
      unresolvedQuestions: [
        "Has the subject company transitioned to a new fiscal year calendar?",
        "Will synchronized annual reports be published in the next reporting cycle?",
      ],
      stopReason: "period_comparability_failed",
    };
  }

  // Path 3: NO_MATERIAL_OUTLIER
  if (!outlierResult.hasOutlier) {
    const devStr = formatPercentage(outlierResult.deviationFromMedian);
    const peerMedStr = formatPercentage(outlierResult.peerMedian);
    return {
      classification: NeutralClassification.NO_MATERIAL_OUTLIER,
      confidence: ConfidenceLevel.HIGH,
      rationale: `${sym}'s revenue growth (${formatPercentage(outlierResult.targetValue)}) is statistically and contextually consistent with peer cohort median (${peerMedStr}, spread: ${devStr}). No material anomaly detected.`,
      limitations: [
        "Peer cohort sample size reflects selected universe; broader cross-sector distribution was not evaluated.",
      ],
      unresolvedQuestions: [
        "Would divergence appear under sub-segment quarterly granularity rather than annual totals?",
      ],
      stopReason: "no_material_outlier_detected",
    };
  }

  // Path 4 & 5: When an outlier exists
  const persistentHyp = hypotheses.find(
    (h) => h.category === "PERSISTENT_OPERATIONAL_DIFFERENCE"
  );
  const oneOffHyp = hypotheses.find((h) => h.category === "ONE_OFF_FINANCIAL_EVENT");

  // Check if persistent operational difference is supported and one-off is rejected
  const isPersistentSupported = persistentHyp && persistentHyp.status === HypothesisStatus.SUPPORTED;
  const isOneOffRejected = oneOffHyp && oneOffHyp.status === HypothesisStatus.REJECTED;

  if (isPersistentSupported && isOneOffRejected) {
    return {
      classification: NeutralClassification.PERSISTENT_DIFFERENCE,
      confidence: ConfidenceLevel.HIGH,
      rationale: `${sym}'s growth (${formatPercentage(outlierResult.targetValue)}) materially outpaces the peer median (${formatPercentage(outlierResult.peerMedian)}). Multi-period financial metrics and earnings expansion refute an isolated one-off accounting spike, confirming a persistent operational divergence.`,
      limitations: [
        "Analysis is strictly based on quantitative historical filings; management strategy discussions are outside scope.",
        "Future macroeconomic or regulatory headwinds may alter growth trajectories.",
      ],
      unresolvedQuestions: [
        "What specific fee-income or digital banking initiatives drove the top-line divergence?",
        "Does competitive replication by peers threaten the persistence of this margin?",
      ],
      stopReason: "evidence_sufficiently_supports_persistent_difference",
    };
  }

  // Path 5: INSUFFICIENT_EVIDENCE
  // An outlier was observed, but evidence could not conclusively support or rule out hypotheses
  return {
    classification: NeutralClassification.INSUFFICIENT_EVIDENCE,
    confidence: ConfidenceLevel.LOW,
    rationale: `An apparent statistical divergence was observed for ${sym} (${formatPercentage(outlierResult.targetValue)} vs peer median ${formatPercentage(outlierResult.peerMedian)}), but available evidence is insufficient to distinguish between operational execution, accounting shifts, or transient effects.`,
    limitations: [
      "Sectors REST overview lacks granular segment line-item notes required to stress-test the anomaly.",
      "Counter-evidence remains mixed across tested metrics.",
    ],
    unresolvedQuestions: [
      "Are audited footnotes detailing extraordinary items available in exchange filings?",
      "Did merger consolidation account for more than 50% of the recognized top-line expansion?",
    ],
    stopReason: "insufficient_discriminating_evidence",
  };
}
