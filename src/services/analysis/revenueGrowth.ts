import { HistoricalFinancialRecord, MetricValue } from "@/domain";
import { formatPercentage } from "@/utils/math";

export interface GrowthCalculationResult {
  growth: number | null;
  baseYear?: number;
  targetYear?: number;
  periodLabel: string;
  isValid: boolean;
  reason?: string;
}

/**
 * Deterministically computes annual revenue growth from historical financial records.
 * Formula: (Revenue_t / Revenue_{t-1}) - 1
 *
 * Rules:
 * - Sorts records chronologically by year.
 * - Prior year revenue must be strictly positive (> 0) to avoid division by zero or negative base distortions.
 * - Missing or null revenue returns isValid: false.
 */
export function computeAnnualRevenueGrowth(
  records: HistoricalFinancialRecord[],
  targetYear?: number
): GrowthCalculationResult {
  if (!records || records.length < 2) {
    return {
      growth: null,
      periodLabel: "Insufficient Historical Data",
      isValid: false,
      reason: "At least two consecutive reporting years are required.",
    };
  }

  // Filter out records without valid year numbers and sort ascending
  const sorted = [...records]
    .filter((r) => typeof r.year === "number" && !isNaN(r.year))
    .sort((a, b) => a.year - b.year);

  let currentRecord: HistoricalFinancialRecord | undefined;
  let priorRecord: HistoricalFinancialRecord | undefined;

  if (targetYear !== undefined) {
    currentRecord = sorted.find((r) => r.year === targetYear);
    priorRecord = sorted.find((r) => r.year === targetYear - 1);
  } else {
    // Pick the most recent consecutive pair
    for (let i = sorted.length - 1; i >= 1; i--) {
      if (sorted[i].year === sorted[i - 1].year + 1) {
        currentRecord = sorted[i];
        priorRecord = sorted[i - 1];
        break;
      }
    }
  }

  if (!currentRecord || !priorRecord) {
    return {
      growth: null,
      periodLabel: targetYear ? `FY${targetYear} vs FY${targetYear - 1}` : "No consecutive years",
      isValid: false,
      reason: "Could not find two consecutive reporting years in historical data.",
    };
  }

  const curRev = currentRecord.revenue;
  const prevRev = priorRecord.revenue;

  // Null or missing check
  if (curRev === null || curRev === undefined || prevRev === null || prevRev === undefined) {
    return {
      growth: null,
      baseYear: priorRecord.year,
      targetYear: currentRecord.year,
      periodLabel: `FY${currentRecord.year} vs FY${priorRecord.year}`,
      isValid: false,
      reason: "Revenue value is null or missing for one of the comparison periods.",
    };
  }

  // Zero or negative prior revenue
  if (prevRev <= 0) {
    return {
      growth: null,
      baseYear: priorRecord.year,
      targetYear: currentRecord.year,
      periodLabel: `FY${currentRecord.year} vs FY${priorRecord.year}`,
      isValid: false,
      reason: "Prior period revenue is non-positive (<= 0), preventing rate-of-change calculation.",
    };
  }

  const growth = curRev / prevRev - 1;

  return {
    growth,
    baseYear: priorRecord.year,
    targetYear: currentRecord.year,
    periodLabel: `FY${currentRecord.year} vs FY${priorRecord.year}`,
    isValid: true,
  };
}

/**
 * Adapts growth calculation into a strongly typed MetricValue.
 */
export function createRevenueGrowthMetricValue(
  symbol: string,
  records: HistoricalFinancialRecord[],
  targetYear?: number
): MetricValue {
  const result = computeAnnualRevenueGrowth(records, targetYear);
  return {
    symbol,
    metricName: "Annual Revenue Growth (Computed)",
    value: result.growth,
    formattedValue: formatPercentage(result.growth),
    baseYear: result.baseYear,
    targetYear: result.targetYear,
    periodLabel: result.periodLabel,
    unit: "% YoY",
    isValid: result.isValid,
    notes: result.reason,
  };
}
