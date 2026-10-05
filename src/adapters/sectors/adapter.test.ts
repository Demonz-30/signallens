import { describe, it, expect } from "vitest";
import { SectorsMockAdapter } from "./mockAdapter";
import { SectorsRestAdapter } from "./restAdapter";
import { createSectorsAdapter } from "./adapterFactory";
import { DataSourceMode } from "@/domain";
import { redactSecrets } from "@/utils/logger";

describe("Sectors Adapter Layer", () => {
  it("Mock adapter successfully loads company fundamentals", async () => {
    const adapter = new SectorsMockAdapter();
    expect(adapter.getMode()).toBe(DataSourceMode.MOCK);

    const bbca = await adapter.getCompanyFundamentals("BBCA");
    expect(bbca.symbol).toBe("BBCA");
    expect(bbca.sourceMode).toBe(DataSourceMode.MOCK);
    expect(bbca.historicalFinancials.length).toBeGreaterThanOrEqual(2);
  });

  it("Mock adapter throws descriptive error for unknown symbol", async () => {
    const adapter = new SectorsMockAdapter();
    await expect(adapter.getCompanyFundamentals("UNKNOWN_TICKER")).rejects.toThrow(
      "was not found in mock fixtures"
    );
  });

  it("REST adapter fails safely when API key is missing", async () => {
    const adapter = new SectorsRestAdapter({ apiKey: "" });
    expect(adapter.getMode()).toBe(DataSourceMode.SECTORS_REST);

    await expect(adapter.getCompanyFundamentals("BBCA")).rejects.toThrow(
      "SECTORS_API_KEY environment variable is not configured"
    );
  });

  it("Factory correctly chooses mock mode by default", () => {
    const adapter = createSectorsAdapter({ mode: "mock" });
    expect(adapter.getMode()).toBe(DataSourceMode.MOCK);
  });

  it("Factory correctly instantiates REST adapter when live mode requested", () => {
    const adapter = createSectorsAdapter({ mode: "live", apiKey: "dummy_test_key" });
    expect(adapter.getMode()).toBe(DataSourceMode.SECTORS_REST);
  });

  it("Secret redaction utility redacts raw tokens and keys", () => {
    const sensitive = "Authorization: sk-secret-1234567890abcdef and SECTORS_API_KEY=my_secret_token_123";
    const redacted = redactSecrets(sensitive);
    expect(redacted).not.toContain("sk-secret-1234567890abcdef");
    expect(redacted).not.toContain("my_secret_token_123");
    expect(redacted).toContain("[REDACTED]");
  });
});
