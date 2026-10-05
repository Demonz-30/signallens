import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  OpenAIResponsesClient,
  executeAllowlistedTool,
  CognitiveInvestigationLoop,
  isAllowlistedTool,
} from "./index";
import {
  ComparabilityStatus,
  DataSourceMode,
  EvidenceVerdict,
  HypothesisStatus,
  OutlierResult,
  CompanyFundamentalData,
} from "@/domain";
import { SectorsMockAdapter } from "@/adapters/sectors";
import { AgentOrchestrator } from "@/services/orchestrator";

describe("OpenAI Responses Client & Protocol", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("reports unavailable if OPENAI_API_KEY is unset", () => {
    delete process.env.OPENAI_API_KEY;
    const client = new OpenAIResponsesClient();
    expect(client.isAvailable()).toBe(false);
  });

  it("reports available and uses configurable model when OPENAI_API_KEY is set", () => {
    process.env.OPENAI_API_KEY = "test-key-safe";
    process.env.OPENAI_MODEL = "gpt-4o-2024-08-06";
    const client = new OpenAIResponsesClient();
    expect(client.isAvailable()).toBe(true);
    expect(client.getModel()).toBe("gpt-4o-2024-08-06");
  });

  it("sends request with Bearer auth and strict schema to /responses endpoint", async () => {
    process.env.OPENAI_API_KEY = "sk-mock-key";
    process.env.OPENAI_MODEL = "gpt-4o";

    let capturedUrl = "";
    let capturedHeaders: Record<string, string> = {};
    let capturedBody: {
      model?: string;
      response_format?: {
        type?: string;
        json_schema?: {
          strict?: boolean;
        };
      };
    } | null = null;

    const mockFetch = vi.fn().mockImplementation(async (url, init) => {
      capturedUrl = url.toString();
      capturedHeaders = init.headers;
      capturedBody = JSON.parse(init.body);

      return {
        ok: true,
        json: async () => ({
          id: "resp_123",
          output: [
            {
              type: "message",
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: JSON.stringify({ status: "parsed_ok" }),
                },
              ],
            },
          ],
        }),
      };
    });

    vi.stubGlobal("fetch", mockFetch);

    const client = new OpenAIResponsesClient();
    const result = await client.generateStructuredResponse<{ status: string }>({
      schemaName: "test_schema",
      jsonSchema: { type: "object", properties: { status: { type: "string" } } },
      instructions: "Return test status",
      inputContent: "test input",
    });

    expect(capturedUrl).toBe("https://api.openai.com/v1/responses");
    expect(capturedHeaders["Authorization"]).toBe("Bearer sk-mock-key");
    expect(capturedBody).not.toBeNull();
    const body = capturedBody!;
    expect(body.model).toBe("gpt-4o");
    expect(body.response_format?.type).toBe("json_schema");
    expect(body.response_format?.json_schema?.strict).toBe(true);
    expect(result.success).toBe(true);
    expect(result.data?.status).toBe("parsed_ok");
  });

  it("safely handles HTTP errors without leaking keys", async () => {
    process.env.OPENAI_API_KEY = "super-secret-key-12345";

    const mockFetch = vi.fn().mockImplementation(async () => ({
      ok: false,
      status: 401,
      text: async () => "Unauthorized: invalid api key",
    }));

    vi.stubGlobal("fetch", mockFetch);

    const client = new OpenAIResponsesClient();
    const result = await client.generateStructuredResponse({
      schemaName: "test_schema",
      jsonSchema: {},
      instructions: "",
      inputContent: "",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("HTTP 401");
    expect(result.error).not.toContain("super-secret-key-12345");
  });
});

