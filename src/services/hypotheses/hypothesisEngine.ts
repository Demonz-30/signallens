import {
  Hypothesis,
  HypothesisStatus,
  OutlierResult,
  ComparabilityStatus,
} from "@/domain";

export interface HypothesisGenerator {
  generateHypotheses(outlierResult: OutlierResult): Promise<Hypothesis[]>;
}

/**
 * Deterministic Rule-Based Hypothesis Generator.
 * Formulates falsifiable, testable hypotheses based strictly on the observed anomaly
 * and comparability characteristics.
 */
export class DeterministicHypothesisGenerator implements HypothesisGenerator {
  async generateHypotheses(outlierResult: OutlierResult): Promise<Hypothesis[]> {
    const hypotheses: Hypothesis[] = [];
    const sym = outlierResult.targetSymbol;

    // Case 1: Comparability / Period mismatch detected
    if (outlierResult.comparability === ComparabilityStatus.MISMATCHED_PERIODS) {
      hypotheses.push({
        id: "HYP_PERIOD_MISMATCH",
        category: "REPORTING_PERIOD_MISMATCH",
        title: "Reporting Period Discrepancy",
        description: `${sym}'s apparent revenue growth divergence is attributable to mismatched fiscal years or stub reporting periods rather than economic outperformance.`,
        whyPlausible: `Data inspection indicated that peer reporting periods do not align with ${sym}'s target fiscal year.`,
        requiredEvidence: "Verification of annual report fiscal end dates (e.g. Dec 31 vs other fiscal year ends) from Sectors report metadata.",
        status: HypothesisStatus.PENDING,
        supportingEvidenceIds: [],
        weakeningEvidenceIds: [],
      });
      return hypotheses;
    }

    // Case 2: Data Quality / Null values detected
    if (
      outlierResult.comparability === ComparabilityStatus.MISSING_DATA ||
      outlierResult.targetValue === null
    ) {
      hypotheses.push({
        id: "HYP_DATA_QUALITY",
        category: "DATA_QUALITY_ISSUE",
        title: "Data Quality or Restatement Artifact",
        description: `The anomaly is an artifact of missing, restated, or malformed revenue entries in the financial filings.`,
        whyPlausible: `Null, non-positive, or missing revenue values were encountered during rate-of-change calculation.`,
        requiredEvidence: "Verification of official audited financial filing consistency and absence of null fields.",
        status: HypothesisStatus.PENDING,
        supportingEvidenceIds: [],
        weakeningEvidenceIds: [],
      });
      return hypotheses;
    }

    // Case 3: No material outlier exists
    if (!outlierResult.hasOutlier) {
      hypotheses.push({
        id: "HYP_NO_OUTLIER",
        category: "PERSISTENT_OPERATIONAL_DIFFERENCE",
        title: "Consistent Peer Group Distribution",
        description: `${sym}'s revenue performance is statistically consistent with peer cohort variance.`,
        whyPlausible: `Metric deviation from the peer median (${((outlierResult.deviationFromMedian ?? 0) * 100).toFixed(1)}%) is within standard dispersion boundaries.`,
        requiredEvidence: "Standard deviation and interquartile range comparison across the peer universe.",
        status: HypothesisStatus.PENDING,
        supportingEvidenceIds: [],
        weakeningEvidenceIds: [],
      });
      return hypotheses;
    }

    // Case 4: Material Outlier detected with aligned periods
    // Generate ranked hypotheses specifically addressing the divergence:

    // Hypothesis A: One-off financial accounting gain or merger/acquisition
    hypotheses.push({
      id: "HYP_ONE_OFF_GAIN",
      category: "ONE_OFF_FINANCIAL_EVENT",
      title: "One-Off Non-Operational Gain or Consolidation Effect",
      description: `${sym}'s revenue growth reflects non-recurring income, asset sales, or inorganic subsidiary consolidation rather than organic core banking/operational growth.`,
      whyPlausible: `${sym}'s growth (${((outlierResult.targetValue ?? 0) * 100).toFixed(1)}%) sharply outpaces peer median (${((outlierResult.peerMedian ?? 0) * 100).toFixed(1)}%), often indicating an inorganic or one-off event.`,
      requiredEvidence: "Comparison of core operational earnings growth vs top-line growth to determine if bottom-line margin expanded proportionally.",
      status: HypothesisStatus.PENDING,
      supportingEvidenceIds: [],
      weakeningEvidenceIds: [],
    });

    // Hypothesis B: Business mix divergence (e.g. digital fees, CASA ratio, high-yield segments)
    hypotheses.push({
      id: "HYP_BUSINESS_MIX",
      category: "BUSINESS_MIX_DIVERGENCE",
      title: "Structural Business Mix & Segment Divergence",
      description: `${sym}'s outperformance is driven by segment specialization (e.g. low-cost CASA deposit funding or fee-based digital transaction dominance) distinct from peers.`,
      whyPlausible: `Top Indonesian banks display differing revenue structures (commercial vs micro-lending vs transaction banking).`,
      requiredEvidence: "Consistent fee-to-revenue ratio and sustained earnings persistence across consecutive years.",
      status: HypothesisStatus.PENDING,
      supportingEvidenceIds: [],
      weakeningEvidenceIds: [],
    });

    // Hypothesis C: Multi-period persistent operational execution
    hypotheses.push({
      id: "HYP_PERSISTENT_EXECUTION",
      category: "PERSISTENT_OPERATIONAL_DIFFERENCE",
      title: "Multi-Year Sustained Operational Efficiency",
      description: `${sym}'s high growth represents a multi-year structural operational advantage rather than a single-year spike.`,
      whyPlausible: `If earnings and prior-year revenues also grew consistently above peer averages, the difference is structural.`,
      requiredEvidence: "Confirmation of above-peer earnings growth and multi-year revenue CAGR in Sectors historical financials.",
      status: HypothesisStatus.PENDING,
      supportingEvidenceIds: [],
      weakeningEvidenceIds: [],
    });

    return hypotheses;
  }
}
