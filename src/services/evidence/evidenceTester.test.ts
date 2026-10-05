import { describe, it, expect } from "vitest";
import { testHypothesesWithEvidence } from "./evidenceTester";
import {
  MOCK_BANKS_DATA,
  MOCK_MISMATCH_DATA,
} from "@/fixtures";
import { detectRevenueGrowthOutlier } from "@/services/analysis";
import { DeterministicHypothesisGenerator } from "@/services/hypotheses";
import {
  EvidenceVerdict,
  HypothesisStatus,
} from "@/domain";

describe("Evidence Testing Engine", () => {
  const hypEngine = new DeterministicHypothesisGenerator();

  it("tests and rejects one-off hypothesis while supporting persistent difference for BBCA", async () => {
    const target = MOCK_BANKS_DATA.BBCA;
    const peers = [
      MOCK_BANKS_DATA.BBRI,
      MOCK_BANKS_DATA.BMRI,
      MOCK_BANKS_DATA.BBNI,
      MOCK_BANKS_DATA.BBTN,
    ];

    const outlierResult = detectRevenueGrowthOutlier(target, peers);
    const hypotheses = await hypEngine.generateHypotheses(outlierResult);

    const { testedHypotheses, evidenceItems } = testHypothesesWithEvidence(
      hypotheses,
      outlierResult,
      target,
      peers
    );

    expect(evidenceItems.length).toBeGreaterThanOrEqual(2);

    // Provenance must be intact
    evidenceItems.forEach((ev) => {
      expect(ev.id).toMatch(/^EV_\d+$/);
      expect(ev.source).toBeDefined();
      expect(ev.timestamp).toBeDefined();
      expect(ev.endpointOrTool).toBeDefined();
    });

    const oneOffHyp = testedHypotheses.find((h) => h.category === "ONE_OFF_FINANCIAL_EVENT");
    expect(oneOffHyp).toBeDefined();
    expect(oneOffHyp?.status).toBe(HypothesisStatus.REJECTED);

    const persistentHyp = testedHypotheses.find(
      (h) => h.category === "PERSISTENT_OPERATIONAL_DIFFERENCE"
    );
    expect(persistentHyp).toBeDefined();
    expect(persistentHyp?.status).toBe(HypothesisStatus.SUPPORTED);
  });

  it("tests and supports period mismatch hypothesis when data is misaligned", async () => {
    const target = MOCK_MISMATCH_DATA.TECH_A;
    const peers = [
      MOCK_MISMATCH_DATA.PEER_B,
      MOCK_MISMATCH_DATA.PEER_C,
      MOCK_MISMATCH_DATA.PEER_D,
    ];

    const outlierResult = detectRevenueGrowthOutlier(target, peers);
    const hypotheses = await hypEngine.generateHypotheses(outlierResult);

    const { testedHypotheses, evidenceItems } = testHypothesesWithEvidence(
      hypotheses,
      outlierResult,
      target,
      peers
    );

    const periodHyp = testedHypotheses.find((h) => h.category === "REPORTING_PERIOD_MISMATCH");
    expect(periodHyp).toBeDefined();
    expect(periodHyp?.status).toBe(HypothesisStatus.SUPPORTED);

    const periodEv = evidenceItems.find((e) => e.targetHypothesisId === periodHyp?.id);
    expect(periodEv?.verdict).toBe(EvidenceVerdict.SUPPORTED);
  });

  it("compiles structured evidence ledger entries with full provenance and confidence", async () => {
    const target = MOCK_BANKS_DATA.BBCA;
    const peers = [
      MOCK_BANKS_DATA.BBRI,
      MOCK_BANKS_DATA.BMRI,
      MOCK_BANKS_DATA.BBNI,
      MOCK_BANKS_DATA.BBTN,
    ];

    const outlierResult = detectRevenueGrowthOutlier(target, peers);
    const hypotheses = await hypEngine.generateHypotheses(outlierResult);
    const { testedHypotheses, evidenceItems } = testHypothesesWithEvidence(
      hypotheses,
      outlierResult,
      target,
      peers
    );

    const ledger = (await import("./evidenceLedger")).compileEvidenceLedger(
      evidenceItems,
      testedHypotheses
    );

    expect(ledger.length).toBe(evidenceItems.length);
    ledger.forEach((entry, idx) => {
      expect(entry.stepIndex).toBe(idx + 1);
      expect(entry.evidenceId).toBeDefined();
      expect(entry.hypothesisTitle).toBeDefined();
      expect(entry.sourceDataProvenance).toContain("Sectors");
      expect(entry.confidence).toBeDefined();
      expect(entry.remainingUncertainty).toBeDefined();
    });
  });

  describe("Regression Hardening — Evidence Falsification & Multi-Year Verification", () => {
    it("Regression: Unsupported BUSINESS_MIX_DIVERGENCE is strictly INCONCLUSIVE / UNRESOLVED", async () => {
      const target = MOCK_BANKS_DATA.BBCA;
      const peers = [
        MOCK_BANKS_DATA.BBRI,
        MOCK_BANKS_DATA.BMRI,
        MOCK_BANKS_DATA.BBNI,
        MOCK_BANKS_DATA.BBTN,
      ];

      const outlierResult = detectRevenueGrowthOutlier(target, peers);
      const hypotheses = await hypEngine.generateHypotheses(outlierResult);
      const { testedHypotheses, evidenceItems } = testHypothesesWithEvidence(
        hypotheses,
        outlierResult,
        target,
        peers
      );

      const businessMixHyp = testedHypotheses.find((h) => h.category === "BUSINESS_MIX_DIVERGENCE");
      expect(businessMixHyp).toBeDefined();
      expect(businessMixHyp?.status).toBe(HypothesisStatus.UNRESOLVED);

      const businessMixEv = evidenceItems.find((e) => e.targetHypothesisId === businessMixHyp?.id);
      expect(businessMixEv?.verdict).toBe(EvidenceVerdict.INCONCLUSIVE);
      expect(businessMixEv?.rationale).toContain("granular segment disclosures");
    });

    it("Regression: Fluctuating / non-consecutive multi-year revenue leaves PERSISTENT_OPERATIONAL_DIFFERENCE as INCONCLUSIVE", async () => {
      // Simulate target with dip in prior year: 100 -> 80 -> 120 (rebound, not consecutive expansion)
      const fluctuatingTarget = {
        ...MOCK_BANKS_DATA.BBCA,
        historicalFinancials: [
          { year: 2022, revenue: 100_000_000, earnings: 40_000_000 },
          { year: 2023, revenue: 80_000_000, earnings: 35_000_000 }, // dip
          { year: 2024, revenue: 120_000_000, earnings: 55_000_000 }, // rebound (+50%)
        ],
      };
      const peers = [
        MOCK_BANKS_DATA.BBRI,
        MOCK_BANKS_DATA.BMRI,
        MOCK_BANKS_DATA.BBNI,
        MOCK_BANKS_DATA.BBTN,
      ];

      const outlierResult = detectRevenueGrowthOutlier(fluctuatingTarget, peers);
      const hypotheses = await hypEngine.generateHypotheses(outlierResult);
      const { testedHypotheses, evidenceItems } = testHypothesesWithEvidence(
        hypotheses,
        outlierResult,
        fluctuatingTarget,
        peers
      );

      const persistentHyp = testedHypotheses.find(
        (h) => h.category === "PERSISTENT_OPERATIONAL_DIFFERENCE"
      );
      expect(persistentHyp).toBeDefined();
      expect(persistentHyp?.status).toBe(HypothesisStatus.UNRESOLVED);

      const persistentEv = evidenceItems.find((e) => e.targetHypothesisId === persistentHyp?.id);
      expect(persistentEv?.verdict).toBe(EvidenceVerdict.INCONCLUSIVE);
      expect(persistentEv?.rationale).toContain("Cannot confirm multi-year operational persistence");
    });
  });
});

