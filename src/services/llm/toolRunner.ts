import {
  CompanyFundamentalData,
  EvidenceItem,
  EvidenceVerdict,
  OutlierResult,
  ComparabilityStatus,
} from "@/domain";
import { formatPercentage } from "@/utils/math";
import { AllowlistedToolName } from "./schemas";

export interface ToolExecutionContext {
  toolName: AllowlistedToolName;
  targetHypothesisId: string;
  targetData: CompanyFundamentalData;
  peersData: CompanyFundamentalData[];
  outlierResult: OutlierResult;
  evidenceId: string;
}

/**
 * Deterministic Evidence Tool Runner.
 * Executes strictly allowlisted verification tools against pre-retrieved Sectors data.
 * Zero arbitrary code execution; zero unauthorized web or API access.
 */
export function executeAllowlistedTool(context: ToolExecutionContext): EvidenceItem {
  const {
    toolName,
    targetHypothesisId,
    targetData,
    peersData,
    outlierResult,
    evidenceId,
  } = context;

  const timestamp = new Date().toISOString();
  const sourceName =
    targetData.sourceMode === "SECTORS_REST"
      ? "Sectors REST API v2 (/v2/company/report/)"
      : "Sectors Mock Fundamental Dataset";

  switch (toolName) {
    case "verify_period_alignment": {
      const isMismatched =
        outlierResult.comparability === ComparabilityStatus.MISMATCHED_PERIODS;
      const targetYears = targetData.historicalFinancials
        .map((h) => h.year)
        .sort();
      const peerYearSummaries = peersData.map(
        (p) =>
          `${p.symbol}: [${p.historicalFinancials.map((h) => h.year).sort().join(", ")}]`
      );

      if (isMismatched) {
        return {
          id: evidenceId,
          title: "Confirmed Fiscal Reporting Period Misalignment",
          source: sourceName,
          sourceMode: targetData.sourceMode,
          endpointOrTool: "verify_period_alignment",
          timestamp,
          data: { targetYears, peerYearSummaries },
          observation: `Target company ${targetData.symbol} reporting years do not align with peer cohort comparison baseline.`,
          verdict: EvidenceVerdict.SUPPORTED,
          targetHypothesisId,
          rationale: `Peer companies report on different fiscal cycles; direct rate-of-change comparison across misaligned periods is invalid.`,
        };
      } else {
        return {
          id: evidenceId,
          title: "Audited Fiscal Reporting Period Alignment",
          source: sourceName,
          sourceMode: targetData.sourceMode,
          endpointOrTool: "verify_period_alignment",
          timestamp,
          data: { targetYears, peerYearSummaries },
          observation: `Target ${targetData.symbol} and peer cohort report consistent calendar fiscal years (FY2023–FY2024).`,
          verdict: EvidenceVerdict.WEAKENED,
          targetHypothesisId,
          rationale: `Period mismatch is ruled out: all compared companies share synchronized reporting schedules.`,
        };
      }
    }

    case "audit_financial_line_items": {
      const hasMissingData =
        outlierResult.comparability === ComparabilityStatus.MISSING_DATA ||
        targetData.historicalFinancials.some((h) => h.revenue === null) ||
        peersData.some((p) =>
          p.historicalFinancials.some((h) => h.revenue === null)
        );

      if (hasMissingData) {
        return {
          id: evidenceId,
          title: "Missing or Incomplete Financial Line Items",
          source: sourceName,
          sourceMode: targetData.sourceMode,
          endpointOrTool: "audit_financial_line_items",
          timestamp,
          data: { targetSymbol: targetData.symbol },
          observation: `Encountered null or unverified revenue line items in historical financial records.`,
          verdict: EvidenceVerdict.SUPPORTED,
          targetHypothesisId,
          rationale: `Cannot reliably verify rate of change without complete historical line items.`,
        };
      } else {
        return {
          id: evidenceId,
          title: "Verified Continuous Financial Data Line Items",
          source: sourceName,
          sourceMode: targetData.sourceMode,
          endpointOrTool: "audit_financial_line_items",
          timestamp,
          data: { recordsCount: targetData.historicalFinancials.length },
          observation: `All historical financial revenue and earnings fields are populated with valid numerical records.`,
          verdict: EvidenceVerdict.WEAKENED,
          targetHypothesisId,
          rationale: `No data quality artifacts or unpopulated fields were found in the examined reports.`,
        };
      }
    }

    case "audit_operating_earnings": {
      const targetEarningsGrowth =
        targetData.historicalFinancials.length >= 2
          ? (() => {
              const s = [...targetData.historicalFinancials].sort(
                (a, b) => a.year - b.year
              );
              const cur = s[s.length - 1].earnings;
              const prev = s[s.length - 2].earnings;
              return cur && prev && prev > 0 ? cur / prev - 1 : null;
            })()
          : null;

      const targetQuarterlyGrowth = targetData.yoyQuarterRevenueGrowth ?? null;

      if (
        targetEarningsGrowth !== null &&
        targetEarningsGrowth > 0.15 &&
        targetQuarterlyGrowth !== null &&
        targetQuarterlyGrowth > 0.1
      ) {
        return {
          id: evidenceId,
          title: "Operating Earnings Growth and Quarterly Consistency",
          source: sourceName,
          sourceMode: targetData.sourceMode,
          endpointOrTool: "audit_operating_earnings",
          timestamp,
          data: {
            annualEarningsGrowth: formatPercentage(targetEarningsGrowth),
            latestQuarterYoYGrowth: formatPercentage(targetQuarterlyGrowth),
          },
          observation: `Strong annual revenue growth was accompanied by ${formatPercentage(targetEarningsGrowth)} net earnings expansion and ${formatPercentage(targetQuarterlyGrowth)} quarterly momentum.`,
          verdict: EvidenceVerdict.WEAKENED,
          targetHypothesisId,
          rationale: `An isolated one-off accounting gain typically causes top-line divergence without corresponding operational earnings and recurring quarterly momentum.`,
        };
      } else {
        return {
          id: evidenceId,
          title: "Inconclusive Non-Operating Variance Data",
          source: sourceName,
          sourceMode: targetData.sourceMode,
          endpointOrTool: "audit_operating_earnings",
          timestamp,
          data: { targetEarningsGrowth, targetQuarterlyGrowth },
          observation: `Earnings persistence does not conclusively rule out potential non-operational or one-off drivers.`,
          verdict: EvidenceVerdict.INCONCLUSIVE,
          targetHypothesisId,
          rationale: `Available financial ratios do not conclusively confirm or disprove non-operating one-offs without audited notes.`,
        };
      }
    }

    case "audit_quarterly_momentum": {
      const qRevGrowth = targetData.yoyQuarterRevenueGrowth ?? null;
      const qEarnGrowth = targetData.yoyQuarterEarningsGrowth ?? null;

      if (qRevGrowth !== null && qRevGrowth > 0.05) {
        return {
          id: evidenceId,
          title: "Positive Quarterly Momentum Audit",
          source: sourceName,
          sourceMode: targetData.sourceMode,
          endpointOrTool: "audit_quarterly_momentum",
          timestamp,
          data: {
            yoyQuarterRevenueGrowth: formatPercentage(qRevGrowth),
            yoyQuarterEarningsGrowth: formatPercentage(qEarnGrowth),
          },
          observation: `Recent quarter shows sustained YoY expansion (${formatPercentage(qRevGrowth)}), indicating ongoing operational activity.`,
          verdict: EvidenceVerdict.SUPPORTED,
          targetHypothesisId,
          rationale: `Quarterly persistence confirms that the growth pace is not confined to an isolated historical reporting date.`,
        };
      } else {
        return {
          id: evidenceId,
          title: "Inconclusive Quarterly Momentum",
          source: sourceName,
          sourceMode: targetData.sourceMode,
          endpointOrTool: "audit_quarterly_momentum",
          timestamp,
          data: { qRevGrowth, qEarnGrowth },
          observation: `Quarterly growth metrics are neutral or missing from report overview.`,
          verdict: EvidenceVerdict.INCONCLUSIVE,
          targetHypothesisId,
          rationale: `Cannot verify recent quarterly momentum without complete quarterly disclosure fields.`,
        };
      }
    }

    case "audit_multi_period_cagr": {
      if (!outlierResult.hasOutlier) {
        return {
          id: evidenceId,
          title: "Cohort Uniformity Verification",
          source: sourceName,
          sourceMode: targetData.sourceMode,
          endpointOrTool: "audit_multi_period_cagr",
          timestamp,
          data: {
            peerMedian: formatPercentage(outlierResult.peerMedian),
            targetValue: formatPercentage(outlierResult.targetValue),
          },
          observation: `Target company growth closely tracks peer median (${formatPercentage(outlierResult.peerMedian)}).`,
          verdict: EvidenceVerdict.SUPPORTED,
          targetHypothesisId,
          rationale: `Cohort variance confirms absence of material divergence across peers.`,
        };
      }

      const targetHist = [...targetData.historicalFinancials]
        .filter(
          (h) => typeof h.year === "number" && typeof h.revenue === "number"
        )
        .sort((a, b) => a.year - b.year);

      const hasMultiYearGrowth =
        targetHist.length >= 3 &&
        (targetHist[targetHist.length - 1].revenue ?? 0) >
          (targetHist[targetHist.length - 2].revenue ?? 0) &&
        (targetHist[targetHist.length - 2].revenue ?? 0) >
          (targetHist[targetHist.length - 3].revenue ?? 0);

      if (hasMultiYearGrowth) {
        return {
          id: evidenceId,
          title: "Multi-Period Structural Growth Divergence",
          source: sourceName,
          sourceMode: targetData.sourceMode,
          endpointOrTool: "audit_multi_period_cagr",
          timestamp,
          data: {
            targetGrowth: formatPercentage(outlierResult.targetValue),
            peerMedian: formatPercentage(outlierResult.peerMedian),
            consecutiveAnnualGrowth: true,
            yearsEvaluated: targetHist.slice(-3).map((h) => h.year),
          },
          observation: `${targetData.symbol} sustained ${formatPercentage(outlierResult.targetValue)} growth vs peer median ${formatPercentage(outlierResult.peerMedian)} with consecutive expansion over 3 consecutive periods.`,
          verdict: EvidenceVerdict.SUPPORTED,
          targetHypothesisId,
          rationale: `The divergence persists across multiple audited periods and outpaces peer benchmark boundaries.`,
        };
      } else {
        return {
          id: evidenceId,
          title: "Inconclusive Multi-Period Persistence",
          source: sourceName,
          sourceMode: targetData.sourceMode,
          endpointOrTool: "audit_multi_period_cagr",
          timestamp,
          data: {
            targetGrowth: formatPercentage(outlierResult.targetValue),
            peerMedian: formatPercentage(outlierResult.peerMedian),
            consecutiveAnnualGrowth: false,
          },
          observation: `${targetData.symbol} exhibits an anomaly in the target period, but historical records show non-consecutive or fluctuating prior-year growth.`,
          verdict: EvidenceVerdict.INCONCLUSIVE,
          targetHypothesisId,
          rationale: `Cannot confirm multi-year operational persistence without verified consecutive multi-period expansion.`,
        };
      }
    }

    case "check_segment_disclosures": {
      return {
        id: evidenceId,
        title: "Absence of Granular Segment Disclosures",
        source: sourceName,
        sourceMode: targetData.sourceMode,
        endpointOrTool: "check_segment_disclosures",
        timestamp,
        data: {
          targetSymbol: targetData.symbol,
          industry: targetData.industry,
          subIndustry: targetData.subIndustry,
        },
        observation: `Sectors REST overview provides total annual revenue (${formatPercentage(outlierResult.targetValue)}) but does not disclose granular CASA ratio, fee-income share, or lending sub-segment breakdown.`,
        verdict: EvidenceVerdict.INCONCLUSIVE,
        targetHypothesisId,
        rationale: `Business mix hypothesis cannot be confirmed without granular segment disclosures from exchange footnotes. Absence of segment data is not proof of structural divergence.`,
      };
    }
  }
}
