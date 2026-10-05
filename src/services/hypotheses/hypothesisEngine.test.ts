import { describe, it, expect } from "vitest";
import { DeterministicHypothesisGenerator } from "./hypothesisEngine";
import {
  ComparabilityStatus,
  HypothesisStatus,
  OutlierResult,
} from "@/domain";

describe("Deterministic Hypothesis Generation Engine", () => {
  const engine = new DeterministicHypothesisGenerator();

  it("generates period mismatch hypothesis when comparability is MISMATCHED_PERIODS", async () => {
    const result: OutlierResult = {
      hasOutlier: false,
      targetSymbol: "TECH_A",
      targetValue: 0.8,
      peerValues: [],
      peerMedian: 0.1,
      peerMean: 0.1,
      peerMin: 0.08,
      peerMax: 0.12,
      peerStdDev: 0.02,
      deviationFromMedian: 0.7,
      zScore: 3.5,
      isHighOutlier: false,
      isLowOutlier: false,
      comparability: ComparabilityStatus.MISMATCHED_PERIODS,
      comparabilityDetails: "Fiscal period mismatch",
    };

    const hypotheses = await engine.generateHypotheses(result);
    expect(hypotheses.length).toBeGreaterThan(0);
    expect(hypotheses[0].category).toBe("REPORTING_PERIOD_MISMATCH");
    expect(hypotheses[0].status).toBe(HypothesisStatus.PENDING);
    expect(hypotheses[0].title).toContain("Period");
  });

  it("generates data quality hypothesis when revenue data is missing/null", async () => {
    const result: OutlierResult = {
      hasOutlier: false,
      targetSymbol: "CORRUPT_A",
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
      comparability: ComparabilityStatus.MISSING_DATA,
      comparabilityDetails: "Target company metric calculation failed",
    };

    const hypotheses = await engine.generateHypotheses(result);
    expect(hypotheses.length).toBe(1);
    expect(hypotheses[0].category).toBe("DATA_QUALITY_ISSUE");
    expect(hypotheses[0].status).toBe(HypothesisStatus.PENDING);
  });

  it("generates uniform distribution hypothesis when no material outlier exists", async () => {
    const result: OutlierResult = {
      hasOutlier: false,
      targetSymbol: "ICBP",
      targetValue: 0.056,
      peerValues: [{ symbol: "INDF", value: 0.053 }],
      peerMedian: 0.055,
      peerMean: 0.055,
      peerMin: 0.051,
      peerMax: 0.059,
      peerStdDev: 0.003,
      deviationFromMedian: 0.001,
      zScore: 0.33,
      isHighOutlier: false,
      isLowOutlier: false,
      comparability: ComparabilityStatus.ALIGNED,
      comparabilityDetails: "Aligned periods",
    };

    const hypotheses = await engine.generateHypotheses(result);
    expect(hypotheses.length).toBe(1);
    expect(hypotheses[0].category).toBe("PERSISTENT_OPERATIONAL_DIFFERENCE");
    expect(hypotheses[0].title).toContain("Consistent Peer Group");
  });

  it("generates ranked falsifiable hypotheses when a clear outlier is detected", async () => {
    const result: OutlierResult = {
      hasOutlier: true,
      targetSymbol: "BBCA",
      targetValue: 0.25,
      peerValues: [
        { symbol: "BBRI", value: 0.08 },
        { symbol: "BMRI", value: 0.085 },
      ],
      peerMedian: 0.08,
      peerMean: 0.08,
      peerMin: 0.06,
      peerMax: 0.085,
      peerStdDev: 0.01,
      deviationFromMedian: 0.17,
      zScore: 2.8,
      isHighOutlier: true,
      isLowOutlier: false,
      comparability: ComparabilityStatus.ALIGNED,
      comparabilityDetails: "Target and peers aligned on FY2024 vs FY2023",
    };

    const hypotheses = await engine.generateHypotheses(result);
    expect(hypotheses.length).toBe(3);

    // All must start in PENDING status, never presented as confirmed fact
    hypotheses.forEach((h) => {
      expect(h.status).toBe(HypothesisStatus.PENDING);
      expect(h.requiredEvidence).toBeDefined();
      expect(h.whyPlausible).toBeDefined();
    });

    const categories = hypotheses.map((h) => h.category);
    expect(categories).toContain("ONE_OFF_FINANCIAL_EVENT");
    expect(categories).toContain("BUSINESS_MIX_DIVERGENCE");
    expect(categories).toContain("PERSISTENT_OPERATIONAL_DIFFERENCE");
  });
});
