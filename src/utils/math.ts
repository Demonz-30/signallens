/**
 * Pure statistical math utilities for deterministic calculations.
 */

export function calculateMean(values: number[]): number | null {
  if (values.length === 0) return null;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

export function calculateMedian(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

export function calculateStdDev(values: number[]): number | null {
  if (values.length < 2) return null;
  const mean = calculateMean(values);
  if (mean === null) return null;
  const variance =
    values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
    (values.length - 1);
  return Math.sqrt(variance);
}

export function calculateZScore(
  value: number,
  mean: number,
  stdDev: number
): number | null {
  if (stdDev <= 0.000001) return null; // Avoid division by near-zero variance
  return (value - mean) / stdDev;
}

export function formatPercentage(val: number | null): string {
  if (val === null || isNaN(val)) return "N/A";
  const pct = val * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}
