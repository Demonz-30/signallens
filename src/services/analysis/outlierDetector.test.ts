import { describe, it, expect } from "vitest";
import { computeAnnualRevenueGrowth } from "./revenueGrowth";
import { detectRevenueGrowthOutlier } from "./outlierDetector";
import { ComparabilityStatus } from "@/domain";
import {
  MOCK_BANKS_DATA,
  MOCK_CONSUMER_DATA,
  MOCK_MISMATCH_DATA,
  MOCK_CORRUPT_DATA,
} from "@/fixtures";

describe("Deterministic Revenue Growth Calculation", () => {
  it("calculates normal positive annual revenue growth correctly", () => {
    const records = [
      { year: 2023, revenue: 100 },
      { year: 2024, revenue: 125 },
    ];
    const result = computeAnnualRevenueGrowth(records);
    expect(result.isValid).toBe(true);
    expect(result.growth).toBeCloseTo(0.25, 4); // 25% growth
    expect(result.periodLabel).toBe("FY2024 vs FY2023");
  });

  it("calculates negative revenue growth correctly", () => {
    const records = [
      { year: 2023, revenue: 200 },
      { year: 2024, revenue: 150 },
    ];
    const result = computeAnnualRevenueGrowth(records);
    expect(result.isValid).toBe(true);
    expect(result.growth).toBeCloseTo(-0.25, 4); // -25% contraction
  });

  it("handles zero or negative prior revenue without division by zero", () => {
    const zeroPrior = [
      { year: 2023, revenue: 0 },
      { year: 2024, revenue: 100 },
    ];
    const resZero = computeAnnualRevenueGrowth(zeroPrior);
    expect(resZero.isValid).toBe(false);
    expect(resZero.growth).toBeNull();
    expect(resZero.reason).toContain("non-positive");

    const negPrior = [
      { year: 2023, revenue: -50 },
      { year: 2024, revenue: 100 },
    ];
    const resNeg = computeAnnualRevenueGrowth(negPrior);
    expect(resNeg.isValid).toBe(false);
    expect(resNeg.growth).toBeNull();
  });

  it("handles missing or null revenue records safely", () => {
    const nullRevenue = [
      { year: 2023, revenue: null },
      { year: 2024, revenue: 100 },
    ];
    const result = computeAnnualRevenueGrowth(nullRevenue);
    expect(result.isValid).toBe(false);
    expect(result.growth).toBeNull();
    expect(result.reason).toContain("null or missing");
  });

  it("handles non-consecutive years", () => {
    const nonConsecutive = [
      { year: 2021, revenue: 100 },
      { year: 2024, revenue: 150 },
    ];
    const result = computeAnnualRevenueGrowth(nonConsecutive);
    expect(result.isValid).toBe(false);
    expect(result.growth).toBeNull();
  });
});

describe("Deterministic Outlier Detection Engine", () => {
  it("detects a clear outlier in banking peer group (BBCA vs peers)", () => {
    const target = MOCK_BANKS_DATA.BBCA;
    const peers = [
      MOCK_BANKS_DATA.BBRI,
      MOCK_BANKS_DATA.BMRI,
      MOCK_BANKS_DATA.BBNI,
      MOCK_BANKS_DATA.BBTN,
    ];

    const result = detectRevenueGrowthOutlier(target, peers);

    expect(result.hasOutlier).toBe(true);
    expect(result.isHighOutlier).toBe(true);
    expect(result.isLowOutlier).toBe(false);
    expect(result.targetSymbol).toBe("BBCA");
    expect(result.targetValue).toBeCloseTo(0.25, 2);
    expect(result.peerMedian).toBeCloseTo(0.0775, 2);
    expect(result.deviationFromMedian).toBeGreaterThan(0.15); // >15% higher than peers
    expect(result.comparability).toBe(ComparabilityStatus.ALIGNED);
  });

  it("reports no material outlier when peers are tightly clustered (Consumer staples)", () => {
    const target = MOCK_CONSUMER_DATA.ICBP;
    const peers = [
      MOCK_CONSUMER_DATA.INDF,
      MOCK_CONSUMER_DATA.MYOR,
      MOCK_CONSUMER_DATA.CMRY,
      MOCK_CONSUMER_DATA.UNVR,
    ];

    const result = detectRevenueGrowthOutlier(target, peers);

    expect(result.hasOutlier).toBe(false);
    expect(result.isHighOutlier).toBe(false);
    expect(result.isLowOutlier).toBe(false);
  });

  it("handles reporting period mismatch properly", () => {
    const target = MOCK_MISMATCH_DATA.TECH_A; // Only 2022-2023
    const peers = [
      MOCK_MISMATCH_DATA.PEER_B, // 2023-2024
      MOCK_MISMATCH_DATA.PEER_C, // 2023-2024
      MOCK_MISMATCH_DATA.PEER_D, // 2023-2024
    ];

    const result = detectRevenueGrowthOutlier(target, peers);

    expect(result.hasOutlier).toBe(false);
    expect(result.comparability).toBe(ComparabilityStatus.MISMATCHED_PERIODS);
    expect(result.comparabilityDetails).toContain("Insufficient aligned peers");
  });

  it("handles insufficient peer sample size (< minPeers)", () => {
    const target = MOCK_BANKS_DATA.BBCA;
    const onlyOnePeer = [MOCK_BANKS_DATA.BBRI];

    const result = detectRevenueGrowthOutlier(target, onlyOnePeer, { minPeers: 2 });

    expect(result.hasOutlier).toBe(false);
    expect(result.comparabilityDetails).toContain("minimum required is 2");
  });

  it("handles corrupt/missing target company revenue", () => {
    const corruptTarget = MOCK_CORRUPT_DATA.CORRUPT_A;
    const peers = [
      MOCK_CORRUPT_DATA.PEER_X,
      MOCK_CORRUPT_DATA.PEER_Y,
      MOCK_CORRUPT_DATA.PEER_Z,
    ];

    const result = detectRevenueGrowthOutlier(corruptTarget, peers);

    expect(result.hasOutlier).toBe(false);
    expect(result.comparability).toBe(ComparabilityStatus.MISSING_DATA);
    expect(result.warning).toBeDefined();
  });
});
