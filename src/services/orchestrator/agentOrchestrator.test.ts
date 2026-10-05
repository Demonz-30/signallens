import { describe, it, expect } from "vitest";
import { AgentOrchestrator } from "./agentOrchestrator";
import { SectorsMockAdapter } from "@/adapters/sectors";
import { NeutralClassification, DataSourceMode } from "@/domain";
import { DEMO_SCENARIOS } from "@/fixtures";

describe("Agent Orchestrator Lifecycle", () => {
  const adapter = new SectorsMockAdapter();
  const orchestrator = new AgentOrchestrator(adapter);

  it("executes primary banking demo scenario to PERSISTENT_DIFFERENCE", async () => {
    const scenario = DEMO_SCENARIOS.killer_demo;
    const result = await orchestrator.runInvestigation({
      targetSymbol: scenario.targetSymbol,
      peerSymbols: scenario.peerSymbols,
    });

    expect(result.investigationId).toMatch(/^inv_/);
    expect(result.classification).toBe(NeutralClassification.PERSISTENT_DIFFERENCE);
    expect(result.sourceMode).toBe(DataSourceMode.MOCK);
    expect(result.outlierResult.hasOutlier).toBe(true);
    expect(result.evidenceLedger.length).toBeGreaterThanOrEqual(2);
    expect(result.trace.length).toBeGreaterThanOrEqual(7);
    expect(result.disclaimer).toContain("Strictly NOT financial advice");
    expect(result.limitations.length).toBeGreaterThan(0);
    expect(result.unresolvedQuestions.length).toBeGreaterThan(0);
  });

  it("executes consumer scenario to NO_MATERIAL_OUTLIER", async () => {
    const scenario = DEMO_SCENARIOS.no_outlier;
    const result = await orchestrator.runInvestigation({
      targetSymbol: scenario.targetSymbol,
      peerSymbols: scenario.peerSymbols,
    });

    expect(result.classification).toBe(NeutralClassification.NO_MATERIAL_OUTLIER);
    expect(result.outlierResult.hasOutlier).toBe(false);
    expect(result.stopReason).toBe("no_material_outlier_detected");
  });

  it("executes period mismatch scenario to INCOMPARABLE_DATA", async () => {
    const scenario = DEMO_SCENARIOS.period_mismatch;
    const result = await orchestrator.runInvestigation({
      targetSymbol: scenario.targetSymbol,
      peerSymbols: scenario.peerSymbols,
    });

    expect(result.classification).toBe(NeutralClassification.INCOMPARABLE_DATA);
    expect(result.stopReason).toBe("period_comparability_failed");
  });

  it("executes corrupt/missing data scenario to DATA_QUALITY_RISK", async () => {
    const scenario = DEMO_SCENARIOS.data_quality;
    const result = await orchestrator.runInvestigation({
      targetSymbol: scenario.targetSymbol,
      peerSymbols: scenario.peerSymbols,
    });

    expect(result.classification).toBe(NeutralClassification.DATA_QUALITY_RISK);
    expect(result.stopReason).toBe("data_quality_compromised");
  });

  it("rejects malformed requests", async () => {
    await expect(
      orchestrator.runInvestigation({
        targetSymbol: "",
        peerSymbols: ["BBRI"],
      })
    ).rejects.toThrow("Target company symbol is required");

    await expect(
      orchestrator.runInvestigation({
        targetSymbol: "BBCA",
        peerSymbols: [],
      })
    ).rejects.toThrow("At least one peer company symbol is required");

    await expect(
      orchestrator.runInvestigation({
        targetSymbol: "BBCA",
        peerSymbols: ["BBCA", "BBRI"],
      })
    ).rejects.toThrow("Target company symbol cannot also be listed in peer group");
  });
});
