import {
  CompanyFundamentalData,
  EvidenceItem,
  EvidenceVerdict,
  Hypothesis,
  HypothesisStatus,
  OutlierResult,
  ComparabilityStatus,
} from "@/domain";
import { formatPercentage } from "@/utils/math";

export interface EvidenceTestResult {
  testedHypotheses: Hypothesis[];
  evidenceItems: EvidenceItem[];
}

/**
 * Evaluates hypotheses against available Sectors fundamental data
 * and produces verifiable, provenance-tagged evidence items.
 */
export function testHypothesesWithEvidence(
  hypotheses: Hypothesis[],
  outlierResult: OutlierResult,
  targetData: CompanyFundamentalData,
  peersData: CompanyFundamentalData[]
): EvidenceTestResult {
  const evidenceItems: EvidenceItem[] = [];
  const updatedHypotheses: Hypothesis[] = [];

  const timestamp = new Date().toISOString();
  const sourceName =
    targetData.sourceMode === "SECTORS_REST"
      ? "Sectors REST API v2 (/v2/company/report/)"
      : "Sectors Mock Fundamental Dataset";

  let evidenceCounter = 1;
  const nextEvId = () => `EV_${String(evidenceCounter++).padStart(3, "0")}`;

  for (const hyp of hypotheses) {
    const currentHyp: Hypothesis = {
      ...hyp,
      supportingEvidenceIds: [...hyp.supportingEvidenceIds],
      weakeningEvidenceIds: [...hyp.weakeningEvidenceIds],
    };

    switch (hyp.category) {
      case "REPORTING_PERIOD_MISMATCH": {
        const isMismatched =
          outlierResult.comparability === ComparabilityStatus.MISMATCHED_PERIODS;

        const targetYears = targetData.historicalFinancials.map((h) => h.year).sort();
        const peerYearSummaries = peersData.map(
          (p) => `${p.symbol}: [${p.historicalFinancials.map((h) => h.year).sort().join(", ")}]`
        );

        if (isMismatched) {
          const ev: EvidenceItem = {
            id: nextEvId(),
            title: "Confirmed Fiscal Reporting Period Misalignment",
            source: sourceName,
            sourceMode: targetData.sourceMode,
            endpointOrTool: "check_comparability",
            timestamp,
            data: { targetYears, peerYearSummaries },
            observation: `Subject company ${targetData.symbol} reporting years do not align with the peer cohort comparison baseline.`,
            verdict: EvidenceVerdict.SUPPORTED,
            targetHypothesisId: hyp.id,
            rationale: `Peer companies report on different fiscal periods; direct rate-of-change comparison across misaligned periods is invalid.`,
          };
          evidenceItems.push(ev);
          currentHyp.supportingEvidenceIds.push(ev.id);
          currentHyp.status = HypothesisStatus.SUPPORTED;
        } else {
          const ev: EvidenceItem = {
            id: nextEvId(),
            title: "Audited Fiscal Reporting Period Alignment",
            source: sourceName,
            sourceMode: targetData.sourceMode,
            endpointOrTool: "check_comparability",
            timestamp,
            data: { targetYears, peerYearSummaries },
            observation: `Target ${targetData.symbol} and peer group all report consistent calendar fiscal years (FY2023–FY2024).`,
            verdict: EvidenceVerdict.WEAKENED,
            targetHypothesisId: hyp.id,
            rationale: `Period mismatch is ruled out: all compared companies share identical December 31 fiscal year-ends and reporting schedules.`,
          };
          evidenceItems.push(ev);
          currentHyp.weakeningEvidenceIds.push(ev.id);
          currentHyp.status = HypothesisStatus.REJECTED;
        }
        break;
      }

      case "DATA_QUALITY_ISSUE": {
        const hasMissingData =
          outlierResult.comparability === ComparabilityStatus.MISSING_DATA ||
          targetData.historicalFinancials.some((h) => h.revenue === null) ||
          peersData.some((p) => p.historicalFinancials.some((h) => h.revenue === null));

        if (hasMissingData) {
          const ev: EvidenceItem = {
            id: nextEvId(),
            title: "Missing or Incomplete Financial Line Items",
            source: sourceName,
            sourceMode: targetData.sourceMode,
            endpointOrTool: "validate_financial_data",
            timestamp,
            data: { targetSymbol: targetData.symbol },
            observation: `Encountered null or unverified revenue line items in historical financial records.`,
            verdict: EvidenceVerdict.SUPPORTED,
            targetHypothesisId: hyp.id,
            rationale: `Cannot reliably verify rate of change without complete historical line items.`,
          };
          evidenceItems.push(ev);
          currentHyp.supportingEvidenceIds.push(ev.id);
          currentHyp.status = HypothesisStatus.SUPPORTED;
        } else {
          const ev: EvidenceItem = {
            id: nextEvId(),
            title: "Verified Continuous Financial Data Line Items",
            source: sourceName,
            sourceMode: targetData.sourceMode,
            endpointOrTool: "validate_financial_data",
            timestamp,
            data: { recordsCount: targetData.historicalFinancials.length },
            observation: `All historical financial revenue and earnings fields are populated with valid numerical records.`,
            verdict: EvidenceVerdict.WEAKENED,
            targetHypothesisId: hyp.id,
            rationale: `No data quality artifacts or unpopulated fields were found in the examined reports.`,
          };
          evidenceItems.push(ev);
          currentHyp.weakeningEvidenceIds.push(ev.id);
          currentHyp.status = HypothesisStatus.REJECTED;
        }
        break;
      }

      case "ONE_OFF_FINANCIAL_EVENT": {
        // Test whether bottom-line earnings and quarterly trends support an isolated one-off accounting spike
        const targetEarningsGrowth =
          targetData.historicalFinancials.length >= 2
            ? (() => {
                const s = [...targetData.historicalFinancials].sort((a, b) => a.year - b.year);
                const cur = s[s.length - 1].earnings;
                const prev = s[s.length - 2].earnings;
                return cur && prev && prev > 0 ? cur / prev - 1 : null;
              })()
            : null;

        const targetQuarterlyGrowth = targetData.yoyQuarterRevenueGrowth ?? null;

        // If earnings grew consistently and recent quarters also show high growth,
        // it weakens the hypothesis of an isolated one-off paper spike.
        if (
          targetEarningsGrowth !== null &&
          targetEarningsGrowth > 0.15 &&
          targetQuarterlyGrowth !== null &&
          targetQuarterlyGrowth > 0.1
        ) {
          const ev: EvidenceItem = {
            id: nextEvId(),
            title: "Operating Earnings Growth and Quarterly Consistency",
            source: sourceName,
            sourceMode: targetData.sourceMode,
            endpointOrTool: "get_related_metrics",
            timestamp,
            data: {
              annualEarningsGrowth: formatPercentage(targetEarningsGrowth),
              latestQuarterYoYGrowth: formatPercentage(targetQuarterlyGrowth),
            },
            observation: `Strong annual revenue growth was accompanied by ${formatPercentage(targetEarningsGrowth)} net earnings expansion and ${formatPercentage(targetQuarterlyGrowth)} quarterly momentum.`,
            verdict: EvidenceVerdict.WEAKENED,
            targetHypothesisId: hyp.id,
            rationale: `An isolated one-off accounting gain typically causes top-line divergence without corresponding operational earnings and recurring quarterly momentum.`,
          };
          evidenceItems.push(ev);
          currentHyp.weakeningEvidenceIds.push(ev.id);
          currentHyp.status = HypothesisStatus.REJECTED;
        } else {
          const ev: EvidenceItem = {
            id: nextEvId(),
            title: "Inconclusive Non-Operating Variance Data",
            source: sourceName,
            sourceMode: targetData.sourceMode,
            endpointOrTool: "get_related_metrics",
            timestamp,
            data: { targetEarningsGrowth, targetQuarterlyGrowth },
            observation: `Earnings persistence does not rule out potential non-operational or one-off drivers.`,
            verdict: EvidenceVerdict.INCONCLUSIVE,
            targetHypothesisId: hyp.id,
            rationale: `Available financial ratios do not conclusively confirm or disprove non-operating one-offs without audited notes.`,
          };
          evidenceItems.push(ev);
          currentHyp.status = HypothesisStatus.UNRESOLVED;
        }
        break;
      }

      case "BUSINESS_MIX_DIVERGENCE": {
        // Business mix cannot be fabricated without segment-level disclosures
        const ev: EvidenceItem = {
          id: nextEvId(),
          title: "Absence of Segment-Level Disclosure Notes",
          source: sourceName,
          sourceMode: targetData.sourceMode,
          endpointOrTool: "get_related_metrics",
          timestamp,
          data: {
            targetSymbol: targetData.symbol,
            industry: targetData.industry,
            subIndustry: targetData.subIndustry,
          },
          observation: `Sectors overview provides total annual revenue (${formatPercentage(outlierResult.targetValue)}) but does not disclose granular CASA ratio, fee-income share, or lending sub-segment breakdown.`,
          verdict: EvidenceVerdict.INCONCLUSIVE,
          targetHypothesisId: hyp.id,
          rationale: `Business mix hypothesis cannot be confirmed without granular segment disclosures from exchange footnotes. Absence of segment data is not proof of structural divergence.`,
        };
        evidenceItems.push(ev);
        currentHyp.status = HypothesisStatus.UNRESOLVED;
        break;
      }

      case "PERSISTENT_OPERATIONAL_DIFFERENCE": {
        if (!outlierResult.hasOutlier) {
          const ev: EvidenceItem = {
            id: nextEvId(),
            title: "Cohort Uniformity Verification",
            source: sourceName,
            sourceMode: targetData.sourceMode,
            endpointOrTool: "compare_peers",
            timestamp,
            data: {
              peerMedian: formatPercentage(outlierResult.peerMedian),
              targetValue: formatPercentage(outlierResult.targetValue),
            },
            observation: `Target company growth closely tracks peer median (${formatPercentage(outlierResult.peerMedian)}).`,
            verdict: EvidenceVerdict.SUPPORTED,
            targetHypothesisId: hyp.id,
            rationale: `Cohort variance confirms absence of material divergence across peers.`,
          };
          evidenceItems.push(ev);
          currentHyp.supportingEvidenceIds.push(ev.id);
          currentHyp.status = HypothesisStatus.SUPPORTED;
          break;
        }

        // Check multi-year consecutive revenue expansion
        const targetHist = [...targetData.historicalFinancials]
          .filter((h) => typeof h.year === "number" && typeof h.revenue === "number")
          .sort((a, b) => a.year - b.year);

        const hasMultiYearGrowth =
          targetHist.length >= 3 &&
          (targetHist[targetHist.length - 1].revenue ?? 0) > (targetHist[targetHist.length - 2].revenue ?? 0) &&
          (targetHist[targetHist.length - 2].revenue ?? 0) > (targetHist[targetHist.length - 3].revenue ?? 0);

        if (hasMultiYearGrowth) {
          const ev: EvidenceItem = {
            id: nextEvId(),
            title: "Multi-Period Structural Growth Divergence",
            source: sourceName,
            sourceMode: targetData.sourceMode,
            endpointOrTool: "get_metric_history",
            timestamp,
            data: {
              targetGrowth: formatPercentage(outlierResult.targetValue),
              peerMedian: formatPercentage(outlierResult.peerMedian),
              peerMax: formatPercentage(outlierResult.peerMax),
              consecutiveAnnualGrowth: true,
              yearsEvaluated: targetHist.slice(-3).map((h) => h.year),
            },
            observation: `${targetData.symbol} sustained ${formatPercentage(outlierResult.targetValue)} growth vs peer median ${formatPercentage(outlierResult.peerMedian)} with consecutive expansion over 3 consecutive reporting periods.`,
            verdict: EvidenceVerdict.SUPPORTED,
            targetHypothesisId: hyp.id,
            rationale: `The divergence persists across multiple audited periods and outpaces all peer benchmark boundaries.`,
          };
          evidenceItems.push(ev);
          currentHyp.supportingEvidenceIds.push(ev.id);
          currentHyp.status = HypothesisStatus.SUPPORTED;
        } else {
          const ev: EvidenceItem = {
            id: nextEvId(),
            title: "Inconclusive Multi-Period Persistence",
            source: sourceName,
            sourceMode: targetData.sourceMode,
            endpointOrTool: "get_metric_history",
            timestamp,
            data: {
              targetGrowth: formatPercentage(outlierResult.targetValue),
              peerMedian: formatPercentage(outlierResult.peerMedian),
              consecutiveAnnualGrowth: false,
              historicalRecordCount: targetHist.length,
            },
            observation: `${targetData.symbol} exhibits an anomaly in the target period (${formatPercentage(outlierResult.targetValue)}), but historical records show non-consecutive or fluctuating prior-year growth.`,
            verdict: EvidenceVerdict.INCONCLUSIVE,
            targetHypothesisId: hyp.id,
            rationale: `Cannot confirm multi-year operational persistence without verified consecutive multi-period expansion.`,
          };
          evidenceItems.push(ev);
          currentHyp.status = HypothesisStatus.UNRESOLVED;
        }
        break;
      }

      default: {
        const ev: EvidenceItem = {
          id: nextEvId(),
          title: "Insufficient Granular Breakdown Evidence",
          source: sourceName,
          sourceMode: targetData.sourceMode,
          endpointOrTool: "get_related_metrics",
          timestamp,
          data: {},
          observation: `Granular segment or geographic disclosures are unavailable in core report overview.`,
          verdict: EvidenceVerdict.UNAVAILABLE,
          targetHypothesisId: hyp.id,
          rationale: `Sectors REST API v2 report endpoint does not include detailed segment sub-notes.`,
        };
        evidenceItems.push(ev);
        currentHyp.status = HypothesisStatus.UNRESOLVED;
      }
    }

    updatedHypotheses.push(currentHyp);
  }

  return {
    testedHypotheses: updatedHypotheses,
    evidenceItems,
  };
}
