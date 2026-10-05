import { describe, it, expect } from "vitest";
import { determineClassification } from "./classifier";
import {
  ComparabilityStatus,
  ConfidenceLevel,
  Hypothesis,
  HypothesisStatus,
  NeutralClassification,
  OutlierResult,
} from "@/domain";

describe("Neutral Classification Engine", () => {
  it("Path 1: Classifies DATA_QUALITY_RISK when data is missing or corrupt", () => {
    const outlierResult: OutlierResult = {
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
      comparabilityDetails: "Missing revenue line items",
    };

    const decision = determineClassification(outlierResult, [], []);
    expect(decision.classification).toBe(NeutralClassification.DATA_QUALITY_RISK);
    expect(decision.confidence).toBe(ConfidenceLevel.HIGH);
    expect(decision.stopReason).toBe("data_quality_compromised");
  });

  it("Path 2: Classifies INCOMPARABLE_DATA when periods are mismatched", () => {
    const outlierResult: OutlierResult = {
      hasOutlier: false,
      targetSymbol: "TECH_A",
      targetValue: 0.2,
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
      comparability: ComparabilityStatus.MISMATCHED_PERIODS,
      comparabilityDetails: "Target lacks 2024 period alignment",
    };

    const decision = determineClassification(outlierResult, [], []);
    expect(decision.classification).toBe(NeutralClassification.INCOMPARABLE_DATA);
    expect(decision.confidence).toBe(ConfidenceLevel.HIGH);
    expect(decision.stopReason).toBe("period_comparability_failed");
  });

  it("Path 3: Classifies NO_MATERIAL_OUTLIER when no outlier exists", () => {
    const outlierResult: OutlierResult = {
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
      comparabilityDetails: "Aligned on FY2024",
    };

    const decision = determineClassification(outlierResult, [], []);
    expect(decision.classification).toBe(NeutralClassification.NO_MATERIAL_OUTLIER);
    expect(decision.confidence).toBe(ConfidenceLevel.HIGH);
    expect(decision.stopReason).toBe("no_material_outlier_detected");
  });

  it("Path 4: Classifies PERSISTENT_DIFFERENCE when operational hypothesis is supported and one-off rejected", () => {
    const outlierResult: OutlierResult = {
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
      zScore: 3.2,
      isHighOutlier: true,
      isLowOutlier: false,
      comparability: ComparabilityStatus.ALIGNED,
      comparabilityDetails: "Aligned periods",
    };

    const hypotheses: Hypothesis[] = [
      {
        id: "HYP_ONE_OFF",
        category: "ONE_OFF_FINANCIAL_EVENT",
        title: "One-Off Gain",
        description: "",
        whyPlausible: "",
        requiredEvidence: "",
        status: HypothesisStatus.REJECTED,
        supportingEvidenceIds: [],
        weakeningEvidenceIds: ["EV_001"],
      },
      {
        id: "HYP_PERSISTENT",
        category: "PERSISTENT_OPERATIONAL_DIFFERENCE",
        title: "Persistent Operational Divergence",
        description: "",
        whyPlausible: "",
        requiredEvidence: "",
        status: HypothesisStatus.SUPPORTED,
        supportingEvidenceIds: ["EV_002"],
        weakeningEvidenceIds: [],
      },
    ];

    const decision = determineClassification(outlierResult, hypotheses, []);
    expect(decision.classification).toBe(NeutralClassification.PERSISTENT_DIFFERENCE);
    expect(decision.confidence).toBe(ConfidenceLevel.HIGH);
    expect(decision.stopReason).toBe("evidence_sufficiently_supports_persistent_difference");
  });

  it("Path 5: Classifies INSUFFICIENT_EVIDENCE when outlier exists but evidence remains inconclusive", () => {
    const outlierResult: OutlierResult = {
      hasOutlier: true,
      targetSymbol: "MYSTERIOUS_CO",
      targetValue: 0.4,
      peerValues: [{ symbol: "P1", value: 0.1 }],
      peerMedian: 0.1,
      peerMean: 0.1,
      peerMin: 0.08,
      peerMax: 0.12,
      peerStdDev: 0.02,
      deviationFromMedian: 0.3,
      zScore: 3.0,
      isHighOutlier: true,
      isLowOutlier: false,
      comparability: ComparabilityStatus.ALIGNED,
      comparabilityDetails: "Aligned periods",
    };

    const hypotheses: Hypothesis[] = [
      {
        id: "HYP_ONE_OFF",
        category: "ONE_OFF_FINANCIAL_EVENT",
        title: "One-Off Gain",
        description: "",
        whyPlausible: "",
        requiredEvidence: "",
        status: HypothesisStatus.UNRESOLVED,
        supportingEvidenceIds: [],
        weakeningEvidenceIds: [],
      },
      {
        id: "HYP_PERSISTENT",
        category: "PERSISTENT_OPERATIONAL_DIFFERENCE",
        title: "Persistent Operational Divergence",
        description: "",
        whyPlausible: "",
        requiredEvidence: "",
        status: HypothesisStatus.UNRESOLVED,
        supportingEvidenceIds: [],
        weakeningEvidenceIds: [],
      },
    ];

    const decision = determineClassification(outlierResult, hypotheses, []);
    expect(decision.classification).toBe(NeutralClassification.INSUFFICIENT_EVIDENCE);
    expect(decision.confidence).toBe(ConfidenceLevel.LOW);
    expect(decision.stopReason).toBe("insufficient_discriminating_evidence");
  });

  describe("Regression Hardening — Epistemic Boundaries & Falsification", () => {
    const baseOutlier: OutlierResult = {
      hasOutlier: true,
      targetSymbol: "TEST_SYM",
      targetValue: 0.35,
      peerValues: [
        { symbol: "P1", value: 0.05 },
        { symbol: "P2", value: 0.06 },
      ],
      peerMedian: 0.055,
      peerMean: 0.055,
      peerMin: 0.05,
      peerMax: 0.06,
      peerStdDev: 0.007,
      deviationFromMedian: 0.295,
      zScore: 3.5,
      isHighOutlier: true,
      isLowOutlier: false,
      comparability: ComparabilityStatus.ALIGNED,
      comparabilityDetails: "Aligned on FY2024",
    };

    it("Regression 1: Persistence not proven MUST NOT become PERSISTENT_DIFFERENCE", () => {
      // Even if one-off is rejected, if persistent execution is inconclusive, cannot claim persistent difference
      const hypotheses: Hypothesis[] = [
        {
          id: "HYP_ONE_OFF",
          category: "ONE_OFF_FINANCIAL_EVENT",
          title: "One-Off",
          description: "",
          whyPlausible: "",
          requiredEvidence: "",
          status: HypothesisStatus.REJECTED,
          supportingEvidenceIds: [],
          weakeningEvidenceIds: ["EV_001"],
        },
        {
          id: "HYP_PERSISTENT",
          category: "PERSISTENT_OPERATIONAL_DIFFERENCE",
          title: "Persistent",
          description: "",
          whyPlausible: "",
          requiredEvidence: "",
          status: HypothesisStatus.UNRESOLVED,
          supportingEvidenceIds: [],
          weakeningEvidenceIds: [],
        },
      ];

      const decision = determineClassification(baseOutlier, hypotheses, []);
      expect(decision.classification).not.toBe(NeutralClassification.PERSISTENT_DIFFERENCE);
      expect(decision.classification).toBe(NeutralClassification.INSUFFICIENT_EVIDENCE);
      expect(decision.confidence).toBe(ConfidenceLevel.LOW);
    });

    it("Regression 2: One-off financial event not rejected MUST NOT become PERSISTENT_DIFFERENCE", () => {
      // Even if persistent difference looks supported, if one-off is NOT rejected, cannot claim persistent difference
      const hypotheses: Hypothesis[] = [
        {
          id: "HYP_ONE_OFF",
          category: "ONE_OFF_FINANCIAL_EVENT",
          title: "One-Off",
          description: "",
          whyPlausible: "",
          requiredEvidence: "",
          status: HypothesisStatus.UNRESOLVED,
          supportingEvidenceIds: [],
          weakeningEvidenceIds: [],
        },
        {
          id: "HYP_PERSISTENT",
          category: "PERSISTENT_OPERATIONAL_DIFFERENCE",
          title: "Persistent",
          description: "",
          whyPlausible: "",
          requiredEvidence: "",
          status: HypothesisStatus.SUPPORTED,
          supportingEvidenceIds: ["EV_002"],
          weakeningEvidenceIds: [],
        },
      ];

      const decision = determineClassification(baseOutlier, hypotheses, []);
      expect(decision.classification).not.toBe(NeutralClassification.PERSISTENT_DIFFERENCE);
      expect(decision.classification).toBe(NeutralClassification.INSUFFICIENT_EVIDENCE);
    });

    it("Regression 3: Unsupported BUSINESS_MIX_DIVERGENCE MUST NOT be treated as proof for PERSISTENT_DIFFERENCE", () => {
      // If only business mix is marked supported (without verified operational persistence), classifier must not emit PERSISTENT_DIFFERENCE
      const hypotheses: Hypothesis[] = [
        {
          id: "HYP_ONE_OFF",
          category: "ONE_OFF_FINANCIAL_EVENT",
          title: "One-Off",
          description: "",
          whyPlausible: "",
          requiredEvidence: "",
          status: HypothesisStatus.REJECTED,
          supportingEvidenceIds: [],
          weakeningEvidenceIds: ["EV_001"],
        },
        {
          id: "HYP_BUSINESS_MIX",
          category: "BUSINESS_MIX_DIVERGENCE",
          title: "Business Mix",
          description: "",
          whyPlausible: "",
          requiredEvidence: "",
          status: HypothesisStatus.SUPPORTED,
          supportingEvidenceIds: ["EV_003"],
          weakeningEvidenceIds: [],
        },
        {
          id: "HYP_PERSISTENT",
          category: "PERSISTENT_OPERATIONAL_DIFFERENCE",
          title: "Persistent",
          description: "",
          whyPlausible: "",
          requiredEvidence: "",
          status: HypothesisStatus.UNRESOLVED,
          supportingEvidenceIds: [],
          weakeningEvidenceIds: [],
        },
      ];

      const decision = determineClassification(baseOutlier, hypotheses, []);
      expect(decision.classification).not.toBe(NeutralClassification.PERSISTENT_DIFFERENCE);
      expect(decision.classification).toBe(NeutralClassification.INSUFFICIENT_EVIDENCE);
    });
  });
});

