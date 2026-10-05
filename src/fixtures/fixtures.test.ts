import { describe, it, expect } from "vitest";
import {
  MOCK_BANKS_DATA,
  MOCK_CONSUMER_DATA,
  MOCK_MISMATCH_DATA,
  MOCK_CORRUPT_DATA,
} from "./mockData";
import { DEMO_SCENARIOS, getMockFundamentalData } from "./scenarios";
import { DataSourceMode, NeutralClassification } from "@/domain";

describe("Mock Data Fixture Layer", () => {
  it("marks all fixtures with explicit DataSourceMode.MOCK", () => {
    Object.values(MOCK_BANKS_DATA).forEach((company) => {
      expect(company.sourceMode).toBe(DataSourceMode.MOCK);
    });
    Object.values(MOCK_CONSUMER_DATA).forEach((company) => {
      expect(company.sourceMode).toBe(DataSourceMode.MOCK);
    });
    Object.values(MOCK_MISMATCH_DATA).forEach((company) => {
      expect(company.sourceMode).toBe(DataSourceMode.MOCK);
    });
    Object.values(MOCK_CORRUPT_DATA).forEach((company) => {
      expect(company.sourceMode).toBe(DataSourceMode.MOCK);
    });
  });

  it("provides complete banking peer data for killer demo scenario", () => {
    const killerScenario = DEMO_SCENARIOS.killer_demo;
    expect(killerScenario).toBeDefined();
    expect(killerScenario.expectedClassification).toBe(
      NeutralClassification.PERSISTENT_DIFFERENCE
    );

    const target = getMockFundamentalData(killerScenario.targetSymbol);
    expect(target).not.toBeNull();
    expect(target?.symbol).toBe("BBCA");
    expect(target?.historicalFinancials.length).toBeGreaterThanOrEqual(2);

    killerScenario.peerSymbols.forEach((peerSym) => {
      const peer = getMockFundamentalData(peerSym);
      expect(peer).not.toBeNull();
      expect(peer?.historicalFinancials.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("contains scenario with missing period alignment", () => {
    const tech = getMockFundamentalData("TECH_A");
    expect(tech?.historicalFinancials.some((f) => f.year === 2024)).toBe(false);
  });

  it("contains scenario with null revenue for data quality testing", () => {
    const corrupt = getMockFundamentalData("CORRUPT_A");
    const record2023 = corrupt?.historicalFinancials.find((f) => f.year === 2023);
    expect(record2023?.revenue).toBeNull();
  });
});
