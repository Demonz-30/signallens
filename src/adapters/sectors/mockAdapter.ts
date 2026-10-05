import { CompanyFundamentalData, DataSourceMode } from "@/domain";
import { SectorsAdapter } from "./sectorsAdapter";
import { getMockFundamentalData } from "@/fixtures";
import { logger } from "@/utils/logger";

/**
 * Mock Sectors Adapter for offline testing and deterministic judging demos.
 * Always marks returned records as DataSourceMode.MOCK.
 */
export class SectorsMockAdapter implements SectorsAdapter {
  getMode(): DataSourceMode {
    return DataSourceMode.MOCK;
  }

  async getCompanyFundamentals(symbol: string): Promise<CompanyFundamentalData> {
    const cleanSymbol = symbol.toUpperCase().replace(/\.JK$/, "");
    logger.info(`Fetching mock Sectors report for ${cleanSymbol}`);

    const data = getMockFundamentalData(cleanSymbol);
    if (!data) {
      throw new Error(
        `Symbol '${cleanSymbol}' was not found in mock fixtures. Available symbols: BBCA, BBRI, BMRI, BBNI, BBTN, ICBP, INDF, MYOR, CMRY, UNVR, TECH_A, PEER_B, PEER_C, PEER_D, CORRUPT_A, PEER_X, PEER_Y, PEER_Z.`
      );
    }

    return {
      ...data,
      sourceMode: DataSourceMode.MOCK,
      retrievedAt: new Date().toISOString(),
    };
  }

  async getPeerGroupFundamentals(symbols: string[]): Promise<CompanyFundamentalData[]> {
    const results: CompanyFundamentalData[] = [];
    for (const sym of symbols) {
      const data = await this.getCompanyFundamentals(sym);
      results.push(data);
    }
    return results;
  }
}
