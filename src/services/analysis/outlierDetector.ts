import {
  CompanyFundamentalData,
  ComparabilityStatus,
  OutlierResult,
} from "@/domain";
import { createRevenueGrowthMetricValue } from "./revenueGrowth";
import {
  calculateMean,
  calculateMedian,
  calculateStdDev,
  calculateZScore,
} from "@/utils/math";

export interface OutlierDetectionOptions {
  targetYear?: number;
  minPeers?: number;
  materialDeviationThreshold?: number; // Minimum absolute difference (e.g. 0.05 for 5%)
}

/**
 * Deterministic Outlier Detection Engine.
 *
 * Rules:
 * 1. Checks peer count (at least minPeers, default 2).
 * 2. Evaluates target and peer period alignment.
 * 3. Handles missing/null values without coercing them to valid data.
 * 4. Determines whether a statistically and economically material difference exists.
 * 5. Returns detailed provenance and metrics.
 */
export function detectRevenueGrowthOutlier(
  targetData: CompanyFundamentalData,
  peersData: CompanyFundamentalData[],
  options: OutlierDetectionOptions = {}
): OutlierResult {
  const minPeers = options.minPeers ?? 2;
  const materialThreshold = options.materialDeviationThreshold ?? 0.05; // 5% absolute spread

  // Step 1: Compute target metric
  const targetMetric = createRevenueGrowthMetricValue(
    targetData.symbol,
    targetData.historicalFinancials,
    options.targetYear
  );

  // If target data itself is invalid or missing
  if (!targetMetric.isValid || targetMetric.value === null) {
    const isCorrupt = targetData.historicalFinancials.some(
      (r) => r.revenue === null || r.revenue === undefined
    );
    const comparability = isCorrupt
      ? ComparabilityStatus.MISSING_DATA
      : ComparabilityStatus.INSUFFICIENT_HISTORY;

    return {
      hasOutlier: false,
      targetSymbol: targetData.symbol,
      targetValue: null,
      peerValues: [],
      peerMedian: null,
      peerMean: null,
      peerMin: null,
      peerMax: null,
      peerStdDev: null,
      deviationFromMedian: null,
      zScore: null,
      isHighOutlier: false,
      isLowOutlier: false,
      comparability,
      comparabilityDetails: `Target company metric calculation failed: ${targetMetric.notes ?? "Missing valid period data"}`,
      warning: "Target company metric is unavailable for safe peer comparison.",
    };
  }

  // Target reporting period
  const referenceTargetYear = targetMetric.targetYear;

  // Step 2: Compute peer metrics aligned to the target period
  const peerValues: { symbol: string; value: number | null }[] = [];
  const validPeerNumbers: number[] = [];
  let periodMismatchCount = 0;
  let missingDataCount = 0;

  for (const peer of peersData) {
    const pMetric = createRevenueGrowthMetricValue(
      peer.symbol,
      peer.historicalFinancials,
      referenceTargetYear
    );

    peerValues.push({ symbol: peer.symbol, value: pMetric.value });

    if (pMetric.isValid && pMetric.value !== null) {
      validPeerNumbers.push(pMetric.value);
    } else {
      if (
        peer.historicalFinancials.some(
          (r) => r.revenue === null || r.revenue === undefined
        )
      ) {
        missingDataCount++;
      } else {
        periodMismatchCount++;
      }
    }
  }

  // Check peer count constraint
  if (validPeerNumbers.length < minPeers) {
    const comparability =
      periodMismatchCount > 0
        ? ComparabilityStatus.MISMATCHED_PERIODS
        : missingDataCount > 0
        ? ComparabilityStatus.MISSING_DATA
        : ComparabilityStatus.INSUFFICIENT_HISTORY;

    return {
      hasOutlier: false,
      targetSymbol: targetData.symbol,
      targetValue: targetMetric.value,
      peerValues,
      peerMedian: null,
      peerMean: null,
      peerMin: null,
      peerMax: null,
      peerStdDev: null,
      deviationFromMedian: null,
      zScore: null,
      isHighOutlier: false,
      isLowOutlier: false,
      comparability,
      comparabilityDetails: `Insufficient aligned peers for target period ${targetMetric.periodLabel}. Found ${validPeerNumbers.length} valid peers, minimum required is ${minPeers}.`,
      warning: "Peer group does not contain enough comparable historical data.",
    };
  }

  // Step 3: Statistical distribution of peer values
  const peerMedian = calculateMedian(validPeerNumbers)!;
  const peerMean = calculateMean(validPeerNumbers)!;
  const peerStdDev = calculateStdDev(validPeerNumbers);
  const peerMin = Math.min(...validPeerNumbers);
  const peerMax = Math.max(...validPeerNumbers);

  const deviationFromMedian = targetMetric.value - peerMedian;
  const zScore =
    peerStdDev && peerStdDev > 0.0001
      ? calculateZScore(targetMetric.value, peerMean, peerStdDev)
      : null;

  // Step 4: Determine outlier status
  // Condition:
  // Target value must exceed the peer median by at least materialThreshold (e.g. 5%)
  // AND either zScore > 1.8 OR target is outside the peer [min, max] range with substantial margin.
  const isHighOutlier =
    deviationFromMedian >= materialThreshold &&
    targetMetric.value > peerMax &&
    (zScore === null || zScore >= 1.5);

  const isLowOutlier =
    deviationFromMedian <= -materialThreshold &&
    targetMetric.value < peerMin &&
    (zScore === null || zScore <= -1.5);

  const hasOutlier = isHighOutlier || isLowOutlier;

  let comparability = ComparabilityStatus.ALIGNED;
  let comparabilityDetails = `Target and ${validPeerNumbers.length} peers aligned on ${targetMetric.periodLabel}.`;

  if (periodMismatchCount > 0) {
    comparability = ComparabilityStatus.MISMATCHED_PERIODS;
    comparabilityDetails += ` Note: ${periodMismatchCount} peer(s) omitted due to period mismatch.`;
  } else if (missingDataCount > 0) {
    comparability = ComparabilityStatus.MISSING_DATA;
    comparabilityDetails += ` Note: ${missingDataCount} peer(s) omitted due to null/missing revenue records.`;
  }

  return {
    hasOutlier,
    targetSymbol: targetData.symbol,
    targetValue: targetMetric.value,
    peerValues,
    peerMedian,
    peerMean,
    peerMin,
    peerMax,
    peerStdDev,
    deviationFromMedian,
    zScore,
    isHighOutlier,
    isLowOutlier,
    comparability,
    comparabilityDetails,
  };
}