describe("Deterministic Evidence Tool Runner", () => {
  const dummyTarget: CompanyFundamentalData = {
    symbol: "TEST",
    name: "Test Corp",
    historicalFinancials: [
      { year: 2022, revenue: 100, earnings: 10 },
      { year: 2023, revenue: 120, earnings: 13 },
      { year: 2024, revenue: 150, earnings: 18 },
    ],
    yoyQuarterRevenueGrowth: 0.15,
    yoyQuarterEarningsGrowth: 0.2,
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: new Date().toISOString(),
  };

  const dummyPeers: CompanyFundamentalData[] = [
    {
      symbol: "PEER1",
      name: "Peer One",
      historicalFinancials: [
        { year: 2022, revenue: 90, earnings: 9 },
        { year: 2023, revenue: 95, earnings: 9.5 },
        { year: 2024, revenue: 100, earnings: 10 },
      ],
      sourceMode: DataSourceMode.MOCK,
      retrievedAt: new Date().toISOString(),
    },
  ];

  const dummyOutlier: OutlierResult = {
    hasOutlier: true,
    targetSymbol: "TEST",
    targetValue: 0.25,
    peerValues: [{ symbol: "PEER1", value: 0.05 }],
    peerMedian: 0.05,
    peerMean: 0.05,
    peerMin: 0.05,
    peerMax: 0.05,
    peerStdDev: 0,
    deviationFromMedian: 0.2,
    zScore: 3.5,
    isHighOutlier: true,
    isLowOutlier: false,
    comparability: ComparabilityStatus.ALIGNED,
    comparabilityDetails: "Periods aligned",
  };

  it("recognizes allowlisted tools", () => {
    expect(isAllowlistedTool("audit_operating_earnings")).toBe(true);
    expect(isAllowlistedTool("arbitrary_unauthorized_tool")).toBe(false);
  });

  it("executes verify_period_alignment deterministically", () => {
    const item = executeAllowlistedTool({
      toolName: "verify_period_alignment",
      targetHypothesisId: "HYP_01",
      targetData: dummyTarget,
      peersData: dummyPeers,
      outlierResult: dummyOutlier,
      evidenceId: "EV_001",
    });

    expect(item.id).toBe("EV_001");
    expect(item.verdict).toBe(EvidenceVerdict.WEAKENED);
    expect(item.endpointOrTool).toBe("verify_period_alignment");
  });

  it("executes audit_operating_earnings and weakens one-off when operational growth is strong", () => {
    const item = executeAllowlistedTool({
      toolName: "audit_operating_earnings",
      targetHypothesisId: "HYP_02",
      targetData: dummyTarget,
      peersData: dummyPeers,
      outlierResult: dummyOutlier,
      evidenceId: "EV_002",
    });

    expect(item.verdict).toBe(EvidenceVerdict.WEAKENED);
    expect(item.observation).toContain("net earnings expansion");
  });

  it("executes audit_multi_period_cagr and supports persistent difference on 3-year consecutive growth", () => {
    const item = executeAllowlistedTool({
      toolName: "audit_multi_period_cagr",
      targetHypothesisId: "HYP_03",
      targetData: dummyTarget,
      peersData: dummyPeers,
      outlierResult: dummyOutlier,
      evidenceId: "EV_003",
    });

    expect(item.verdict).toBe(EvidenceVerdict.SUPPORTED);
    expect(item.observation).toContain("consecutive expansion over 3 consecutive periods");
  });

  it("executes check_segment_disclosures and marks inconclusive due to absence of exchange footnotes", () => {
    const item = executeAllowlistedTool({
      toolName: "check_segment_disclosures",
      targetHypothesisId: "HYP_04",
      targetData: dummyTarget,
      peersData: dummyPeers,
      outlierResult: dummyOutlier,
      evidenceId: "EV_004",
    });

    expect(item.verdict).toBe(EvidenceVerdict.INCONCLUSIVE);
  });
});

