import { NextRequest, NextResponse } from "next/server";
import { InvestigationRequest } from "@/domain";
import { createSectorsAdapter } from "@/adapters/sectors";
import { AgentOrchestrator } from "@/services/orchestrator";
import { logger } from "@/utils/logger";

export async function POST(req: NextRequest) {
  try {
    let body: Partial<InvestigationRequest>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload in request body." },
        { status: 400 }
      );
    }

    // Input sanitization & validation
    if (!body.targetSymbol || typeof body.targetSymbol !== "string") {
      return NextResponse.json(
        { error: "targetSymbol is required and must be a valid string ticker." },
        { status: 400 }
      );
    }

    if (
      !body.peerSymbols ||
      !Array.isArray(body.peerSymbols) ||
      body.peerSymbols.length < 1
    ) {
      return NextResponse.json(
        { error: "peerSymbols is required and must contain at least 1 ticker." },
        { status: 400 }
      );
    }

    const cleanTarget = body.targetSymbol.trim().toUpperCase();
    const cleanPeers = body.peerSymbols
      .filter((s) => typeof s === "string")
      .map((s) => s.trim().toUpperCase());

    if (cleanPeers.includes(cleanTarget)) {
      return NextResponse.json(
        { error: "Target company cannot be included in peer group." },
        { status: 400 }
      );
    }

    const mode = body.mode === "live" ? "live" : "mock";

    logger.info(`Received investigation request for ${cleanTarget} [Mode: ${mode}]`);

    const adapter = createSectorsAdapter({ mode });
    const orchestrator = new AgentOrchestrator(adapter);

    const result = await orchestrator.runInvestigation({
      targetSymbol: cleanTarget,
      peerSymbols: cleanPeers,
      mode,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected server error occurred.";
    logger.error("API investigation endpoint failure", err);

    return NextResponse.json(
      {
        error: message,
        disclaimer:
          "SignalLens server error. No advice or trading signals are generated.",
      },
      { status: 500 }
    );
  }
}
