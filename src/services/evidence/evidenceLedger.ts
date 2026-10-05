import {
  ConfidenceLevel,
  EvidenceItem,
  EvidenceLedgerEntry,
  EvidenceVerdict,
  Hypothesis,
} from "@/domain";

/**
 * Compiles atomic evidence items into a human-readable, auditable Evidence Ledger.
 * Each entry answers:
 * - What was observed?
 * - What hypothesis was being tested?
 * - What data was used & where did it come from?
 * - What did the evidence indicate?
 * - How strong is the conclusion?
 * - What remains uncertain?
 */
export function compileEvidenceLedger(
  evidenceItems: EvidenceItem[],
  hypotheses: Hypothesis[]
): EvidenceLedgerEntry[] {
  const hypMap = new Map<string, Hypothesis>(hypotheses.map((h) => [h.id, h]));

  return evidenceItems.map((item, index) => {
    const hyp = hypMap.get(item.targetHypothesisId);
    const hypTitle = hyp ? hyp.title : "General Cohort Assessment";

    // Determine confidence level based on verdict and source data completeness
    let confidence: ConfidenceLevel = ConfidenceLevel.MEDIUM;
    let remainingUncertainty = "Audited notes and sub-segment operational data not directly disclosed in REST overview.";

    if (item.verdict === EvidenceVerdict.SUPPORTED) {
      if (item.endpointOrTool === "check_comparability" || item.endpointOrTool === "validate_financial_data") {
        confidence = ConfidenceLevel.HIGH;
        remainingUncertainty = "None regarding reporting periods; fiscal alignment verified.";
      } else {
        confidence = ConfidenceLevel.MEDIUM;
        remainingUncertainty = "Macroeconomic factors and monetary policy environment remain external variables.";
      }
    } else if (item.verdict === EvidenceVerdict.WEAKENED) {
      confidence = ConfidenceLevel.HIGH;
      remainingUncertainty = "Hypothesis is contradicted by reported financials; residual probability is low.";
    } else if (item.verdict === EvidenceVerdict.INCONCLUSIVE || item.verdict === EvidenceVerdict.UNAVAILABLE) {
      confidence = ConfidenceLevel.LOW;
      remainingUncertainty = "Detailed financial disclosure notes from IDX required to resolve conclusively.";
    }

    const sourceDataProvenance = `${item.source} · Endpoint: ${item.endpointOrTool} [${item.sourceMode}]`;

    return {
      stepIndex: index + 1,
      evidenceId: item.id,
      hypothesisId: item.targetHypothesisId,
      hypothesisTitle: hypTitle,
      observation: item.observation,
      sourceDataProvenance,
      verdict: item.verdict,
      confidence,
      remainingUncertainty,
    };
  });
}