describe("Bounded Two-Call Cognitive Investigation Loop", () => {
  beforeEach(() => {
    process.env.OPENAI_API_KEY = "test-api-key";
  });

  afterEach(() => {
    delete process.env.OPENAI_API_KEY;
    vi.restoreAllMocks();
  });

  it("executes bounded Call 1 -> Deterministic Tool -> Call 2 pipeline", async () => {
    let callCount = 0;

    const mockFetch = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        // Call 1: Hypothesize and Plan
        return {
          ok: true,
          json: async () => ({
            id: "resp_call_1",
            output: [
              {
                type: "message",
                role: "assistant",
                content: [
                  {
                    type: "text",
                    text: JSON.stringify({
                      hypotheses: [
                        {
                          id: "HYP_ONE_OFF",
                          category: "ONE_OFF_FINANCIAL_EVENT",
                          title: "One-Off Accounting Spike",
                          description: "Temporary paper gain",
                          whyPlausible: "Sudden spike",
                          targetToolExecution: "audit_operating_earnings",
                        },
                        {
                          id: "HYP_PERSISTENT",
                          category: "PERSISTENT_OPERATIONAL_DIFFERENCE",
                          title: "Multi-Year Execution",
                          description: "Sustained operational outperformance",
                          whyPlausible: "Strong consecutive growth",
                          targetToolExecution: "audit_multi_period_cagr",
                        },
                      ],
                      challengeQuestions: ["Did core earnings mirror top-line growth?"],
                      investigationStrategy: "Audit operating earnings and multi-year consistency",
                    }),
                  },
                ],
              },
            ],
          }),
        };
      } else {
        // Call 2: Challenge and Revise
        return {
          ok: true,
          json: async () => ({
            id: "resp_call_2",
            output: [
              {
                type: "message",
                role: "assistant",
                content: [
                  {
                    type: "text",
                    text: JSON.stringify({
                      hypothesisAssessments: [
                        {
                          hypothesisId: "HYP_ONE_OFF",
                          evaluatedEvidenceIds: ["EV_001"],
                          evidentiaryAssessment: "REFUTED_BY_EVIDENCE",
                          falsificationNotes: "Net earnings and quarterly momentum refute paper gain",
                        },
                        {
                          hypothesisId: "HYP_PERSISTENT",
                          evaluatedEvidenceIds: ["EV_002"],
                          evidentiaryAssessment: "STRONGLY_SUPPORTED",
                          falsificationNotes: "3-year consecutive expansion confirms operational divergence",
                        },
                      ],
                      qualitativeInvestigationRationale: "Evidence demonstrates persistent divergence rather than accounting artifact.",
                      remainingUncertainties: ["Granular segment footnotes are not published in REST overview."],
                      investigationLimitations: ["Quantitative retrospective filing analysis only."],
                    }),
                  },
                ],
              },
            ],
          }),
        };
      }
    });

    vi.stubGlobal("fetch", mockFetch);

    const adapter = new SectorsMockAdapter();
    const targetData = await adapter.getCompanyFundamentals("BBCA");
    const peersData = await adapter.getPeerGroupFundamentals(["BMRI", "BBRI", "BBNI"]);

    const loop = new CognitiveInvestigationLoop();
    const outlierResult: OutlierResult = {
      hasOutlier: true,
      targetSymbol: "BBCA",
      targetValue: 0.145,
      peerValues: [
        { symbol: "BMRI", value: 0.088 },
        { symbol: "BBRI", value: 0.076 },
        { symbol: "BBNI", value: 0.062 },
      ],
      peerMedian: 0.076,
      peerMean: 0.075,
      peerMin: 0.062,
      peerMax: 0.088,
      peerStdDev: 0.013,
      deviationFromMedian: 0.069,
      zScore: 5.3,
      isHighOutlier: true,
      isLowOutlier: false,
      comparability: ComparabilityStatus.ALIGNED,
      comparabilityDetails: "Periods aligned",
    };

    const result = await loop.runLoop(outlierResult, targetData, peersData);

    expect(result).not.toBeNull();
    expect(callCount).toBe(2);
    expect(result?.callsMade).toBe(2);
    expect(result?.hypotheses.length).toBe(2);
    expect(result?.evidenceItems.length).toBe(2);

    // Epistemic verification: status is governed by deterministic evidence verdicts
    const persistentHyp = result?.hypotheses.find((h) => h.id === "HYP_PERSISTENT");
    expect(persistentHyp?.status).toBe(HypothesisStatus.SUPPORTED);
    expect(persistentHyp?.qualitativeAssessment).toBe("STRONGLY_SUPPORTED");
  });

  it("falls back cleanly to deterministic pipeline when OpenAI API call fails", async () => {
    const mockFetch = vi.fn().mockImplementation(async () => {
      throw new Error("Network timeout connecting to api.openai.com");
    });

    vi.stubGlobal("fetch", mockFetch);

    const loop = new CognitiveInvestigationLoop();
    const adapter = new SectorsMockAdapter();
    const targetData = await adapter.getCompanyFundamentals("BBCA");
    const peersData = await adapter.getPeerGroupFundamentals(["BMRI", "BBRI", "BBNI"]);

    const outlierResult: OutlierResult = {
      hasOutlier: true,
      targetSymbol: "BBCA",
      targetValue: 0.145,
      peerValues: [],
      peerMedian: 0.076,
      peerMean: 0.075,
      peerMin: 0.062,
      peerMax: 0.088,
      peerStdDev: 0.013,
      deviationFromMedian: 0.069,
      zScore: 5.3,
      isHighOutlier: true,
      isLowOutlier: false,
      comparability: ComparabilityStatus.ALIGNED,
      comparabilityDetails: "Periods aligned",
    };

    const result = await loop.runLoop(outlierResult, targetData, peersData);
    // Returns null so orchestrator can invoke deterministic engine
    expect(result).toBeNull();
  });
});

