import {
  MOCK_BANKS_DATA,
  MOCK_CONSUMER_DATA,
  MOCK_MISMATCH_DATA,
  MOCK_CORRUPT_DATA,
} from "./mockData";
import { NeutralClassification } from "@/domain";

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  targetSymbol: string;
  peerSymbols: string[];
  expectedClassification: NeutralClassification;
  highlightNote: string;
}

export const DEMO_SCENARIOS: Record<string, DemoScenario> = {
  killer_demo: {
    id: "killer_demo",
    name: "Primary Demo: Indonesian Big Banks (BBCA vs BBRI, BMRI, BBNI, BBTN)",
    description: "BBCA reports ~25% revenue growth vs peer median ~8%. Agent tests reporting periods, one-off gains, and persistent operational factors.",
    targetSymbol: "BBCA",
    peerSymbols: ["BBRI", "BMRI", "BBNI", "BBTN"],
    expectedClassification: NeutralClassification.PERSISTENT_DIFFERENCE,
    highlightNote: "Deterministic calculation reveals true outlier; evidence verifies organic transaction fees rather than inorganic M&A.",
  },
  no_outlier: {
    id: "no_outlier",
    name: "Uniform Peer Group: Consumer Staples (ICBP vs INDF, MYOR, CMRY, UNVR)",
    description: "All companies report steady 5.1%–5.9% revenue growth with no meaningful deviation.",
    targetSymbol: "ICBP",
    peerSymbols: ["INDF", "MYOR", "CMRY", "UNVR"],
    expectedClassification: NeutralClassification.NO_MATERIAL_OUTLIER,
    highlightNote: "Agent stops immediately with NO_MATERIAL_OUTLIER without inventing unnecessary speculative stories.",
  },
  period_mismatch: {
    id: "period_mismatch",
    name: "Reporting Period Mismatch (TECH_A vs PEER_B, PEER_C, PEER_D)",
    description: "Subject company lacks 2024 reporting period alignment against peers.",
    targetSymbol: "TECH_A",
    peerSymbols: ["PEER_B", "PEER_C", "PEER_D"],
    expectedClassification: NeutralClassification.INCOMPARABLE_DATA,
    highlightNote: "Agent prevents forced comparison across misaligned fiscal periods and flags INCOMPARABLE_DATA.",
  },
  data_quality: {
    id: "data_quality",
    name: "Data Quality Issue: Missing Values (CORRUPT_A vs PEER_X, PEER_Y, PEER_Z)",
    description: "Historical financials contain null revenue, preventing reliable rate-of-change calculation.",
    targetSymbol: "CORRUPT_A",
    peerSymbols: ["PEER_X", "PEER_Y", "PEER_Z"],
    expectedClassification: NeutralClassification.DATA_QUALITY_RISK,
    highlightNote: "Agent identifies corrupted/null records instead of silently coercing them to zero or fabricating numbers.",
  },
};

/**
 * Universal lookup helper for fixtures by symbol across all scenarios.
 */
export function getMockFundamentalData(symbol: string) {
  const allMocks = {
    ...MOCK_BANKS_DATA,
    ...MOCK_CONSUMER_DATA,
    ...MOCK_MISMATCH_DATA,
    ...MOCK_CORRUPT_DATA,
  };
  return allMocks[symbol] || null;
}
