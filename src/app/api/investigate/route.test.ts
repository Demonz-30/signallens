import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";
import { NeutralClassification } from "@/domain";

describe("API Route: /api/investigate", () => {
  it("returns 200 with valid investigation analysis for killer banking demo", async () => {
    const req = new NextRequest("http://localhost:3000/api/investigate", {
      method: "POST",
      body: JSON.stringify({
        targetSymbol: "BBCA",
        peerSymbols: ["BBRI", "BMRI", "BBNI", "BBTN"],
        mode: "mock",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.investigationId).toBeDefined();
    expect(json.classification).toBe(NeutralClassification.PERSISTENT_DIFFERENCE);
    expect(json.evidenceLedger.length).toBeGreaterThanOrEqual(2);
  });

  it("returns 400 when targetSymbol is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/investigate", {
      method: "POST",
      body: JSON.stringify({
        peerSymbols: ["BBRI"],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain("targetSymbol is required");
  });

  it("returns 400 when target is included in peerSymbols", async () => {
    const req = new NextRequest("http://localhost:3000/api/investigate", {
      method: "POST",
      body: JSON.stringify({
        targetSymbol: "BBCA",
        peerSymbols: ["BBCA", "BMRI"],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain("Target company cannot be included in peer group");
  });

  it("returns 500 and clear error when live mode fails (does NOT silently switch to mock mode)", async () => {
    const originalKey = process.env.SECTORS_API_KEY;
    try {
      delete process.env.SECTORS_API_KEY;

      const req = new NextRequest("http://localhost:3000/api/investigate", {
        method: "POST",
        body: JSON.stringify({
          targetSymbol: "BBCA",
          peerSymbols: ["BMRI"],
          mode: "live",
        }),
      });

      const res = await POST(req);
      // Live mode MUST fail with 500 when Sectors cannot authenticate, NOT 200 with mock data
      expect(res.status).toBe(500);

      const json = await res.json();
      expect(json.error).toContain("SECTORS_API_KEY");
      expect(json.disclaimer).toBeDefined();
    } finally {
      if (originalKey !== undefined) {
        process.env.SECTORS_API_KEY = originalKey;
      }
    }
  });

  it("explicitly preserves mock mode isolation when mode is mock", async () => {
    const req = new NextRequest("http://localhost:3000/api/investigate", {
      method: "POST",
      body: JSON.stringify({
        targetSymbol: "ICBP",
        peerSymbols: ["INDF", "MYOR"],
        mode: "mock",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.sourceMode).toBe("MOCK");
    expect(json.classification).toBe(NeutralClassification.NO_MATERIAL_OUTLIER);
  });
});