describe("AgentOrchestrator End-to-End with Cognitive Integration", () => {
  it("runs full investigation using fallback when key is absent, preserving deterministic classifications", async () => {
    delete process.env.OPENAI_API_KEY;
    const adapter = new SectorsMockAdapter();
    const orchestrator = new AgentOrchestrator(adapter);

    const result = await orchestrator.runInvestigation({
      targetSymbol: "BBCA",
      peerSymbols: ["BMRI", "BBRI", "BBNI"],
    });

    expect(result.classification).toBe("PERSISTENT_DIFFERENCE");
    expect(result.evidenceItems.length).toBeGreaterThan(0);
    expect(result.trace.some((t) => t.stepId === "STEP_04_HYPOTHESIS_GENERATION")).toBe(true);
  });
});

describe("Epistemic Hardening & Boundary Enforcement", () => {
  it("prevents LLM from overriding deterministic hypothesis status or fabricating support", async () => {
    process.env.OPENAI_API_KEY = "mock-key";

    let callCount = 0;
    const mockFetch = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        return {
          ok: true,
          json: async () => ({
            output: [
              {
                content: [
                  {
                    text: JSON.stringify({
                      hypotheses: [
                        {
                          id: "HYP_01",
                          category: "ONE_OFF_FINANCIAL_EVENT",
                          title: "One-Off Accounting Spike",
                          description: "Unsubstantiated spike",
                          whyPlausible: "High growth",
                          targetToolExecution: "audit_operating_earnings",
                        },
                      ],
                      challengeQuestions: ["Is it real?"],
                      investigationStrategy: "Audit earnings",
                    }),
                  },
                ],
              },
            ],
          }),
        };
      } else {
        // Adversarial Call 2: LLM tries to claim the hypothesis is STRONGLY_SUPPORTED
        // even though audit_operating_earnings actually weakened it!
        return {
          ok: true,
          json: async () => ({
            output: [
              {
                content: [
                  {
                    text: JSON.stringify({
                      hypothesisAssessments: [
                        {
                          hypothesisId: "HYP_01",
                          evaluatedEvidenceIds: ["EV_001"],
                          evidentiaryAssessment: "STRONGLY_SUPPORTED",
                          falsificationNotes: "LLM attempts to claim support despite tool verdict",
                        },
                      ],
                      qualitativeInvestigationRationale: "Adversarial commentary claiming certainty",
                      remainingUncertainties: [],
                      investigationLimitations: [],
                    }),
                  },
                ],
              },
            ],
          }),
        };
      }
    });

    vi.stubGlobal("fetch", mockFetch);

    const adapter = new SectorsMockAdapter();
    const targetData = await adapter.getCompanyFundamentals("BBCA");
    const peersData = await adapter.getPeerGroupFundamentals(["BMRI", "BBRI", "BBNI"]);

    const loop = new CognitiveInvestigationLoop();
    const outlierResult: OutlierResult = {
      hasOutlier: true,
      targetSymbol: "BBCA",
      targetValue: 0.145,
      peerValues: [],
      peerMedian: 0.076,
      peerMean: 0.075,
      peerMin: 0.062,
      peerMax: 0.088,
      peerStdDev: 0.013,
      deviationFromMedian: 0.069,
      zScore: 5.3,
      isHighOutlier: true,
      isLowOutlier: false,
      comparability: ComparabilityStatus.ALIGNED,
      comparabilityDetails: "Periods aligned",
    };

    const result = await loop.runLoop(outlierResult, targetData, peersData);
    expect(result).not.toBeNull();

    const hyp = result?.hypotheses[0];
    // Deterministic authority: tool found strong operating earnings growth -> WEAKENED -> REJECTED
    // The LLM's claim of "STRONGLY_SUPPORTED" does NOT alter the deterministic status!
    expect(hyp?.status).toBe(HypothesisStatus.REJECTED);
    expect(hyp?.qualitativeAssessment).toBe("STRONGLY_SUPPORTED"); // only preserved as commentary
  });

  it("strictly enforces non-advisory disclaimer and locked classification enums", async () => {
    delete process.env.OPENAI_API_KEY;
    const adapter = new SectorsMockAdapter();
    const orchestrator = new AgentOrchestrator(adapter);

    const result = await orchestrator.runInvestigation({
      targetSymbol: "TECH_A",
      peerSymbols: ["PEER_B", "PEER_C", "PEER_D"],
    });

    // Mismatched periods scenario
    expect(result.classification).toBe("INCOMPARABLE_DATA");
    expect(result.disclaimer).toContain("Strictly NOT financial advice");
    expect(result.disclaimer).toContain("Never fabricate financial certainty");
  });
});
